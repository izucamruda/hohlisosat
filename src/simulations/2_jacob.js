function draw_jacob(ctx, w, h, t, p, oc) { 
    // Глубокий черный фон лаборатории
    ctx.fillStyle = '#010103'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Исправлено: Звук высоковольтного трансформатора (50 Гц + треск при разгоне)
    let freq = 50 + (oc ? (Math.random() - 0.5) * 40 : (Math.random() - 0.5) * 4);
    let vol = oc ? 0.8 : 0.3; 
    setAudio(freq, vol, 'sawtooth'); 
    
    let sh = h / 3; 
    let sh2 = sh * 2; // Исправлено: корректно объявили границу второй секции
    
    // Три секции триколора
    let arr = [
        { y1: 10,       y2: sh,     c: '#ffffff' }, // Верх (Белый)
        { y1: sh,       y2: sh2,    c: '#0066ff' }, // Середина (Синий)
        { y1: sh2,      y2: h - 10, c: '#ff2200' }  // Низ (Красный)
    ]; 
    
    arr.forEach(s => { 
        // Скорость подъема дуги
        let prog = (t * (oc ? 0.05 : 0.02)) % 1; 
        
        // Текущая Y-координата электрического разряда
        let cy = s.y2 - (s.y2 - s.y1) * prog; 
        
        // Исправлено: Расстояние между усами лестницы (кверху они расширяются)
        let currentSpan = 40 + (1 - (cy / h)) * 120; 
        
        // 1. Отрисовка металлических направляющих (электродов)
        ctx.strokeStyle = '#1b1f38'; 
        ctx.lineWidth = 4; 
        ctx.beginPath(); 
        // Левый ус
        ctx.moveTo(w / 2 - (40 + (1 - (s.y2 / h)) * 120), s.y2); 
        ctx.lineTo(w / 2 - (40 + (1 - (s.y1 / h)) * 120), s.y1); 
        // Правый ус
        ctx.moveTo(w / 2 + (40 + (1 - (s.y2 / h)) * 120), s.y2); 
        ctx.lineTo(w / 2 + (40 + (1 - (s.y1 / h)) * 120), s.y1); 
        ctx.stroke(); 
        
        // 2. Отрисовка плазменной электрической дуги
        ctx.strokeStyle = s.c; 
        // Исправлено: Толщина и хаотичность дуги в зависимости от разгона
        ctx.lineWidth = oc ? 6 : 2 + Math.random() * 3; 
        ctx.shadowBlur = oc ? 40 : 20; 
        ctx.shadowColor = s.c; 
        
        ctx.beginPath(); 
        // Начинаем разряд от левого уса до правого
        let startX = w / 2 - currentSpan;
        ctx.moveTo(startX, cy); 
        
        let segments = 8;
        for (let i = 1; i <= segments; i++) { 
            let targetX = startX + (currentSpan * 2) * (i / segments);
            // Создаем изломы молнии по оси Y
            // Исправлено: Пропущенные умножения перед скобками
            let targetY = cy + (Math.random() - 0.5) * (oc ? 45 : 15);
            
            // Если это последний сегмент — принудительно бьем точно в правый ус
            if (i === segments) {
                ctx.lineTo(w / 2 + currentSpan, cy);
            } else {
                ctx.lineTo(targetX, targetY); 
            }
        } 
        ctx.stroke(); 
        
        // Дополнительная микро-вспышка в точках контакта с электродами
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(w / 2 - currentSpan, cy, 3, 0, Math.PI * 2);
        ctx.arc(w / 2 + currentSpan, cy, 3, 0, Math.PI * 2);
        ctx.fill();
    }); 
    
    ctx.shadowBlur = 0; 
}

// Экспортируем функцию в глобальную видимость для сборщика
window.draw_jacob = draw_jacob;
