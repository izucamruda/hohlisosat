function draw_corona(ctx, w, h, t, p, oc) { 
    // Глубокий темный фон вакуумной камеры
    ctx.fillStyle = '#020205'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Звук: Сухой, шипящий высокочастотный треск короны (140 Гц + белый шум)
    let freq = 140 + (oc ? (Math.random() - 0.5) * 150 : (Math.random() - 0.5) * 40);
    let vol = oc ? 0.6 : 0.25;
    setAudio(freq, vol, 'sawtooth'); 
    
    let sh = h / 3; 
    let step = oc ? 10 : 20; // Плотность игл (при разгоне разрядов становится больше)
    
    // Рисуем 3 независимые зоны ионизации газов (Неон, Аргон, Воздух)
    for (let z = 0; z < 3; z++) {
        let cy = z * sh + sh / 2; // Исправлено: z * sh
        let col = ['#ffffff', '#2563eb', '#e11d48'][z];
        
        ctx.strokeStyle = col; 
        ctx.lineWidth = oc ? 2.5 : 1.2; 
        ctx.shadowBlur = oc ? 20 : 8; 
        ctx.shadowColor = col; 
        
        // Начало пакетной сборки путей молний (ПРОИЗВОДИТЕЛЬНОСТЬ Х100)
        ctx.beginPath(); 
        
        for (let i = 15; i < w - 15; i += step) { 
            // 1. Отрисовка металлической нано-иглы (источник поля)
            ctx.moveTo(i, cy - 5);
            ctx.lineTo(i, cy + 5);
            
            // 2. Исправлено: Генерация ветвящихся стримеров плазмы
            let segments = oc ? 4 : 2;
            let lastX = i;
            let lastY = cy;
            
            for (let s = 0; s < segments; s++) {
                // Исправлены знаки умножения
                let targetX = lastX + (Math.random() - 0.5) * (oc ? 30 : 15) * p;
                let targetY = lastY + (Math.random() - 0.5) * (oc ? 55 : 25) * p;
                
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(targetX, targetY);
                
                lastX = targetX;
                lastY = targetY;
            }
        } 
        
        // Один stroke() на всю полосу цвета вместо сотен!
        ctx.stroke(); 
        
        // Маленькие горячие фиолетовые точки на кончиках игл (активные зоны)
        ctx.fillStyle = '#d8b4fe';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        for (let i = 15; i < w - 15; i += step) {
            ctx.arc(i, cy, 1.5, 0, Math.PI * 2);
        }
        ctx.fill();
    } 
}

// Экспортируем функцию для автоматического билдера
window.draw_corona = draw_corona;
