import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService, User, Item, InventoryItem } from '../../services/database';

@Component({
  selector: 'app-user-inventory',
  imports: [CommonModule],
  templateUrl: './user-inventory.html',
  styleUrl: './user-inventory.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInventoryComponent implements OnInit {
  private readonly databaseService = inject(DatabaseService);
  
  protected readonly users = signal<User[]>([]);
  protected readonly items = signal<Item[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedUserId = signal(1); // Default to Alice
  
  // Computed properties for derived state
  protected readonly selectedUser = computed(() => 
    this.users().find(u => u.id === this.selectedUserId())
  );
  
  protected readonly userInventory = computed(() => 
    this.selectedUser()?.inventories || []
  );
  
  protected readonly totalValue = computed(() => 
    this.userInventory().reduce((total, inv) => {
      const item = this.items().find(i => i.id === inv.itemId);
      return total + (item ? item.value * inv.quantity : 0);
    }, 0)
  );

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load users and items in parallel
    Promise.all([
      this.databaseService.getUsers().toPromise(),
      this.databaseService.getItems().toPromise()
    ]).then(([users, items]) => {
      this.users.set(users || []);
      this.items.set(items || []);
      this.loading.set(false);
    }).catch(err => {
      this.error.set('Failed to load inventory data. Make sure the API is running!');
      this.loading.set(false);
      console.error('Error loading data:', err);
    });
  }

  protected getItemForInventory(inventory: InventoryItem): Item | undefined {
    return this.items().find(i => i.id === inventory.itemId);
  }

  protected onUserChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedUserId.set(parseInt(target.value));
  }
}
