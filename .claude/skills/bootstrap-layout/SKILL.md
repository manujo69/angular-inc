# Bootstrap 5 Layout Patterns

Usa este skill cuando construyas layouts o necesites patrones Bootstrap comunes.

## Grid System

```html
<!-- Responsive cards grid -->
<div class="row g-3">
  @for (item of items(); track item.id) {
    <div class="col-12 col-md-6 col-xl-4">
      <!-- card content -->
    </div>
  }
</div>

<!-- Two-column layout -->
<div class="row">
  <div class="col-12 col-lg-8"><!-- main --></div>
  <div class="col-12 col-lg-4"><!-- sidebar --></div>
</div>
```

## Common Patterns

```html
<!-- Page header with action -->
<div class="row align-items-center mb-4">
  <div class="col"><h2 class="mb-0">Title</h2></div>
  <div class="col-auto">
    <button class="btn btn-primary">Action</button>
  </div>
</div>

<!-- Loading spinner -->
<div class="d-flex justify-content-center py-5">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

<!-- Alert error -->
<div class="alert alert-danger" role="alert">{{ error() }}</div>
```

## Rules
- Spacing y layout SIEMPRE con clases Bootstrap (p-3, mb-4, gap-2, etc.)
- CSS custom solo para estilos imposibles con Bootstrap
- Importar Bootstrap SCSS solo en `src/styles/_variables.scss`
