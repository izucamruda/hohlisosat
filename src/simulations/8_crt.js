function draw_crt(ctx, w, h, t, p, oc) {
    // 1. Очистка экрана — глубокий черный бархат выключенного кинескопа
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, w, h);
    
    // Писк строчного трансформатора (15.625 кГц). При разгоне начинает жутко «плыть»
    let freq = 15625 + (oc ? (Math.random() - 0.5) * 1200 : Math.sin(t * 0.1) * 10);
    let vol = oc ? 0.04 : 0.015;
    setAudio(freq, vol, 'sine');
    
    let sh = h / 3;
    
    // 2. БЫСТРАЯ ОТРИСОВКА: Заливаем 3 базовые полосы редкоземельного люминофора
    ctx.fillStyle = '#1a1a24'; // Верх (пока без луча — тлеющий белый люминофор)
    ctx.fillRect(0, 0, w, sh);
    ctx.fillStyle = '#001144'; // Середина (тлеющий синий)
    ctx.fillRect(0, sh, w, sh);
    ctx.fillStyle = '#440000'; // Низ (тлеющий красный)
    ctx.fillRect(0, sh * 2, w, h - sh * 2);
    
    // 3. ЭФФЕКТ СТРОЧНОЙ РАЗВЕРТКИ И ЛУЧА
    // Вычисляем позицию горизонтального прохода электронного луча
    let scanSpeed = oc ? 45 : 22;
    let beamY = (t * scanSpeed) % h;
    
    // Эффект статического шума и помех при разгоне сети
    if (oc && Math.random() < 0.15) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.fillRect(0, Math.random() * h, w, Math.random() * 10);
    }
    
    // Накладываем маску теневой маски кинескопа (Scanlines)
    let step = oc ? 6 : 3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    for (let i = 0; i < h; i += step) {
        ctx.fillRect(0, i, w, oc ? 3 : 1);
    }
    
    // 4. Отрисовка ярких RGB полос в точке пролета электронного пушка
    for (let z = 0; z < 3; z++) {
        let col = ['#ffffff', '#0066ff', '#ff3333'][z];
        
        // Проверяем, находится ли луч развертки в текущей зоне триколора
        let zoneTop = z * sh;
        let zoneBottom = (z + 1) * sh;
        
        if (beamY >= zoneTop && beamY <= zoneBottom) {
            // Рисуем след засветки люминофора после пролета луча
            let gradient = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 5);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.8, col);
            gradient.addColorStop(1, '#fff'); // Само ядро электронного луча
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, beamY - 40, w, 42);
            
            // Бегущая яркая точка по строке (горизонтальная синхронизация)
            let sx = (t * (oc ? 55 : 30)) % w;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = oc ? 30 : 15;
            ctx.shadowColor = col;
            ctx.fillRect(sx, beamY, oc ? 35 : 15, 3);
            ctx.shadowBlur = 0;
        }
    }
}

// Экспортируем функцию для автоматического сборщика compile.py
window.draw_crt = draw_crt;
