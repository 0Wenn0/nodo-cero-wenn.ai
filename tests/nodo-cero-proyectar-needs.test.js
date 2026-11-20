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
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>! /\bsrc\s*=/.test(m[1]));

check('Selector de necesidades tiene estado accesible',()=>assert.ok(html.includes('id="i7OpportunityNeedsStatus"')&&html.includes('aria-describedby="i7OpportunityHelp i7OpportunityNeedsStatus"')));
check('Necesidades elegibles se filtran por IDs de hallazgos seleccionados',()=>assert.ok(html.includes('activeNeeds.filter(n => selectedFindingIds.includes(n.hallazgoId))')));
check('El selector muestra opciones reales de necesidades elegibles',()=>assert.ok(html.includes('eligibleNeeds.forEach(n =>')&&html.includes('option.value = n.id')));
check('Estado vacío distingue falta de selección',()=>assert.ok(html.includes('Selecciona primero uno o más hallazgos')));
check('Estado vacío distingue ausencia de necesidades',()=>assert.ok(html.includes('Todavía no hay necesidades documentadas')));
check('Estado vacío explica necesidades no vinculadas y ruta a IDENTIFICAR',()=>assert.ok(html.includes('No hay necesidades vinculadas con los hallazgos seleccionados')&&html.includes('Registra una necesidad en IDENTIFICAR')));
check('El selector conserva solo selecciones válidas',()=>assert.ok(html.includes('option.selected = previousNeeds.has(n.id)')&&html.includes('eligibleNeeds.forEach')));
check('El registro sigue exigiendo al menos una necesidad',()=>assert.ok(html.includes('if (!needIds.length) throw new Error(\'Selecciona al menos una necesidad vinculada con los hallazgos elegidos.\')')));
check('La creación de oportunidad conserva validación de correspondencia',()=>assert.ok(html.includes('Cada necesidad debe existir y corresponder a uno de los hallazgos de origen.')));
check('No se crean necesidades ni relaciones automáticamente',()=>{const start=html.indexOf('function renderI7OpportunityBuilder');const end=html.indexOf('function saveI7Opportunity',start);const block=html.slice(start,end);assert.ok(!/createNeed\s*\(|addRelation\s*\(/.test(block));});
check('No hay IDs HTML duplicados',()=>assert.deepEqual([...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],[]));
check('JavaScript inline tiene sintaxis válida',()=>{assert.ok(inlineScripts.length>0);inlineScripts.forEach(m=>new vm.Script(m[2]));});

const failed=checks.filter(x=>x.result==='FAIL');
console.log(JSON.stringify({file:htmlPath,passed:checks.length-failed.length,total:checks.length,checks},null,2));
if(failed.length) process.exitCode=1;
