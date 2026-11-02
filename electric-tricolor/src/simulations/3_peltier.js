function draw_peltier(ctx, w, h, t, p, oc) { 
    // Фон ИК-экрана (глубокий холодный фиолетовый)
    ctx.fillStyle = '#040112'; 
    ctx.fillRect(0, 0, w, h); 
    
    // Звук: Низкочастотный гул системы охлаждения (90 Гц)
    // При разгоне звук становится выше и начинает вибрировать от перегрузки
    let freq = 90 + (oc ? Math.sin(t * 0.4) * 20 : 0);
    let vol = oc ? 0.4 : 0.15;
    setAudio(freq, vol, 'triangle'); 
    
    let sh = h / 3; 
    let cols = 48; // Количество термопар по горизонтали
    let rows = 18; // Количество термопар по вертикали
    
    let cellW = (w - 40) / cols;
    let cellH = (h - 40) / rows;
    
    for (let r = 0; r < rows; r++) {
        let blockY = 20 + r * cellH;
        
        for (let c = 0; c < cols; c++) {
            let blockX = 20 + c * cellW;
            
            // Базовый цвет в зависимости от зоны флага (Верх, Середина, Низ)
            let red = 0, green = 0, blue = 0;
            
            // Тепловой шум ИК-матрицы (усиливается при разгоне сети)
            let noise = (Math.random() - 0.5) * (oc ? 80 : 15);
            
            if (r < 6) {
                // ВЕРХ: Раскаленная зона (Белый/Желтый спектр тепловизора, +90°C)
                let pulse = Math.sin(t * 0.08 + c * 0.1) * 15;
                red = Math.min(255, Math.max(0, 220 + pulse + noise));
                green = Math.min(255, Math.max(0, 220 + pulse + noise));
                blue = Math.min(255, Math.max(0, 180 + noise));
            } else if (r >= 6 && r < 12) {
                // СЕРЕДИНА: Ледяная зона (Абсолютный холод, глубокий синий/фиолетовый, -20°C)
                red = Math.min(255, Math.max(0, 20 + noise));
                green = Math.min(255, Math.max(0, 15 + noise));
                blue = Math.min(255, Math.max(0, 90 + Math.sin(t * 0.05) * 20 + noise));
            } else {
                // НИЗ: Умеренное тепло (Красный спектр, +35°C)
                red = Math.min(255, Math.max(0, 180 + noise));
                green = Math.min(255, Math.max(0, 30 + noise));
                blue = Math.min(255, Math.max(0, 30 + noise));
            }
            
            // Эффект экстремального выгорания матрицы при разгоне сети
            if (oc) {
                red = Math.min(255, red * 1.5);
                green = Math.min(255, green * 0.5);
                blue = Math.min(255, blue * 2.0);
            }
            
            // Отрисовка отдельного элемента Пельтье
            ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
            ctx.fillRect(blockX + 1, blockY + 1, cellW - 2, cellH - 2);
        }
    }
    
    // Горизонтальные линии тепловых помех сканирования ИК-камеры
    let scanLines = oc ? 30 : 10;
    for (let i = 0; i < scanLines; i++) { 
        // Исправлены строки rgba и пропущенные знаки умножения
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12})`; 
        // Исправлено: Math.random() * h и Math.random() * (...)
        ctx.fillRect(0, Math.random() * h, Math.random() * (oc ? w : w * 0.5), 1); 
    } 
}

// Экспортируем для автоматического билдера
window.draw_peltier = draw_peltier;
