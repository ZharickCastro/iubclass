import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FichaProducto, Producto } from './ficha-producto';

@Component({
  selector: 'app-inventario',
  imports: [FichaProducto, CurrencyPipe],
  template: `
    <section class="inventario">
      <h2>Inventario de periféricos</h2>

      <div class="totales">
        <div class="total">
          <span>Valor total</span>
          <strong>{{ valorTotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
        </div>
        <div class="total">
          <span>Unidades</span>
          <strong>{{ unidadesTotales() }}</strong>
        </div>
        <div class="total">
          <span>Agotados</span>
          <strong>{{ agotados() }}</strong>
        </div>
      </div>

      <button type="button" class="vaciar" (click)="vaciar()">Vaciar lista</button>

      <div class="lista">
        @for (p of productos(); track p.nombre) {
          <app-ficha [producto]="p" (retirar)="retirar($event)" />
        } @empty {
          <p class="vacio">No hay productos para mostrar</p>
        }
      </div>
    </section>
  `,
  styles: `
    .inventario { display: block; max-width: 44rem; margin: 0 auto; padding: 1rem; }
    h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .totales { display: flex; gap: .8rem; flex-wrap: wrap; margin: 1rem 0; }
    .total { background: #f1f5f9; border-radius: .6rem; padding: .6rem 1rem; }
    .total span { display: block; font-size: .7rem; text-transform: uppercase; letter-spacing: .05em; color: #64748b; }
    .total strong { font-size: 1.4rem; color: #0f172a; }
    .vaciar { border-radius: .4rem; background: #991b1b; color: #fff; padding: .35rem .9rem; font-size: .85rem; font-weight: 700; }
    .lista { display: flex; flex-direction: column; gap: .6rem; margin-top: 1rem; }
    .vacio { padding: 1.5rem; text-align: center; color: #64748b; border: 1px dashed #cbd5e1; border-radius: .6rem; }
  `,
})
export class Inventario {
  productos = signal<Producto[]>([
    { nombre: 'Teclado', precio: 38000, existencias: 6 },
    { nombre: 'Ratón', precio: 22000, existencias: 0 },
    { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
    { nombre: 'Cable de red', precio: 6500, existencias: 12 },
  ]);

  valorTotal = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.existencias, 0),
  );

  unidadesTotales = computed(() =>
    this.productos().reduce((suma, p) => suma + p.existencias, 0),
  );

  agotados = computed(() => this.productos().filter((p) => p.existencias === 0).length);

  retirar(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.existencias > 0 ? { ...p, existencias: p.existencias - 1 } : p,
      ),
    );
  }

  vaciar() {
    this.productos.set([]);
  }
}
