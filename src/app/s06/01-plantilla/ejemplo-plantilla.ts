import { Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// =============================================================================
//  S06 · EJEMPLO 1 · Formularios basados en plantilla con ngModel
//  Diapositivas 10 y 11
// -----------------------------------------------------------------------------
//  Qué muestra
//    - FormsModule en imports: sin él, [(ngModel)] no existe en la plantilla.
//    - Parte A · un campo suelto: [(ngModel)]="texto" enlaza el input con una
//      signal en los dos sentidos. Lo que se escribe actualiza la signal, y el
//      computed filtrados recalcula la lista. Es el caso para el que el
//      formulario de plantilla es suficiente: un campo, sin reglas.
//    - Parte B · un formulario completo: #f="ngForm" da acceso al formulario
//      que Angular construye a partir de la plantilla. Cada ngModel dentro de
//      <form> necesita el atributo name: es la clave del control en f.value.
//    - El modelo del formulario vive en la plantilla: la clase no sabe qué
//      controles existen. Esa es la diferencia con los formularios reactivos.
//
//  Qué observar
//    - Escriba «ñ» en el buscador: la lista se reduce a Ñame.
//    - En la parte B, escriba en los dos campos y observe f.value y f.valid
//      debajo del formulario. Borre el producto: f.valid pasa a false.
//
//  Error que se provoca en la diapositiva 13
//    Quitar name="producto" del primer input de la parte B:
//      NG01352: If ngModel is used within a form tag, either the name attribute
//      must be set or the form control must be defined as 'standalone' in
//      ngModelOptions.
// =============================================================================

@Component({
  selector: 'app-ejemplo-plantilla',
  imports: [FormsModule, JsonPipe],
  template: `
    <p class="parte">Parte A · un campo suelto</p>
    <label class="campo">
      Buscar en el tablero
      <input [(ngModel)]="texto" placeholder="nombre del producto" />
    </label>
    <ul class="mt-2 text-sm">
      @for (p of filtrados(); track p) {
        <li>{{ p }}</li>
      } @empty {
        <li class="text-slate-500">Ningún producto coincide con «{{ texto() }}»</li>
      }
    </ul>

    <p class="parte">Parte B · un formulario completo</p>
    <form #f="ngForm" (ngSubmit)="enviado.set(f.value)" class="grid gap-2 sm:grid-cols-3">
      <label class="campo">
        Producto
        <input name="producto" ngModel required />
      </label>
      <label class="campo">
        Observación
        <input name="observacion" ngModel />
      </label>
      <button type="submit" class="btn self-end" [disabled]="f.invalid">Enviar</button>
    </form>
    <pre class="salida">f.value = {{ f.value | json }}   f.valid = {{ f.valid }}</pre>
    @if (enviado(); as e) {
      <p class="text-sm">Último envío: {{ e | json }}</p>
    }
  `,
  styles: `
    .parte { margin-top: .8rem; font-size: .75rem; font-weight: 800; text-transform: uppercase; color: #b45309; }
    .campo { display: grid; gap: .2rem; font-size: .8rem; font-weight: 600; color: #334155; }
    input { border: 1px solid #cbd5e1; border-radius: .4rem; padding: .3rem .5rem; font-weight: 400; }
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
    .btn:disabled { opacity: .4; }
    .salida { margin-top: .5rem; border-radius: .4rem; background: #0f172a; color: #e2e8f0; padding: .4rem .6rem; font-size: .75rem; }
  `,
})
export class EjemploPlantilla {
  protected readonly productos = ['Yuca', 'Ñame', 'Plátano', 'Guayaba', 'Mango'];
  protected readonly texto = signal('');
  protected readonly filtrados = computed(() => {
    const t = this.texto().trim().toLowerCase();
    return this.productos.filter((p) => p.toLowerCase().includes(t));
  });
  protected readonly enviado = signal<unknown>(null);
}
