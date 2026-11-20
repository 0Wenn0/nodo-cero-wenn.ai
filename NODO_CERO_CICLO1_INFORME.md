# NODO CERO — Ciclo 1: Estabilidad y recuperación

## Línea base y modificación
- Repositorio: `0Wenn0/nodo-cero-wenn.ai`
- Rama: `main`
- Archivo fuente: `index.html`
- SHA anterior: `306d476d7ad01b69ff57184929da6f7441646779`
- Commit del ciclo: `fb891e2e40e916b89b504a186d25b50a816ec01d`
- SHA actualizado del HTML tras ajustes de UX: `af3da2314a11cb0304ae4a27d6602db17379a84f`
- Suite QA: `tests/nodo-cero-ciclo1.test.js`, SHA `894a36bcde03f676b75b2ac10c14c175669e7e78`
- Commit más reciente de la suite: `4e25dce39f14ba60fc828841c2610f66420adbeb`
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
- Suite reproducible ejecutada sobre el HTML remoto mediante el motor JavaScript disponible en la sesión: **26/26 PASS**.
- Verificación adicional de referencias DOM: **29 listeners directos; 0 IDs inexistentes**.
- Parseo del script inline mediante el motor JavaScript V8 disponible en la sesión: **1/1 PASS**.
- Simulación aislada de las funciones reales de normalización, restauración y guardado: **4/4 PASS** (respaldo válido, JSON malformado, protección contra sobrescritura y rollback ante fallo de integridad).
- SHA remoto verificado después del commit: **PASS**.

## Suite reproducible
Archivo: `tests/nodo-cero-ciclo1.test.js`

Ejecutar desde la raíz del repositorio con Node.js:
```bash
node tests/nodo-cero-ciclo1.test.js
```
La suite valida estructura, presencia de controles, colecciones I1, orden de restauración, protección ante respaldo inválido, listeners DOM y sintaxis de scripts inline.

## Ajustes de UX posteriores a la validación manual de la usuaria

La usuaria ejecutó en navegador pruebas manuales de respaldo válido, cinco variantes de respaldo inválido y fallos de escritura por `QuotaExceededError`. Reportó recuperación íntegra de las 12 colecciones, IDs y relaciones, conservación del guardado local ante importaciones inválidas y continuidad de uso con fallos de escritura. La ruta del selector de archivos del sistema no se ejercitó; se inyectó el contenido descargado en el mismo campo de importación. La lectura de `localStorage` fallida desde el arranque no se pudo inyectar desde esa sesión.

A partir de esos resultados se implementaron tres ajustes:
1. Banner persistente de error de guardado, visible por encima de los paneles, con cierre manual; el texto de la Bitácora cambia a un aviso explícito de que los cambios están solo en memoria y vuelve al mensaje normal tras un guardado exitoso.
2. Antes de sustituir una exploración con registros, se valida el archivo y se solicita confirmación. Aceptar descarga primero un respaldo de la exploración actual y continúa; cancelar conserva la exploración actual. Si no puede generarse el respaldo previo, la importación se cancela.
3. Todos los listeners globales de `input` y `change` excluyen `input[type=file]`, evitando que seleccionar un archivo marque la exploración como modificada.

Suite ampliada: **26/26 PASS** en ejecución del script con harness JavaScript. La prueba estática verifica la presencia y orden de estas protecciones; no sustituye una nueva prueba manual en navegador del diálogo de confirmación, descarga previa y banner persistente.

## Límites de validación
- **No ejecutado en navegador real en esta sesión.** La corrección requiere validar manualmente el comportamiento ante un respaldo local deliberadamente inválido, un respaldo válido importado y almacenamiento bloqueado/cuota excedida.
- No se certifica descarga efectiva de JSON en navegador ni round-trip real de exportación/importación en esta sesión.
- La prueba de integridad semántica de todas las relaciones del modelo I1 depende de datos de prueba completos; la suite estática no sustituye esa prueba.
- No se declara E2E de navegador ni se infiere funcionamiento de GitHub Pages a partir del commit.

## Dictamen
**PASS CON VALIDACIÓN MANUAL REPORTADA POR LA USUARIA; REQUIERE CONFIRMAR LOS ÚLTIMOS AJUSTES DE UX EN NAVEGADOR.**

El arranque, el código de bienvenida, el modelo de persistencia, el control de referencias DOM y la sintaxis pasan las verificaciones estáticas ejecutadas. Se corrigió un riesgo crítico de posible pérdida del respaldo local. La usuaria reportó como satisfactorias las pruebas de recuperación JSON, rechazo de respaldos inválidos y continuidad ante fallos de escritura. Los últimos ajustes de banner y confirmación de reemplazo requieren una pasada manual breve antes del cierre definitivo.
