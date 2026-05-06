# Angular 21 Component Patterns

Usa este skill cuando generes nuevos componentes Angular.

## Standard Component Template

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-<name>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ``,
})
export class <Name>Component {
  // Inputs usando signal API
  myInput = input.required<string>();
  optionalInput = input(false);

  // Outputs
  myEvent = output<string>();

  // Servicios/stores vía inject()
  private readonly myService = inject(MyService);
}
```

## Rules
- SIEMPRE `standalone: true`
- SIEMPRE `ChangeDetectionStrategy.OnPush`
- SIEMPRE `inject()` — nunca constructor injection
- SIEMPRE `input()` / `output()` signal API
- Plantillas Bootstrap: usar clases utilitarias, NO estilos inline
- Usar bloques `@if`, `@for`, `@defer` (nueva sintaxis de control flow)
