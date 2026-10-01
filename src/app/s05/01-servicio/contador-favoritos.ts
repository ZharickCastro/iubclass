import { Component, inject } from '@angular/core';
import { FavoritosService } from './favoritos.service';

// =============================================================================
//  S05 · EJEMPLO 1c · Otro componente, en otra rama del árbol, con el mismo estado
//  Diapositiva 10
// -----------------------------------------------------------------------------
//  Este componente está en el encabezado de la aplicación (app.html), no en la
//  página /s05. No recibe nada por input: pide el servicio con inject() y lee
//  la misma signal que la lista de favoritos.
//
//  Sin servicio, el estado tendría que vivir en App, el único ancestro común
//  de los dos componentes, y bajar por input a través de cada componente
//  intermedio, incluso los que no lo usan.
// =============================================================================

@Component({
  selector: 'app-contador-favoritos',
  template: `<span class="contador" title="Favoritos (S05)">{{ favoritos.total() }} favoritos</span>`,
  styles: `
    .contador { border-radius: 999px; background: #fbbf24; color: #0f172a; padding: .1rem .6rem; font-size: .75rem; font-weight: 800; }
  `,
})
export class ContadorFavoritos {
  protected readonly favoritos = inject(FavoritosService);
}
