import { Component } from '@angular/core';
import { SaludoHeredadoModule } from './saludo-heredado.module';

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
export class EjemploNgModule {}
