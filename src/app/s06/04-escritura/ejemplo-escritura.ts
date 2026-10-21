import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

// =============================================================================
//  S06 · EJEMPLO 4 · Escribir en el formulario desde el código
//  Diapositivas 25 y 26
// -----------------------------------------------------------------------------
//  Qué muestra
//    - setValue({...}) exige TODOS los controles del grupo. Si falta uno,
//      lanza en ejecución:
//        NG01002: Must supply a value for form control with name: 'unidad'
//      (y TypeScript ya lo marca al compilar si el objeto se escribe literal;
//      aquí se fuerza con un objeto tipado como any para ver el error real).
//    - patchValue({...}) escribe solo los controles que recibe y deja los demás.
//    - reset() devuelve cada control a su valor inicial (el grupo es nonNullable).
//    - value omite los controles deshabilitados; getRawValue() los incluye.
//
//  Qué observar
//    - Pulse los botones en orden y lea el panel después de cada uno.
//    - «setValue incompleto» no cambia nada: el error aparece abajo, en rojo,
//      y también en la consola (F12).
//    - «Deshabilitar unidad»: unidad desaparece de value y sigue en getRawValue().
// =============================================================================

@Component({
  selector: 'app-ejemplo-escritura',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <div class="flex flex-wrap gap-1">
      <button type="button" class="btn" (click)="completo()">setValue completo</button>
      <button type="button" class="btn" (click)="incompleto()">setValue incompleto</button>
      <button type="button" class="btn" (click)="parcial()">patchValue precio</button>
      <button type="button" class="btn" (click)="alternarUnidad()">
        {{ form.controls.unidad.disabled ? 'Habilitar' : 'Deshabilitar' }} unidad
      </button>
      <button type="button" class="btn claro" (click)="limpiar()">reset()</button>
    </div>
    <pre class="salida">value         = {{ form.value | json }}
getRawValue() = {{ form.getRawValue() | json }}</pre>
    @if (error()) {
      <p class="mt-1 text-xs font-semibold text-red-700">{{ error() }}</p>
    }
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .7rem; font-size: .75rem; font-weight: 600; }
    .btn.claro { background: #e2e8f0; color: #0f172a; }
    .salida { margin-top: .6rem; border-radius: .4rem; background: #0f172a; color: #e2e8f0; padding: .4rem .6rem; font-size: .72rem; }
  `,
})
export class EjemploEscritura {
  protected readonly form = inject(FormBuilder).nonNullable.group({
    producto: ['Guayaba'],
    unidad: ['lb'],
    precio: [1200],
  });
  protected readonly error = signal('');

  completo() {
    this.error.set('');
    this.form.setValue({ producto: 'Mango', unidad: 'kg', precio: 3600 });
  }

  incompleto() {
    const datos: any = { producto: 'Patilla', precio: 2500 }; // falta unidad
    try {
      this.form.setValue(datos);
    } catch (e) {
      this.error.set((e as Error).message);
      console.error(e);
    }
  }

  parcial() {
    this.error.set('');
    this.form.patchValue({ precio: this.form.controls.precio.value + 100 });
  }

  alternarUnidad() {
    const unidad = this.form.controls.unidad;
    if (unidad.disabled) {
      unidad.enable();
    } else {
      unidad.disable();
    }
  }

  limpiar() {
    this.error.set('');
    this.form.reset();
    this.form.controls.unidad.enable();
  }
}
