function drawBars(isLinear = true) {
    ctx.save();
    ctx.strokeStyle = drawSettings.lineColor;
    ctx.lineWidth = drawSettings.lineWidth;
    ctx.fillStyle = drawSettings.fillColor;

    let barSpacing = drawSettings.spacing;
    let margin = 1;

    if (isLinear) {
        let x, y, width, height;
        let screenWidthForBars = canvas.width - margin * 2;
        let screenHeightForBars = canvas.height - margin * 2;
        let barWidth = (screenWidthForBars / audioData.length) - barSpacing;
        let barHeight = (screenHeightForBars / audioData.length) - barSpacing;
        for (let i = 0; i < audioData.length; i++) {
            switch (drawSettings.placement) {
                case "top": // top/left
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = drawSettings.baselinePosition;
                        width = barWidth;
                        height = audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition;
                        y = (i * barWidth) + (barSpacing * i);
                        width = audioData[i];
                        height = barWidth;
                    }
                    break;
                case "bottom": // bottom/right
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = canvas.height - drawSettings.baselinePosition;
                        width = barWidth;
                        height = -audioData[i];
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = canvas.width - drawSettings.baselinePosition;
                        y = (i * barWidth) + (barSpacing * i);
                        width = -audioData[i];
                        height = barHeight;
                    }
                    break;
                case "middle":
                    if (drawSettings.orientation == "horizontal") {
                        x = (i * barWidth) + (barSpacing * i);
                        y = drawSettings.baselinePosition - audioData[i];
                        width = barWidth;
                        height = audioData[i] * 2;
                    }
                    if (drawSettings.orientation == "vertical") {
                        x = drawSettings.baselinePosition - audioData[i];
                        y = (i * barWidth) + (barSpacing * i);
                        width = audioData[i] * 2;
                        height = barWidth;
                    }
                    break;
            }
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }


    
    else { // Radial
        const rotationCenter = { x: 0, y: 0 };
        let rotationRadius = 50;
        let theta = 0;
        let delta = 360 / audioData.length * barSpacing;
        let barWidth = (360 / audioData.length) - barSpacing;

        if (drawSettings.orientation == "horizontal") {
            switch (drawSettings.placement) {
                case "top": // top
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 4;
                    break;
                case "bottom": // bottom
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = (canvas.height / 4) * 3;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        else if (drawSettings.orientation == "vertical") {
            switch (drawSettings.placement) {
                case "top": // left
                    rotationCenter.x = canvas.width / 4;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "bottom": // right
                    rotationCenter.x = (canvas.width / 4) * 3;
                    rotationCenter.y = canvas.height / 2;
                    break;
                case "middle":
                    rotationCenter.x = canvas.width / 2;
                    rotationCenter.y = canvas.height / 2;
                    break;
            }
        }
        ctx.translate(rotationCenter.x, rotationCenter.y);

        for (let i = 0; i < audioData.length; i++) {
            let newX = rotationRadius * Math.cos(utility.degreesToRadians(theta));
            let newY = rotationRadius * Math.sin(utility.degreesToRadians(theta));
            ctx.save();
            ctx.translate(newX, newY);
            ctx.rotate(utility.degreesToRadians(theta));

            ctx.beginPath();
            ctx.rect(0, -barWidth / 2, audioData[i], barWidth);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.restore();
            theta += delta;
        }
    }
    ctx.restore();
}