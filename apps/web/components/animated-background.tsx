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
        const GRID_SIZE = 130;

        let gridCanvas: HTMLCanvasElement | null = null;
        let pulses: Pulse[] = [];

        const dpr = window.devicePixelRatio || 1;

        let cachedGridColor = "rgba(255,255,255,0.1)";
        let cachedPulseColor = "rgba(255,255,255,0.5)";
        let cachedPulseFadeColor = "rgba(255,255,255,0)";

        const resolveColors = () => {
            const temp = document.createElement("div");
            temp.style.display = "none";
            document.body.appendChild(temp);

            temp.style.color = "color-mix(in srgb, var(--primary), transparent 80%)";
            cachedGridColor = getComputedStyle(temp).color;

            temp.style.color = "color-mix(in srgb, var(--primary), transparent 80%)";
            cachedPulseColor = getComputedStyle(temp).color;

            temp.style.color = "color-mix(in srgb, var(--primary), transparent 100%)";
            cachedPulseFadeColor = getComputedStyle(temp).color;

            document.body.removeChild(temp);
        };

        const getRandomInt = (max: number) => Math.floor(Math.random() * max);

        class Pulse {
            x!: number;
            y!: number;

            dx!: number;
            dy!: number;

            speed: number;
            length: number;

            mainWidth: number;
            mainHeight: number;

            constructor(w: number, h: number, initial = false) {
                this.mainWidth = w;
                this.mainHeight = h;

                this.speed = 0.8;
                this.length = 100 + Math.random() * 35;

                if (initial) {
                    this.x = getRandomInt(Math.ceil(w / GRID_SIZE)) * GRID_SIZE;
                    this.y = getRandomInt(Math.ceil(h / GRID_SIZE)) * GRID_SIZE;

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
                    case 0:
                        this.x = getRandomInt(Math.ceil(this.mainWidth / GRID_SIZE)) * GRID_SIZE;
                        this.y = -this.length;
                        this.dx = 0;
                        this.dy = this.speed;
                        break;

                    case 1:
                        this.x = this.mainWidth + this.length;
                        this.y = getRandomInt(Math.ceil(this.mainHeight / GRID_SIZE)) * GRID_SIZE;
                        this.dx = -this.speed;
                        this.dy = 0;
                        break;

                    case 2:
                        this.x = getRandomInt(Math.ceil(this.mainWidth / GRID_SIZE)) * GRID_SIZE;
                        this.y = this.mainHeight + this.length;
                        this.dx = 0;
                        this.dy = -this.speed;
                        break;

                    case 3:
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

                if (
                    this.x < -buffer ||
                    this.x > this.mainWidth + buffer ||
                    this.y < -buffer ||
                    this.y > this.mainHeight + buffer
                ) {
                    this.respawn();
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const normDx = this.dx === 0 ? 0 : this.dx / Math.abs(this.dx);
                const normDy = this.dy === 0 ? 0 : this.dy / Math.abs(this.dy);

                const gradient = ctx.createLinearGradient(
                    this.x,
                    this.y,
                    this.x - normDx * this.length,
                    this.y - normDy * this.length
                );

                gradient.addColorStop(0, cachedPulseColor);
                gradient.addColorStop(1, cachedPulseFadeColor);

                ctx.beginPath();
                ctx.lineWidth = 1.5;
                ctx.lineCap = "round";

                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - normDx * this.length, this.y - normDy * this.length);

                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
        }

        const preRenderGrid = (w: number, h: number) => {
            gridCanvas = document.createElement("canvas");
            gridCanvas.width = w;
            gridCanvas.height = h;

            const gCtx = gridCanvas.getContext("2d");
            if (!gCtx) return;

            gCtx.strokeStyle = cachedGridColor;
            gCtx.lineWidth = 1;

            const nbW = Math.ceil(w / GRID_SIZE);
            const nbH = Math.ceil(h / GRID_SIZE);

            for (let i = 0; i <= nbW; i++) {
                for (let j = 0; j <= nbH; j++) {
                    gCtx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                }
            }
        };

        const initCanvas = () => {
            const rect = canvas.getBoundingClientRect();

            const width = rect.width;
            const height = rect.height;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            resolveColors();
            preRenderGrid(width, height);

            pulses = [];

            const nbW = Math.ceil(width / GRID_SIZE);
            const nbH = Math.ceil(height / GRID_SIZE);

            const pulseCount = Math.floor(nbW * nbH * 0.2) + 20;

            for (let i = 0; i < pulseCount; i++) {
                pulses.push(new Pulse(width, height, true));
            }
        };

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (gridCanvas) {
                ctx.drawImage(gridCanvas, 0, 0);
            }

            for (const pulse of pulses) {
                pulse.update();
                pulse.draw(ctx);
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        const debounce = (fn: () => void, delay: number) => {
            let t: NodeJS.Timeout;
            return () => {
                clearTimeout(t);
                t = setTimeout(fn, delay);
            };
        };

        const handleResize = debounce(() => {
            initCanvas();
        }, 200);

        window.addEventListener("resize", handleResize);

        // Wait for layout
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initCanvas();
                renderLoop();
            });
        });

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