"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const GRID_SIZE = 120;
        let gridCanvas: HTMLCanvasElement | null = null;
        let cachedGridColor = "rgba(255, 255, 255, 0.05)"; // Default subtle white

        const resolveColors = () => {
            if (typeof window === 'undefined') return;
            const root = document.documentElement;
            const style = getComputedStyle(root);
            const primaryHsl = style.getPropertyValue('--primary').trim();

            // Just resolve once and cache. If user wants white (as seen in their recent edits), 
            // we can stick to a subtle version of the primary or just white.
            // Using a subtle version of the primary color for the grid.
            if (primaryHsl && primaryHsl.includes(' ')) {
                const parts = primaryHsl.split(' ');
                cachedGridColor = `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.08)`;
            } else {
                cachedGridColor = "rgba(255, 255, 255, 0.05)";
            }
        };

        class Pulse {
            x!: number;
            y!: number;
            speed: number;
            dx!: number;
            dy!: number;
            mainWidth: number;
            mainHeight: number;
            length: number;
            color: string;

            constructor(mainWidth: number, mainHeight: number, initial: boolean = false) {
                this.mainWidth = mainWidth;
                this.mainHeight = mainHeight;
                this.speed = 0.5 + Math.random() * 1.3;
                this.length = 55 + Math.random() * 35;
                this.color = 'rgba(253, 255, 255,'; // User's preferred bright white

                if (initial) {
                    this.x = getRandomInt(Math.ceil(mainWidth / GRID_SIZE)) * GRID_SIZE;
                    this.y = getRandomInt(Math.ceil(mainHeight / GRID_SIZE)) * GRID_SIZE;
                    if (Math.random() > 0.5) {
                        this.dx = Math.random() > 0.5 ? this.speed : -this.speed;
                        this.dy = 0;
                    } else {
                        this.dx = 0;
                        this.dy = Math.random() > 0.5 ? this.speed : -this.speed;
                    }
                } else {
                    this.respawn();
                }
            }

            respawn() {
                const edge = getRandomInt(4);
                switch (edge) {
                    case 0: // Top
                        this.x = getRandomInt(Math.ceil(this.mainWidth / GRID_SIZE)) * GRID_SIZE;
                        this.y = -this.length;
                        this.dx = 0;
                        this.dy = this.speed;
                        break;
                    case 1: // Right
                        this.x = this.mainWidth + this.length;
                        this.y = getRandomInt(Math.ceil(this.mainHeight / GRID_SIZE)) * GRID_SIZE;
                        this.dx = -this.speed;
                        this.dy = 0;
                        break;
                    case 2: // Bottom
                        this.x = getRandomInt(Math.ceil(this.mainWidth / GRID_SIZE)) * GRID_SIZE;
                        this.y = this.mainHeight + this.length;
                        this.dx = 0;
                        this.dy = -this.speed;
                        break;
                    case 3: // Left
                        this.x = -this.length;
                        this.y = getRandomInt(Math.ceil(this.mainHeight / GRID_SIZE)) * GRID_SIZE;
                        this.dx = this.speed;
                        this.dy = 0;
                        break;
                }
            }

            update() {
                this.x += this.dx;
                this.y += this.dy;
                const buffer = this.length + 50;
                if (this.x < -buffer || this.x > this.mainWidth + buffer || this.y < -buffer || this.y > this.mainHeight + buffer) {
                    this.respawn();
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const normDx = this.dx === 0 ? 0 : this.dx / Math.abs(this.dx);
                const normDy = this.dy === 0 ? 0 : this.dy / Math.abs(this.dy);

                const fullColor = this.color + ' 0.8)'; // Slightly lower opacity for subtleness
                const fadeColor = this.color + ' 0.0)';

                const gradient = ctx.createLinearGradient(
                    this.x, this.y,
                    this.x - normDx * this.length,
                    this.y - normDy * this.length
                );
                gradient.addColorStop(0, fullColor);
                gradient.addColorStop(1, fadeColor);

                ctx.beginPath();
                ctx.lineWidth = 1.2;
                ctx.lineCap = "round";
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - normDx * this.length, this.y - normDy * this.length);
                ctx.strokeStyle = gradient;
                ctx.stroke();
                ctx.closePath();
            }
        }

        const getRandomInt = (max: number) => Math.floor(Math.random() * max);
        let pulses: Pulse[] = [];

        const initCanvas = () => {
            if (!canvas) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;

            resolveColors();

            // Create offscreen canvas for the grid
            gridCanvas = document.createElement('canvas');
            gridCanvas.width = w;
            gridCanvas.height = h;
            const gridCtx = gridCanvas.getContext('2d');

            if (gridCtx) {
                gridCtx.strokeStyle = cachedGridColor;
                gridCtx.lineWidth = 1;
                const nbOfEntityW = Math.ceil(w / GRID_SIZE);
                const nbOfEntityH = Math.ceil(h / GRID_SIZE);

                gridCtx.beginPath();
                for (let i = 0; i <= nbOfEntityW; i++) {
                    gridCtx.moveTo(i * GRID_SIZE, 0);
                    gridCtx.lineTo(i * GRID_SIZE, h);
                }
                for (let j = 0; j <= nbOfEntityH; j++) {
                    gridCtx.moveTo(0, j * GRID_SIZE);
                    gridCtx.lineTo(w, j * GRID_SIZE);
                }
                gridCtx.stroke();
            }

            pulses = [];
            const pulseCount = Math.floor((w * h) / (GRID_SIZE * GRID_SIZE) * 2.5); // Density based
            for (let i = 0; i < pulseCount; i++) {
                pulses.push(new Pulse(w, h, true));
            }
        };

        const renderLoop = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the pre-rendered grid (extremely fast)
            if (gridCanvas) {
                ctx.drawImage(gridCanvas, 0, 0);
            }

            // Update and draw pulses
            for (const pulse of pulses) {
                pulse.update();
                pulse.draw(ctx);
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        const handleResize = () => {
            initCanvas();
        };

        initCanvas();
        renderLoop();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-2] pointer-events-none opacity-10"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
