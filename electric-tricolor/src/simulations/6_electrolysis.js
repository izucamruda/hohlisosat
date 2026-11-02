function draw_electrolysis(ctx, w, h, t, p, oc) { 
    // Глубокий темный фон химического раствора
    ctx.fillStyle = '#03050a'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Звук: Бурление электролита и гул помпы (75 Гц)
    // При разгоне звук становится выше и начинает пузыриться за счет частотной модуляции
    let freq = 75 + (oc ? Math.abs(Math.sin(t * 0.2)) * 40 : 0);
    let vol = oc ? 0.5 : 0.2;
    setAudio(freq, vol, 'triangle'); 
    
    let sh = h / 3; 
    let bubbleCount = oc ? 350 : 120; // Количество ионов-пузырьков gaz
    
    for (let i = 0; i < bubbleCount; i++) { 
        // Детерминированный (фиксированный) расчет Y-координаты для каждого индекса i
        // Использование Math.sin(i) вместо Math.random() останавливает хаотичные прыжки пузырьков
        let pseudoRandomY = (Math.sin(i * 9.8) + 1) / 2; 
        let ey = 15 + pseudoRandomY * (h - 30);
        
        // Определение зоны флага (0, 1, 2)
        let ez = Math.min(2, Math.floor(ey / sh)); 
        let col = ['#ffffff', '#2563eb', '#dc2626'][ez]; 
        
        // Исправлено: Горизонтальное движение пузырьков от тока
        let speed = oc ? 4.5 : 1.8;
        let ex = 40 + ((t * speed + i * 17) % (w - 80)); 
        
        // Размер пузырька газа (псевдослучайный, но фиксированный для индекса)
        let radius = 1.5 + ((Math.cos(i * 5.5) + 1) / 2) * 2.5 * p;
        
        ctx.fillStyle = col; 
        ctx.shadowBlur = oc ? 12 : 5; 
        ctx.shadowColor = col; 
        
        ctx.beginPath(); 
        // Исправлено: Математические знаки умножения внутри синусоиды покачивания и Math.PI * 2
        let waveY = ey + Math.sin(ex * 0.03 + i) * 8;
        ctx.arc(ex, waveY, radius, 0, Math.PI * 2); 
        ctx.fill(); 
        
        // Блик внутри пузырька (для придания объема газу)
        if (radius > 2.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(ex - radius*0.3, waveY - radius*0.3, radius*0.2, 0, Math.PI * 2);
            ctx.fill();
        }
    } 
    
    // Отрисовка погруженных титановых электродов по бокам ванны
    ctx.fillStyle = '#1e293b';
    ctx.shadowBlur = 0;
    ctx.fillRect(20, 10, 15, h - 20); // Анод
    ctx.fillRect(w - 35, 10, 15, h - 20); // Катод
}

// Экспортируем функцию для автоматического билдера compile.py
window.draw_electrolysis = draw_electrolysis;
