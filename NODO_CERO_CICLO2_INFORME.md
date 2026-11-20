# NODO CERO — Ciclo 2: entregables y liberación

## Línea base
- Repositorio: `0Wenn0/nodo-cero-wenn.ai`
- Rama: `main`
- Aplicación: https://0wenn0.github.io/nodo-cero-wenn.ai/
- Archivo fuente auditado: `index.html`
- SHA del blob recuperado de `main`: `af3da2314a11cb0304ae4a27d6602db17379a84f`
- Tamaño: 220,943 caracteres UTF-8 (contenido entregado por GitHub Contents API).
- Documentación anterior: Informe Ciclo 1, SHA `56f3477aa70e53df14614fb541c35e49146c16e8`.
- Suite Ciclo 1: `tests/nodo-cero-ciclo1.test.js`, SHA `894a36bcde03f676b75b2ac10c14c175669e7e78`.

## Alcance de Ciclo 2
Se inspeccionó la versión vigente antes de modificarla. La aplicación ya contiene el recorrido de cinco etapas, siete territorios, modelo de registros, trazabilidad de necesidades/posibilidades/oportunidades, ficha Markdown, exportación PNG, respaldo JSON, persistencia local y recuperación. No se sustituyó el HTML ni se reescribió ninguna funcionalidad ya existente.

## Cambios de este ciclo
1. README con propósito, recorrido, territorios, entregables, privacidad, arquitectura, uso y pruebas.
2. Suite estructural reproducible del Ciclo 2.
3. Checklist de liberación para la revisión manual y despliegue.
4. Este informe de alcance y límites.

## Verificaciones de código realizadas durante la inspección
- Canvas principal único.
- Siete territorios y cinco botones de etapa.
- Funciones de captura estructurada, creación de posibilidades y oportunidades.
- Validador de integridad y relaciones.
- Ficha Markdown con trazabilidad, autoría y escape de contenido.
- Exportación PNG mediante Canvas.
- Persistencia local, recuperación y respaldo JSON.
- Confirmación y respaldo previo antes de reemplazar exploraciones.
- Alerta persistente ante errores de guardado.
- Guía reabrible y recuperación del estado previo.
- Adaptación del Canvas al tamaño de ventana.

Estas comprobaciones son inspección de código y estructura. No demuestran que las interacciones funcionen visualmente en todos los navegadores.

## Pruebas
La suite nueva contiene 32 verificaciones estáticas/estructurales y se entrega para ejecución local con Node.js:
`node tests/nodo-cero-ciclo2.test.js`

**Resultado en esta sesión:** 32/32 PASS al ejecutar el contenido de la suite en un harness JavaScript V8 con el HTML recuperado de `main`. La suite de regresión del Ciclo 1 también pasó 26/26 en el mismo harness. Esto valida las aserciones y la estructura del HTML inspeccionado; no equivale a ejecutar el comando Node.js nativo en un clon local. La ejecución nativa queda **NOT TESTED**.

## Limitaciones
- No se ejecutó Chrome/Edge ni una prueba E2E.
- No se verificó la descarga real de Markdown/PNG/JSON en un navegador durante este ciclo.
- No se confirmó el despliegue de GitHub Pages después de las nuevas modificaciones de documentación.
- La aplicación depende de Tailwind CDN y Google Fonts para parte de su presentación.
- El ZIP del repositorio se ofrece mediante el archivo de GitHub de la rama `main`; no se generó un ZIP independiente en esta sesión.

## Dictamen
**CICLO 2 — DOCUMENTACIÓN Y SUITE PREPARADAS; LIBERACIÓN PENDIENTE DE EJECUCIÓN LOCAL Y VALIDACIÓN MANUAL.**

No se modificó `index.html` porque la inspección de la versión vigente confirmó que las capacidades incluidas en el alcance ya estaban implementadas. Se evita introducir cambios de producto sin un defecto demostrado. La aprobación definitiva corresponde al prompt final de validación, después de ejecutar la suite y completar el checklist en navegador.
