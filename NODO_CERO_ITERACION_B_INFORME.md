# NODO CERO — Informe de Iteración B: constructor de relaciones colectivas

**Estado:** constructor ampliado en `main`. Regresión estructural PASS. Recorrido E2E Chromium incorporado al CI y en ejecución/verificación.

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

El job de Chromium automatiza el flujo de creación, edición de participantes/categoría/significado, restauración de versión, recarga y archivado. Su resultado debe confirmarse en la ejecución enlazada antes de considerar validado el E2E.

## Criterios de cierre

| Criterio | Estado |
|---|---|
| Constructor, filtros y creación | PASS (estructura y contratos) |
| Edición integral y validación de duplicados | PASS (estructura y contratos) |
| Snapshot completo y restauración de participantes/categoría | PASS (estructura y contratos) |
| Regresión estructural | PASS (109/109) |
| E2E Chromium | En ejecución / pendiente de resultado final |
| Responsive y accesibilidad manual | NOT TESTED |
| Revisión manual de consola y navegador | NOT TESTED |
| Despliegue final de GitHub Pages | Pendiente de confirmar |

## Fuera de alcance

Las interpretaciones emergentes corresponden a Iteración C. La exportación Markdown y la visualización PNG de relaciones colectivas corresponden a Iteración D.
