#!/bin/bash

# Angular Tips Service Generator
# Usage: ./generate-service.sh <service-name> [--state|--api|--util]

set -e

SERVICE_NAME=$1
SERVICE_TYPE=${2:-"--api"}  # Default to API service

if [ -z "$SERVICE_NAME" ]; then
    echo "❌ Error: Please provide service name"
    echo "Usage: ./generate-service.sh <service-name> [--state|--api|--util]"
    echo "Example: ./generate-service.sh user --state"
    exit 1
fi

# Convert to proper case formats
SERVICE_KEBAB=$(echo "$SERVICE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
SERVICE_PASCAL=$(echo "$SERVICE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')
SERVICE_CAMEL=$(echo "$SERVICE_PASCAL" | sed 's/^./\L&/')

echo "🚀 Generating Angular Tips service..."
echo "Service: $SERVICE_PASCAL ($SERVICE_KEBAB)"
echo "Type: $SERVICE_TYPE"

# Determine service location
case $SERVICE_TYPE in
    --state)
        SERVICE_DIR="src/app/core/services"
        ;;
    --api)
        SERVICE_DIR="src/app/core/services"
        ;;
    --util)
        SERVICE_DIR="src/app/shared/utils"
        ;;
    *)
        SERVICE_DIR="src/app/core/services"
        ;;
esac

mkdir -p "$SERVICE_DIR"

TS_FILE="$SERVICE_DIR/$SERVICE_KEBAB.service.ts"

if [ "$SERVICE_TYPE" == "--state" ]; then
    # State management service
    cat > "$TS_FILE" << EOF
import { Injectable, signal, computed, inject } from '@angular/core';
import { ${SERVICE_PASCAL}ApiService } from './${SERVICE_KEBAB}-api.service';

export interface ${SERVICE_PASCAL}Item {
  id: string;
  name: string;
  // Add more properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class ${SERVICE_PASCAL}StateService {
  private readonly ${SERVICE_CAMEL}ApiService = inject(${SERVICE_PASCAL}ApiService);
  
  // Private state signals
  private readonly _items = signal<${SERVICE_PASCAL}Item[]>([]);
  private readonly _selectedItem = signal<${SERVICE_PASCAL}Item | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  // Public computed selectors
  readonly ${SERVICE_CAMEL}State = computed(() => ({
    items: this._items(),
    selectedItem: this._selectedItem(),
    loading: this._loading(),
    error: this._error(),
    hasItems: this._items().length > 0,
    selectedItemId: this._selectedItem()?.id || null
  }));
  
  // Computed helpers
  readonly selectedItem = computed(() => this._selectedItem());
  readonly isLoading = computed(() => this._loading());
  readonly hasError = computed(() => this._error() !== null);
  
  // Actions
  load${SERVICE_PASCAL}s(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.${SERVICE_CAMEL}ApiService.get${SERVICE_PASCAL}s().subscribe({
      next: (items) => {
        this._items.set(items);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(\`Failed to load \${SERVICE_CAMEL}s\`);
        this._loading.set(false);
        console.error(\`Error loading \${SERVICE_CAMEL}s:\`, err);
      }
    });
  }
  
  create${SERVICE_PASCAL}(item: Omit<${SERVICE_PASCAL}Item, 'id'>): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.${SERVICE_CAMEL}ApiService.create${SERVICE_PASCAL}(item).subscribe({
      next: (newItem) => {
        this._items.update(items => [...items, newItem]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(\`Failed to create \${SERVICE_CAMEL}\`);
        this._loading.set(false);
        console.error(\`Error creating \${SERVICE_CAMEL}:\`, err);
      }
    });
  }
  
  update${SERVICE_PASCAL}(id: string, updates: Partial<${SERVICE_PASCAL}Item>): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.${SERVICE_CAMEL}ApiService.update${SERVICE_PASCAL}(id, updates).subscribe({
      next: (updatedItem) => {
        this._items.update(items => 
          items.map(item => item.id === id ? updatedItem : item)
        );
        if (this._selectedItem()?.id === id) {
          this._selectedItem.set(updatedItem);
        }
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(\`Failed to update \${SERVICE_CAMEL}\`);
        this._loading.set(false);
        console.error(\`Error updating \${SERVICE_CAMEL}:\`, err);
      }
    });
  }
  
  delete${SERVICE_PASCAL}(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.${SERVICE_CAMEL}ApiService.delete${SERVICE_PASCAL}(id).subscribe({
      next: () => {
        this._items.update(items => items.filter(item => item.id !== id));
        if (this._selectedItem()?.id === id) {
          this._selectedItem.set(null);
        }
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(\`Failed to delete \${SERVICE_CAMEL}\`);
        this._loading.set(false);
        console.error(\`Error deleting \${SERVICE_CAMEL}:\`, err);
      }
    });
  }
  
  select${SERVICE_PASCAL}(item: ${SERVICE_PASCAL}Item | null): void {
    this._selectedItem.set(item);
  }
  
  clearError(): void {
    this._error.set(null);
  }
  
  reset(): void {
    this._items.set([]);
    this._selectedItem.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
EOF

elif [ "$SERVICE_TYPE" == "--api" ]; then
    # API service
    cat > "$TS_FILE" << EOF
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ${SERVICE_PASCAL}Item {
  id: string;
  name: string;
  // Add more properties as needed
}

export interface Create${SERVICE_PASCAL}Dto {
  name: string;
  // Add more properties as needed
}

export interface Update${SERVICE_PASCAL}Dto {
  name?: string;
  // Add more properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class ${SERVICE_PASCAL}ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = \`\${environment.apiUrl}/${SERVICE_KEBAB}s\`;

  get${SERVICE_PASCAL}s(): Observable<${SERVICE_PASCAL}Item[]> {
    return this.http.get<${SERVICE_PASCAL}Item[]>(this.apiUrl);
  }

  get${SERVICE_PASCAL}(id: string): Observable<${SERVICE_PASCAL}Item> {
    return this.http.get<${SERVICE_PASCAL}Item>(\`\${this.apiUrl}/\${id}\`);
  }

  create${SERVICE_PASCAL}(item: Create${SERVICE_PASCAL}Dto): Observable<${SERVICE_PASCAL}Item> {
    return this.http.post<${SERVICE_PASCAL}Item>(this.apiUrl, item);
  }

  update${SERVICE_PASCAL}(id: string, updates: Update${SERVICE_PASCAL}Dto): Observable<${SERVICE_PASCAL}Item> {
    return this.http.put<${SERVICE_PASCAL}Item>(\`\${this.apiUrl}/\${id}\`, updates);
  }

  delete${SERVICE_PASCAL}(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }

  // Add search/filter methods as needed
  search${SERVICE_PASCAL}s(query: string): Observable<${SERVICE_PASCAL}Item[]> {
    return this.http.get<${SERVICE_PASCAL}Item[]>(\`\${this.apiUrl}/search\`, {
      params: { q: query }
    });
  }
}
EOF

else
    # Utility service
    cat > "$TS_FILE" << EOF
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ${SERVICE_PASCAL}UtilService {

  // Add utility methods here
  format${SERVICE_PASCAL}Name(name: string): string {
    return name.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  validate${SERVICE_PASCAL}(item: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.name || item.name.trim().length === 0) {
      errors.push('Name is required');
    }

    // Add more validation rules

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Add more utility methods as needed
}
EOF
fi

echo "✅ Service generated successfully!"
echo "📁 File created: $TS_FILE"
echo ""
echo "🔧 Next steps:"

if [ "$SERVICE_TYPE" == "--state" ]; then
    echo "1. Create the corresponding API service:"
    echo "   ./generate-service.sh $SERVICE_NAME --api"
    echo "2. Add the state service to your AppStateService or use it in containers"
    echo "3. Update interfaces and add proper type definitions"
elif [ "$SERVICE_TYPE" == "--api" ]; then
    echo "1. Update the environment configuration with the correct API URL"
    echo "2. Adjust the interfaces to match your actual API response"
    echo "3. Consider creating a corresponding state service:"
    echo "   ./generate-service.sh $SERVICE_NAME --state"
else
    echo "1. Add the utility service to your shared barrel exports"
    echo "2. Import and use the utility methods where needed"
fi

echo "4. Add the service to barrel exports (index.ts) if needed"
