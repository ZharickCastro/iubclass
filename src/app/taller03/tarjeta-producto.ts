import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta">
      <h3>{{ producto().nombre }}</h3>
      <p class="precio">{{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      <p class="disponibles">Disponibles: {{ disponibles() }}</p>
      <button
        type="button"
        class="agregar"
        [disabled]="disponibles() === 0"
        (click)="agregar.emit(producto().nombre)"
      >
        Agregar
      </button>
    </article>
  `,
  styles: `
    .tarjeta { border: 1px solid #cbd5e1; border-radius: .6rem; padding: .8rem 1rem; background: #fff; display: flex; flex-direction: column; gap: .2rem; }
    h3 { font-weight: 700; color: #0f172a; }
    .precio { font-size: 1.1rem; font-weight: 800; color: #1d4ed8; }
    .disponibles { font-size: .85rem; color: #475569; }
    .agregar { margin-top: .4rem; border-radius: .4rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 700; }
    .agregar:disabled { opacity: .3; cursor: not-allowed; }
  `,
})
export class TarjetaProducto {
  producto = input.required<Producto>();
  enPedido = input(0);

  disponibles = computed(() => this.producto().existencias - this.enPedido());

  agregar = output<string>();
}
