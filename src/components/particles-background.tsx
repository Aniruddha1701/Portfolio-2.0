"use client"

import React, { useRef, useEffect } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles: Particle[] = [];
    const particleCount = Math.floor(width / 30);
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5 + 1;
        this.color = 'rgba(125, 249, 255, 0.5)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.body.scrollHeight; // Set height to scroll height
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener('resize', resizeHandler);
    // Also resize on initial load
    resizeHandler();

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if(!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(125, 249, 255, ${1 - dist / 100})`;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
        window.removeEventListener('resize', resizeHandler);
    }

  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full bg-transparent" />;
};

export default ParticlesBackground;
