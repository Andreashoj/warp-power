import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';
import { PowerListComponent } from '../../../components/power-list/power-list';

@Component({
  selector: 'app-powers-container',
  imports: [PowerListComponent],
  template: `
    <app-power-list 
      [powers]="appState.powersState().items"
      [loading]="appState.powersState().loading"
      [error]="appState.powersState().error">
    </app-power-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowersContainerComponent implements OnInit {
  protected readonly appState = inject(AppStateService);

  ngOnInit(): void {
    this.appState.loadPowers();
  }
}
