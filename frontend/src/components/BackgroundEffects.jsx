import React, { useEffect, useState, useRef } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size 1 to 4
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.speedY = Math.random() * 0.5 + 0.1; // Drift upwards slowly
        this.alpha = Math.random() * 0.5 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      }
      
      draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`; // Premium violet hue
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
      }
      
      update(mouse) {
        // Twinkling effect
        this.alpha += this.twinkleSpeed;
        if (this.alpha >= 0.8 || this.alpha <= 0.1) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }

        // Float upwards
        this.y -= this.speedY;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
          this.baseX = this.x;
        }

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 150;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
          this.size = Math.min(this.size + 0.2, 5); // Grow slightly when near mouse
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20; // Return to base X slowly
          }
          if (this.size > 2) {
             this.size -= 0.1;
          }
        }
      }
    }
    
    // Create particles
    const particles = [];
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Track mouse
    let mouse = {
      x: null,
      y: null
    };
    
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update(mouse);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default BackgroundEffects;
