# COM30 · Guía de trabajo del Taller 04

**El pedido en un servicio inyectable · cierre: martes 13 de octubre de 2026, 23:59**

Esta guía ordena el trabajo e indica, para cada requisito, qué ejemplo de la sesión contiene la
técnica y **qué cambia en el taller**. Los ejemplos de `src/app/s05/` usan otro dominio (los
favoritos) a propósito. El enunciado oficial, con la secuencia de prueba y la rúbrica, es
`COM30_S05_taller04.docx`, en el aula.

---

## Antes de empezar

1. **Actualice su fork** (Sync fork → Update branch) y ejecute `git pull`.
2. **Con Angular CLI:** copie la carpeta `src/app/taller03/` como `src/app/taller04/` y agregue la
   ruta `/taller04` en `app.routes.ts`. El Taller 03 queda intacto. **En StackBlitz:** trabaje en
   una copia de su `main.ts` del Taller 03.
3. Si su Taller 03 quedó incompleto, termine primero `TarjetaProducto` y `ResumenPedido`.
4. Tenga a mano la **tabla 2 del enunciado**. Recórrala completa al final de cada paso.

---

## Orden de trabajo

### Paso 1 · El servicio · R1 y R2

| | |
|---|---|
| **Construya** | `pedido.service.ts` con la signal privada, su versión `asReadonly()`, los `computed` y los métodos `agregar` y `quitar`. |
| **Consulte** | Ejemplo 1 (`favoritos.service.ts`). |
| **Qué cambia en el taller** | Hay seis valores derivados, no uno. La regla del domicilio, que en el Taller 03 estaba en el resumen, se mueve aquí. |
| **Compruebe** | Ningún componente puede compilar `servicio._pedido.set(...)`: el compilador responde TS2341. |

### Paso 2 · Pedido sin estado propio · R3

| | |
|---|---|
| **Construya** | En `Pedido`, `inject(PedidoService)` y borre su signal. Las tarjetas reciben los datos del servicio y su `(agregar)` llama al método del servicio. |
| **Consulte** | Ejemplo 1 (`lista-favoritos.ts`): el hijo de la S04 sigue igual y el padre responde con el servicio. |
| **Qué cambia en el taller** | `TarjetaProducto` no cambia. `ResumenPedido` sí: pierde sus inputs y su output y usa el servicio. |
| **Compruebe** | Pasos P4 a P7 de la tabla 2. |

### Paso 3 · El contador del encabezado · R4

| | |
|---|---|
| **Construya** | `ContadorPedido`, sin inputs, y agréguelo en `app.html`, junto al contador de favoritos de la S05. |
| **Consulte** | Ejemplo 1 (`contador-favoritos.ts`) y cómo se agregó en `app.html` y `app.ts`. |
| **Compruebe** | Paso P2: el contador cambia sin abrir el resumen. Paso P8: cambie de pestaña y vuelva. |

### Paso 4 · El resumen diferido · R5

| | |
|---|---|
| **Construya** | En la plantilla de `Pedido`, el `@defer (on interaction)` con el `@placeholder` que pide el enunciado. |
| **Consulte** | Ejemplo 4 (`ejemplo-defer.ts`). |
| **Error típico** | `@defer (on interaction)` sin `@placeholder`: NG8019. |
| **Compruebe** | Pasos P1 y P3. En F12 → Red aparece el chunk del resumen al pulsar el botón. |

---

## Antes de entregar

- Recorra la tabla 2 completa desde P1, sin recargar la página.
- `npx ng build` sin errores; en la salida aparece un *lazy chunk* con el nombre del resumen.
- `git push` y verifique en una ventana privada que el enlace del fork abre.
