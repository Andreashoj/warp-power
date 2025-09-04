import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="notification"
          [class]="'notification--' + notification.type"
          role="alert">
          
          <div class="notification__content">
            <span class="notification__icon">{{ getIcon(notification.type) }}</span>
            <span class="notification__message">{{ notification.message }}</span>
          </div>
          
          <button 
            type="button"
            class="notification__close"
            (click)="dismiss(notification.id)"
            aria-label="Close notification">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
    }

    .notification--success {
      background: rgba(16, 185, 129, 0.9);
      color: white;
    }

    .notification--error {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }

    .notification--warning {
      background: rgba(245, 158, 11, 0.9);
      color: white;
    }

    .notification--info {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }

    .notification__content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .notification__icon {
      margin-right: 12px;
      font-size: 18px;
    }

    .notification__message {
      flex: 1;
      font-weight: 500;
    }

    .notification__close {
      background: none;
      border: none;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      margin-left: 12px;
      border-radius: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .notification__close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  protected readonly notificationService = inject(NotificationService);
  
  protected getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }
  
  protected dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
