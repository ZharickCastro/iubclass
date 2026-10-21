import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// =============================================================================
//  S06 · EJEMPLO 2 · Un FormControl suelto
//  Diapositivas 16 y 17
// -----------------------------------------------------------------------------
//  Qué muestra
//    - ReactiveFormsModule en imports: trae las directivas [formControl],
//      [formGroup] y formControlName.
//    - El control se crea en la clase, no en la plantilla: new FormControl(...).
//      La plantilla solo lo conecta con [formControl]="kilos".
//    - kilos es nonNullable: su tipo es FormControl<number> y reset() lo
//      devuelve al valor inicial, 1.
//    - libras no es nonNullable: su tipo es FormControl<number | null> y
//      reset() lo deja en null.
//    - setValue(n) escribe el valor desde el código; el input se actualiza solo.
//
//  Qué observar
//    - Escriba 4 en los dos campos y pulse «reset()» en cada uno: kilos vuelve
//      a 1 y libras queda en null (el campo se ve vacío).
//    - Pulse «setValue(10)»: el número aparece en el input sin tocar el teclado.
// =============================================================================

@Component({
  selector: 'app-ejemplo-control',
  imports: [ReactiveFormsModule],
  template: `
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="campo">
          Kilos · new FormControl(1, {{ '{' }} nonNullable: true {{ '}' }})
          <input type="number" [formControl]="kilos" />
        </label>
        <pre class="salida">kilos.value = {{ kilos.value }}</pre>
        <div class="mt-1 flex gap-1">
          <button type="button" class="btn" (click)="kilos.setValue(10)">setValue(10)</button>
          <button type="button" class="btn" (click)="kilos.reset()">reset()</button>
        </div>
      </div>
      <div>
        <label class="campo">
          Libras · new FormControl(1)
          <input type="number" [formControl]="libras" />
        </label>
        <pre class="salida">libras.value = {{ libras.value }}</pre>
        <div class="mt-1 flex gap-1">
          <button type="button" class="btn" (click)="libras.setValue(10)">setValue(10)</button>
          <button type="button" class="btn" (click)="libras.reset()">reset()</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .campo { display: grid; gap: .2rem; font-size: .8rem; font-weight: 600; color: #334155; }
    input { border: 1px solid #cbd5e1; border-radius: .4rem; padding: .3rem .5rem; font-weight: 400; }
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .7rem; font-size: .75rem; font-weight: 600; }
    .salida { margin-top: .4rem; border-radius: .4rem; background: #0f172a; color: #e2e8f0; padding: .35rem .6rem; font-size: .75rem; }
  `,
})
export class EjemploControl {
  protected readonly kilos = new FormControl(1, { nonNullable: true }); // FormControl<number>
  protected readonly libras = new FormControl(1); // FormControl<number | null>
}
