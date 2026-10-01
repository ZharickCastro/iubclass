import { NgModule, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class SaludoHeredado {
  @Input() puesto = '';
  @Input() abierto = false;
}

@NgModule({
  declarations: [SaludoHeredado],
  imports: [CommonModule],
  exports: [SaludoHeredado],
})
export class SaludoHeredadoModule {}
