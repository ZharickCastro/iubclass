# COM30 · S06 · Ejemplos de la sesión

**Sesión S06 · miércoles 21 de octubre de 2026 · Formularios basados en plantilla y reactivos**

El código de la sesión está en `src/app/s06/` y se ve en la ruta **`/s06`** de la aplicación
(pestaña «S06 · Ejemplos»). Cada ejemplo corresponde a diapositivas de `COM30_S06_sesion.pdf`, en el
aula. La explicación completa está en el comentario de encabezado de cada archivo.

Quien trabaja en StackBlitz tiene los ejemplos en un solo archivo: `_para-stackblitz/s06-main.ts`.

---

## Antes de empezar

1. En su fork en GitHub: **Sync fork → Update branch**. Luego, en la carpeta del proyecto,
   `git pull`.
2. En los equipos de la sala, Node.js no está en el PATH: `.\entorno-sala.cmd` en cmd, o las
   tareas *COM30* de VS Code (ver `CLASE_S04.md`).
3. `npm install` (no hay dependencias nuevas: `@angular/forms` ya estaba en el proyecto) y
   `npx ng serve`.

---

## Mapa de la sesión

| # | Diapositiva | Archivo | Concepto |
|---|---|---|---|
| 1 | 10, 11 y 13 | `01-plantilla/ejemplo-plantilla.ts` | `FormsModule`, `[(ngModel)]` con una signal, `#f="ngForm"`, `name` |
| 2 | 16 y 17 | `02-control/ejemplo-control.ts` | `FormControl` suelto, `[formControl]`, `setValue`, `reset` con y sin `nonNullable` |
| 3 | 18 a 21, 27 y 28 | `03-grupo/registro-precio.ts` · `precios-dia.service.ts` | `FormBuilder`, `[formGroup]`, `formControlName`, `(ngSubmit)`, `Validators.required`, envío al servicio, edición |
| 4 | 25 y 26 | `04-escritura/ejemplo-escritura.ts` | `value` frente a `getRawValue()`, `setValue`, `patchValue`, `reset`, NG01002 |

---

## Ejemplo 1 · Formularios basados en plantilla

- **Qué hacer:** escribir «ñ» en el buscador; en la parte B, escribir un producto y borrarlo.
- **Qué observar:** la lista se filtra con cada tecla. Debajo de la parte B, `f.value` y `f.valid`
  cambian sin que la clase declare ningún control.
- **Qué error previene:** usar `[(ngModel)]="texto()"` (NG5002) u omitir `name` dentro de un
  `<form>` (NG01352).

## Ejemplo 2 · Un FormControl suelto

- **Qué hacer:** escribir 4 en los dos campos y pulsar `reset()` en cada uno.
- **Qué observar:** Kilos vuelve a 1 (`nonNullable`); Libras queda en `null` y el campo se ve vacío.
- **Qué error previene:** declarar controles sin `nonNullable` y luego tener que tratar `null` en
  todo el código que lee el valor.

## Ejemplo 3 · Formulario reactivo conectado a un servicio

`PreciosDiaService` es el patrón de la S05 (signal privada, `asReadonly()`, métodos con
`update()`) aplicado a los precios del día. `RegistroPrecio` declara el formulario con
`inject(FormBuilder).nonNullable.group(...)` y lo envía al servicio.

- **Qué hacer:** escribir solo «Guayaba» en Producto; borrar el precio; escribir lb y 1250 y pulsar
  «Redondear» y «Registrar»; pulsar «Corregir» en Ñame.
- **Qué observar:** con «Guayaba» y precio 0 el formulario es válido (`required` acepta el 0); con el
  precio borrado deja de serlo. Al registrar, la tabla muestra $ 1.300 y el formulario vuelve a sus
  valores iniciales. Al corregir, `producto` desaparece de `form.value` y sigue en `getRawValue()`.
- **Qué error previene:** pasar `form.value` al servicio (TS2345) y olvidar `reset()` después de
  guardar.

## Ejemplo 4 · Escribir en el formulario desde el código

- **Qué hacer:** pulsar los botones en orden y leer el panel después de cada uno.
- **Qué observar:** «setValue incompleto» no cambia ningún control y muestra
  `NG01002: Must supply a value for form control with name: 'unidad'`. «Deshabilitar unidad» la
  quita de `value` y la conserva en `getRawValue()`.

---

## Errores provocados durante la clase

| Diapositiva | Cambio | Mensaje |
|---|---|---|
| 13 | Quitar `FormsModule` de `imports` en el ejemplo 1 | `NG8002: Can't bind to 'ngModel' since it isn't a known property of 'input'` |
| 13 | `[(ngModel)]="texto()"` | `NG5002: Unsupported expression in a two-way binding` |
| 13 | Quitar `name="producto"` de la parte B | `NG01352: If ngModel is used within a form tag, either the name attribute must be set…` |
| 22 | Quitar `ReactiveFormsModule` en el ejemplo 3 | `NG8002: Can't bind to 'formGroup' since it isn't a known property of 'form'` |
| 22 | `formControlName="precios"` | `Cannot find control with name: 'precios'` |
| 25 | `this.precios.registrar(this.form.value)` | `TS2345: Argument of type 'Partial<…>' is not assignable to parameter of type 'PrecioDia'` |

Restaure cada archivo después de provocar el error (`git checkout -- <archivo>`).

---

## Taller 05

El enunciado oficial es `COM30_S06_taller05.docx`, en el aula. El orden de trabajo está en
`GUIA_TALLER_05.md`. Los ejemplos usan otro dominio (los precios del día) a propósito: el taller
trabaja el catálogo del puesto del Taller 03.
