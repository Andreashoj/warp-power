import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService, User, Item, InventoryItem } from '../../services/database';

@Component({
  selector: 'app-user-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-inventory.html',
  styleUrl: './user-inventory.css'
})
export class UserInventoryComponent implements OnInit {
  users: User[] = [];
  items: Item[] = [];
  loading = true;
  error: string | null = null;
  selectedUserId = 1; // Default to Alice

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load users and items in parallel
    Promise.all([
      this.databaseService.getUsers().toPromise(),
      this.databaseService.getItems().toPromise()
    ]).then(([users, items]) => {
      this.users = users || [];
      this.items = items || [];
      this.loading = false;
    }).catch(err => {
      this.error = 'Failed to load inventory data. Make sure the API is running!';
      this.loading = false;
      console.error('Error loading data:', err);
    });
  }

  getSelectedUser(): User | undefined {
    return this.users.find(u => u.id === this.selectedUserId);
  }

  getUserInventory(): InventoryItem[] {
    const user = this.getSelectedUser();
    return user?.inventories || [];
  }

  getItemForInventory(inventory: InventoryItem): Item | undefined {
    return this.items.find(i => i.id === inventory.itemId);
  }

  onUserChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedUserId = parseInt(target.value);
  }

  getTotalValue(): number {
    return this.getUserInventory().reduce((total, inv) => {
      const item = this.getItemForInventory(inv);
      return total + (item ? item.value * inv.quantity : 0);
    }, 0);
  }
}
