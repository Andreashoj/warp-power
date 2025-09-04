import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  showSpeechBubble = false;
  kittenX = 50; // Starting position X (percentage)
  kittenY = 50; // Starting position Y (percentage)
  
  private moveInterval?: number;
  private speechTimeout?: number;

  ngOnInit(): void {
    this.startFloating();
  }

  ngOnDestroy(): void {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
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
    this.showSpeechBubble = true;
    
    // Hide speech bubble after 2 seconds
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
    }
    
    this.speechTimeout = window.setTimeout(() => {
      this.showSpeechBubble = false;
    }, 2000);

    // Give kitten a little bounce when clicked
    this.kittenY = Math.max(5, this.kittenY - 5);
    setTimeout(() => {
      this.kittenY = Math.min(85, this.kittenY + 5);
    }, 200);
  }
}
