import { Injectable, computed, signal } from '@angular/core';

// =============================================================================
//  S05 · EJEMPLO 1a · Servicio de estado con una signal privada
//  Diapositivas 8 y 9
// -----------------------------------------------------------------------------
//  Qué muestra
//    - @Injectable({ providedIn: 'root' }): Angular crea UNA instancia de esta
//      clase para toda la aplicación, la primera vez que alguien la pide.
//    - La signal de estado es private: ningún componente puede hacer set() ni
//      update() sobre ella. El servicio es el único dueño del estado.
//    - favoritos es la versión de solo lectura (asReadonly): los componentes
//      la leen como cualquier signal, favoritos(), pero no la escriben.
//    - Los cambios entran por métodos con nombre: alternar(). Así, todas las
//      reglas sobre cómo cambia el estado viven en un solo archivo.
//
//  Es el mismo estado del ejemplo 2 de la S04, que vivía en el componente
//  padre. Aquí sale del componente porque lo leen dos componentes que no
//  tienen un padre común cercano: la lista de /s05 y el contador del
//  encabezado de la aplicación.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly _favoritos = signal<string[]>([]);

  // Lectura pública, escritura imposible desde fuera.
  readonly favoritos = this._favoritos.asReadonly();
  readonly total = computed(() => this._favoritos().length);

  esFavorito(nombre: string): boolean {
    return this._favoritos().includes(nombre);
  }

  // La única puerta de entrada para cambiar el estado.
  alternar(nombre: string) {
    this._favoritos.update((lista) =>
      lista.includes(nombre) ? lista.filter((n) => n !== nombre) : [...lista, nombre],
    );
  }

  limpiar() {
    this._favoritos.set([]);
  }
}
