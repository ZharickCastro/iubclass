import { Component } from '@angular/core';
import { EjemploPlantilla } from './01-plantilla/ejemplo-plantilla';
import { EjemploControl } from './02-control/ejemplo-control';
import { RegistroPrecio } from './03-grupo/registro-precio';
import { EjemploEscritura } from './04-escritura/ejemplo-escritura';

// =============================================================================
//  S06 · Página de ejemplos · ruta /s06
// -----------------------------------------------------------------------------
//  Reúne los cuatro ejemplos de la sesión, en el orden de la presentación.
//  Cada tarjeta indica la diapositiva que la acompaña y el archivo del código.
//  La explicación completa está en el encabezado de cada archivo y en
//  CLASE_S06.md.
// =============================================================================

@Component({
  selector: 'app-s06',
  imports: [EjemploPlantilla, EjemploControl, RegistroPrecio, EjemploEscritura],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Sesión S06 · Formularios basados en plantilla y reactivos</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ejemplos de la sesión. Cada uno indica la diapositiva que lo acompaña y su archivo en src/app/s06/.
    </p>

    <h3 class="bloque">Bloque 1 · Dos sistemas de formularios</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 1 · Diapositivas 10 y 11 · 01-plantilla/ejemplo-plantilla.ts</p>
      <h4>Formularios basados en plantilla: ngModel suelto y ngForm</h4>
      <app-ejemplo-plantilla />
    </section>

    <h3 class="bloque">Bloque 2 · Formularios reactivos</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 2 · Diapositivas 16 y 17 · 02-control/ejemplo-control.ts</p>
      <h4>Un FormControl suelto: value, setValue y reset con nonNullable</h4>
      <app-ejemplo-control />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 3 · Diapositivas 18 a 21, 27 y 28 · 03-grupo/registro-precio.ts y precios-dia.service.ts</p>
      <h4>FormGroup con FormBuilder conectado a un servicio: registrar y corregir precios del día</h4>
      <app-registro-precio />
    </section>

    <h3 class="bloque">Bloque 3 · Leer y escribir el formulario</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 4 · Diapositivas 25 y 26 · 04-escritura/ejemplo-escritura.ts</p>
      <h4>setValue, patchValue, reset, value y getRawValue</h4>
      <app-ejemplo-escritura />
    </section>
  `,
  styles: `
    .bloque { margin-top: 2rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
    .tarjeta { margin-top: .9rem; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: .75rem; background: #fff; padding: 1rem 1.2rem; }
    .meta { font-size: .7rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    h4 { margin: .15rem 0 .7rem; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  `,
})
export class S06 {}
