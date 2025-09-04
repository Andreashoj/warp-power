import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  
  readonly notifications = computed(() => this._notifications());
  
  showSuccess(message: string, autoClose = true, duration = 5000): void {
    this.addNotification(message, 'success', autoClose, duration);
  }
  
  showError(message: string, autoClose = false, duration = 0): void {
    this.addNotification(message, 'error', autoClose, duration);
  }
  
  showWarning(message: string, autoClose = true, duration = 7000): void {
    this.addNotification(message, 'warning', autoClose, duration);
  }
  
  showInfo(message: string, autoClose = true, duration = 5000): void {
    this.addNotification(message, 'info', autoClose, duration);
  }
  
  dismiss(id: string): void {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }
  
  clear(): void {
    this._notifications.set([]);
  }
  
  private addNotification(
    message: string, 
    type: Notification['type'], 
    autoClose: boolean, 
    duration: number
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      autoClose,
      duration
    };
    
    this._notifications.update(notifications => [...notifications, notification]);
    
    if (autoClose && duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }
  }
  
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
