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
