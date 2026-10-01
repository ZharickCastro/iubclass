import { Component } from '@angular/core';
import { ListaFavoritos } from './01-servicio/lista-favoritos';
import { EjemploAlcance } from './02-alcance/ejemplo-alcance';
import { EjemploNgModule } from './03-ngmodule/ejemplo-ngmodule';
import { EjemploDefer } from './04-defer/ejemplo-defer';

// =============================================================================
//  S05 · Página de ejemplos · ruta /s05
// -----------------------------------------------------------------------------
//  Reúne los cuatro ejemplos de la sesión, en el orden de la presentación.
//  Cada tarjeta indica la diapositiva que la acompaña y el archivo del código.
//  La explicación completa está en el encabezado de cada archivo, en
//  CLASE_S05.md y en la guía de estudio de la sesión (aula virtual).
//
//  El ejemplo 1 tiene una segunda parte fuera de esta página: el contador
//  de favoritos del encabezado de la aplicación (01-servicio/contador-favoritos.ts).
// =============================================================================

@Component({
  selector: 'app-s05',
  imports: [ListaFavoritos, EjemploAlcance, EjemploNgModule, EjemploDefer],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Sesión S05 · Servicios, inyección de dependencias y carga diferida</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ejemplos de la sesión. Cada uno indica la diapositiva que lo acompaña y su archivo en src/app/s05/.
    </p>

    <h3 class="bloque">Bloque 1 · Servicios e inyección de dependencias</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 1 · Diapositivas 8 a 10 · 01-servicio/ (servicio, lista y contador del encabezado)</p>
      <h4>Estado compartido en un servicio: la lista y el contador de favoritos del encabezado</h4>
      <app-lista-favoritos />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 2 · Diapositiva 11 · 02-alcance/ejemplo-alcance.ts</p>
      <h4>providedIn: 'root' frente a providers del componente</h4>
      <app-ejemplo-alcance />
    </section>

    <h3 class="bloque">Bloque 2 · Standalone y NgModule</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 3 · Diapositiva 16 · 03-ngmodule/ (solo lectura de código heredado)</p>
      <h4>Un componente standalone que usa un NgModule</h4>
      <app-ejemplo-ngmodule />
    </section>

    <h3 class="bloque">Bloque 3 · Carga diferida</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 4 · Diapositivas 18 a 20 · 04-defer/ejemplo-defer.ts y historial-precios.ts</p>
      <h4>&#64;defer (on interaction) con &#64;placeholder y &#64;loading</h4>
      <app-ejemplo-defer />
    </section>
  `,
  styles: `
    .bloque { margin-top: 2rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
    .tarjeta { margin-top: .9rem; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: .75rem; background: #fff; padding: 1rem 1.2rem; }
    .meta { font-size: .7rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    h4 { margin: .15rem 0 .7rem; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  `,
})
export class S05 {}
