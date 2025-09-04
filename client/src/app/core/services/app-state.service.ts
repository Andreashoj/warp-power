import { Injectable, signal, computed, inject } from '@angular/core';
import { PowersService, WarpPower } from '../../services/powers';
import { DatabaseService, User, Item } from '../../services/database';
import { Treat } from '../../components/treat-dispenser/treat-dispenser';

export interface AppState {
  powers: {
    items: WarpPower[];
    loading: boolean;
    error: string | null;
  };
  inventory: {
    users: User[];
    items: Item[];
    selectedUserId: number;
    loading: boolean;
    error: string | null;
  };
  treats: {
    items: Treat[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly powersService = inject(PowersService);
  private readonly databaseService = inject(DatabaseService);

  // Powers state
  private readonly _powersItems = signal<WarpPower[]>([]);
  private readonly _powersLoading = signal(false);
  private readonly _powersError = signal<string | null>(null);

  // Inventory state  
  private readonly _inventoryUsers = signal<User[]>([]);
  private readonly _inventoryItems = signal<Item[]>([]);
  private readonly _selectedUserId = signal(1);
  private readonly _inventoryLoading = signal(false);
  private readonly _inventoryError = signal<string | null>(null);

  // Treats state
  private readonly _treats = signal<Treat[]>([]);

  // Public read-only selectors
  readonly powersState = computed(() => ({
    items: this._powersItems(),
    loading: this._powersLoading(),
    error: this._powersError()
  }));

  readonly inventoryState = computed(() => ({
    users: this._inventoryUsers(),
    items: this._inventoryItems(),
    selectedUserId: this._selectedUserId(),
    loading: this._inventoryLoading(),
    error: this._inventoryError(),
    selectedUser: this._inventoryUsers().find(u => u.id === this._selectedUserId()),
    userInventory: this._inventoryUsers().find(u => u.id === this._selectedUserId())?.inventories || []
  }));

  readonly treatsState = computed(() => ({
    items: this._treats()
  }));

  // Powers actions
  loadPowers(): void {
    this._powersLoading.set(true);
    this._powersError.set(null);

    this.powersService.getPowers().subscribe({
      next: (powers) => {
        this._powersItems.set(powers);
        this._powersLoading.set(false);
      },
      error: (err) => {
        this._powersError.set('Failed to load powers. Make sure the API is running!');
        this._powersLoading.set(false);
        console.error('Error loading powers:', err);
      }
    });
  }

  // Inventory actions
  loadInventoryData(): void {
    this._inventoryLoading.set(true);
    this._inventoryError.set(null);

    Promise.all([
      this.databaseService.getUsers().toPromise(),
      this.databaseService.getItems().toPromise()
    ]).then(([users, items]) => {
      this._inventoryUsers.set(users || []);
      this._inventoryItems.set(items || []);
      this._inventoryLoading.set(false);
    }).catch(err => {
      this._inventoryError.set('Failed to load inventory data. Make sure the API is running!');
      this._inventoryLoading.set(false);
      console.error('Error loading inventory data:', err);
    });
  }

  selectUser(userId: number): void {
    this._selectedUserId.set(userId);
  }

  // Treats actions
  addTreat(treat: Treat): void {
    this._treats.update(treats => [...treats, treat]);
  }

  removeTreat(treatId: string): void {
    this._treats.update(treats => treats.filter(t => t.id !== treatId));
  }

  // Computed helpers
  readonly selectedUser = computed(() => 
    this._inventoryUsers().find(u => u.id === this._selectedUserId())
  );

  readonly userInventory = computed(() => 
    this.selectedUser()?.inventories || []
  );

  readonly inventoryTotalValue = computed(() => {
    const items = this._inventoryItems();
    return this.userInventory().reduce((total, inv) => {
      const item = items.find(i => i.id === inv.itemId);
      return total + (item ? item.value * inv.quantity : 0);
    }, 0);
  });
}
