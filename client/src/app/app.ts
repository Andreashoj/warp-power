import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PowerListComponent } from './components/power-list/power-list';
import { FloatingKittenComponent } from './components/floating-kitten/floating-kitten';
import { TreatDispenserComponent, Treat } from './components/treat-dispenser/treat-dispenser';
import { UserInventoryComponent } from './components/user-inventory/user-inventory';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PowerListComponent, FloatingKittenComponent, TreatDispenserComponent, UserInventoryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(TreatDispenserComponent) treatDispenser!: TreatDispenserComponent;
  @ViewChild(FloatingKittenComponent) kitten!: FloatingKittenComponent;
  
  protected readonly title = signal('Warp Power');
  treats: Treat[] = [];

  onTreatThrown(treat: Treat): void {
    this.treats.push(treat);
  }

  onTreatEaten(treatId: string): void {
    this.treats = this.treats.filter(t => t.id !== treatId);
  }
}
