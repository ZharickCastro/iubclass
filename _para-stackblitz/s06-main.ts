/* =============================================================================
   COM30 · S06 · EJEMPLOS DE LA CLASE · VERSIÓN PARA STACKBLITZ (un solo archivo)
   -----------------------------------------------------------------------------
   Es el mismo código de src/app/s06/, reunido en un archivo. Cada bloque indica
   el archivo original; la explicación de cada ejemplo está en su comentario de
   encabezado y en CLASE_S06.md.

   En Angular CLI cada componente va en su propio archivo y se importa con
   import { ... } from './...'. Aquí todos comparten archivo, así que esas
   líneas de import no aparecen: cada clase ya es visible para las demás.

   Uso
     1. En StackBlitz, abra src/main.ts.
     2. Haga clic dentro del editor, seleccione todo (Ctrl+A) y pegue encima.
        Se reemplaza el contenido del archivo; el archivo no se elimina.
     3. Para los estilos de Tailwind, agregue en src/index.html, dentro de <head>:
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   ========================================================================== */

import { CurrencyPipe, JsonPipe, registerLocaleData } from '@angular/common';
import { Component, Injectable, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import localeEsCo from '@angular/common/locales/es-CO';

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/01-plantilla/ejemplo-plantilla.ts
// =============================================================================
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
class EjemploPlantilla {
  protected readonly productos = ['Yuca', 'Ñame', 'Plátano', 'Guayaba', 'Mango'];
  protected readonly texto = signal('');
  protected readonly filtrados = computed(() => {
    const t = this.texto().trim().toLowerCase();
    return this.productos.filter((p) => p.toLowerCase().includes(t));
  });
  protected readonly enviado = signal<unknown>(null);
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/02-control/ejemplo-control.ts
// =============================================================================
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
class EjemploControl {
  protected readonly kilos = new FormControl(1, { nonNullable: true }); // FormControl<number>
  protected readonly libras = new FormControl(1); // FormControl<number | null>
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/03-grupo/precios-dia.service.ts
// =============================================================================
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

type Unidad = 'kg' | 'lb' | 'unidad';

interface PrecioDia {
  producto: string;
  unidad: Unidad;
  precio: number;
}

@Injectable({ providedIn: 'root' })
class PreciosDiaService {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/03-grupo/registro-precio.ts
// =============================================================================
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
class RegistroPrecio {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/04-escritura/ejemplo-escritura.ts
// =============================================================================
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
class EjemploEscritura {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s06/s06.ts
// =============================================================================
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
class S06 {}

// =============================================================================
// ARRANQUE (en Angular CLI esto está en main.ts, app.ts y app.config.ts)
// =============================================================================
@Component({ selector: 'app-root', imports: [S06], template: `<main style="max-width:64rem;margin:auto;padding:1.5rem"><app-s06 /></main>` })
class App {}

registerLocaleData(localeEsCo);
bootstrapApplication(App, { providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }] });
