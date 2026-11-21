# NODO CERO — Checklist de liberación

## Integridad de versión
- [ ] Confirmar que `main` contiene el commit previsto.
- [ ] Registrar SHA de `index.html`, suite y documentación.
- [ ] Confirmar que los commits anteriores permanecen en el historial.
- [ ] Confirmar que no se publicaron respaldos JSON de participantes.

## Producto y recorrido
- [ ] El mapa muestra los siete territorios.
- [ ] La guía abre en primera visita y puede reabrirse.
- [ ] La guía permite volver al estado previo del mapa durante una sesión.
- [ ] OBSERVAR registra descripción, contexto, procedencia, interpretación e hipótesis.
- [ ] IDENTIFICAR permite formular necesidades vinculadas.
- [ ] CONECTAR permite crear relaciones argumentadas.
- [ ] IMAGINAR permite registrar posibilidades vinculadas.
- [ ] PROYECTAR permite formular oportunidades trazables.
- [ ] La navegación entre etapas conserva el estado.

## Persistencia y recuperación
- [ ] Guardado automático visible.
- [ ] Recarga recupera datos y etapa.
- [ ] Respaldo JSON descarga y conserva IDs/relaciones.
- [ ] Importación válida recupera la exploración.
- [ ] Importación inválida conserva la exploración actual.
- [ ] Reemplazo solicita confirmación y permite descargar respaldo previo.
- [ ] Respaldo local corrupto no se sobrescribe automáticamente.
- [ ] Error de almacenamiento muestra un aviso persistente.

## Entregables
- [ ] Ficha Markdown contiene los datos esperados y se descarga.
- [ ] Constelación PNG representa territorios y conexiones existentes.
- [ ] Respaldo JSON se puede recuperar en otra sesión/navegador.

## Experiencia y accesibilidad
- [ ] Revisar escritorio y móvil en Chrome o Edge.
- [ ] Comprobar foco, teclado, etiquetas y mensajes accesibles.
- [ ] Comprobar paneles, modales, Escape y botones.
- [ ] Confirmar que los errores no bloquean el resto de la aplicación.

## Publicación
- [ ] Esperar a que GitHub Pages despliegue el commit.
- [ ] Abrir la URL publicada y comprobar que sirve el commit esperado.
- [ ] Repetir el recorrido y las exportaciones en la versión publicada.
- [ ] Registrar resultados como PASS / FAIL / BLOCKED / NOT TESTED.

## Protección de datos
- [ ] Mantener las exploraciones locales en el dispositivo de cada participante.
- [ ] No solicitar respaldos JSON en el repositorio público.
- [ ] Recordar a participantes conservar sus respaldos en un lugar privado.

## Iteración final — PROYECTAR: necesidades relacionadas
- [ ] Seleccionar un hallazgo con necesidad activa asociada y comprobar que aparece.
- [ ] Seleccionar un hallazgo sin necesidad asociada y comprobar el estado vacío explicativo.
- [ ] Comprobar el mensaje cuando todavía no existen necesidades activas.
- [ ] Cambiar la selección de hallazgos y comprobar que las necesidades se actualizan.
- [ ] Confirmar que no permanecen seleccionadas necesidades que ya no corresponden.
- [ ] Registrar oportunidad y verificar trazabilidad.
- [ ] Recargar y comprobar que las relaciones persisten.
- [ ] Exportar/importar JSON en entorno de prueba aislado y comprobar las relaciones.
- [ ] Ejecutar `node tests/nodo-cero-proyectar-needs.test.js`.


## Iteración A — Modelo de relaciones colectivas e interpretaciones emergentes
- [ ] Los respaldos JSON anteriores se importan con las nuevas colecciones vacías.
- [ ] Las relaciones colectivas admiten dos o más referencias tipadas válidas.
- [ ] Se validan categoría, explicación, cardinalidad, referencias y duplicados.
- [ ] Las interpretaciones emergentes exigen dos o más fuentes distintas.
- [ ] Inferencia e hipótesis por contrastar se conservan como estados distintos.
- [ ] IDs, historiales y versionRecords incluyen las nuevas entidades.
- [ ] Archivado en cascada conserva registros e historiales y se revierte ante error.
- [ ] El respaldo JSON nuevo conserva referencias e historiales.
- [ ] Ejecutar `node tests/nodo-cero-relaciones-colectivas.test.js`.

## Iteración B — Constructor visual de relaciones colectivas
- [ ] Filtrar participantes por tipo y territorio.
- [ ] Buscar participantes por contenido.
- [ ] Seleccionar tres o más registros/territorios de distintos tipos.
- [ ] Verificar que un elemento puede participar en varias relaciones.
- [ ] Guardar categoría y explicación argumentada.
- [ ] Confirmar que la categoría causal se presenta como hipotética.
- [ ] Consultar las relaciones colectivas activas y sus participantes.
- [ ] Editar explicación y comprobar que crea una versión sin cambiar el ID.
- [ ] Consultar/restaurar historial.
- [ ] Archivar una relación y comprobar que se conserva en el historial.
- [ ] Recargar y verificar persistencia.
- [ ] Ejecutar `node tests/nodo-cero-relaciones-colectivas-ui.test.js`.
