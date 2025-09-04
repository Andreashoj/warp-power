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
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
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

      // Show user-friendly notification
      notificationService.showError(errorMessage);

      // Log detailed error for debugging
      console.error('HTTP Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
        message: error.message
      });

      return throwError(() => error);
    })
  );
};
