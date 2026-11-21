# NODO CERO

**Explorador pedagógico de oportunidades para hackatones.**

> No necesitas llegar con una idea. Solo necesitas empezar con una pregunta.

NODO CERO acompaña a las participantes desde la observación de situaciones humanas hasta la formulación de preguntas de oportunidad. La experiencia utiliza un archipiélago interactivo como metáfora de exploración: cada territorio abre perspectivas y las conexiones permiten relacionar hallazgos.

## Aplicación

- **Versión publicada:** https://0wenn0.github.io/nodo-cero-wenn.ai/
- **Repositorio:** https://github.com/0Wenn0/nodo-cero-wenn.ai
- **Rama de publicación:** `main`
- **Archivo de aplicación:** `index.html`

## Recorrido pedagógico

1. **OBSERVAR:** registrar situaciones, contexto, evidencias, interpretaciones e hipótesis.
2. **IDENTIFICAR:** formular necesidades relacionadas con hallazgos e interpretaciones.
3. **CONECTAR:** construir relaciones argumentadas entre hallazgos y territorios.
4. **IMAGINAR:** registrar posibilidades vinculadas con hallazgos y necesidades.
5. **PROYECTAR:** formular oportunidades mediante preguntas «¿Cómo podríamos...?», con trazabilidad a sus fuentes.

Las etapas orientan la exploración. Sus criterios de integridad no califican la calidad de las ideas.

## Territorios

- Educación y Aprendizaje
- Salud y Bienestar
- Comunidad y Vínculos
- Oportunidades y Trabajo
- Entorno y Ciudad
- Cultura y Expresión
- Tecnología y Acceso

Tecnología y Acceso también funciona como dimensión transversal para reconocer cómo las herramientas y condiciones tecnológicas intervienen en distintas situaciones.

## Entregables de cada exploración

- **Ficha de Exploración (.md):** síntesis editable de la pregunta de oportunidad, problema o necesidad, comunidad, cambio deseado, investigación pendiente, autoría y rastro de exploración.
- **Constelación (.png):** representación visual del mapa explorado y sus conexiones.
- **Respaldo (.json):** copia recuperable de la exploración completa, incluidos registros, IDs, relaciones e historial.

El Markdown y el PNG son entregables de presentación. El JSON es el respaldo portable para recuperar la exploración.

## Persistencia y privacidad

- La aplicación guarda automáticamente en el almacenamiento local del navegador.
- La recuperación automática corresponde al mismo perfil y origen del navegador.
- Para continuar en otro equipo o navegador, descarga un respaldo JSON y recupéralo allí.
- La importación valida el archivo antes de aplicarlo y solicita confirmación si reemplazará una exploración con registros; ofrece descargar primero el respaldo actual.
- Si el respaldo local es inválido, el guardado queda protegido para evitar sobrescribirlo automáticamente.
- Las exploraciones individuales no se envían a un servicio central ni deben subirse al repositorio público.

**Importante:** conserva tu archivo JSON en un lugar privado y seguro. No compartas respaldos que contengan información personal o sensible.

## Uso

1. Abre la [aplicación publicada](https://0wenn0.github.io/nodo-cero-wenn.ai/).
2. Consulta la guía inicial o vuelve a abrirla desde «¿Cómo se usa?».
3. Explora los territorios y registra hallazgos, evidencias e interpretaciones.
4. Relaciona necesidades, conexiones y posibilidades.
5. Formula una pregunta de oportunidad.
6. Descarga la Ficha Markdown, la Constelación PNG y un respaldo JSON.

## Arquitectura técnica

- Aplicación web autocontenida en `index.html`.
- Interfaz y estilos integrados en el HTML.
- Canvas 2D para el archipiélago interactivo.
- JavaScript integrado para estado, navegación, modelo de registros, relaciones, persistencia y exportaciones.
- Tailwind CSS y Google Fonts se cargan desde CDN; por ello, la experiencia visual completa depende de conexión a internet y disponibilidad de esos recursos.
- Persistencia local mediante `localStorage`; no hay backend ni almacenamiento compartido entre participantes.

## Desarrollo y pruebas

Desde la raíz del repositorio, con Node.js:

```bash
node tests/nodo-cero-ciclo1.test.js
node tests/nodo-cero-ciclo2.test.js
node tests/nodo-cero-relaciones-colectivas.test.js
```

Las suites verifican estructura, contratos y condiciones estáticas del código. No sustituyen pruebas funcionales manuales en Chrome o Edge ni una prueba E2E real.

Consulta:
- [Informe del Ciclo 1](NODO_CERO_CICLO1_INFORME.md)
- [Informe del Ciclo 2](NODO_CERO_CICLO2_INFORME.md)
- [Checklist de liberación](NODO_CERO_RELEASE_CHECKLIST.md)

## Relaciones colectivas e interpretaciones emergentes

La arquitectura contempla relaciones entre dos o más registros y lecturas emergentes trazables. La implementación del modelo de datos y persistencia se encuentra en curso; los constructores de interfaz y las exportaciones específicas se liberarán en subiteraciones posteriores. Consulta la [especificación de arquitectura](NODO_CERO_RELACIONES_COLECTIVAS_ESPECIFICACION.md).

## Publicación

GitHub Pages publica desde la rama `main`. Un commit en `main` no implica que el despliegue haya terminado: comprueba la aplicación publicada después de cada liberación.

## Principios del producto

NODO CERO acompaña a observar, interpretar, relacionar y formular oportunidades. No prescribe una solución ni convierte la exploración en una evaluación de desempeño. La participante conserva la autoría de sus hallazgos y decisiones.
