function draw_sonolum(ctx, w, h, t, p, oc) { 
    // Глубокий, кристально чистый черный фон дистиллированной воды
    ctx.fillStyle = '#010103'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Звук: Ультразвуковой резонанс (24 кГц). 
    // Для человеческого уха это почти тишина, но при разгоне сети частота падает в слышимый спектр
    // имитируя разрушение стоячей волны и кавитационный скрежет
    let freq = 24000 - (oc ? 22000 + Math.random() * 800 : 0);
    let vol = oc ? 0.4 : 0.02; // При перегрузке звук становится слышимым и громким
    setAudio(freq, vol, 'sine'); 
    
    let sh = h / 3; 
    let bubbleCount = oc ? 200 : 60; // Количество светящихся кавитационных пузырьков
    
    // Рисуем 3 слоя акустического триколора
    for (let k = 0; k < bubbleCount; k++) { 
        // Исправлено: Выбор зоны флага (0, 1, 2)
        let z = Math.floor(Math.random() * 3);
        let col = ['#ffffff', '#3b82f6', '#ef4444'][z]; 
        
        // Исправлено: Распределение пузырьков вдоль акустической оси (пучности стоячей волны)
        let angle = Math.random() * Math.PI * 2;
        let radiusX = (oc ? 450 : 280) * Math.random();
        
        // Электроакустический фокус: сжимаем пузырьки к центру стоячей волны с помощью Math.sin
        let sx = w / 2 + Math.cos(angle) * radiusX;
        
        // Базовая центральная линия для текущей полосы флага
        // Исправлено: z * sh
        let centerY = z * sh + sh / 2;
        
        // Синусоидальное смещение (стоячая волна давления 45 кГц)
        // Исправлено умножение перед скобками
        let waveSpread = (oc ? 45 : 20) * Math.sin(sx * 0.05 + t * 0.1);
        let sy = centerY + waveSpread + (Math.random() - 0.5) * 15; 
        
        // Отрисовка мигающих плазменных ядер пузырьков
        ctx.fillStyle = col; 
        ctx.shadowBlur = oc ? 30 : 15; 
        ctx.shadowColor = col; 
        
        ctx.beginPath(); 
        // Исправлено умножение для радиуса и Math.PI * 2
        let bubbleSize = (0.8 + Math.random() * (oc ? 4.5 : 2)) * p;
        ctx.arc(sx, sy, Math.max(0.5, bubbleSize), 0, Math.PI * 2); 
        ctx.fill(); 
        
        // Раз в несколько кадров пускаем ультразвуковые круги давления (ударные волны схлопывания)
        if (oc && Math.random() < 0.005) {
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(sx, sy, 40, 0, Math.PI * 2);
            ctx.stroke();
        }
    } 
    
    ctx.shadowBlur = 0; 
    
    // Рисуем силуэты кольцевых пьезоизлучателей сверху и снизу канваса
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w/2 - 100, 5, 200, 5);
    ctx.fillRect(w/2 - 100, h - 10, 200, 5);
}

// Экспортируем функцию для автоматического билдера compile.py
window.draw_sonolum = draw_sonolum;
