import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PowerListComponent } from './components/power-list/power-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PowerListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Warp Power');
}
