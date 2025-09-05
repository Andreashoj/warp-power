#!/bin/bash

# Angular Tips Component Generator
# Usage: ./generate-component.sh <feature-name> <component-name> [--smart|--dumb]

set -e

FEATURE_NAME=$1
COMPONENT_NAME=$2
COMPONENT_TYPE=${3:-"--dumb"}  # Default to dumb component

if [ -z "$FEATURE_NAME" ] || [ -z "$COMPONENT_NAME" ]; then
    echo "❌ Error: Please provide feature name and component name"
    echo "Usage: ./generate-component.sh <feature-name> <component-name> [--smart|--dumb]"
    echo "Example: ./generate-component.sh users user-list --dumb"
    exit 1
fi

# Convert to proper case formats
FEATURE_KEBAB=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
COMPONENT_KEBAB=$(echo "$COMPONENT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
FEATURE_PASCAL=$(echo "$FEATURE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')
COMPONENT_PASCAL=$(echo "$COMPONENT_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')
FEATURE_CAMEL=$(echo "$FEATURE_PASCAL" | sed 's/^./\L&/')
COMPONENT_CAMEL=$(echo "$COMPONENT_PASCAL" | sed 's/^./\L&/')

echo "🚀 Generating Angular Tips component..."
echo "Feature: $FEATURE_PASCAL ($FEATURE_KEBAB)"
echo "Component: $COMPONENT_PASCAL ($COMPONENT_KEBAB)"
echo "Type: $COMPONENT_TYPE"

# Create directory structure
if [ "$COMPONENT_TYPE" == "--smart" ]; then
    COMPONENT_DIR="src/app/features/$FEATURE_KEBAB/containers"
    SELECTOR_PREFIX="$FEATURE_KEBAB-container"
else
    COMPONENT_DIR="src/app/features/$FEATURE_KEBAB/components"
    SELECTOR_PREFIX="$FEATURE_KEBAB-$COMPONENT_KEBAB"
fi

mkdir -p "$COMPONENT_DIR"

# Generate TypeScript file
TS_FILE="$COMPONENT_DIR/$COMPONENT_KEBAB.component.ts"

if [ "$COMPONENT_TYPE" == "--smart" ]; then
    # Smart component template
    cat > "$TS_FILE" << EOF
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';
import { ${COMPONENT_PASCAL}Component } from '../components/${COMPONENT_KEBAB}.component';

@Component({
  selector: 'app-$SELECTOR_PREFIX',
  imports: [${COMPONENT_PASCAL}Component],
  template: \`
    <app-$FEATURE_KEBAB-$COMPONENT_KEBAB 
      [items]="appState.${FEATURE_CAMEL}State().items"
      [loading]="appState.${FEATURE_CAMEL}State().loading"
      [error]="appState.${FEATURE_CAMEL}State().error"
      (itemSelected)="onItemSelected(\$event)"
      (itemDeleted)="onItemDeleted(\$event)">
    </app-$FEATURE_KEBAB-$COMPONENT_KEBAB>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${COMPONENT_PASCAL}ContainerComponent implements OnInit {
  protected readonly appState = inject(AppStateService);

  ngOnInit(): void {
    this.appState.load${FEATURE_PASCAL}();
  }

  protected onItemSelected(item: any): void {
    // Handle item selection
    console.log('Item selected:', item);
  }

  protected onItemDeleted(id: string): void {
    // Handle item deletion
    console.log('Item deleted:', id);
  }
}
EOF
else
    # Dumb component template
    cat > "$TS_FILE" << EOF
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ${COMPONENT_PASCAL}Item {
  id: string;
  name: string;
  // Add more properties as needed
}

@Component({
  selector: 'app-$SELECTOR_PREFIX',
  imports: [CommonModule],
  templateUrl: './$COMPONENT_KEBAB.component.html',
  styleUrl: './$COMPONENT_KEBAB.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${COMPONENT_PASCAL}Component {
  // Pure presentation component - all data from inputs
  readonly items = input<${COMPONENT_PASCAL}Item[]>([]);
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  
  // Events to parent
  readonly itemSelected = output<${COMPONENT_PASCAL}Item>();
  readonly itemDeleted = output<string>();

  protected onSelectItem(item: ${COMPONENT_PASCAL}Item): void {
    this.itemSelected.emit(item);
  }

  protected onDeleteItem(id: string): void {
    this.itemDeleted.emit(id);
  }
}
EOF
fi

# Generate HTML template
HTML_FILE="$COMPONENT_DIR/$COMPONENT_KEBAB.component.html"

if [ "$COMPONENT_TYPE" != "--smart" ]; then
    cat > "$HTML_FILE" << EOF
<div class="$COMPONENT_KEBAB-container">
  <h2>$COMPONENT_PASCAL</h2>
  
  @if (loading()) {
    <div class="loading">
      Loading ${COMPONENT_CAMEL}s...
    </div>
  }
  
  @if (error()) {
    <div class="error">
      {{ error() }}
    </div>
  }
  
  @if (!loading() && !error()) {
    <div class="items-grid">
      @for (item of items(); track item.id) {
        <div class="item-card">
          <h3>{{ item.name }}</h3>
          
          <div class="item-actions">
            <button 
              type="button"
              class="btn btn-primary"
              (click)="onSelectItem(item)">
              Select
            </button>
            <button 
              type="button"
              class="btn btn-danger"
              (click)="onDeleteItem(item.id)">
              Delete
            </button>
          </div>
        </div>
      }
    </div>
    
    @if (items().length === 0) {
      <div class="no-items">
        No ${COMPONENT_CAMEL}s found.
      </div>
    }
  }
</div>
EOF

    # Generate CSS file
    CSS_FILE="$COMPONENT_DIR/$COMPONENT_KEBAB.component.css"
    cat > "$CSS_FILE" << EOF
.$COMPONENT_KEBAB-container {
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid #fcc;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.item-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
EOF
fi

echo "✅ Component generated successfully!"
echo "📁 Files created:"
echo "   - $TS_FILE"
if [ "$COMPONENT_TYPE" != "--smart" ]; then
    echo "   - $HTML_FILE"
    echo "   - $CSS_FILE"
fi
echo ""
echo "🔧 Next steps:"
echo "1. Add the component to your feature's barrel export (index.ts)"
echo "2. Import and use the component in your templates"
if [ "$COMPONENT_TYPE" == "--smart" ]; then
    echo "3. Generate the corresponding dumb component"
    echo "   ./generate-component.sh $FEATURE_NAME $COMPONENT_NAME --dumb"
fi
echo "4. Update your AppStateService if needed"
