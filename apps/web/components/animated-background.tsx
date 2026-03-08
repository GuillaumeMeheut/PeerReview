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

        // Cache resolved colors to avoid DOM access in render loop
        let cachedGridColor = "rgba(255, 255, 255, 0.1)";
        let cachedPulseColor = "rgba(255, 255, 255, 0.5)";
        let cachedPulseFadeColor = "rgba(255, 255, 255, 0.0)";

        const resolveColors = () => {
            if (typeof window === "undefined") return;
            const temp = document.createElement("div");
            temp.style.display = "none";
            document.body.appendChild(temp);

            // Use color-mix to let the browser handle opacity calculations regardless of format (oklch, lab, rgb)
            temp.style.color = "color-mix(in srgb, var(--primary), transparent 80%)";
            cachedGridColor = getComputedStyle(temp).color;

            temp.style.color = "color-mix(in srgb, var(--primary), transparent 50%)";
            cachedPulseColor = getComputedStyle(temp).color;

            temp.style.color = "color-mix(in srgb, var(--primary), transparent 100%)";
            cachedPulseFadeColor = getComputedStyle(temp).color;

            document.body.removeChild(temp);
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
            lastTurnX: number = -1;
            lastTurnY: number = -1;

            constructor(mainWidth: number, mainHeight: number, initial: boolean = false) {
                this.mainWidth = mainWidth;
                this.mainHeight = mainHeight;
                this.speed = 2 + Math.random() * 1.2;
                this.length = 55 + Math.random() * 35;

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
                const edge = getRandomInt(4); // 0: Top, 1: Right, 2: Bottom, 3: Left
                this.lastTurnX = -1;
                this.lastTurnY = -1;

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

                // User disabled turning logic: pulses stay straight

                const buffer = this.length + 50;
                if (this.x < -buffer || this.x > this.mainWidth + buffer || this.y < -buffer || this.y > this.mainHeight + buffer) {
                    this.respawn();
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const normDx = this.dx === 0 ? 0 : this.dx / Math.abs(this.dx);
                const normDy = this.dy === 0 ? 0 : this.dy / Math.abs(this.dy);

                const gradient = ctx.createLinearGradient(
                    this.x, this.y,
                    this.x - normDx * this.length,
                    this.y - normDy * this.length
                );
                // Use cached theme colors
                gradient.addColorStop(0, cachedPulseColor);
                gradient.addColorStop(1, cachedPulseFadeColor);

                ctx.beginPath();
                ctx.lineWidth = 1.5;
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

        const preRenderGrid = (w: number, h: number) => {
            gridCanvas = document.createElement('canvas');
            gridCanvas.width = w;
            gridCanvas.height = h;
            const gCtx = gridCanvas.getContext('2d');
            if (!gCtx) return;

            gCtx.strokeStyle = cachedGridColor;
            gCtx.lineWidth = 1;

            const nbOfEntityW = Math.ceil(w / GRID_SIZE);
            const nbOfEntityH = Math.ceil(h / GRID_SIZE);

            for (let i = 0; i <= nbOfEntityW; i++) {
                for (let j = 0; j <= nbOfEntityH; j++) {
                    gCtx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        };

        const initCanvas = () => {
            if (!canvas) return;
            resolveColors();
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;

            preRenderGrid(w, h);
            pulses = [];

            const nbOfEntityW = Math.ceil(w / GRID_SIZE);
            const nbOfEntityH = Math.ceil(h / GRID_SIZE);
            const pulseCount = Math.floor((nbOfEntityW * nbOfEntityH) * 0.2) + 20;

            for (let i = 0; i < pulseCount; i++) {
                pulses.push(new Pulse(w, h, true));
            }
        };

        const renderLoop = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw cached grid
            if (gridCanvas) {
                ctx.drawImage(gridCanvas, 0, 0);
            }

            for (const pulse of pulses) {
                pulse.update();
                pulse.draw(ctx);
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        initCanvas();
        renderLoop();

        const handleResize = () => {
            initCanvas();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-2] pointer-events-none opacity-30"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
