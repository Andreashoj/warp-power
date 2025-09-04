import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface Treat {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isEaten: boolean;
  isLanding: boolean;
}

@Component({
  selector: 'app-treat-dispenser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treat-dispenser.html',
  styleUrl: './treat-dispenser.css',
  animations: [
    trigger('treatFall', [
      transition(':enter', [
        style({ transform: 'scale(0.5) rotate(0deg)', opacity: 0.8 }),
        animate('300ms ease-out', style({ transform: 'scale(1) rotate(360deg)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'scale(0) rotate(180deg)', opacity: 0 }))
      ])
    ])
  ]
})
export class TreatDispenserComponent implements OnInit, OnDestroy {
  @Output() treatThrown = new EventEmitter<Treat>();
  @Output() treatEaten = new EventEmitter<string>();
  
  treats: Treat[] = [];
  private animationFrame?: number;
  private gravity = 0.5;
  private bounce = 0.6;
  private friction = 0.98;

  ngOnInit(): void {
    this.startPhysicsLoop();
    this.setupClickHandler();
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  setupClickHandler(): void {
    document.addEventListener('click', (event) => {
      // Don't throw treats if clicking on the kitten
      const target = event.target as HTMLElement;
      if (target.closest('.kitten-container')) {
        return;
      }
      
      this.throwTreat(event.clientX, event.clientY);
    });
  }

  throwTreat(targetX: number, targetY: number): void {
    const treat: Treat = {
      id: Math.random().toString(36).substr(2, 9),
      x: targetX - 10, // Center the treat
      y: targetY - 10,
      velocityX: (Math.random() - 0.5) * 2, // Small random horizontal velocity
      velocityY: -5 - Math.random() * 3, // Upward initial velocity
      isEaten: false,
      isLanding: false
    };

    this.treats.push(treat);
    this.treatThrown.emit(treat);

    // Remove treat after 10 seconds if not eaten
    setTimeout(() => {
      this.removeTreat(treat.id);
    }, 10000);
  }

  startPhysicsLoop(): void {
    const updatePhysics = () => {
      this.treats.forEach(treat => {
        if (treat.isEaten) return;

        // Apply gravity
        treat.velocityY += this.gravity;
        
        // Update position
        treat.x += treat.velocityX;
        treat.y += treat.velocityY;

        // Apply friction
        treat.velocityX *= this.friction;

        // Bounce off floor (bottom of screen)
        if (treat.y > window.innerHeight - 30) {
          treat.y = window.innerHeight - 30;
          treat.velocityY *= -this.bounce;
          treat.isLanding = true;
          
          // Stop very small bounces
          if (Math.abs(treat.velocityY) < 1) {
            treat.velocityY = 0;
          }
        }

        // Bounce off walls
        if (treat.x < 0 || treat.x > window.innerWidth - 20) {
          treat.velocityX *= -this.bounce;
          treat.x = Math.max(0, Math.min(window.innerWidth - 20, treat.x));
        }
      });

      this.animationFrame = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();
  }

  removeTreat(treatId: string): void {
    this.treats = this.treats.filter(treat => treat.id !== treatId);
  }

  eatTreat(treatId: string): void {
    const treat = this.treats.find(t => t.id === treatId);
    if (treat && !treat.isEaten) {
      treat.isEaten = true;
      this.treatEaten.emit(treatId);
      
      // Remove treat after eating animation
      setTimeout(() => {
        this.removeTreat(treatId);
      }, 500);
    }
  }

  // Method for kitten to check nearby treats
  getNearbyTreat(kittenX: number, kittenY: number, radius: number = 50): Treat | null {
    return this.treats.find(treat => {
      if (treat.isEaten) return false;
      
      const distance = Math.sqrt(
        Math.pow(treat.x - kittenX, 2) + Math.pow(treat.y - kittenY, 2)
      );
      
      return distance < radius;
    }) || null;
  }

  treatTrackBy(index: number, treat: Treat): string {
    return treat.id;
  }
}
