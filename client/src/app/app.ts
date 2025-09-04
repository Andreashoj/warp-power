import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PowerListComponent } from './components/power-list/power-list';
import { FloatingKittenComponent } from './components/floating-kitten/floating-kitten';
import { TreatDispenserComponent, Treat } from './components/treat-dispenser/treat-dispenser';
import { UserInventoryComponent } from './components/user-inventory/user-inventory';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { AppStateService } from './core/services/app-state.service';
import { PowersContainerComponent } from './features/powers/containers/powers-container.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    PowersContainerComponent,
    FloatingKittenComponent, 
    TreatDispenserComponent, 
    UserInventoryComponent,
    NotificationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly appState = inject(AppStateService);
  protected readonly title = signal('Warp Power');

  protected onTreatThrown(treat: Treat): void {
    this.appState.addTreat(treat);
  }

  protected onTreatEaten(treatId: string): void {
    this.appState.removeTreat(treatId);
  }
}
