# Angular Tips Architecture Configuration for Warp AI

This configuration provides templates and patterns for building Angular applications following the best practices from [Angular Tips (ngtips.com)](https://ngtips.com).

## 🏗️ Architecture Patterns

### Project Structure
```
src/app/
├── core/                    # Core services & infrastructure
│   ├── services/           # App-wide services (state, error handling, etc.)
│   ├── interceptors/       # HTTP interceptors
│   ├── guards/            # Route guards
│   └── index.ts           # Barrel exports
├── shared/                 # Reusable components & utilities
│   ├── components/        # Dumb/presentation components
│   ├── pipes/            # Custom pipes
│   ├── directives/       # Custom directives
│   └── utils/            # Utility functions
├── features/              # Feature modules
│   └── [feature-name]/
│       ├── components/    # Dumb components
│       ├── containers/    # Smart components
│       ├── services/      # Feature-specific services
│       └── index.ts      # Feature barrel exports
└── layout/               # Application layout components
```

## 🎯 Component Patterns

### Smart/Dumb Component Pattern
- **Smart Components (Containers):** Handle state, business logic, API calls
- **Dumb Components (Presentation):** Pure display components with inputs/outputs
- **Location:** Smart in `/containers/`, Dumb in `/components/`

### State Management
- Use **signals** for reactive state management
- **AppStateService** for centralized application state
- **Computed properties** for derived state
- **Private signals** with **public computed selectors**

## 📋 Code Templates

### Smart Container Component Template
```typescript
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-[feature]-container',
  imports: [/* presentation components */],
  template: \`
    <app-[feature]-list 
      [items]="appState.[feature]State().items"
      [loading]="appState.[feature]State().loading"
      [error]="appState.[feature]State().error">
    </app-[feature]-list>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Feature]ContainerComponent implements OnInit {
  protected readonly appState = inject(AppStateService);

  ngOnInit(): void {
    this.appState.load[Feature]();
  }
}
```

### Dumb Presentation Component Template
```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-[feature]-list',
  imports: [CommonModule],
  templateUrl: './[feature]-list.component.html',
  styleUrl: './[feature]-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [Feature]ListComponent {
  // Pure presentation component - all data from inputs
  readonly items = input<[Type][]>([]);
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  
  // Events to parent
  readonly itemSelected = output<[Type]>();
  readonly itemDeleted = output<string>();
}
```

### Service with State Management Template
```typescript
import { Injectable, signal, computed, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class [Feature]StateService {
  private readonly [feature]Service = inject([Feature]Service);
  
  // Private state
  private readonly _items = signal<[Type][]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  // Public selectors
  readonly [feature]State = computed(() => ({
    items: this._items(),
    loading: this._loading(),
    error: this._error()
  }));
  
  // Actions
  load[Feature](): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.[feature]Service.get[Feature]().subscribe({
      next: (items) => {
        this._items.set(items);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load [feature]');
        this._loading.set(false);
      }
    });
  }
}
```

## 🛠️ Required Configurations

### app.config.ts Template
```typescript
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
```

### Core Services Required
1. **AppStateService** - Centralized state management
2. **NotificationService** - User feedback system
3. **LoadingService** - Global loading states
4. **AppErrorHandler** - Error handling

### HTTP Interceptors Required
1. **errorInterceptor** - API error handling
2. **loadingInterceptor** - Loading states

## 📏 Best Practices Checklist

### ✅ Component Guidelines
- [ ] Use `ChangeDetectionStrategy.OnPush` on all components
- [ ] Smart components in `/containers/`, dumb in `/components/`
- [ ] Use `input()` and `output()` functions instead of decorators
- [ ] Use `inject()` instead of constructor injection
- [ ] Remove explicit `standalone: true` (default in Angular 20+)

### ✅ Template Guidelines
- [ ] Use new control flow syntax (`@if`, `@for`, `@switch`)
- [ ] Include `track` expressions in `@for` loops
- [ ] Use direct style/class bindings instead of `ngClass`/`ngStyle`
- [ ] Signal bindings in templates: `{{ signal() }}`

### ✅ State Management Guidelines
- [ ] Use signals for reactive state
- [ ] Computed properties for derived state
- [ ] Private signals with public computed selectors
- [ ] `update()` and `set()` instead of direct mutations

### ✅ Error Handling Guidelines
- [ ] HTTP interceptor for API errors
- [ ] Global error handler configured
- [ ] User-friendly notifications
- [ ] Proper error logging

### ✅ Performance Guidelines
- [ ] OnPush change detection strategy
- [ ] Signal-based reactivity
- [ ] Lazy loading for feature modules
- [ ] Optimized bundle structure

## 🚀 Quick Start Commands

### Generate Smart/Dumb Component Pair
```bash
# Create feature structure
mkdir -p src/app/features/[feature]/{components,containers}

# Generate smart container
# Generate dumb component
# Connect them together
```

### Generate Service with State
```bash
# Create state service following patterns
# Add to AppStateService
# Wire up HTTP calls
```

This configuration ensures consistent application of Angular Tips patterns across all projects!
