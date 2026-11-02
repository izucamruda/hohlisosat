let cherCanvas = null;
let cherCtx = null;

function draw_cherenkov(ctx, w, h, t, p, oc) { 
    // Инициализируем вторичный буфер для симуляции оптической среды воды
    if (!cherCanvas) {
        cherCanvas = document.createElement('canvas');
        cherCanvas.width = w;
        cherCanvas.height = h;
        cherCtx = cherCanvas.getContext('2d');
    }

    // Заливаем активную зону глубоким черным цветом с легким синеватым осадком глубины
    cherCtx.fillStyle = '#000108'; 
    cherCtx.fillRect(0, 0, w, h); 
    
    // Глубокий, инфразвуковой гул водяных насосов охлаждения реактора (25 Гц)
    let freq = 25 + (oc ? Math.sin(t * 0.2) * 5 : 0);
    let vol = oc ? 0.9 : 0.4;
    setAudio(freq, vol, 'sawtooth'); 
    
    let sh = h / 3; 
    
    // 1. СТРУКТУРА: Рисуем физические кварцевые разделители каналов в бассейне
    ctx.fillStyle = '#00020d';
    ctx.fillRect(0, 0, w, h);
    
    // 2. СИМУЛЯЦИЯ ИЗЛУЧЕНИЯ: Расчет пролета быстрых электронов
    // Электроны пролетают сквозь центральный водяной канал и порождают вспышки
    let particleCount = oc ? 15 : 5;
    cherCtx.fillStyle = 'rgba(0, 140, 255, 0.4)';
    
    for (let i = 0; i < particleCount; i++) {
        let pId = i * 245.1;
        let speed = oc ? 35 : 16;
        // Координаты летящей частицы
        let px = (t * speed + pId) % (w + 400) - 200;
        let py = sh + 10 + ((Math.sin(i * 1.7) + 1) / 2) * (sh - 20); // Частицы летят в центральном синем секторе
        
        // Математически точный конус Вавилова-Черенкова (угол свечения в воде ~41°)
        cherCtx.strokeStyle = `rgba(0, 110, 255, ${oc ? 0.5 : 0.25})`;
        cherCtx.lineWidth = 3;
        cherCtx.beginPath();
        cherCtx.moveTo(px, py);
        cherCtx.lineTo(px - 60, py - 45); // Верхняя кромка конуса Маха
        cherCtx.moveTo(px, py);
        cherCtx.lineTo(px - 60, py + 45); // Нижняя кромка конуса Маха
        cherCtx.stroke();
        
        // Квантовое ядро трека
        cherCtx.fillStyle = '#ffffff';
        cherCtx.fillRect(px, py, 2, 2);
    }

    // Добавляем глобальное черенковское объемное свечение (Bloom) в центральном синем канале
    let blueGlow = cherCtx.createLinearGradient(0, sh, 0, sh * 2);
    blueGlow.addColorStop(0, 'rgba(0, 50, 200, 0.1)');
    blueGlow.addColorStop(0.5, `rgba(0, 90, 255, ${oc ? 0.8 : 0.5})`);
    blueGlow.addColorStop(1, 'rgba(0, 50, 200, 0.1)');
    cherCtx.fillStyle = blueGlow;
    cherCtx.fillRect(0, sh, w, sh);

    // 3. ШИФТЕРЫ СПЕКТРА (Переизлучение в верхнем и нижнем каналах)
    // Верхний канал: Вода + Сцинтиллятор POPOP (превращает UV/Синий в яркий Белый)
    let alphaWhite = oc ? 0.9 : 0.5 + Math.sin(t * 0.05) * 0.08;
    let whiteGrad = ctx.createLinearGradient(0, sh, 0, 0);
    whiteGrad.addColorStop(0, `rgba(255, 255, 255, ${alphaWhite * p})`);
    whiteGrad.addColorStop(1, 'rgba(10, 15, 30, 0)');
    cherCtx.fillStyle = whiteGrad;
    cherCtx.fillRect(0, 0, w, sh);

    // Нижний канал: Вода + Родамин-Б (превращает рассеянный синий свет в радиационный Красный)
    let alphaRed = oc ? 0.9 : 0.5 + Math.cos(t * 0.05) * 0.08;
    let redGrad = ctx.createLinearGradient(0, sh * 2, 0, h);
    redGrad.addColorStop(0, `rgba(235, 20, 20, ${alphaRed * p})`);
    redGrad.addColorStop(1, 'rgba(15, 0, 10, 0)');
    cherCtx.fillStyle = redGrad;
    cherCtx.fillRect(0, sh * 2, w, sh);

    // 4. ОПТИЧЕСКИЕ ПОМЕХИ: Добавляем эффект черенковского мерцания среды
    if (Math.random() < (oc ? 0.4 : 0.1)) {
        cherCtx.fillStyle = `rgba(0, 150, 255, ${Math.random() * 0.15})`;
        cherCtx.fillRect(0, 0, w, h);
    }

    // Выводим все слои на главный экран
    ctx.drawImage(cherCanvas, 0, 0);

    // Рисуем физические разделительные решетки между отсеками бассейна
    ctx.strokeStyle = '#1b1f38';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, sh); ctx.lineTo(w, sh);
    ctx.moveTo(0, sh * 2); ctx.lineTo(w, sh * 2);
    ctx.stroke();
}

window.draw_cherenkov = draw_cherenkov;
