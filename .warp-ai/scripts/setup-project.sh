#!/bin/bash

# Angular Tips Project Setup Script
# Usage: ./setup-project.sh [project-name]

set -e

PROJECT_NAME=${1:-$(basename $(pwd))}

echo "🚀 Setting up Angular Tips architecture for: $PROJECT_NAME"

# Create directory structure
echo "📁 Creating directory structure..."

mkdir -p src/app/{core,shared,features,layout}
mkdir -p src/app/core/{services,interceptors,guards}
mkdir -p src/app/shared/{components,pipes,directives,utils}
mkdir -p src/app/features

echo "✅ Directory structure created"

# Create core services
echo "🔧 Setting up core services..."

# AppStateService
cat > src/app/core/services/app-state.service.ts << 'EOF'
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Global application state
  private readonly _globalLoading = signal(false);
  private readonly _user = signal<any>(null);
  
  // Public selectors
  readonly globalState = computed(() => ({
    loading: this._globalLoading(),
    user: this._user(),
    isAuthenticated: this._user() !== null
  }));
  
  // Actions
  setGlobalLoading(loading: boolean): void {
    this._globalLoading.set(loading);
  }
  
  setUser(user: any): void {
    this._user.set(user);
  }
  
  clearUser(): void {
    this._user.set(null);
  }
}
EOF

# NotificationService
cat > src/app/core/services/notification.service.ts << 'EOF'
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
EOF

# LoadingService
cat > src/app/core/services/loading.service.ts << 'EOF'
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _loadingCount = signal(0);
  
  readonly isLoading = computed(() => this._loadingCount() > 0);
  
  show(): void {
    this._loadingCount.update(count => count + 1);
  }
  
  hide(): void {
    this._loadingCount.update(count => Math.max(0, count - 1));
  }
  
  reset(): void {
    this._loadingCount.set(0);
  }
}
EOF

# Error Handler
cat > src/app/core/services/error-handler.service.ts << 'EOF'
import { Injectable, ErrorHandler, inject } from '@angular/core';
import { NotificationService } from './notification.service';

export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: Date;
  userMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);

  handleError(error: unknown): void {
    const appError = this.createAppError(error);
    
    this.logError(appError);
    this.showUserError(appError);
  }

  private createAppError(error: unknown): AppError {
    let message = 'An unexpected error occurred';
    let userMessage = 'Something went wrong. Please try again.';
    let code: string | undefined;
    let details = error;

    if (error instanceof Error) {
      message = error.message;
      
      if (error.name === 'HttpErrorResponse') {
        code = 'HTTP_ERROR';
        userMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (error.name === 'ChunkLoadError') {
        code = 'CHUNK_LOAD_ERROR';
        userMessage = 'Failed to load application resources. Please refresh the page.';
      }
    }

    return {
      message,
      code,
      details,
      timestamp: new Date(),
      userMessage
    };
  }

  private logError(error: AppError): void {
    console.group('🚨 Application Error');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Timestamp:', error.timestamp.toISOString());
    console.error('Details:', error.details);
    console.groupEnd();
  }

  private showUserError(error: AppError): void {
    this.notificationService.showError(error.userMessage || error.message);
  }
}
EOF

# HTTP Interceptors
echo "🌐 Setting up HTTP interceptors..."

cat > src/app/core/interceptors/error.interceptor.ts << 'EOF'
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request - Please check your input';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please log in';
            break;
          case 403:
            errorMessage = 'Forbidden - You do not have permission';
            break;
          case 404:
            errorMessage = 'Not Found - The requested resource was not found';
            break;
          case 500:
            errorMessage = 'Internal Server Error - Please try again later';
            break;
          case 503:
            errorMessage = 'Service Unavailable - Please try again later';
            break;
          default:
            errorMessage = `Server Error (${error.status}): ${error.message}`;
        }
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
EOF

cat > src/app/core/interceptors/loading.interceptor.ts << 'EOF'
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skipLoading = req.headers.has('X-Skip-Loading');
  
  if (!skipLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.hide();
      }
    })
  );
};
EOF

# Barrel exports
echo "📦 Creating barrel exports..."

cat > src/app/core/services/index.ts << 'EOF'
export * from './app-state.service';
export * from './notification.service';
export * from './loading.service';
export * from './error-handler.service';
EOF

cat > src/app/core/interceptors/index.ts << 'EOF'
export * from './error.interceptor';
export * from './loading.interceptor';
EOF

cat > src/app/core/index.ts << 'EOF'
export * from './services';
export * from './interceptors';
EOF

# Notification Component
echo "🔔 Creating notification component..."

mkdir -p src/app/shared/components/notification

cat > src/app/shared/components/notification/notification.component.ts << 'EOF'
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

    .notification--success { background: rgba(16, 185, 129, 0.9); color: white; }
    .notification--error { background: rgba(239, 68, 68, 0.9); color: white; }
    .notification--warning { background: rgba(245, 158, 11, 0.9); color: white; }
    .notification--info { background: rgba(59, 130, 246, 0.9); color: white; }

    .notification__content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .notification__icon {
      margin-right: 12px;
      font-size: 18px;
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
EOF

# Update app.config.ts
echo "⚙️ Updating app configuration..."

if [ -f "src/app/app.config.ts" ]; then
    cp src/app/app.config.ts src/app/app.config.ts.backup
fi

cat > src/app/app.config.ts << 'EOF'
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AppErrorHandler, errorInterceptor, loadingInterceptor } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor, loadingInterceptor])
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
};
EOF

echo ""
echo "🎉 Angular Tips architecture setup complete!"
echo ""
echo "📁 Created:"
echo "   - Core services (AppStateService, NotificationService, LoadingService, ErrorHandler)"
echo "   - HTTP interceptors (error, loading)"
echo "   - Notification component"
echo "   - Barrel exports"
echo "   - Updated app.config.ts"
echo ""
echo "🔧 Next steps:"
echo "1. Update your main app component to include:"
echo "   <app-notification></app-notification>"
echo ""
echo "2. Generate your first feature:"
echo "   ./.warp-ai/scripts/generate-component.sh my-feature feature-list --dumb"
echo "   ./.warp-ai/scripts/generate-component.sh my-feature feature-container --smart"
echo ""
echo "3. Add state management:"
echo "   ./.warp-ai/scripts/generate-service.sh my-feature --state"
echo ""
echo "✨ Your Angular project is now following Angular Tips best practices!"
