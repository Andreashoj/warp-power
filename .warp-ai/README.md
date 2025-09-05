# 🚀 Warp AI Angular Tips Configuration

This directory contains pre-configured templates, scripts, and guidelines for building Angular applications following the professional patterns from **[Angular Tips (ngtips.com)](https://ngtips.com)**.

## 📁 What's Included

```
.warp-ai/
├── README.md                      # This comprehensive guide
├── angular-tips-config.md         # Architecture patterns & guidelines
├── scripts/
│   ├── generate-component.sh      # Smart/dumb component generator
│   ├── generate-service.sh        # Service generator (state/api/util)
│   └── setup-project.sh          # New project setup script
└── templates/
    ├── component/                 # Component templates
    ├── service/                   # Service templates
    └── project/                   # Project structure templates
```

## 🎯 Quick Start

### 1. Generate Components Following Angular Tips Patterns

```bash
# Generate a dumb (presentation) component
./.warp-ai/scripts/generate-component.sh products product-list --dumb

# Generate a smart (container) component
./.warp-ai/scripts/generate-component.sh products product-container --smart
```

### 2. Generate Services with Proper Architecture

```bash
# Generate API service
./.warp-ai/scripts/generate-service.sh product --api

# Generate state management service
./.warp-ai/scripts/generate-service.sh product --state

# Generate utility service
./.warp-ai/scripts/generate-service.sh validation --util
```

## 🏗️ Architecture Overview

### Smart/Dumb Component Pattern
- **Smart Components:** Handle business logic, state management, API calls
- **Dumb Components:** Pure presentation, only inputs and outputs
- **Benefits:** Better testability, reusability, and maintainability

### Centralized State Management
- **Signals-first:** Reactive state management with Angular signals
- **Computed Properties:** Derived state calculations
- **Proper Encapsulation:** Private signals with public computed selectors

### Error Handling & UX
- **Global Error Handler:** Centralized error processing
- **HTTP Interceptors:** Automatic API error handling
- **User Notifications:** Professional toast notifications

## 📋 Generated Code Examples

### Smart Container Component
```typescript
@Component({
  selector: 'app-products-container',
  template: `
    <app-product-list 
      [items]="appState.productsState().items"
      [loading]="appState.productsState().loading"
      [error]="appState.productsState().error">
    </app-product-list>
  `
})
export class ProductsContainerComponent implements OnInit {
  protected readonly appState = inject(AppStateService);

  ngOnInit(): void {
    this.appState.loadProducts();
  }
}
```

### Dumb Presentation Component
```typescript
@Component({
  selector: 'app-product-list',
  template: `
    @if (loading()) {
      <div class="loading">Loading products...</div>
    }
    
    @if (error()) {
      <div class="error">{{ error() }}</div>
    }
    
    @for (product of items(); track product.id) {
      <div class="product-card">
        <h3>{{ product.name }}</h3>
        <button (click)="onSelectItem(product)">Select</button>
      </div>
    }
  `
})
export class ProductListComponent {
  readonly items = input<ProductItem[]>([]);
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly itemSelected = output<ProductItem>();
}
```

### State Management Service
```typescript
@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private readonly _items = signal<ProductItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  readonly productState = computed(() => ({
    items: this._items(),
    loading: this._loading(),
    error: this._error()
  }));
  
  loadProducts(): void {
    this._loading.set(true);
    this.productApiService.getProducts().subscribe({
      next: (items) => {
        this._items.set(items);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load products');
        this._loading.set(false);
      }
    });
  }
}
```

## 🛠️ Code Generation Commands

### Component Generation
```bash
# Basic component pair (smart + dumb)
./.warp-ai/scripts/generate-component.sh users user-list --dumb
./.warp-ai/scripts/generate-component.sh users user-container --smart

# Feature-specific components
./.warp-ai/scripts/generate-component.sh dashboard analytics-widget --dumb
./.warp-ai/scripts/generate-component.sh settings settings-form --dumb
```

### Service Generation
```bash
# Complete service stack
./.warp-ai/scripts/generate-service.sh user --api      # API layer
./.warp-ai/scripts/generate-service.sh user --state    # State management
./.warp-ai/scripts/generate-service.sh auth --util     # Utility functions
```

## 📏 Best Practices Enforced

### ✅ Modern Angular Patterns
- OnPush change detection strategy
- Signal-based reactivity
- `input()` and `output()` functions
- `inject()` instead of constructor injection
- New control flow syntax (`@if`, `@for`, `@switch`)

### ✅ Architecture Patterns
- Smart/dumb component separation
- Centralized state management
- Proper error handling
- HTTP interceptors
- Barrel exports for clean imports

### ✅ Performance Optimizations
- OnPush change detection
- Signal-based updates
- Lazy loading ready structure
- Optimized bundle organization

## 🔧 Integration with Warp AI

### Prompt Templates
When working with Warp AI, use these context prompts:

```
Please generate an Angular component following the Angular Tips patterns:
- Use the smart/dumb component pattern
- Implement OnPush change detection
- Use signals for state management
- Follow the project structure in .warp-ai/angular-tips-config.md
```

### Configuration Files
The `.warp-ai/angular-tips-config.md` file contains:
- Complete architecture guidelines
- Code templates for copy/paste
- Best practices checklist
- Project structure standards

## 🚀 Project Setup for New Projects

1. **Copy Configuration:**
   ```bash
   cp -r .warp-ai/ /path/to/new-project/
   ```

2. **Setup Core Architecture:**
   ```bash
   cd /path/to/new-project
   ./.warp-ai/scripts/setup-project.sh
   ```

3. **Generate Features:**
   ```bash
   ./.warp-ai/scripts/generate-component.sh dashboard main-dashboard --smart
   ./.warp-ai/scripts/generate-service.sh dashboard --state
   ```

## 🎓 Learning Resources

- **[Angular Tips](https://ngtips.com)** - Official documentation
- **[GitHub Repository](https://github.com/martinboue/angular-tips)** - Source code and examples
- **This Project** - Live implementation of all patterns

## 📊 Benefits Achieved

### 🏗️ Architecture
- ✅ Enterprise-grade project structure
- ✅ Consistent coding patterns
- ✅ Proper separation of concerns
- ✅ Scalable state management

### 🚀 Developer Experience
- ✅ Code generation scripts
- ✅ Consistent templates
- ✅ Best practices enforcement
- ✅ Clear documentation

### 🎯 Maintainability
- ✅ Testable components
- ✅ Reusable code patterns
- ✅ Clear error handling
- ✅ Professional UX

## 🔥 Ready-to-Use Templates

All generated code includes:
- **TypeScript interfaces** with proper typing
- **HTML templates** with new control flow syntax
- **CSS styles** with professional design
- **Error handling** with user feedback
- **Loading states** with proper UX
- **Accessibility** with ARIA attributes

## 🎉 Get Started Now!

```bash
# Generate your first Angular Tips component
./.warp-ai/scripts/generate-component.sh my-feature awesome-list --dumb

# Create the corresponding smart container  
./.warp-ai/scripts/generate-component.sh my-feature awesome-container --smart

# Add state management
./.warp-ai/scripts/generate-service.sh awesome --state
```

**Your Angular development is now supercharged with professional patterns!** 🚀
