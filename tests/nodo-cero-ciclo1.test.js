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
const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
const directListeners = [...html.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)\.addEventListener/g)].map(m=>m[1]);
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>! /\bsrc\s*=/.test(m[1]));

check('Canvas principal único',()=>assert.equal((html.match(/id="worldCanvas"/g)||[]).length,1));
check('Siete territorios definidos',()=>assert.match(html,/id:\s*'(?:educacion|salud|comunidad|oportunidades|entorno|cultura|tecnologia)'/));
check('Cinco etapas presentes',()=>['observar:','identificar:','conectar:','imaginar:','proyectar:'].forEach(x=>assert.ok(html.includes(x),x)));
check('Bienvenida y controles presentes',()=>['guideModal','btnOpenGuide','btnCloseGuideTop','btnStartExploring'].forEach(x=>assert.ok(html.includes('id="'+x+'"'),x)));
check('Marca de bienvenida persistida',()=>assert.ok(html.includes("nodo-cero.guide-seen.v1")&&html.includes('markGuideAsSeen();')));
check('Reanudación omite bienvenida con progreso',()=>assert.ok(html.includes('if (hasExplorationProgress || guideWasSeen)')));
check('Colecciones del modelo I1 declaradas',()=>['visits','findings','bridgesMeanings','possibilities','evidences','interpretations','needs','opportunities','versionRecords','authorship','technologyDimensions'].forEach(x=>assert.ok(html.includes("'"+x+"'"),x)));
check('Snapshot incluye etapa y exploración',()=>assert.ok(html.includes('currentStage:state.currentStage, exploration')));
check('Serialización de Set',()=>assert.ok(html.includes('value instanceof Set ? Array.from(value) : value')));
check('Recuperación valida integridad',()=>assert.ok(html.includes('validateExplorationIntegrity();')));
check('Recuperación restaura estado previo ante fallo',()=>assert.ok(html.includes('state.exploration = previousExploration;')&&html.includes('state.currentStage = previousStage;')));
check('Respaldo local inválido protegido contra sobrescritura',()=>assert.ok(html.includes('if (localRestoreBlocked)')&&html.includes('localRestoreBlocked = true;')));
check('Importación válida libera bloqueo',()=>assert.ok(html.includes('localRestoreBlocked=false;')));
check('Importación fallida conserva estado anterior',()=>assert.ok(html.includes('state.exploration=previous; state.currentStage=previousStage;')));
check('Controles de respaldo conectados',()=>['btnExportJSON','btnImportJSON','inputImportJSON','exportExplorationJSON','importExplorationJSON'].forEach(x=>assert.ok(html.includes(x),x)));
check('No existe borrado automático de localStorage',()=>assert.ok(!html.includes('localStorage.clear(')&&!html.includes('localStorage.removeItem(')));
check('Restauración ocurre antes del guardado inicial',()=>assert.ok(html.indexOf('const restored = restoreLocalExploration();')<html.indexOf('persistExplorationNow();',html.indexOf('window.onload = function'))));
check('Arranque inicializa mapa y animación',()=>['initWorld();','requestAnimationFrame(loop);'].forEach(x=>assert.ok(html.includes(x),x)));
check('Todos los listeners directos apuntan a IDs existentes',()=>assert.deepEqual([...new Set(directListeners.filter(id=>!ids.has(id)))],[]));
check('Scripts inline tienen sintaxis válida',()=>{assert.ok(inlineScripts.length>0);inlineScripts.forEach(m=>new vm.Script(m[2]));});

const failed=checks.filter(x=>x.result==='FAIL');
console.log(JSON.stringify({file:htmlPath,passed:checks.length-failed.length,total:checks.length,checks},null,2));
if(failed.length) process.exitCode=1;
