import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FavoritosService } from '../01-servicio/favoritos.service';

// =============================================================================
//  S05 · EJEMPLO 4a · Componente que se carga de forma diferida
//  Diapositivas 18 y 20
// -----------------------------------------------------------------------------
//  Este componente solo se usa dentro de un bloque @defer (ejemplo-defer.ts).
//  Por eso Angular lo compila en un archivo JavaScript aparte (un chunk) que
//  el navegador descarga cuando se cumple el disparador, no al abrir la página.
//
//  Lee FavoritosService: cuando aparece, muestra los favoritos marcados ANTES
//  de que se cargara. El estado no vive en el componente, así que no se
//  pierde aunque el componente llegue tarde.
// =============================================================================

interface Registro {
  producto: string;
  semana: string;
  precio: number;
}

@Component({
  selector: 'app-historial-precios',
  imports: [CurrencyPipe],
  template: `
    <p class="text-xs text-slate-500">Favoritos marcados antes de cargar: {{ favoritos.total() }}</p>
    <table class="mt-1 w-full text-left text-sm">
      <thead class="bg-slate-900 text-xs uppercase text-white">
        <tr><th class="px-3 py-1.5">Producto</th><th class="px-3 py-1.5">Semana</th><th class="px-3 py-1.5">Precio</th></tr>
      </thead>
      <tbody>
        @for (r of registros; track r.producto + r.semana) {
          <tr class="border-t border-slate-100" [class.fav]="favoritos.esFavorito(r.producto)">
            <td class="px-3 py-1.5">{{ r.producto }}</td>
            <td class="px-3 py-1.5">{{ r.semana }}</td>
            <td class="px-3 py-1.5">{{ r.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .fav { background: #fef3c7; font-weight: 700; }
  `,
})
export class HistorialPrecios {
  protected readonly favoritos = inject(FavoritosService);
  protected readonly registros: Registro[] = [
    { producto: 'Mango', semana: 'S38', precio: 1700 },
    { producto: 'Mango', semana: 'S39', precio: 1800 },
    { producto: 'Patilla', semana: 'S38', precio: 6200 },
    { producto: 'Patilla', semana: 'S39', precio: 6500 },
    { producto: 'Tomate', semana: 'S39', precio: 3200 },
  ];
}
