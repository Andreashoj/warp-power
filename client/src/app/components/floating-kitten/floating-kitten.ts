import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Treat } from '../treat-dispenser/treat-dispenser';

@Component({
  selector: 'app-floating-kitten',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-kitten.html',
  styleUrl: './floating-kitten.css',
  animations: [
    trigger('speechAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5) translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(-5px)' }))
      ])
    ]),
    trigger('bounceAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)' }),
        animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class FloatingKittenComponent implements OnInit, OnDestroy {
  @Input() treats: Treat[] = [];
  
  showSpeechBubble = false;
  speechText = 'Meow! 🐾';
  kittenX = 50; // Starting position X (percentage)
  kittenY = 50; // Starting position Y (percentage)
  isChasing = false;
  isEating = false;
  targetTreat: Treat | null = null;
  
  private moveInterval?: number;
  private speechTimeout?: number;
  private chaseInterval?: number;

  ngOnInit(): void {
    this.startFloating();
    this.startTreatDetection();
  }

  ngOnDestroy(): void {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
    }
    if (this.chaseInterval) {
      clearInterval(this.chaseInterval);
    }
  }

  startFloating(): void {
    // Move the kitten to a new random position every 3-5 seconds
    this.moveInterval = window.setInterval(() => {
      this.moveToRandomPosition();
    }, Math.random() * 2000 + 3000); // 3-5 seconds
  }

  moveToRandomPosition(): void {
    // Keep kitten within safe bounds (10% to 90% of screen)
    this.kittenX = Math.random() * 80 + 10;
    this.kittenY = Math.random() * 80 + 10;
  }

  onKittenClick(): void {
    // Show meow with centralized method
    this.showSpeech('Meow! 🐾', 2000);

    // Give kitten a little bounce when clicked
    this.kittenY = Math.max(5, this.kittenY - 5);
    setTimeout(() => {
      this.kittenY = Math.min(85, this.kittenY + 5);
    }, 200);
  }

  startTreatDetection(): void {
    this.chaseInterval = window.setInterval(() => {
      if (!this.isChasing && !this.isEating) {
        this.lookForTreats();
      } else if (this.isChasing && this.targetTreat) {
        this.chaseTreat();
      }
    }, 50); // Check every 50ms for smooth movement
  }

  lookForTreats(): void {
    const availableTreats = this.treats.filter(treat => !treat.isEaten && this.isTreatSettled(treat));
    
    if (availableTreats.length === 0) return;

    // Find the closest treat
    const kittenPixelX = (this.kittenX / 100) * window.innerWidth;
    const kittenPixelY = (this.kittenY / 100) * window.innerHeight;

    let closestTreat: Treat | null = null;
    let closestDistance = Infinity;

    availableTreats.forEach(treat => {
      const distance = Math.sqrt(
        Math.pow(treat.x - kittenPixelX, 2) + 
        Math.pow(treat.y - kittenPixelY, 2)
      );
      
      if (distance < closestDistance && distance < 300) { // Only chase nearby treats
        closestDistance = distance;
        closestTreat = treat;
      }
    });

    if (closestTreat) {
      this.startChasing(closestTreat);
    }
  }

  isTreatSettled(treat: Treat): boolean {
    // Only chase treats that have landed or are moving slowly
    return treat.isLanding || Math.abs(treat.velocityY) < 2;
  }

  startChasing(treat: Treat): void {
    this.isChasing = true;
    this.targetTreat = treat;
    
    // Stop normal floating while chasing
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = undefined;
    }

    // Show excited speech bubble
    this.showSpeech('Treat! 🍪', 1500);
  }

  chaseTreat(): void {
    if (!this.targetTreat || this.targetTreat.isEaten) {
      this.stopChasing();
      return;
    }

    const kittenPixelX = (this.kittenX / 100) * window.innerWidth;
    const kittenPixelY = (this.kittenY / 100) * window.innerHeight;

    const deltaX = this.targetTreat.x - kittenPixelX;
    const deltaY = this.targetTreat.y - kittenPixelY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If close enough, eat the treat!
    if (distance < 30) {
      this.eatTreat();
      return;
    }

    // Move towards the treat
    const speed = 2; // pixels per frame
    const moveX = (deltaX / distance) * speed;
    const moveY = (deltaY / distance) * speed;

    const newPixelX = kittenPixelX + moveX;
    const newPixelY = kittenPixelY + moveY;

    // Convert back to percentages
    this.kittenX = (newPixelX / window.innerWidth) * 100;
    this.kittenY = (newPixelY / window.innerHeight) * 100;

    // Keep kitten within bounds
    this.kittenX = Math.max(5, Math.min(95, this.kittenX));
    this.kittenY = Math.max(5, Math.min(95, this.kittenY));
  }

  eatTreat(): void {
    if (!this.targetTreat) return;

    this.isEating = true;
    this.targetTreat.isEaten = true;

    // Happy eating speech bubbles with longer duration
    const eatingSounds = ['Nom nom! 😋', 'Yummy! 😸', 'Purr... 😻', 'Crunch! 😍', 'So good! 🥰'];
    const randomSound = eatingSounds[Math.floor(Math.random() * eatingSounds.length)];
    this.showSpeech(randomSound, 3000); // Show for 3 seconds

    // Eating animation duration - longer to show the speech
    setTimeout(() => {
      this.isEating = false;
      this.stopChasing();
    }, 3500); // Slightly longer than speech to ensure smooth transition
  }

  stopChasing(): void {
    this.isChasing = false;
    this.targetTreat = null;
    this.speechText = 'Meow! 🐾';
    
    // Resume normal floating behavior
    if (!this.moveInterval) {
      this.startFloating();
    }
  }

  // Centralized speech bubble method to avoid conflicts
  showSpeech(text: string, duration: number): void {
    // Clear any existing speech timeout
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
    }
    
    this.speechText = text;
    this.showSpeechBubble = true;
    
    // Hide speech bubble after specified duration
    this.speechTimeout = window.setTimeout(() => {
      this.showSpeechBubble = false;
    }, duration);
  }
}
