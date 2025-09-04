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
    
    // Log the error for debugging
    this.logError(appError);
    
    // Show user-friendly message
    this.showUserError(appError);
  }

  private createAppError(error: unknown): AppError {
    let message = 'An unexpected error occurred';
    let userMessage = 'Something went wrong. Please try again.';
    let code: string | undefined;
    let details = error;

    if (error instanceof Error) {
      message = error.message;
      
      // Handle specific error types
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

    // In production, send to logging service
    if (this.isProduction()) {
      this.sendToLoggingService(error);
    }
  }

  private showUserError(error: AppError): void {
    this.notificationService.showError(error.userMessage || error.message);
  }

  private isProduction(): boolean {
    return false; // Replace with actual environment check
  }

  private sendToLoggingService(error: AppError): void {
    // Implementation for external logging service
    // e.g., Sentry, LogRocket, etc.
  }
}
