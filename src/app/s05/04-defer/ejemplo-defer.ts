import { Component } from '@angular/core';
import { HistorialPrecios } from './historial-precios';

// =============================================================================
//  S05 · EJEMPLO 4b · @defer con disparador de interacción
//  Diapositivas 18 a 20
// -----------------------------------------------------------------------------
//  Qué muestra
//    - @defer (on interaction): el contenido se carga cuando el usuario hace
//      clic sobre el @placeholder. Antes de eso, el navegador no descarga el
//      código de HistorialPrecios.
//    - @placeholder: lo que se ve antes de cargar. Con on interaction es
//      obligatorio: es el elemento sobre el que se hace clic.
//    - @loading (minimum 600ms): lo que se ve mientras se descarga. minimum
//      evita un parpadeo si la descarga es instantánea.
//
//  Qué observar (F12 > Red, filtro JS)
//    - Al abrir /s05 no aparece el chunk de HistorialPrecios.
//    - Al pulsar «Ver historial de precios» aparece una petición nueva a un
//      archivo chunk-XXXX.js: es el componente diferido.
//    - Marque favoritos en el ejemplo 1 antes de pulsar: el historial los
//      resalta al aparecer, porque los lee del servicio.
// =============================================================================

@Component({
  selector: 'app-ejemplo-defer',
  imports: [HistorialPrecios],
  template: `
    @defer (on interaction) {
      <app-historial-precios />
    } @placeholder {
      <button type="button" class="btn">Ver historial de precios</button>
    } @loading (minimum 600ms) {
      <p class="text-sm text-slate-500">Cargando el historial…</p>
    }
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
export class EjemploDefer {}
