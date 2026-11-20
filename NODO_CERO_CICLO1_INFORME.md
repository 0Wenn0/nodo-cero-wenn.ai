# NODO CERO — Ciclo 1: Estabilidad y recuperación

## Línea base y modificación
- Repositorio: `0Wenn0/nodo-cero-wenn.ai`
- Rama: `main`
- Archivo fuente: `index.html`
- SHA anterior: `306d476d7ad01b69ff57184929da6f7441646779`
- Commit del ciclo: `fb891e2e40e916b89b504a186d25b50a816ec01d`
- SHA nuevo: `fcc0fee65b4c03cc75ec0cf1c06ac51f1d0306ea`
- El histórico previo se conserva mediante commits; no se modificó ni eliminó el almacenamiento local de la usuaria.

## Hallazgo y corrección
Se identificó un riesgo crítico en recuperación: si el JSON local existía pero era inválido o incompatible, `restoreLocalExploration()` devolvía `false`; posteriormente el arranque ejecutaba `persistExplorationNow()` y podía sobrescribir el respaldo que no se pudo leer con el estado inicial vacío.

Se aplicó una corrección mínima:
1. La recuperación conserva el estado previo y revierte el estado parcial si la validación falla.
2. Un respaldo local inválido activa `localRestoreBlocked`.
3. Mientras exista ese bloqueo, el guardado automático no sobrescribe el respaldo original.
4. Una importación JSON válida libera el bloqueo y permite persistir el estado recuperado.
5. No se borran datos locales ni se incorpora almacenamiento central.

## Pruebas ejecutadas en esta sesión
- Comprobaciones estáticas sobre el archivo remoto recuperado: **19/19 PASS**.
- Verificación adicional de referencias DOM: **29 listeners directos; 0 IDs inexistentes**.
- Parseo del script inline mediante el motor JavaScript V8 disponible en la sesión: **1/1 PASS**.
- SHA remoto verificado después del commit: **PASS**.

## Suite reproducible
Archivo: `tests/nodo-cero-ciclo1.test.js`

Ejecutar desde la raíz del repositorio con Node.js:
```bash
node tests/nodo-cero-ciclo1.test.js
```
La suite valida estructura, presencia de controles, colecciones I1, orden de restauración, protección ante respaldo inválido, listeners DOM y sintaxis de scripts inline.

## Límites de validación
- **No ejecutado en navegador real en esta sesión.** La corrección requiere validar manualmente el comportamiento ante un respaldo local deliberadamente inválido, un respaldo válido importado y almacenamiento bloqueado/cuota excedida.
- No se certifica descarga efectiva de JSON en navegador ni round-trip real de exportación/importación en esta sesión.
- La prueba de integridad semántica de todas las relaciones del modelo I1 depende de datos de prueba completos; la suite estática no sustituye esa prueba.
- No se declara E2E de navegador ni se infiere funcionamiento de GitHub Pages a partir del commit.

## Dictamen
**PASS PARCIAL / NO CERRAR CICLO 1 TODAVÍA.**

El arranque, el código de bienvenida, el modelo de persistencia, el control de referencias DOM y la sintaxis pasan las verificaciones estáticas ejecutadas. Se corrigió un riesgo crítico de posible pérdida del respaldo local. La validación de navegador real y el round-trip JSON siguen pendientes, por lo que no se declara cierre total del ciclo.
