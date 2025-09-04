import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowersService, WarpPower } from '../../services/powers';

@Component({
  selector: 'app-power-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './power-list.html',
  styleUrl: './power-list.css'
})
export class PowerListComponent implements OnInit {
  powers: WarpPower[] = [];
  loading = true;
  error: string | null = null;

  constructor(private powersService: PowersService) {}

  ngOnInit(): void {
    this.loadPowers();
  }

  loadPowers(): void {
    this.loading = true;
    this.powersService.getPowers().subscribe({
      next: (powers) => {
        this.powers = powers;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load powers. Make sure the API is running!';
        this.loading = false;
        console.error('Error loading powers:', err);
      }
    });
  }
}
