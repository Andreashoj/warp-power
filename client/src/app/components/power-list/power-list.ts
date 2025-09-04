import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersService, WarpPower } from '../../services/powers';

@Component({
  selector: 'app-power-list',
  imports: [CommonModule],
  templateUrl: './power-list.html',
  styleUrl: './power-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerListComponent implements OnInit {
  private readonly powersService = inject(PowersService);
  
  protected readonly powers = signal<WarpPower[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPowers();
  }

  private loadPowers(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.powersService.getPowers().subscribe({
      next: (powers) => {
        this.powers.set(powers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load powers. Make sure the API is running!');
        this.loading.set(false);
        console.error('Error loading powers:', err);
      }
    });
  }
}
