# NODO CERO — Informe de implementación A: modelo y persistencia

**Estado:** implementación de modelo incorporada a `main`; validación automatizada pendiente de ejecución en checkout local.  
**Fecha:** 20 de noviembre de 2026.

## Alcance implementado

- Se añadieron las colecciones `collectiveRelations` y `emergentInterpretations` al estado de exploración.
- Se incorporaron los tipos de registro `relacion_colectiva` e `interpretacion_emergente`.
- Se definió el catálogo: `patron`, `tension`, `causal_hipotetica`, `complementaria`, `contradiccion`, `analogia` y `otra`.
- Se añadieron las funciones de dominio `createCollectiveRelation(data)` y `createEmergentInterpretation(data)`. Son contratos de modelo; todavía no están conectadas a controles de interfaz.
- Las relaciones admiten referencias tipadas a territorios, hallazgos, evidencias, interpretaciones, necesidades, posibilidades y oportunidades.
- La validación global comprueba cardinalidad, tipo, existencia, estado de archivado, categorías, significado, fuentes mínimas y duplicados.
- Las interpretaciones emergentes distinguen `inferencia` y `hipotesis`, y requieren dos o más fuentes distintas.
- Ambas colecciones participan en mutaciones atómicas, IDs globales, historiales y registros de versión.
- El archivado de una fuente archiva las relaciones colectivas dependientes y las interpretaciones emergentes que dependen de esa fuente o de esas relaciones. La operación está dentro del contrato de mutación atómica.
- Los respaldos anteriores se normalizan con arreglos vacíos para las colecciones nuevas. Se mantiene `backupSchemaVersion: 1`; las conexiones binarias existentes no se migran ni alteran.
- El contador de registros y el checklist de liberación incluyen las nuevas colecciones.

## Archivos

- `index.html`: modelo y persistencia.
- `tests/nodo-cero-relaciones-colectivas.test.js`: 18 comprobaciones estructurales y de contrato.
- `NODO_CERO_RELACIONES_COLECTIVAS_ESPECIFICACION.md`: especificación funcional y técnica.
- `NODO_CERO_RELEASE_CHECKLIST.md`: criterios de aceptación para la iteración A.
- `README.md`: estado de la ampliación y comando de prueba.

## Estado de validación

| Verificación | Estado | Observación |
|---|---|---|
| Lectura del archivo remoto actualizado | PASS | SHA de blob de `index.html`: `3a561f94a488159a31f51b58c28c00d91d145bf6`. |
| Presencia de colecciones y funciones de dominio | PASS | Confirmado sobre el archivo remoto recuperado. |
| Normalización compatible con respaldos anteriores | PASS | Las colecciones ausentes se inicializan como arreglos vacíos. |
| Suite nueva (18 checks) | NOT TESTED | El archivo de prueba está incorporado; no se ejecutó `node` contra un checkout del repositorio. |
| Suites de regresión Ciclo 1, Ciclo 2 y PROYECTAR | NOT TESTED | Pendientes de ejecución sobre esta versión. |
| Navegador real / importación y exportación E2E | NOT TESTED | No se declara prueba E2E. |
| Interfaz de usuario para crear y consultar relaciones | PENDIENTE | Corresponde a la subiteración B. |
| Interfaz de interpretaciones emergentes | PENDIENTE | Corresponde a la subiteración C. |

## Siguiente paso

Antes de construir la interfaz, ejecutar la suite nueva y las tres suites de regresión sobre un checkout limpio de `main`. Resolver cualquier fallo y después comenzar B: constructor de relaciones colectivas. No declarar la iteración A cerrada hasta que las suites pasen.
