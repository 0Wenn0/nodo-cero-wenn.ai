# NODO CERO — Informe de Iteración B: constructor de relaciones colectivas

**Estado:** Iteración B implementada y validada en CI. El recorrido E2E con Chromium y las suites estructurales finalizaron en PASS. El commit probado está publicado mediante GitHub Pages.

## Alcance implementado

- Constructor integrado en la sección CONECTAR de «Mi Exploración».
- Catálogo de participantes: territorios, hallazgos, evidencias, interpretaciones, necesidades, posibilidades y oportunidades.
- Filtros por tipo y territorio, búsqueda y selección múltiple.
- La creación desde la interfaz exige tres o más participantes.
- Siete categorías y guía contextual. La relación causal se identifica como hipotética.
- Listado de relaciones activas con sus participantes.
- Edición integral de participantes, categoría y explicación desde un editor contextual.
- La edición conserva el ID, valida referencias activas y duplicados, y crea una versión con snapshot completo.
- El historial restaura también participantes y categoría, no solo el texto; la restauración crea una nueva versión.
- Archivado conserva la relación y sus referencias.
- Las conexiones binarias existentes permanecen intactas.

## Archivos y commits principales

- `index.html`: editor integral y restauración de estructura colectiva.
- `tests/nodo-cero-relaciones-colectivas-ui.test.js`: suite estructural ampliada.
- `tests/nodo-cero-relaciones-colectivas.e2e.cjs`: recorrido Playwright/Chromium.
- `.github/workflows/nodo-cero-regression.yml`: suites estructurales y job de Chromium.
- `NODO_CERO_RELEASE_CHECKLIST.md`: pasos de validación manual.

## Validación automatizada

GitHub Actions completó con éxito las suites estructurales:
- Modelo colectivo: 19/19.
- Ciclo 1: 26/26.
- Ciclo 2: 32/32.
- PROYECTAR: 12/12.
- Interfaz B: 20/20.

**Total: 109/109 comprobaciones estructurales PASS.**

**E2E Chromium: PASS.** El navegador automatizado completó el flujo de creación, edición de participantes/categoría/significado, restauración de versión, persistencia tras recarga y archivado.

- Ejecución: [GitHub Actions #44913299736](https://github.com/0Wenn0/nodo-cero-wenn.ai/actions/runs/44913299736).
- Job Chromium: `136873485462`.
- Commit probado: `406a1adfa145fb28fc9551d97ef3d35c4cd2d945`.
- GitHub Pages para ese commit: ejecución [#44913298827](https://github.com/0Wenn0/nodo-cero-wenn.ai/actions/runs/44913298827), concluida en success.

## Criterios de cierre

| Criterio | Estado |
|---|---|
| Constructor, filtros y creación | PASS (estructura y contratos) |
| Edición integral y validación de duplicados | PASS (estructura y contratos) |
| Snapshot completo y restauración de participantes/categoría | PASS (estructura y contratos) |
| Regresión estructural | PASS (109/109) |
| E2E Chromium | PASS |
| Persistencia tras recarga en E2E | PASS |
| Despliegue GitHub Pages del commit probado | PASS |
| Responsive y accesibilidad manual | NOT TESTED |
| Revisión manual de consola y navegador | NOT TESTED |

## Fuera de alcance

Las interpretaciones emergentes corresponden a Iteración C. La exportación Markdown y la visualización PNG de relaciones colectivas corresponden a Iteración D.

## Alcance de la validación

El E2E se ejecutó en Chromium dentro de GitHub Actions. Esto valida el recorrido automatizado descrito, pero no sustituye una revisión manual de responsive, accesibilidad con tecnologías de asistencia ni consola en distintos navegadores.
