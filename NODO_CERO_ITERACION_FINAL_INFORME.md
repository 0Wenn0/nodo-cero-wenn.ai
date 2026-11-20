# NODO CERO — Informe de iteración final (corrección de PROYECTAR)

## Alcance ejecutado

Se inspeccionó la versión vigente de `main` antes de modificarla. El archivo inicial fue recuperado con blob SHA `af3da2314a11cb0304ae4a27d6602db17379a84f` (220,943 caracteres).

## Diagnóstico de la incidencia

El constructor de oportunidades obtiene las necesidades activas y las filtra por `hallazgoId` contra los IDs de los hallazgos seleccionados en PROYECTAR. Por diseño, una selección de hallazgos que todavía no tienen necesidades asociadas produce cero opciones.

La validación de creación de oportunidades ya exige al menos una necesidad y comprueba que cada necesidad corresponda a uno de los hallazgos de origen. La captura evidencia que el selector no explica por qué está vacío; no demuestra por sí misma pérdida de datos ni una ruptura de relaciones.

## Corrección aplicada

En `index.html`:

- Se añadió un estado contextual accesible para el selector de necesidades (`role=status`, `aria-live=polite` y asociación mediante `aria-describedby`).
- El selector distingue tres escenarios vacíos: no hay hallazgos seleccionados; no hay necesidades activas; hay necesidades activas, pero ninguna corresponde a los hallazgos elegidos.
- Se añadieron instrucciones concretas para registrar necesidades en IDENTIFICAR o seleccionar otro hallazgo.
- Las necesidades elegibles se renderizan como opciones DOM y conservan la selección únicamente cuando siguen siendo elegibles.
- Se conservaron las validaciones de trazabilidad; no se crean necesidades ni relaciones automáticamente y no se permite registrar oportunidades sin necesidad seleccionada.

## Pruebas y resultados

### Validaciones estáticas ejecutadas en esta sesión

| Prueba | Resultado |
|---|---|
| Selector accesible y asociado a su ayuda | PASS |
| Filtrado por ID del hallazgo seleccionado | PASS |
| Estado vacío cuando no hay hallazgos seleccionados | PASS |
| Estado vacío cuando no hay necesidades activas | PASS |
| Estado vacío cuando no hay necesidades vinculadas | PASS |
| Conservación exclusiva de selecciones elegibles | PASS |
| Validación de necesidad obligatoria al guardar | PASS |
| Validación de correspondencia hallazgo-necesidad | PASS |
| Render sin creación automática de registros o relaciones | PASS |
| Ausencia de IDs HTML duplicados | PASS |

Resultado: **10/10 validaciones estáticas PASS**.

### Suite de regresión añadida

Se agregó `tests/nodo-cero-proyectar-needs.test.js` con 12 comprobaciones automatizadas, incluida la compilación sintáctica de los scripts inline mediante Node.js `vm.Script`.

**Estado de ejecución: BLOCKED.** En esta sesión no se dispuso de un runtime Node.js conectado al checkout del repositorio para ejecutar el archivo de pruebas ni las suites históricas. La suite quedó agregada al repositorio, pero no se declara ejecutada.

### Pruebas pendientes de navegador real

No se ejecutaron pruebas E2E en Chrome/Edge. Permanecen pendientes:
- Necesidad vinculada visible para un hallazgo seleccionado.
- Actualización al cambiar hallazgos y selección múltiple.
- Registro de oportunidad y persistencia tras recarga.
- Exportación/importación JSON en entorno de prueba aislado.
- Recorrido completo, responsive, teclado y accesibilidad.
- Verificación independiente de GitHub Pages.

## Archivos modificados

- `index.html`: corrección de estados vacíos del selector.
- `tests/nodo-cero-proyectar-needs.test.js`: suite de regresión específica.
- `NODO_CERO_RELEASE_CHECKLIST.md`: pruebas nuevas añadidas al checklist.

## Historial de commits

- SHA inicial de `index.html`: `af3da2314a11cb0304ae4a27d6602db17379a84f`.
- Corrección de aplicación: `8c946a721af31e695c3810fb746fefbe21cb9a2c`.
- Suite de regresión: `1bd4887acfd0e0505d9a90261270627801000a0e`.
- Checklist actualizado: `355d1ed35b6aafe92717ae7e0e9c52ed98094307`.

## Dictamen

La corrección del estado vacío contextual quedó implementada y las comprobaciones estáticas disponibles pasaron. La iteración **no puede declararse como liberación completamente validada**: faltan ejecución de las suites Node.js, pruebas funcionales en navegador real y verificación de la publicación de GitHub Pages.

No se modificó ni se solicitó el contenido del almacenamiento local de la usuaria. No se añadieron datos personales ni respaldos JSON al repositorio.
