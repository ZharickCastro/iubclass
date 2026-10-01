# COM30 · S05 · Ejemplos de la sesión

**Sesión S05 · miércoles 7 de octubre de 2026 · sesión asincrónica · Servicios, inyección de
dependencias y carga diferida**

El código de la sesión está en `src/app/s05/` y se ve en la ruta **`/s05`** de la aplicación
(pestaña «S05 · Ejemplos»). Cada ejemplo corresponde a diapositivas de `COM30_S05_sesion.pdf` y
a una sección de la guía de estudio `COM30_S05_guia_estudio.pdf`, las dos en el aula. La
explicación completa está en el comentario de encabezado de cada archivo.

Quien trabaja en StackBlitz tiene los ejemplos en un solo archivo: `_para-stackblitz/s05-main.ts`.

---

## Antes de empezar

1. En su fork en GitHub: **Sync fork → Update branch**. Luego, en la carpeta del proyecto,
   `git pull`.
2. En los equipos de la sala, Node.js no está en el PATH: `.\entorno-sala.cmd` en cmd, o las
   tareas *COM30* de VS Code (ver `CLASE_S04.md`).
3. `npm install` (no hay dependencias nuevas, pero no sobra) y `npx ng serve`.

---

## Mapa de la sesión

| # | Diapositiva | Archivo | Concepto |
|---|---|---|---|
| 1 | 8 a 10 | `01-servicio/favoritos.service.ts` · `lista-favoritos.ts` · `contador-favoritos.ts` | Servicio en `root`, signal privada, `asReadonly()`, `inject()` |
| 2 | 11 | `02-alcance/ejemplo-alcance.ts` | `providedIn: 'root'` frente a `providers` del componente |
| 3 | 16 | `03-ngmodule/saludo-heredado.module.ts` · `ejemplo-ngmodule.ts` | Lectura de un `NgModule` y de `@Input()` |
| 4 | 18 a 20 | `04-defer/ejemplo-defer.ts` · `historial-precios.ts` | `@defer (on interaction)`, `@placeholder`, `@loading` |
| — | 10 | `src/app/app.html` · `app.ts` | El contador de favoritos del encabezado: el mismo estado fuera de `/s05` |

---

## Ejemplo 1 · El estado de los favoritos en un servicio

Es el estado del ejemplo 2 de la S04, que vivía en un componente padre. Ahora lo leen dos
componentes que no tienen un padre común cercano: la lista de `/s05` y el contador de favoritos del
encabezado.

- **Qué hacer:** marcar dos productos en `/s05`; ir a la pestaña Tablero; volver a `/s05`.
- **Qué observar:** el contador de favoritos cambia en el encabezado al marcar. Al volver, los favoritos
  siguen marcados: la página se destruyó y se volvió a crear, el servicio no.
- **Qué error previene:** pasar un dato por input a través de cinco componentes que no lo usan.

## Ejemplo 2 · Una instancia o una por componente

- **Qué hacer:** pulsar «+1 nota» en el panel A, y marcar un favorito en el ejemplo 1.
- **Qué observar:** el panel B no cambia con la nota del A (cada panel tiene su propio
  `NotaLocalService`), pero los dos muestran el mismo total de favoritos (`FavoritosService` es
  uno solo).

## Ejemplo 3 · Leer un NgModule

Solo lectura. Así se escribía una aplicación hasta Angular 14 y así siguen muchos proyectos en
empresas. El comentario del archivo explica `declarations`, `imports`, `exports`,
`standalone: false` y `@Input()`. No se escribe código nuevo así.

## Ejemplo 4 · @defer

- **Qué hacer:** abrir F12 → Red, filtrar por JS, y pulsar «Ver historial de precios».
- **Qué observar:** aparece una petición nueva a un archivo `chunk-….js`: el código del componente
  se descarga en ese momento. El historial resalta los favoritos marcados antes de cargarlo,
  porque los lee del servicio.
