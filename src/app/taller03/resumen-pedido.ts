import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="resumen">
      <h2>Resumen del pedido</h2>

      <ul class="lineas">
        @for (l of lineas(); track l.nombre) {
          <li class="linea">
            <span class="detalle">{{ l.nombre }} × {{ l.cantidad }}</span>
            <span class="importe">{{ l.precio * l.cantidad | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
            <button type="button" class="quitar" (click)="quitar.emit(l.nombre)">Quitar</button>
          </li>
        } @empty {
          <li class="vacio">El pedido está vacío</li>
        }
      </ul>

      <dl class="totales">
        <div>
          <dt>Subtotal</dt>
          <dd class="subtotal">{{ subtotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</dd>
        </div>
        <div>
          <dt>Domicilio</dt>
          <dd class="domicilio">
            @if (lineas().length === 0) {
              —
            } @else if (domicilio() === 0) {
              Gratis
            } @else {
              {{ domicilio() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
            }
          </dd>
        </div>
        <div class="fila-total">
          <dt>Total</dt>
          <dd class="total">{{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</dd>
        </div>
      </dl>
    </section>
  `,
  styles: `
    .resumen { border: 1px solid #cbd5e1; border-radius: .6rem; padding: 1rem; background: #fff; }
    h2 { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: .6rem; }
    .lineas { list-style: none; padding: 0; margin: 0 0 .8rem; display: flex; flex-direction: column; gap: .4rem; }
    .linea { display: flex; align-items: center; gap: .8rem; border-top: 1px solid #e2e8f0; padding-top: .4rem; }
    .detalle { flex: 1; font-weight: 600; color: #0f172a; }
    .importe { color: #475569; }
    .quitar { border-radius: .4rem; background: #991b1b; color: #fff; padding: .2rem .7rem; font-size: .75rem; font-weight: 700; }
    .vacio { padding: 1rem; text-align: center; color: #64748b; border: 1px dashed #cbd5e1; border-radius: .5rem; }
    .totales > div { display: flex; justify-content: space-between; padding: .2rem 0; color: #475569; }
    .totales dd { margin: 0; font-weight: 700; color: #0f172a; }
    .fila-total { border-top: 2px solid #0f172a; margin-top: .3rem; padding-top: .4rem !important; font-size: 1.2rem; }
  `,
})
export class ResumenPedido {
  lineas = input.required<Linea[]>();

  quitar = output<string>();

  subtotal = computed(() =>
    this.lineas().reduce((suma, l) => suma + l.precio * l.cantidad, 0),
  );

  domicilio = computed(() => {
    if (this.lineas().length === 0) return 0;
    return this.subtotal() >= 20000 ? 0 : 3000;
  });

  total = computed(() => this.subtotal() + this.domicilio());
}
