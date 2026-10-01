/* =============================================================================
   COM30 · S05 · EJEMPLOS DE LA CLASE · VERSIÓN PARA STACKBLITZ (un solo archivo)
   -----------------------------------------------------------------------------
   Es el mismo código de src/app/s05/, reunido en un archivo. Cada bloque indica
   el archivo original; la explicación de cada ejemplo está en su comentario de
   encabezado y en CLASE_S05.md.

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

import { Component, Injectable, Input, LOCALE_ID, NgModule, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import localeEsCo from '@angular/common/locales/es-CO';

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/02-output/boton-favorito.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 2a · Componente hijo con output()
//  Diapositiva 22
// -----------------------------------------------------------------------------
//  Qué muestra
//    - alternar = output<string>(): el hijo declara un evento propio y el tipo
//      del dato que viaja con él (aquí, el nombre del producto).
//    - alternar.emit(nombre()): el hijo avisa. No decide qué pasa después.
//    - marcado es un input: el hijo no guarda si es favorito o no; se lo
//      dice el padre en cada momento.
//
//  Qué observar
//    - El botón no modifica ninguna lista. Solo emite. Si el padre no escucha
//      el evento, el clic no tiene ningún efecto.
// =============================================================================

@Component({
  selector: 'app-boton-favorito',
  template: `
    <button type="button" class="fav" [class.activo]="marcado()" (click)="alternar.emit(nombre())">
      {{ marcado() ? '★ Favorito' : '☆ Marcar' }}
    </button>
  `,
  styles: `
    .fav { border: 1px solid #cbd5e1; border-radius: .5rem; padding: .2rem .7rem; font-size: .8rem; font-weight: 600; color: #475569; background: #fff; }
    .activo { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
  `,
})
class BotonFavorito {
  nombre = input.required<string>();
  marcado = input(false);

  // El nombre del evento es el que usa el padre entre paréntesis: (alternar).
  alternar = output<string>();
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/01-servicio/favoritos.service.ts
// =============================================================================
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
class FavoritosService {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/01-servicio/lista-favoritos.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 1b · Un componente que usa el servicio con inject()
//  Diapositiva 10
// -----------------------------------------------------------------------------
//  Qué muestra
//    - inject(FavoritosService) en un inicializador de campo: Angular entrega
//      la instancia única del servicio. El componente no la crea con new.
//    - BotonFavorito es el mismo hijo de la S04, sin cambios: sigue recibiendo
//      [marcado] por input y avisando con (alternar). Lo que cambió es quién
//      responde al aviso: ahora es el servicio, no una signal del componente.
//    - El componente ya no declara ningún estado propio.
//
//  Qué observar
//    - Marque dos productos y cambie de pestaña (Tablero) y vuelva: los
//      favoritos siguen marcados. El componente se destruyó y se volvió a
//      crear; el servicio no.
// =============================================================================

@Component({
  selector: 'app-lista-favoritos',
  imports: [BotonFavorito],
  template: `
    <ul class="space-y-1">
      @for (nombre of productos; track nombre) {
        <li class="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span>{{ nombre }}</span>
          <app-boton-favorito
            [nombre]="nombre"
            [marcado]="favoritos.esFavorito(nombre)"
            (alternar)="favoritos.alternar($event)"
          />
        </li>
      }
    </ul>
    <button type="button" class="btn mt-2" (click)="favoritos.limpiar()">Quitar todos</button>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
class ListaFavoritos {
  protected readonly favoritos = inject(FavoritosService);
  protected readonly productos = ['Mango', 'Guayaba', 'Patilla', 'Tomate'];
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/01-servicio/contador-favoritos.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 1c · Otro componente, en otra rama del árbol, con el mismo estado
//  Diapositiva 10
// -----------------------------------------------------------------------------
//  Este componente está en el encabezado de la aplicación (app.html), no en la
//  página /s05. No recibe nada por input: pide el servicio con inject() y lee
//  la misma signal que la lista de favoritos.
//
//  Sin servicio, el estado tendría que vivir en App, el único ancestro común
//  de los dos componentes, y bajar por input a través de cada componente
//  intermedio, incluso los que no lo usan.
// =============================================================================

@Component({
  selector: 'app-contador-favoritos',
  template: `<span class="contador" title="Favoritos (S05)">{{ favoritos.total() }} favoritos</span>`,
  styles: `
    .contador { border-radius: 999px; background: #fbbf24; color: #0f172a; padding: .1rem .6rem; font-size: .75rem; font-weight: 800; }
  `,
})
class ContadorFavoritos {
  protected readonly favoritos = inject(FavoritosService);
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/02-alcance/ejemplo-alcance.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 2 · Una instancia para toda la aplicación o una por componente
//  Diapositiva 11
// -----------------------------------------------------------------------------
//  Qué muestra
//    - NotaLocalService NO tiene providedIn. Se registra en providers del
//      componente PanelNota: Angular crea una instancia nueva para cada panel.
//    - FavoritosService tiene providedIn: 'root': los dos paneles reciben la
//      misma instancia que el resto de la aplicación.
//
//  Qué observar
//    - «+1 nota» en el panel A no cambia el panel B: cada uno tiene su propio
//      NotaLocalService.
//    - El total de favoritos es el mismo en los dos paneles y en el
//      encabezado: hay un solo FavoritosService.
//    - Si se borra providers: [NotaLocalService] de PanelNota, la aplicación
//      falla al abrir /s05 con NG0201: ningún inyector sabe crear el servicio.
// =============================================================================

@Injectable()
class NotaLocalService {
  private readonly _notas = signal(0);
  readonly notas = this._notas.asReadonly();

  sumar() {
    this._notas.update((n) => n + 1);
  }
}

@Component({
  selector: 'app-panel-nota',
  providers: [NotaLocalService],
  template: `
    <div class="panel">
      <p class="tit">Panel {{ nombre() }}</p>
      <p>Notas de este panel: <strong>{{ local.notas() }}</strong></p>
      <p>Favoritos de la aplicación: <strong>{{ global.total() }}</strong></p>
      <button type="button" class="btn" (click)="local.sumar()">+1 nota</button>
    </div>
  `,
  styles: `
    .panel { border: 1px solid #cbd5e1; border-radius: .6rem; background: #fff; padding: .6rem .9rem; font-size: .85rem; }
    .tit { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #475569; }
    .btn { margin-top: .4rem; border-radius: .4rem; background: #1e293b; color: #fff; padding: .2rem .7rem; font-size: .75rem; font-weight: 700; }
  `,
})
class PanelNota {
  nombre = input.required<string>();
  protected readonly local = inject(NotaLocalService);
  protected readonly global = inject(FavoritosService);
}

@Component({
  selector: 'app-ejemplo-alcance',
  imports: [PanelNota],
  template: `
    <div class="grid gap-3 md:grid-cols-2">
      <app-panel-nota nombre="A" />
      <app-panel-nota nombre="B" />
    </div>
  `,
})
class EjemploAlcance {}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/03-ngmodule/saludo-heredado.module.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 3a · Cómo se escribía antes: NgModule y componente no standalone
//  Diapositiva 16 · SOLO PARA LECTURA DE CÓDIGO HEREDADO
// -----------------------------------------------------------------------------
//  Así se organizaba una aplicación Angular hasta la versión 14, y así siguen
//  muchos proyectos en empresas. No se escribe código nuevo de esta forma.
//
//  Cómo leerlo
//    - standalone: false   el componente no se importa solo: pertenece a un
//                          módulo. Desde Angular 19 el valor por defecto es
//                          true, por eso en el curso nunca se escribe.
//    - declarations        los componentes, directivas y pipes que el módulo
//                          «posee». Cada uno se declara en un solo módulo.
//    - imports             otros módulos cuyo contenido se usa en las
//                          plantillas de este módulo (CommonModule trae
//                          *ngIf, *ngFor y los pipes).
//    - exports             lo que el módulo deja usar a quien lo importa.
//    - @Input()            el decorador anterior a input(). No es una signal:
//                          se lee sin paréntesis.
//
//  El componente standalone de ejemplo-ngmodule.ts importa este módulo
//  completo para poder usar <app-saludo-heredado>.
// =============================================================================

@Component({
  selector: 'app-saludo-heredado',
  standalone: false,
  template: `
    <p class="text-sm">
      Puesto <strong>{{ puesto }}</strong>
      <span *ngIf="abierto; else cerrado"> · abierto</span>
      <ng-template #cerrado><span> · cerrado</span></ng-template>
    </p>
  `,
})
class SaludoHeredado {
  @Input() puesto = '';
  @Input() abierto = false;
}

@NgModule({
  declarations: [SaludoHeredado],
  imports: [CommonModule],
  exports: [SaludoHeredado],
})
class SaludoHeredadoModule {}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/03-ngmodule/ejemplo-ngmodule.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 3b · Un componente standalone que usa un módulo heredado
//  Diapositiva 16
// -----------------------------------------------------------------------------
//  Qué muestra
//    - Un componente actual (standalone) puede usar código viejo: importa el
//      NgModule completo en imports, igual que importaría otro componente.
//    - Es la forma habitual de migrar un proyecto: lo nuevo se escribe
//      standalone y convive con los módulos que aún no se han reescrito.
//
//  Qué observar
//    - Los bindings [puesto] y [abierto] funcionan igual que con input(). La
//      diferencia está dentro del hijo: @Input() no produce una signal.
// =============================================================================

@Component({
  selector: 'app-ejemplo-ngmodule',
  imports: [SaludoHeredadoModule],
  template: `
    <app-saludo-heredado puesto="Frutas" [abierto]="true" />
    <app-saludo-heredado puesto="Verduras" [abierto]="false" />
  `,
})
class EjemploNgModule {}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/04-defer/historial-precios.ts
// =============================================================================
// =============================================================================
//  S05 · EJEMPLO 4a · Componente que se carga de forma diferida
//  Diapositivas 18 y 20
// -----------------------------------------------------------------------------
//  Este componente solo se usa dentro de un bloque @defer (ejemplo-defer.ts).
//  Por eso Angular lo compila en un archivo JavaScript aparte (un chunk) que
//  el navegador descarga cuando se cumple el disparador, no al abrir la página.
//
//  Lee FavoritosService: cuando aparece, muestra los favoritos marcados ANTES
//  de que se cargara. El estado no vive en el componente, así que no se
//  pierde aunque el componente llegue tarde.
// =============================================================================

interface Registro {
  producto: string;
  semana: string;
  precio: number;
}

@Component({
  selector: 'app-historial-precios',
  imports: [CurrencyPipe],
  template: `
    <p class="text-xs text-slate-500">Favoritos marcados antes de cargar: {{ favoritos.total() }}</p>
    <table class="mt-1 w-full text-left text-sm">
      <thead class="bg-slate-900 text-xs uppercase text-white">
        <tr><th class="px-3 py-1.5">Producto</th><th class="px-3 py-1.5">Semana</th><th class="px-3 py-1.5">Precio</th></tr>
      </thead>
      <tbody>
        @for (r of registros; track r.producto + r.semana) {
          <tr class="border-t border-slate-100" [class.fav]="favoritos.esFavorito(r.producto)">
            <td class="px-3 py-1.5">{{ r.producto }}</td>
            <td class="px-3 py-1.5">{{ r.semana }}</td>
            <td class="px-3 py-1.5">{{ r.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .fav { background: #fef3c7; font-weight: 700; }
  `,
})
class HistorialPrecios {
  protected readonly favoritos = inject(FavoritosService);
  protected readonly registros: Registro[] = [
    { producto: 'Mango', semana: 'S38', precio: 1700 },
    { producto: 'Mango', semana: 'S39', precio: 1800 },
    { producto: 'Patilla', semana: 'S38', precio: 6200 },
    { producto: 'Patilla', semana: 'S39', precio: 6500 },
    { producto: 'Tomate', semana: 'S39', precio: 3200 },
  ];
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/04-defer/ejemplo-defer.ts
// =============================================================================
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
class EjemploDefer {}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s05/s05.ts
// =============================================================================
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
class S05 {}

// =============================================================================
// ARRANQUE (en Angular CLI esto está en main.ts, app.ts y app.config.ts)
// =============================================================================
@Component({ selector: 'app-root', imports: [S05, ContadorFavoritos], template: `<main style="max-width:64rem;margin:auto;padding:1.5rem"><p>Encabezado: <app-contador-favoritos /></p><app-s05 /></main>` })
class App {}

registerLocaleData(localeEsCo);
bootstrapApplication(App, { providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }] });
