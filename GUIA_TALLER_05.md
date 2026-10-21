# COM30 · Guía de trabajo del Taller 05

**Catálogo del puesto con formulario reactivo · cierre: miércoles 28 de octubre de 2026, 23:59**

Esta guía ordena el trabajo e indica, para cada requisito, qué ejemplo de las sesiones S05 y S06
contiene la técnica y **qué cambia en el taller**. Los ejemplos usan otros dominios (favoritos,
precios del día) a propósito. El enunciado oficial, con la secuencia de prueba y la rúbrica, es
`COM30_S06_taller05.docx`, en el aula.

---

## Antes de empezar

1. **Actualice su fork** (Sync fork → Update branch) y ejecute `git pull`.
2. **Con Angular CLI:** cree la carpeta `src/app/taller05/` y la ruta `/taller05` en
   `app.routes.ts`. **En StackBlitz:** todo va en `src/main.ts`; el contador va en la plantilla del
   componente raíz.
3. Copie la interfaz `Producto` del Taller 03 y los cuatro productos de la tabla 1 del enunciado.
4. Tenga a mano la **tabla 2 del enunciado**. Recórrala completa al final de cada paso.

---

## Orden de trabajo

### Paso 1 · El servicio del catálogo · R1 y R2

| | |
|---|---|
| **Construya** | `catalogo.service.ts` con la signal privada, su versión `asReadonly()`, los cuatro `computed` y los métodos `agregar` y `actualizar`. |
| **Consulte** | S05, ejemplo 1 (`src/app/s05/01-servicio/favoritos.service.ts`) y S06, ejemplo 3 (`precios-dia.service.ts`). |
| **Qué cambia en el taller** | `actualizar` recibe el **nombre original** y el producto nuevo: el nombre puede cambiar al editar. |
| **Compruebe** | Columnas «Unid.» y «Valor inventario» de P1: 16 y $ 32.900. |

### Paso 2 · El contador del encabezado · R6 (primera parte)

| | |
|---|---|
| **Construya** | `ContadorCatalogo`, sin inputs, agregado en `app.html` junto al contador de favoritos de la S05. |
| **Consulte** | S05, `contador-favoritos.ts`, y cómo se agregó en `app.html` y `app.ts`. |
| **Compruebe** | P1: «Productos: 4 · Agotados: 0» en todas las pestañas de la aplicación. |

### Paso 3 · El formulario de alta · R3

| | |
|---|---|
| **Construya** | En `Catalogo`, el `FormGroup` con `nombre`, `precio` y `existencias`, los tres con `Validators.required`; la plantilla con `[formGroup]`, `formControlName` y `(ngSubmit)`. |
| **Consulte** | S06, ejemplo 3 (`registro-precio.ts`), diapositivas 18 a 21 y 27. |
| **Qué cambia en el taller** | Tres controles numéricos y de texto; no hay `<select>`. Al guardar en modo alta se llama a `agregar()`. |
| **Error típico** | Pasar `form.value` al servicio: TS2345. Use `getRawValue()`. |
| **Compruebe** | P1 (botón deshabilitado) y P2 (cinco productos, formulario en nombre vacío, 0, 0). |

### Paso 4 · La edición · R4

| | |
|---|---|
| **Construya** | Botón «Editar» en cada fila; una signal con el nombre original del producto en edición; el título del formulario según esa signal; «Cancelar». |
| **Consulte** | S06, ejemplo 3 (`corregir()` y `cancelar()`) y ejemplo 4 (`patchValue`). |
| **Qué cambia en el taller** | El ejemplo carga con `setValue()` y deshabilita la clave. El taller carga con **`patchValue()`** y **no** deshabilita el nombre: guarda el nombre original en una signal. |
| **Compruebe** | P4, P6 y P7. En P7, «Guardar» se deshabilita con el campo vacío y «Cancelar» no cambia a Mango. |

### Paso 5 · El filtro con ngModel · R5

| | |
|---|---|
| **Construya** | Una casilla «Solo agotados» **fuera** del `<form [formGroup]>`, con `[(ngModel)]` ligado a una signal, y un `computed` con la lista visible. |
| **Consulte** | S06, ejemplo 1, parte A (`ejemplo-plantilla.ts`). |
| **Qué cambia en el taller** | Es una casilla (`type="checkbox"`), no un texto: la signal es `boolean`. |
| **Error típico** | Poner la casilla dentro del `<form [formGroup]>`: la consola muestra `NG01350: ngModel cannot be used to register form controls with a parent formGroup directive`. |
| **Compruebe** | P5: una fila con la casilla marcada, cinco sin ella. Redacte la justificación en el enunciado. |

### Paso 6 · El resumen diferido · R6 (segunda parte)

| | |
|---|---|
| **Construya** | `ResumenInventario`, que lee el servicio con `inject()`, dentro de `@defer (on interaction)` con el `@placeholder` que pide el enunciado. |
| **Consulte** | S05, ejemplo 4 (`ejemplo-defer.ts`). |
| **Error típico** | `@defer (on interaction)` sin `@placeholder`: NG8019. |
| **Compruebe** | P1 y P3. En P6 el resumen abierto cambia a $ 37.400 sin cerrarlo. |

---

## Antes de entregar

- Recorra la tabla 2 completa desde P1, sin recargar la página.
- `npx ng build` sin errores; en la salida aparece un *lazy chunk* con el nombre del resumen.
- `git push` y verifique en una ventana privada que el enlace del fork abre.
- Tome las capturas de P4 y P7 que pide el enunciado.
