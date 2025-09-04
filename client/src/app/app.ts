import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PowerListComponent } from './components/power-list/power-list';
import { FloatingKittenComponent } from './components/floating-kitten/floating-kitten';
import { TreatDispenserComponent, Treat } from './components/treat-dispenser/treat-dispenser';
import { UserInventoryComponent } from './components/user-inventory/user-inventory';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PowerListComponent, FloatingKittenComponent, TreatDispenserComponent, UserInventoryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('Warp Power');
  protected readonly treats = signal<Treat[]>([]);

  protected onTreatThrown(treat: Treat): void {
    this.treats.update(treats => [...treats, treat]);
  }

  protected onTreatEaten(treatId: string): void {
    this.treats.update(treats => treats.filter(t => t.id !== treatId));
  }
}
