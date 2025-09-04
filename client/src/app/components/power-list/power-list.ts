import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarpPower } from '../../services/powers';

@Component({
  selector: 'app-power-list',
  imports: [CommonModule],
  templateUrl: './power-list.html',
  styleUrl: './power-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerListComponent {
  // Pure presentation component - all data comes from inputs
  readonly powers = input<WarpPower[]>([]);
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
}
