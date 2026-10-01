import { Component, inject } from '@angular/core';
import { BotonFavorito } from '../../s04/02-output/boton-favorito';
import { FavoritosService } from './favoritos.service';

// =============================================================================
//  S05 · EJEMPLO 1b · Un componente que usa el servicio con inject()
//  Diapositiva 10
// -----------------------------------------------------------------------------
//  Qué muestra
//    - inject(FavoritosService) en un inicializador de campo: Angular entrega
//      la instancia única del servicio. El componente no la crea con new.
//    - BotonFavorito es el mismo hijo de la S04, sin cambios: sigue recibiendo
//      [marcado] por input y avisando con (alternar). Lo que cambió es quién
//      responde al aviso: ahora es el servicio, no una signal del componente.
//    - El componente ya no declara ningún estado propio.
//
//  Qué observar
//    - Marque dos productos y cambie de pestaña (Tablero) y vuelva: los
//      favoritos siguen marcados. El componente se destruyó y se volvió a
//      crear; el servicio no.
// =============================================================================

@Component({
  selector: 'app-lista-favoritos',
  imports: [BotonFavorito],
  template: `
    <ul class="space-y-1">
      @for (nombre of productos; track nombre) {
        <li class="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span>{{ nombre }}</span>
          <app-boton-favorito
            [nombre]="nombre"
            [marcado]="favoritos.esFavorito(nombre)"
            (alternar)="favoritos.alternar($event)"
          />
        </li>
      }
    </ul>
    <button type="button" class="btn mt-2" (click)="favoritos.limpiar()">Quitar todos</button>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
export class ListaFavoritos {
  protected readonly favoritos = inject(FavoritosService);
  protected readonly productos = ['Mango', 'Guayaba', 'Patilla', 'Tomate'];
}
