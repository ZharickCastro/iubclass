import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PreciosDiaService, PrecioDia, Unidad } from './precios-dia.service';

// =============================================================================
//  S06 · EJEMPLO 3b · Formulario reactivo con FormBuilder, conectado a un servicio
//  Diapositivas 18, 19, 21, 27 y 28
// -----------------------------------------------------------------------------
//  Qué muestra
//    - inject(FormBuilder).nonNullable.group({...}): el MODELO DE FORMULARIO
//      se declara en la clase. Cada entrada es [valor inicial, validadores].
//      nonNullable hace que reset() devuelva cada control a su valor inicial.
//    - [formGroup]="form" en <form> y formControlName en cada campo conectan la
//      plantilla con ese modelo. (ngSubmit) se dispara al enviar.
//    - Validators.required y [disabled]="form.invalid": el botón no deja enviar
//      un formulario incompleto. La validación completa es tema de la S07.
//    - guardar(): getRawValue() entrega el valor de TODOS los controles,
//      incluido el que está deshabilitado. El servicio recibe un PrecioDia
//      completo y el formulario se limpia con reset().
//    - corregir(p): setValue(p) carga los tres campos de una vez y
//      producto.disable() impide cambiar la clave del registro.
//    - redondear(): patchValue({ precio }) cambia solo un campo.
//
//  Qué observar
//    - El panel oscuro muestra form.value y form.getRawValue(). Pulse
//      «Corregir» en Ñame: producto desaparece de form.value (está
//      deshabilitado) pero sigue en getRawValue().
//    - Registre «Guayaba · lb · 1250», pulse «Redondear» antes de guardar y
//      guarde: la tabla muestra $ 1.300 y el contador «por kilo» no cambia.
//
//  Para comparar (diapositiva 19): la misma declaración sin FormBuilder es
//    form = new FormGroup({
//      producto: new FormControl('', { nonNullable: true, validators: Validators.required }),
//      unidad: new FormControl<Unidad>('kg', { nonNullable: true }),
//      precio: new FormControl(0, { nonNullable: true, validators: Validators.required }),
//    });
// =============================================================================

@Component({
  selector: 'app-registro-precio',
  imports: [ReactiveFormsModule, CurrencyPipe, JsonPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="guardar()" class="grid gap-2 sm:grid-cols-4">
      <label class="campo">
        Producto
        <input formControlName="producto" />
      </label>
      <label class="campo">
        Unidad
        <select formControlName="unidad">
          <option value="kg">kg</option>
          <option value="lb">lb</option>
          <option value="unidad">unidad</option>
        </select>
      </label>
      <label class="campo">
        Precio
        <input type="number" formControlName="precio" />
      </label>
      <div class="flex items-end gap-1">
        <button type="submit" class="btn" [disabled]="form.invalid">
          {{ editando() ? 'Guardar corrección' : 'Registrar' }}
        </button>
        <button type="button" class="btn claro" (click)="redondear()">Redondear</button>
        @if (editando()) {
          <button type="button" class="btn claro" (click)="cancelar()">Cancelar</button>
        }
      </div>
    </form>

    <pre class="salida">form.value         = {{ form.value | json }}
form.getRawValue() = {{ form.getRawValue() | json }}
form.valid         = {{ form.valid }}</pre>

    <table class="mt-3 w-full text-sm">
      <thead>
        <tr class="text-left text-slate-500"><th>Producto</th><th>Unidad</th><th>Precio</th><th></th></tr>
      </thead>
      <tbody>
        @for (p of precios.precios(); track p.producto) {
          <tr class="border-t border-slate-200">
            <td>{{ p.producto }}</td>
            <td>{{ p.unidad }}</td>
            <td>{{ p.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
            <td><button type="button" class="enlace" (click)="corregir(p)">Corregir</button></td>
          </tr>
        }
      </tbody>
    </table>
    <p class="mt-1 text-xs text-slate-500">Precios por kilo: {{ precios.porKilo() }}</p>
  `,
  styles: `
    .campo { display: grid; gap: .2rem; font-size: .8rem; font-weight: 600; color: #334155; }
    input, select { border: 1px solid #cbd5e1; border-radius: .4rem; padding: .3rem .5rem; font-weight: 400; }
    input:disabled { background: #f1f5f9; color: #64748b; }
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .7rem; font-size: .75rem; font-weight: 600; }
    .btn.claro { background: #e2e8f0; color: #0f172a; }
    .btn:disabled { opacity: .4; }
    .enlace { font-size: .75rem; font-weight: 700; color: #1d4ed8; }
    .salida { margin-top: .6rem; border-radius: .4rem; background: #0f172a; color: #e2e8f0; padding: .4rem .6rem; font-size: .72rem; }
  `,
})
export class RegistroPrecio {
  protected readonly precios = inject(PreciosDiaService);
  private readonly fb = inject(FormBuilder);

  // Modelo de formulario: lo que el usuario escribe.
  protected readonly form = this.fb.nonNullable.group({
    producto: ['', Validators.required],
    unidad: ['kg' as Unidad],
    precio: [0, Validators.required],
  });

  protected readonly editando = signal(false);

  guardar() {
    const datos: PrecioDia = this.form.getRawValue();
    if (this.editando()) {
      this.precios.corregir(datos);
    } else {
      this.precios.registrar(datos);
    }
    this.cancelar();
  }

  corregir(p: PrecioDia) {
    this.form.setValue(p); // los tres campos, en una sola llamada
    this.form.controls.producto.disable(); // la clave no se edita
    this.editando.set(true);
  }

  redondear() {
    const precio = this.form.controls.precio.value;
    this.form.patchValue({ precio: Math.round(precio / 100) * 100 }); // solo un campo
  }

  cancelar() {
    this.form.reset(); // vuelve a '', 'kg' y 0
    this.form.controls.producto.enable();
    this.editando.set(false);
  }
}
