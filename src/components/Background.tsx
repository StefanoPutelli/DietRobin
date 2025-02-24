'use client';
import { drawFlower } from "@/lib/simplexNoise";
import { useEffect, useRef } from "react";

const FPS = 60;

export default function Background() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineWidth = 2;
                let freq = 2.0;
                const upLimit = 2.5;
                const downLimit = 1.5;
                let asc = true;
                const draw = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawFlower(ctx, {
                        x: canvas.width,
                        y: canvas.height,
                        radius: Math.min(canvas.width, canvas.height) / 2,
                    }, "#b3e240", "#66cc8a", freq);
                    if (freq > upLimit) {
                        asc = false;
                    } else if (freq < downLimit) {
                        asc = true;
                    }
                    freq += asc ? 0.003 : -0.003;
                    setTimeout(() => {
                        requestAnimationFrame(draw);
                    }, 1000 / FPS);
                }
                draw();

            }
        }
    }, []);

    return (
        <div className="absolute top-0 right-0 h-full aspect-square z-[-1]">
            <canvas ref={canvasRef} height={1080} width={1080} className="w-full h-full"></canvas>
        </div>
    )
}