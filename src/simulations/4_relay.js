function draw_relay(ctx, w, h, t, p, oc) { 
    // Черный фон распределительного щита
    ctx.fillStyle = '#06070a'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Шанс срабатывания реле на текущем кадре
    let click = Math.random() < (oc ? 0.7 : 0.25); 
    
    // Оптимизация звука: Базовый индуктивный гул 50Гц + яростный треск искр
    if (click) {
        let sparkFreq = 200 + Math.random() * 800; // Частота щелчка
        let sparkVol = oc ? 0.9 : 0.4;
        setAudio(sparkFreq, sparkVol, 'square');
    } else {
        // Если вспышки нет, реле издает тихий фоновый гул катушек (50 Гц)
        setAudio(50, oc ? 0.3 : 0.08, 'sawtooth');
    }
    
    let sh = h / 3; 
    let sparkCount = oc ? 25 : 6; // Количество одновременно искрящих реле
    
    for (let k = 0; k < sparkCount; k++) { 
        // Исправлено: Выбор зоны флага (0, 1 или 2)
        let z = Math.floor(Math.random() * 3); 
        
        // Исправлены пропущенные знаки умножения и переменная z * sh
        let rx = 50 + Math.random() * (w - 100); 
        let ry = z * sh + Math.random() * (sh - 20) + 10; 
        
        // Цвета флага
        let col = ['#ffffff', '#2563eb', '#ef4444'][z]; 
        
        ctx.strokeStyle = col; 
        ctx.lineWidth = oc ? 3 : 1.5; 
        ctx.shadowBlur = oc ? 25 : 12; 
        ctx.shadowColor = col; 
        
        // Отрисовка снопа искр (каждая искра — отдельный суб-путь)
        ctx.beginPath(); 
        let rays = 8;
        for (let i = 0; i < rays; i++) { 
            let a = (i * Math.PI / 4) + (Math.random() - 0.5) * 0.4; // Добавили хаотичности углам
            // Исправлено умножение
            let l = (3 + Math.random() * (oc ? 35 : 15)) * p; 
            
            ctx.moveTo(rx, ry); 
            ctx.lineTo(rx + Math.cos(a) * l, ry + Math.sin(a) * l); 
        } 
        ctx.stroke(); // Рисуем всю искру разом — это работает быстро
        
        // Рисуем маленькую белую точку-ядро в центре взрыва дуги
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(rx, ry, oc ? 2 : 1, 0, Math.PI * 2);
        ctx.fill();
    } 
    
    // Гасим свечение, чтобы не тормозили другие элементы интерфейса
    ctx.shadowBlur = 0; 
}

// Экспортируем функцию для компилятора
window.draw_relay = draw_relay;
