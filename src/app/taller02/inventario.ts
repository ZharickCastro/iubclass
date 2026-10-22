import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UnidadesPipe } from './unidades-pipe';

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

type Estado = 'agotado' | 'bajo' | 'disponible';

@Component({
  selector: 'app-inventario-taller02',
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  template: `
    <section class="inventario">
      <h1>Inventario · {{ hoy | date: 'fullDate' }}</h1>

      <div class="filtros">
        @for (c of categorias; track c) {
          <button type="button" class="filtro" [class.activo]="filtro() === c" (click)="filtro.set(c)">
            {{ c }}
          </button>
        }
      </div>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Existencias</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (f of filas(); track f.nombre) {
            <tr [class.agotado]="f.estado === 'agotado'">
              <td>{{ f.nombre }}</td>
              <td>{{ f.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
              <td>{{ f.cantidad | unidades }}</td>
              <td>
                @switch (f.estado) {
                  @case ('agotado') {
                    <span class="estado e-agotado">Agotado</span>
                  }
                  @case ('bajo') {
                    <span class="estado e-bajo">Bajo</span>
                  }
                  @case ('disponible') {
                    <span class="estado e-disponible">Disponible</span>
                  }
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="vacio">No hay productos en esta categoría</td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
  styles: `
    .inventario { display: block; max-width: 46rem; margin: 0 auto; padding: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
    .filtros { display: flex; gap: .5rem; margin-bottom: 1rem; }
    .filtro { border: 1px solid #cbd5e1; border-radius: .4rem; background: #fff; padding: .3rem .9rem; font-size: .85rem; font-weight: 600; color: #475569; }
    .filtro.activo { background: #1e293b; border-color: #1e293b; color: #fff; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #0f172a; color: #fff; text-align: left; padding: .6rem .8rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; }
    td { padding: .6rem .8rem; border-bottom: 1px solid #e2e8f0; color: #0f172a; }
    .agotado td { background: #fee2e2; color: #7f1d1d; }
    .vacio { text-align: center; color: #64748b; padding: 1.5rem; }
    .estado { border-radius: 999px; padding: .1rem .7rem; font-size: .75rem; font-weight: 700; }
    .e-agotado { background: #fecaca; color: #991b1b; }
    .e-bajo { background: #fef3c7; color: #92400e; }
    .e-disponible { background: #dcfce7; color: #166534; }
  `,
})
export class InventarioTaller02 {
  hoy = new Date();

  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];

  filtro = signal('Todas');

  productos = signal<Producto[]>([
    { nombre: 'Mango', categoria: 'Frutas', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas', precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas', precio: 6500, cantidad: 2 },
    { nombre: 'Tomate', categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 },
  ]);

  visibles = computed(() => {
    const categoria = this.filtro();
    if (categoria === 'Todas') return this.productos();
    return this.productos().filter((p) => p.categoria === categoria);
  });

  filas = computed(() =>
    this.visibles().map((p) => {
      let estado: Estado = 'disponible';
      if (p.cantidad === 0) estado = 'agotado';
      else if (p.cantidad < 3) estado = 'bajo';
      return { ...p, estado };
    }),
  );
}
