# NODO CERO — Informe de Iteración B: constructor de relaciones colectivas

**Estado:** implementación incorporada a `main`; pruebas automatizadas estructurales PASS. Validación manual/E2E en navegador pendiente.

## Alcance implementado

- Constructor integrado en la sección CONECTAR de «Mi Exploración».
- Catálogo de participantes: territorios, hallazgos, evidencias, interpretaciones, necesidades, posibilidades y oportunidades.
- Filtros por tipo y territorio, más búsqueda por contenido.
- Selección múltiple con resumen visible de participantes.
- Regla de interfaz: mínimo tres participantes para crear un puente colectivo.
- Catálogo de siete categorías: patrón, tensión, relación causal hipotética, complementariedad, contradicción, analogía y otra.
- Orientación contextual para explicar cada categoría. La categoría causal indica expresamente que se trata de una hipótesis que requiere investigación.
- Creación mediante el modelo de dominio existente, con referencias tipadas, IDs estables, historial y persistencia.
- Listado de relaciones colectivas activas con participantes consultables.
- Acciones de edición de explicación, consulta/restauración de historial y archivado.
- La edición conserva el ID y crea una versión nueva. El archivado conserva el registro.
- Las conexiones binarias existentes permanecen sin cambios.

## Archivos

- `index.html`: constructor, filtros, listado y acciones.
- `tests/nodo-cero-relaciones-colectivas-ui.test.js`: suite de contrato UI.
- `.github/workflows/nodo-cero-regression.yml`: incorpora la suite UI al flujo automatizado.
- `README.md`: instrucciones y alcance actualizados.
- `NODO_CERO_RELEASE_CHECKLIST.md`: pruebas manuales pendientes.

## Validación

La suite nueva contiene 14 comprobaciones estructurales. La ejecución automatizada de GitHub Actions asociada al commit de implementación reportó PASS para las cinco suites:
- Relaciones colectivas (modelo): 19/19.
- Ciclo 1: 26/26.
- Ciclo 2: 32/32.
- PROYECTAR: 12/12.
- Constructor UI B: 14/14.

**Total: 103/103 comprobaciones automatizadas PASS.**

Estas suites verifican estructura, contratos, listeners, sintaxis JavaScript e IDs HTML. No prueban interacción real de navegador ni sustituyen las comprobaciones manuales.

## Pendiente antes de cerrar B

- Crear una relación con tres participantes de tipos y territorios distintos.
- Reutilizar un participante en dos relaciones.
- Editar y comprobar historial/restauración.
- Archivar una relación y verificar su conservación.
- Recargar la aplicación y comprobar persistencia.
- Revisar responsive, teclado, foco y consola en Chrome/Edge.
- Confirmar despliegue de GitHub Pages.

## Estado por criterio

| Criterio | Estado |
|---|---|
| Constructor y filtros | PASS (contrato estructural) |
| Selección mínima de tres | PASS (contrato estructural) |
| Catálogo y guía pedagógica | PASS (contrato estructural) |
| Creación conectada al modelo | PASS (contrato estructural) |
| Edición/versionado/archivado | PASS (integración estructural) |
| Regresión automatizada | PASS (103/103) |
| Interacción real en navegador | NOT TESTED |
| Persistencia manual y exportación/importación | NOT TESTED |
| Responsive y accesibilidad manual | NOT TESTED |

## Fuera de alcance

La creación de interpretaciones emergentes corresponde a Iteración C. La exportación Markdown y la visualización de relaciones colectivas en PNG corresponden a Iteración D.
