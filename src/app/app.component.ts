import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'blogger';

  @ViewChild('matrixCanvas', { static: true })
  private readonly matrixCanvasRef!: ElementRef<HTMLCanvasElement>;

  private animationFrameId: number | null = null;
  private resizeListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) {
      return;
    }

    const canvas = this.matrixCanvasRef.nativeElement;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      return;
    }

    const charset = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let lastTime = 0;
    const targetFps = 30;
    const frameIntervalMs = 1000 / targetFps;

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.font = `${fontSize}px var(--mono)`;

      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * height / fontSize));
    };

    const tick = (time: number) => {
      if (time - lastTime < frameIntervalMs) {
        this.animationFrameId = window.requestAnimationFrame(tick);
        return;
      }
      lastTime = time;

      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = 'rgba(10, 10, 10, 0.08)';
      context.fillRect(0, 0, width, height);

      context.fillStyle = 'rgba(0, 255, 65, 0.75)';
      for (let i = 0; i < columns; i++) {
        const char = charset.charAt(Math.floor(Math.random() * charset.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        context.fillText(char, x, y);

        const isOffScreen = y > height && Math.random() > 0.975;
        if (isOffScreen) {
          drops[i] = 0;
        } else {
          drops[i] += 1;
        }
      }

      this.animationFrameId = window.requestAnimationFrame(tick);
    };

    resize();
    this.resizeListener = () => resize();
    window.addEventListener('resize', this.resizeListener, { passive: true });

    this.animationFrameId = window.requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }
}
