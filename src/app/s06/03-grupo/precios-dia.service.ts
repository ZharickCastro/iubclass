import { Injectable, computed, signal } from '@angular/core';

// =============================================================================
//  S06 · EJEMPLO 3a · El modelo de datos: el servicio de precios del día
//  Diapositivas 20 y 27
// -----------------------------------------------------------------------------
//  Es el patrón de la S05 (FavoritosService) aplicado a otro estado: la lista
//  de precios que el puesto publica cada día.
//    - signal privada, versión pública con asReadonly() y métodos con nombre.
//    - registrar() agrega un precio nuevo; corregir() reemplaza uno existente.
//      Los dos devuelven un arreglo nuevo con update(): no mutan la lista.
//
//  Este servicio es el MODELO DE DATOS: lo que la aplicación guarda. No sabe
//  que existe un formulario. El formulario (registro-precio.ts) es el MODELO
//  DE FORMULARIO: lo que el usuario está escribiendo, que todavía puede estar
//  incompleto o ser inválido. Los datos pasan del segundo al primero solo
//  cuando el usuario envía el formulario y el formulario es válido.
// =============================================================================

export type Unidad = 'kg' | 'lb' | 'unidad';

export interface PrecioDia {
  producto: string;
  unidad: Unidad;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class PreciosDiaService {
  private readonly _precios = signal<PrecioDia[]>([
    { producto: 'Yuca', unidad: 'kg', precio: 2800 },
    { producto: 'Ñame', unidad: 'kg', precio: 4200 },
    { producto: 'Plátano', unidad: 'unidad', precio: 1500 },
  ]);

  readonly precios = this._precios.asReadonly();
  readonly porKilo = computed(() => this._precios().filter((p) => p.unidad === 'kg').length);

  registrar(nuevo: PrecioDia) {
    this._precios.update((lista) => [...lista, nuevo]);
  }

  corregir(cambio: PrecioDia) {
    this._precios.update((lista) =>
      lista.map((p) => (p.producto === cambio.producto ? cambio : p)),
    );
  }
}
