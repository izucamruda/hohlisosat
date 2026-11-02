function draw_led(ctx, w, h, t, p, oc) { 
    // Глубокий темный фон лаборатории
    ctx.fillStyle = '#030306'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Исправлена генерация частоты звука (ШИМ-гул)
    let freq = 60 + Math.sin(t * 0.05) * 4;
    // Снизили базовую громкость, чтобы не била по ушам, при разгоне звук становится агрессивнее
    let vol = oc ? 0.6 : 0.2; 
    setAudio(freq, vol, 'sine'); 
    
    let r = 18, c = 34, size = 8, gap = 14; 
    let sx = (w - (c * (size + gap))) / 2 + size/2; 
    let sy = (h - (r * (size + gap))) / 2 + size/2; 
    
    for (let i = 0; i < r; i++) { 
        // Логика формирования Российского Триколора по строкам
        let col = '#ffffff'; // Верхняя треть — белая
        if (i >= 6 && i < 12) col = '#005bbb'; // Синяя
        if (i >= 12) col = '#d52b1e'; // Красная
        
        // Исправлена формула мерцания (волна ШИМ)
        let wave = Math.sin(t * 0.1 + i) * 0.2;
        let fl = (0.8 + wave) * p; 
        
        // Эффект перегрузки при разгоне сети (хаотичные искры/помехи ШИМ)
        if (oc) {
            fl += (Math.random() - 0.5) * 0.6;
        }
        
        // Свечение диодов (Bloom-эффект)
        ctx.shadowBlur = Math.max(0, 15 * fl); 
        ctx.shadowColor = col; 
        ctx.fillStyle = col; 
        
        // Отрисовка сетки светодиодов
        for (let j = 0; j < c; j++) { 
            ctx.beginPath(); 
            // Исправлены пропущенные умножения j * (...) и i * (...)
            ctx.arc(sx + j * (size + gap), sy + i * (size + gap), (size / 2) * Math.max(0.3, fl), 0, Math.PI * 2); 
            ctx.fill(); 
        } 
    } 
    // Сбрасываем тень, чтобы не тормозил интерфейс
    ctx.shadowBlur = 0; 
}

// Привязываем функцию к глобальному объекту window для сборщика
window.draw_led = draw_led;
