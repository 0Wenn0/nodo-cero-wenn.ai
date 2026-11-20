#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const htmlPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const html = fs.readFileSync(htmlPath, 'utf8');
const checks = [];
function check(name, fn) {
  try { fn(); checks.push({name, result:'PASS'}); }
  catch (error) { checks.push({name, result:'FAIL', error:error.message}); }
}
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
const idSet = new Set(ids);
const directListeners = [...html.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)\.addEventListener/g)].map(m=>m[1]);
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>! /\bsrc\s*=/.test(m[1]));
const section = (start, end) => { const a=html.indexOf(start); const b=end ? html.indexOf(end,a+start.length) : html.length; return a<0 ? '' : html.slice(a,b<0?html.length:b); };

check('Lienzo Canvas principal único',()=>assert.equal((html.match(/id="worldCanvas"/g)||[]).length,1));
check('Siete territorios definidos',()=>{const m=html.match(/const TERRITORIES = \[([\s\S]*?)\n\s*\];/);assert.ok(m,'TERRITORIES');assert.equal((m[1].match(/\bid:\s*'/g)||[]).length,7);});
check('Los siete nombres de territorio están presentes',()=>['Educación y Aprendizaje','Salud y Bienestar','Comunidad y Vínculos','Oportunidades y Trabajo','Entorno y Ciudad','Cultura y Expresión','Tecnología y Acceso'].forEach(x=>assert.ok(html.includes(x),x)));
check('Cinco etapas declaradas',()=>['observar:','identificar:','conectar:','imaginar:','proyectar:'].forEach(x=>assert.ok(html.includes(x),x)));
check('Cinco controles de etapa',()=>assert.equal((html.match(/class="stage-btn/g)||[]).length,5));
check('Modelo de registros I1 presente',()=>['visits','findings','bridgesMeanings','possibilities','evidences','interpretations','needs','opportunities','versionRecords','authorship','technologyDimensions'].forEach(x=>assert.ok(html.includes("'"+x+"'")||html.includes('"'+x+'"'),x)));
check('OBSERVAR separa observación, contexto, evidencia, interpretación e hipótesis',()=>['i3ObservationText','i3ContextText','i3EvidenceType','i3EvidenceText','i3InterpretationText','i3HypothesisText'].forEach(x=>assert.ok(html.includes('id="'+x+'"'),x)));
check('IDENTIFICAR crea necesidades trazables',()=>assert.ok(html.includes('function createNeed')&&html.includes('hallazgoId')));
check('CONECTAR ofrece constructor de relaciones',()=>assert.ok(html.includes('function openConnectionBuilder')&&html.includes('connectionBuilder')));
check('IMAGINAR exige hallazgo de origen',()=>assert.ok(html.includes('function createPossibility')&&html.includes('Vincula al menos un hallazgo activo')));
check('PROYECTAR exige trazabilidad de oportunidad',()=>assert.ok(html.includes('function createOpportunity')&&html.includes('La oportunidad debe vincularse con hallazgos activos existentes')));
check('Oportunidades usan identificadores estables',()=>assert.ok(html.includes('selectedOpportunityId')&&html.includes('sourceFindingIds')));
check('Validador global comprueba integridad',()=>assert.ok(html.includes('function validateExplorationIntegrity')&&html.includes('validateUniqueIds')));
check('Ficha de Exploración y controles de descarga',()=>['sheetModal','btnDownloadMarkdown','btnCopySheet','buildMarkdownReport'].forEach(x=>assert.ok(html.includes(x),x)));
check('Markdown incluye secciones de síntesis',()=>{const m=section('function buildMarkdownReport','function exportConstellationPNG');['Pregunta de Oportunidad','Problema o necesidad identificada','Persona o comunidad involucrada','Cambio deseado y posibilidades imaginadas','Lo que todavía necesitamos investigar','Trazabilidad de la oportunidad'].forEach(x=>assert.ok(m.includes(x),x));});
check('Markdown escapa texto de participantes',()=>assert.ok(html.includes('function escapeMarkdownHTML')&&html.includes(".replace(/</g, '&lt;')")));
check('Ficha incluye rastro y autoría',()=>{const m=section('function buildMarkdownReport','function exportConstellationPNG');assert.ok(m.includes('Autoría de la exploración')&&m.includes('Rastro en Constelación'));});
check('Exportación PNG usa Canvas y nombre reconocible',()=>{const m=section('function exportConstellationPNG','// =========================================================================');assert.ok(m.includes('canvas.toDataURL(\'image/png\')')&&m.includes('nodo-cero-constelacion.png'));});
check('Modo Constelación tiene entrada y salida',()=>['btnConstellationMode','btnExitConstellation','constellationBar'].forEach(x=>assert.ok(html.includes('id="'+x+'"'),x)));
check('Persistencia local usa clave versionada',()=>assert.ok(html.includes("nodo-cero.exploration.v1")&&html.includes('localStorage.setItem')));
check('Recuperación ocurre antes del guardado inicial',()=>assert.ok(html.indexOf('const restored = restoreLocalExploration();')<html.indexOf('persistExplorationNow();',html.indexOf('window.onload = function')));
check('Respaldo JSON serializa Sets',()=>assert.ok(html.includes('value instanceof Set ? Array.from(value) : value')));
check('Importación normaliza y valida antes de aplicar',()=>{const m=section('function importExplorationJSON','function ');assert.ok(m.includes('normalizeImportedSnapshot')&&m.includes('validateExplorationIntegrity')&&m.includes('window.confirm'));});
check('Importación ofrece respaldo previo',()=>{const m=section('function importExplorationJSON','function ');assert.ok(m.includes('exportExplorationJSON()')&&m.includes('Importación cancelada'));});
check('Respaldo local inválido evita sobrescritura',()=>assert.ok(html.includes('if (localRestoreBlocked)')&&html.includes('localRestoreBlocked = true;')));
check('Error de persistencia tiene alerta accesible',()=>assert.ok(html.includes('id="persistenceAlert"')&&html.includes('aria-live="assertive"')));
check('Bienvenida se puede reabrir y conserva el estado previo',()=>assert.ok(html.includes('guideReturnState')&&html.includes('btnOpenGuide')&&html.includes('btnStartExploring')));
check('Canvas se adapta al tamaño de ventana',()=>assert.ok(html.includes('function resizeCanvas')&&html.includes("window.addEventListener('resize', resizeCanvas)")));
check('Controles interactivos tienen etiquetas accesibles básicas',()=>assert.ok(html.includes('aria-label="Indicador de recorrido"')&&html.includes('role="status"')&&html.includes('aria-live="polite"')));
check('Listeners directos apuntan a IDs existentes',()=>assert.deepEqual([...new Set(directListeners.filter(id=>!idSet.has(id)))],[]));
check('No hay IDs HTML duplicados',()=>assert.deepEqual([...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],[]));
check('JavaScript inline tiene sintaxis válida',()=>{assert.ok(inlineScripts.length>0);inlineScripts.forEach(m=>new vm.Script(m[2]));});

const failed=checks.filter(x=>x.result==='FAIL');
console.log(JSON.stringify({file:htmlPath,passed:checks.length-failed.length,total:checks.length,checks},null,2));
if(failed.length) process.exitCode=1;
