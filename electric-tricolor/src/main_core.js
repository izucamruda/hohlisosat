const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d'); 
let currentLab = 'led'; 
let globalPower = 1.0; 
let isOverclocked = false; 
let time = 0; 
let audioCtx = null, mainOsc = null, mainGain = null;

const db = { 
    led: { title: "01 // Полупроводниковая Матрица", desc: "Свечение p-n переходов GaN и GaP полупроводников. Белая полоса задействует люминофор.", v: 3.4, a: 150, t: 25, label: "Частота ШИМ модуля" }, 
    jacob: { title: "02 // Высоковольтные Лестницы Иакова", desc: "Электрический пробой воздуха 30кВ. Дуга окрашивается солями Магния, Индия и Стронция.", v: 30000, a: 1.2, t: 1900, label: "Вольтаж трансформатора" }, 
    peltier: { title: "03 // Матрица Пельтье (ИК-Спектр)", desc: "Флаг в инфракрасном диапазоне. Верх раскален до +90°C, середина заморожена до -20°C, низ +35°C.", v: 48, a: 900, t: 90, label: "Сила накачки электронов" }, 
    relay: { title: "04 // Искровой Релейный Щит", desc: "Сотни силовых контакторов размыкают индуктивные цепи, формируя флаг из снопов высоковольтных искр.", v: 380, a: 1800, t: 80, label: "Частота коммутации (Гц)" }, 
    mhd: { title: "05 // Магнитная Гидродинамика", desc: "Сверхпроводящие магниты упорядочивают наночастицы в жидком металле, меняя спектр отражения.", v: 220, a: 6000, t: -196, label: "Индукция поля катушек" }, 
    electrolysis: { title: "06 // Ионный Электролиз Раствора", desc: "Электрический ток высвобождает ионы у электродов, мгновенно меняя цвет лакмусовых индикаторов.", v: 12, a: 4000, t: 50, label: "Скорость прокачки помпы" }, 
    cherenkov: { title: "07 // Квантовый Эффект Черенкова", desc: "Радиационный флаг. Электроны движутся в воде быстрее скорости света, генерируя черенковский свет.", v: 1500000, a: 10, t: 400, label: "Энергия пучка ускорителя" }, 
    crt: { title: "08 // Многолучевой Вакуумный Кинескоп", desc: "Три плоских пучка электронов под напряжением 32кВ бомбардируют три полосы редкоземельных люминофоров.", v: 32000, a: 0.08, t: 60, label: "Напряжение фокусировки" }, 
    corona: { title: "09 // Ионный Коронный Разряд", desc: "Сверхвысокое поле на массивах нано-игл зажигает воздух. Микро-впрыск неона и аргона строит триколор.", v: 500000, a: 0.05, t: 40, label: "Потенциал ионизации" }, 
    sonolum: { title: "10 // Акустическая Кавитация", desc: "Пьезоизлучатели на частоте 45кГц превращают ток в звук, а звук в свет через схлопывание пузырьков.", v: 110, a: 250, t: 95, label: "Акустический резонанс" } 
};

function initSidebar() { 
    const list = document.getElementById('labList'); 
    Object.keys(db).forEach((key) => { 
        const btn = document.createElement('button'); 
        // Исправлена синтаксическая ошибка с кавычками ``
        btn.className = `lab-item ${key === currentLab ? 'active' : ''}`; 
        btn.innerHTML = db[key].title; 
        btn.onclick = () => { 
            document.querySelectorAll('.lab-item').forEach(b => b.classList.remove('active')); 
            btn.classList.add('active'); 
            currentLab = key; 
            document.getElementById('labTitle').innerText = db[key].title; 
            document.getElementById('labDesc').innerText = db[key].desc; 
            document.getElementById('sliderLabel').innerText = db[key].label; 
        }; 
        list.appendChild(btn); 
    }); 
    document.getElementById('labTitle').innerText = db[currentLab].title; 
    document.getElementById('labDesc').innerText = db[currentLab].desc; 
    document.getElementById('sliderLabel').innerText = db[currentLab].label;
}

function toggleAudio() { 
    if (!audioCtx) { 
        audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
        mainOsc = audioCtx.createOscillator(); 
        mainGain = audioCtx.createGain(); 
        mainOsc.type = 'sawtooth'; 
        mainOsc.frequency.setValueAtTime(50, audioCtx.currentTime); 
        mainGain.gain.setValueAtTime(0.03, audioCtx.currentTime); 
        mainOsc.connect(mainGain); 
        mainGain.connect(audioCtx.destination); 
        mainOsc.start(); 
        document.getElementById('audioBtn').style.background = '#10b981'; 
        document.getElementById('audioBtn').innerText = "ЗВУК: ON"; 
    } else { 
        if (audioCtx.state === 'suspended') { 
            audioCtx.resume(); 
            document.getElementById('audioBtn').innerText = "ЗВУК: ON"; 
        } else { 
            audioCtx.suspend(); 
            document.getElementById('audioBtn').innerText = "ЗВУК: OFF"; 
        } 
    } 
}

// Восстановлен оборванный кусок функции звука
function setAudio(freq, vol, type='sawtooth') { 
    if (audioCtx && mainOsc && audioCtx.state === 'running') { 
        mainOsc.type = type; 
        mainOsc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
        mainGain.gain.setValueAtTime(vol * 0.05, audioCtx.currentTime); 
    } 
}

// Навешивание событий разгона
const ocBtn = document.getElementById('ocBtn'); 
function setOC(state) { 
    isOverclocked = state; 
    if(state) ocBtn.classList.add('active'); 
    else ocBtn.classList.remove('active'); 
} 

if (ocBtn) {
    ocBtn.addEventListener('mousedown', () => setOC(true)); 
    ocBtn.addEventListener('mouseup', () => setOC(false)); 
    ocBtn.addEventListener('mouseleave', () => setOC(false)); 
    ocBtn.addEventListener('touchstart', (e) => { e.preventDefault(); setOC(true); }); 
    ocBtn.addEventListener('touchend', () => setOC(false));
}

document.getElementById('powerSlider').oninput = (e) => { 
    globalPower = e.target.value / 100; 
};

function updateTelemetry() { 
    let l = db[currentLab]; 
    let ocMult = isOverclocked ? 2.5 : 1.0; 
    let p = globalPower * ocMult; 
    document.getElementById('vVolt').innerText = Math.round(l.v * p) + " V"; 
    document.getElementById('vAmp').innerText = (l.a * p).toFixed(1) + " A"; 
    document.getElementById('vTemp').innerText = Math.round(l.t * p) + " °C";
    
    let cpu = document.getElementById('vCpu');
    if (isOverclocked) {
        cpu.innerText = "ПРОЦЕССОР СГОРЕЛ"; 
        cpu.style.color = "#ef4444";
        // Жесткий лаг
        let start = performance.now(); 
        while(performance.now() - start < Math.random() * 12) {}
    } else {
        cpu.innerText = globalPower > 1.4 ? "КУЛЕРЫ ПЛАВЯТСЯ" : "СТАБИЛЬНО";
        cpu.style.color = globalPower > 1.4 ? "#f59e0b" : "#10b981";
    }
}

window.onload = () => { 
    initSidebar(); 
    function loop() { 
        // Исправлен приоритет математических операций
        time += (isOverclocked ? 3.0 : 1.0) * globalPower; 
        updateTelemetry();
        
        let drawFunc = window["draw_" + currentLab];
        if (typeof drawFunc === 'function') {
            drawFunc(ctx, canvas.width, canvas.height, time, globalPower, isOverclocked);
        }
        requestAnimationFrame(loop);
    }
    loop();
};
