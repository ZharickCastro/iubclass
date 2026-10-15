import { Component, computed, signal } from '@angular/core';
import { Producto, TarjetaProducto } from './tarjeta-producto';
import { Linea, ResumenPedido } from './resumen-pedido';

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <section class="pedido">
      <h1>Pedido</h1>

      <div class="productos">
        @for (p of productos; track p.nombre) {
          <app-tarjeta-producto
            [producto]="p"
            [enPedido]="unidades()[p.nombre] ?? 0"
            (agregar)="agregar($event)"
          />
        }
      </div>

      <app-resumen-pedido [lineas]="lineas()" (quitar)="quitar($event)" />
    </section>
  `,
  styles: `
    .pedido { display: flex; flex-direction: column; gap: 1rem; max-width: 46rem; margin: 0 auto; padding: 1rem; }
    h1 { font-size: 1.6rem; font-weight: 800; color: #0f172a; }
    .productos { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: .8rem; }
  `,
})
export class Pedido {
  productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
  ];

  pedido = signal<Linea[]>([]);

  lineas = computed(() => this.pedido().filter((l) => l.cantidad > 0));

  unidades = computed(() =>
    Object.fromEntries(this.lineas().map((l) => [l.nombre, l.cantidad])) as Record<string, number>,
  );

  agregar(nombre: string) {
    const producto = this.productos.find((p) => p.nombre === nombre);
    if (!producto || (this.unidades()[nombre] ?? 0) >= producto.existencias) return;

    this.pedido.update((lista) =>
      lista.some((l) => l.nombre === nombre)
        ? lista.map((l) => (l.nombre === nombre ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...lista, { nombre, precio: producto.precio, cantidad: 1 }],
    );
  }

  quitar(nombre: string) {
    this.pedido.update((lista) => lista.filter((l) => l.nombre !== nombre));
  }
}
