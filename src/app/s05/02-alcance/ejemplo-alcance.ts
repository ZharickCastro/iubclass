import { Component, Injectable, inject, input, signal } from '@angular/core';
import { FavoritosService } from '../01-servicio/favoritos.service';

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
export class NotaLocalService {
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
export class PanelNota {
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
export class EjemploAlcance {}
