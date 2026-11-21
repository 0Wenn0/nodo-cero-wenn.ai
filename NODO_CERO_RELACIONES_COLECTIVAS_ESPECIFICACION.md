# NODO CERO — Especificación de arquitectura: relaciones colectivas e interpretaciones emergentes

**Estado:** propuesta funcional y técnica para la siguiente iteración  
**Base inspeccionada:** `main`, commit de referencia `ed232d6909ee327b7b2d350e7543c453556c1c0a` (SHA de `index.html`: `4f458052c2999c671d4c44d28f49e40b1a84a972`)  
**Alcance de este documento:** especificación. No modifica todavía el comportamiento de la aplicación.

## 1. Propósito

Ampliar NODO CERO para que las participantes puedan construir relaciones entre dos o más elementos de su exploración y formular interpretaciones nuevas a partir de esas combinaciones.

La ampliación conserva el recorrido pedagógico, las conexiones binarias, los identificadores, los historiales, la autoría opcional, la persistencia local y los respaldos existentes.

## 2. Decisiones de arquitectura

1. Las conexiones binarias actuales se conservan en `bridgesMeanings`; no se migran ni reescriben como parte de esta iteración.
2. Se incorpora una colección independiente `collectiveRelations` para relaciones entre **dos o más participantes**. Su estructura admite dos participantes, aunque la interfaz colectiva se orientará a seleccionar tres o más cuando la intención sea construir una relación grupal.
3. Se incorpora `emergentInterpretations` para interpretaciones que nacen de una combinación de registros y/o relaciones. No sustituye a `interpretations`, que hoy se vincula a un hallazgo concreto.
4. Los participantes de una relación se representan mediante referencias tipadas, no mediante copias de los registros.
5. Una relación puede cruzar territorios y etapas. Un registro puede participar en varias relaciones.
6. Los respaldos JSON anteriores siguen siendo válidos: las colecciones nuevas se normalizan como arreglos vacíos cuando no existen.
7. No se cambia el significado ni la estructura de las conexiones binarias existentes.

## 3. Catálogo inicial de relaciones

| Código | Etiqueta | Orientación pedagógica |
|---|---|---|
| `patron` | Patrón | Recurrencia, semejanza o fenómeno compartido entre elementos. |
| `tension` | Tensión | Necesidades, intereses o condiciones que entran en fricción. |
| `causal_hipotetica` | Relación causal hipotética | Posible influencia entre fenómenos; requiere investigación antes de afirmarse como causalidad. |
| `complementaria` | Complementariedad | Elementos que se enriquecen o completan mutuamente. |
| `contradiccion` | Contradicción | Perspectivas o hallazgos aparentemente incompatibles. |
| `analogia` | Analogía | Situaciones diferentes que comparten una estructura o lógica. |
| `otra` | Otra relación | Categoría abierta con descripción obligatoria. |

Las categorías son un catálogo inicial, no una taxonomía cerrada. El tipo describe cómo se relacionan los elementos; no certifica que la interpretación sea verdadera. En particular, `causal_hipotetica` nunca debe mostrarse como causalidad demostrada.

## 4. Modelo de datos propuesto

### 4.1 Referencia tipada a participante

```js
{
  entityType: 'hallazgo',
  entityId: 'hallazgo_...'
}
```

Tipos admitidos en la primera implementación:

- `territorio`: uno de los siete territorios configurados.
- `hallazgo`: registro de `findings` (observación, interpretación registrada como hallazgo, hipótesis, necesidad/pregunta si el modelo actual las contiene allí).
- `evidencia`: registro de `evidences`.
- `interpretacion`: interpretación existente de `interpretations`.
- `necesidad`: registro de `needs`.
- `posibilidad`: registro de `possibilities`.
- `oportunidad`: registro de `opportunities`.

La resolución debe consultar la colección real y verificar el ID. No se deben aceptar etiquetas libres como sustituto de referencias válidas. Las relaciones colectivas y las interpretaciones emergentes no serán participantes de otras relaciones en esta primera versión; así se evitan ciclos y dependencias recursivas difíciles de explicar.

### 4.2 Relación colectiva

Colección: `state.exploration.collectiveRelations`

```js
{
  id: 'relacion_...',
  recordType: 'relacion_colectiva',
  schemaVersion: 1,
  participantRefs: [
    { entityType: 'hallazgo', entityId: '...' },
    { entityType: 'necesidad', entityId: '...' },
    { entityType: 'interpretacion', entityId: '...' }
  ],
  relationType: 'patron',
  meaning: 'Descripción argumentada de lo que conecta a los elementos',
  status: 'documentado',
  archivedAt: null,
  author: null,
  authorId: null,
  history: [],
  createdAt: 'ISO-8601'
}
```

Reglas:
- Mínimo dos participantes distintos; sin duplicados por combinación `entityType + entityId`.
- Cada participante debe existir y ser elegible.
- Se permiten participantes de distintos tipos y territorios.
- `meaning` es obligatorio y debe explicar por qué los elementos se relacionan; no basta con seleccionar elementos.
- `relationType` debe pertenecer al catálogo o ser `otra`. Para `otra`, la descripción debe precisar la relación.
- La relación no impone dirección ni causalidad. Si en el futuro se necesita dirección, se modelará explícitamente y no se inferirá del orden de selección.
- La edición conserva el ID y crea una versión. Cambiar participantes o categoría también debe quedar registrado en el historial, no solo cambiar el texto.

### 4.3 Interpretación emergente

Colección: `state.exploration.emergentInterpretations`

```js
{
  id: 'interpretacion_emergente_...',
  recordType: 'interpretacion_emergente',
  schemaVersion: 1,
  text: 'Significado o lectura nueva que surge al considerar conjuntamente las fuentes',
  sourceParticipantRefs: [
    { entityType: 'hallazgo', entityId: '...' },
    { entityType: 'necesidad', entityId: '...' }
  ],
  sourceRelationIds: ['relacion_...'],
  epistemicStatus: 'inferencia',
  status: 'documentado',
  archivedAt: null,
  author: null,
  authorId: null,
  history: [],
  createdAt: 'ISO-8601'
}
```

Reglas:
- Debe citar al menos dos fuentes distintas en total, contando referencias directas y/o relaciones colectivas.
- Cada `sourceRelationId` debe apuntar a una relación colectiva existente.
- Las referencias directas permiten que una interpretación se base en registros aunque todavía no se haya formalizado una relación.
- `epistemicStatus` admite inicialmente `inferencia` o `hipotesis`. La interfaz debe explicar la diferencia: inferencia = lectura derivada de las fuentes; hipótesis = explicación tentativa que requiere contraste.
- La interpretación emergente no se convierte automáticamente en evidencia ni en hecho.
- Puede originar nuevas preguntas, necesidades o posibilidades, mediante referencias explícitas en una futura ampliación. Esta iteración no altera automáticamente registros existentes.

## 5. Integridad, historial y archivado

### IDs e historial
- Usar el generador actual de IDs estables y el mecanismo de versiones existente.
- Incluir ambas colecciones en la validación global de IDs, el snapshot, el contador de registros y el historial.
- Cada nueva entidad debe tener historial inicial y entrada correspondiente en `versionRecords`.
- Restaurar una versión debe crear una versión nueva y conservar identidad y metadatos actuales, siguiendo el contrato actual.

### Referencias y archivado
- Las referencias a registros archivados se conservan para que el rastro histórico no desaparezca.
- Una relación o interpretación emergente activa no debe presentar como vigente una fuente archivada.
- Al archivar un participante, archivar también las relaciones colectivas activas que lo incluyan y las interpretaciones emergentes activas que dependan de esas relaciones o directamente de ese participante. Conservar todos los registros, IDs, fuentes e historiales.
- El archivado en cascada debe ejecutarse como una mutación atómica: si falla una validación, se revierte la operación completa.
- Una entidad archivada puede aparecer en la vista de historial con una etiqueta visible de «Archivada».

### Duplicados
- No impedir que un mismo conjunto de participantes tenga más de una relación si el tipo o el significado difiere.
- Evitar duplicados exactos: misma combinación normalizada de participantes, mismo tipo y mismo significado, en estado activo.
- Ordenar referencias solo para calcular la clave de duplicidad; conservar el orden de selección en el registro si aporta contexto.

## 6. Compatibilidad y respaldo

- Añadir `collectiveRelations` y `emergentInterpretations` a la inicialización de la exploración y a `normalizeImportedSnapshot`.
- No incrementar `backupSchemaVersion` por añadir colecciones opcionales compatibles hacia atrás. Los respaldos antiguos se recuperan con ambas colecciones vacías.
- Los respaldos nuevos incluyen las dos colecciones completas, con IDs, referencias, estado, autoría e historial.
- Importar debe validar referencias y tipos antes de sustituir la exploración activa.
- La importación fallida debe conservar intacta la exploración actual y el respaldo local previo.
- No escribir respaldos JSON de participantes en el repositorio público.

## 7. Experiencia de uso propuesta

### Constructor de relación colectiva
1. Abrir «Crear relación colectiva».
2. Buscar y seleccionar elementos de distintos tipos y territorios.
3. Mostrar una lista de participantes seleccionados con tipo, territorio y fragmento de texto para verificar que se eligió el registro correcto.
4. Elegir una categoría del catálogo.
5. Escribir qué relación se observa y por qué importa.
6. Guardar y mostrar la relación en el panel de exploración, con sus participantes consultables.

Estados vacíos orientadores:
- Sin registros disponibles: «Primero registra hallazgos, necesidades o posibilidades para poder relacionarlos».
- Un solo elemento seleccionado: «Añade al menos otro elemento para construir una relación».
- Participante archivado o inexistente: bloquear el guardado y explicar cuál referencia requiere atención.

### Constructor de interpretación emergente
1. Iniciar desde una relación colectiva o desde la sección de interpretaciones.
2. Seleccionar fuentes directas y/o relaciones colectivas.
3. Redactar qué significado nuevo aparece al considerarlas juntas.
4. Elegir «Inferencia» o «Hipótesis por contrastar».
5. Guardar y mostrar las fuentes que sustentan esa lectura.

La interfaz debe distinguir visualmente:
- **Fuente:** registro observado/documentado.
- **Relación:** vínculo argumentado entre fuentes.
- **Interpretación emergente:** lectura nueva derivada de una o varias fuentes y relaciones.
- **Hipótesis:** explicación tentativa pendiente de contraste.

No presentar la interpretación como una conclusión automática generada por el sistema. La participante conserva la autoría del significado.

## 8. Exportaciones

### JSON
Incluir ambas colecciones completas. Es el respaldo recuperable y conserva las referencias e historiales.

### Ficha Markdown
Añadir secciones:
- Relaciones colectivas: categoría, explicación y participantes (tipo, territorio y extracto).
- Interpretaciones emergentes: texto, estado epistémico y fuentes/relaciones de origen.

Excluir registros archivados de la síntesis principal o marcarlos explícitamente como archivados; no borrar su existencia del JSON.

### Constelación PNG
La visualización de múltiples participantes no debe simular que una relación de tres o más elementos son varios puentes binarios independientes. En la primera versión visual, representar una relación colectiva con un nodo/forma común conectado a sus participantes o con una agrupación inequívoca. Si el lienzo actual no permite representar esto con claridad, mantener el PNG actual y documentar la limitación; no dibujar una visualización engañosa.

## 9. Alcance recomendado por subiteraciones

### A — Modelo y persistencia
- Colecciones nuevas, normalización, snapshot, importación/exportación JSON.
- Resolución tipada de participantes.
- Validación de IDs, referencias, tipos, cardinalidad y duplicados.
- Versionado, archivado y pruebas de compatibilidad con respaldos anteriores.

### B — Relaciones colectivas
- Constructor multi-selección con búsqueda y filtros por tipo/territorio.
- Catálogo de categorías y descripción argumentada.
- Listado, detalle, edición, historial y archivado.

### C — Interpretaciones emergentes
- Constructor desde relaciones y registros.
- Diferenciación inferencia/hipótesis.
- Trazabilidad visible y edición/versionado/archivado.

### D — Entregables y visualización
- Exportación Markdown.
- Representación de relaciones colectivas en PNG, solo si resulta legible.
- Pruebas integrales en navegador real y regresión de exportación/importación.

**Orden recomendado:** A → B → C → D. No iniciar por el rediseño visual: primero debe existir un modelo íntegro y recuperable.

## 10. Criterios de aceptación

### Modelo
- [ ] Se pueden guardar relaciones con 2, 3, 4 o más participantes.
- [ ] Un participante puede pertenecer a varias relaciones.
- [ ] Se aceptan referencias cruzadas entre tipos y territorios.
- [ ] Se rechazan cero o un participante, referencias inexistentes, duplicados y categorías inválidas.
- [ ] La relación requiere explicación escrita.
- [ ] Las seis categorías acordadas y «Otra» están disponibles.
- [ ] Una relación causal se etiqueta siempre como hipotética.

### Interpretaciones emergentes
- [ ] Se puede crear una interpretación desde dos o más fuentes y/o relaciones.
- [ ] Se conservan las fuentes originales y la relación de origen.
- [ ] Se distingue inferencia de hipótesis por contrastar.
- [ ] No se crea evidencia ni causalidad demostrada automáticamente.

### Integridad
- [ ] IDs únicos globalmente.
- [ ] Historial y restauración crean versiones nuevas.
- [ ] Archivado conserva registros e historial y trata dependencias de forma atómica.
- [ ] Los registros archivados no se ofrecen como fuentes activas.

### Compatibilidad y exportación
- [ ] Un JSON previo a esta iteración se importa sin cambios ni pérdida.
- [ ] Un JSON nuevo se exporta e importa conservando IDs y relaciones.
- [ ] Importación inválida no altera la exploración actual.
- [ ] Markdown presenta las relaciones e interpretaciones con trazabilidad.
- [ ] La suite de regresión anterior sigue pasando.

### Pruebas y reporte
- [ ] Pruebas unitarias/estructurales de contratos y validadores.
- [ ] Pruebas de migración con respaldo JSON anterior.
- [ ] Prueba manual en navegador: creación, edición, archivado, recarga y exportación/importación.
- [ ] Verificar consola y responsive.
- [ ] Reportar cada prueba como PASS / FAIL / BLOCKED / NOT TESTED. No afirmar E2E si no se ejecutó navegador real.

## 11. Fuera de alcance por ahora

- Colaboración simultánea entre participantes o almacenamiento central.
- Inteligencia artificial que proponga o valide automáticamente relaciones.
- Inferencia causal automática.
- Relaciones recursivas entre relaciones e interpretaciones emergentes.
- Cambios obligatorios a las cinco etapas pedagógicas.
- Migración masiva de conexiones binarias antiguas a relaciones colectivas.
- Rediseño completo del mapa o del lenguaje visual.

## 12. Pregunta de diseño para la implementación visual

¿Dónde iniciar la creación? La opción recomendada es permitir ambas entradas:
- Desde «Mi exploración»: crear una relación seleccionando cualquier registro disponible.
- Desde el detalle de un registro: «Relacionar con…», abriendo el mismo constructor con ese elemento preseleccionado.

Ambas entradas deben usar el mismo constructor y las mismas reglas de validación.
