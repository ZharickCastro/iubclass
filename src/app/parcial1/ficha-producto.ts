import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

type Estado = 'Agotado' | 'Inventario bajo' | 'Disponible';

@Component({
  selector: 'app-ficha',
  imports: [CurrencyPipe],
  template: `
    <article class="ficha" [class.agotada]="producto().existencias === 0">
      <div class="datos">
        <h3>{{ producto().nombre }}</h3>
        <p>
          {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          · {{ producto().existencias }} en existencias
        </p>
      </div>

      @switch (estado()) {
        @case ('Agotado') {
          <span class="estado agotado">Agotado</span>
        }
        @case ('Inventario bajo') {
          <span class="estado bajo">Inventario bajo</span>
        }
        @case ('Disponible') {
          <span class="estado disponible">Disponible</span>
        }
      }

      <button
        type="button"
        class="retirar"
        [disabled]="producto().existencias === 0"
        (click)="retirar.emit(producto().nombre)"
      >
        Retirar 1
      </button>
    </article>
  `,
  styles: `
    .ficha { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border: 1px solid #cbd5e1; border-radius: .6rem; padding: .7rem 1rem; background: #fff; }
    .agotada { background: #f8fafc; }
    h3 { font-weight: 700; color: #0f172a; }
    p { font-size: .85rem; color: #475569; }
    .estado { border-radius: 999px; padding: .1rem .7rem; font-size: .75rem; font-weight: 700; }
    .agotado { background: #fee2e2; color: #991b1b; }
    .bajo { background: #fef3c7; color: #92400e; }
    .disponible { background: #dcfce7; color: #166534; }
    .retirar { border-radius: .4rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 700; }
    .retirar:disabled { opacity: .3; cursor: not-allowed; }
  `,
})
export class FichaProducto {
  producto = input.required<Producto>();

  estado = computed<Estado>(() => {
    const existencias = this.producto().existencias;
    if (existencias === 0) return 'Agotado';
    if (existencias < 3) return 'Inventario bajo';
    return 'Disponible';
  });

  retirar = output<string>();
}
