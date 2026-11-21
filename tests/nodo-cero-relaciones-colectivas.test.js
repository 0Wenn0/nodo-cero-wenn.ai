#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const htmlPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const html = fs.readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>! /\bsrc\s*=|\btype\s*=\s*["']module["']/.test(m[1]));
const checks=[];
function check(name,fn){try{fn();checks.push({name,result:'PASS'});}catch(error){checks.push({name,result:'FAIL',error:error.message});}}
const section=(start,end)=>{const a=html.indexOf(start),b=end?html.indexOf(end,a+start.length):html.length;return a<0?'':html.slice(a,b<0?html.length:b);};

check('Colecciones nuevas inicializadas en exploración',()=>['collectiveRelations: []','emergentInterpretations: []'].forEach(x=>assert.ok(html.includes(x),x)));
check('Respaldo antiguo normaliza colecciones nuevas sin exigir migración',()=>{const m=section('function normalizeImportedSnapshot','function persistExplorationNow');assert.ok(m.includes("'collectiveRelations'")&&m.includes("'emergentInterpretations'")&&m.includes('[1].includes(raw.backupSchemaVersion)'));});
check('Mutaciones atómicas incluyen ambas colecciones',()=>{const m=section('function atomicRecordMutation','function createStableId');assert.ok(m.includes("'collectiveRelations'")&&m.includes("'emergentInterpretations'"));});
check('Tipos y categorías del catálogo están declarados',()=>['patron','tension','causal_hipotetica','complementaria','contradiccion','analogia','otra'].forEach(x=>assert.ok(html.includes("'"+x+"'"),x)));
check('Referencias tipadas admiten los tipos definidos',()=>['hallazgo','evidencia','interpretacion','necesidad','posibilidad','oportunidad'].forEach(x=>assert.ok(html.includes(x+':'),x)));
check('Resolución de fuentes comprueba existencia y archivado',()=>{const m=section('function resolveCollectiveParticipant','function validateExplorationIntegrity');assert.ok(m.includes('TERRITORIES.find')&&m.includes('target.status===\'archivado\''));});
check('Relación colectiva requiere dos o más fuentes',()=>{const m=section('function createCollectiveRelation','function createEmergentInterpretation');assert.ok(m.includes('participantRefs.length<2')&&m.includes('validateCollectiveParticipantRefs'));});
check('Relación colectiva valida categoría y explicación',()=>{const m=section('function createCollectiveRelation','function createEmergentInterpretation');assert.ok(m.includes('COLLECTIVE_RELATION_TYPES.has')&&m.includes('validateRecordText(meaning,1000)'));});
check('Interpretación emergente distingue inferencia e hipótesis',()=>{const m=section('function createEmergentInterpretation','function createSemanticConnection');assert.ok(m.includes('EMERGENT_EPISTEMIC_STATUSES.has')&&m.includes('sourceRelationIds')&&m.includes('sourceParticipantRefs'));});
check('Interpretación emergente exige dos fuentes distintas',()=>{const m=section('function createEmergentInterpretation','function createSemanticConnection');assert.ok(m.includes('sourceKeys.size<2'));});
check('Validador global comprueba cardinalidad, fuentes y duplicados',()=>{const m=section('const collectiveKeys=new Set()','for (const finding of ex.findings)');['participantRefs.length<2','validateCollectiveParticipantRefs','duplicateKey','sourceKeys.size<2','relation.status===\'archivado\''].forEach(x=>assert.ok(m.includes(x),x));});
check('Ambas colecciones participan en IDs e historial global',()=>{const m=section('function validateExplorationIntegrity','function archiveRecord');assert.ok(m.includes('ex.collectiveRelations || []')&&m.includes('ex.emergentInterpretations || []'));});
check('Inicialización preserva e incorpora historiales',()=>{const m=section('function initializeRecordLayer','function renderTerritoryPanel');assert.ok(m.includes("ensureRecordShape(item,'relacion_colectiva')")&&m.includes("ensureRecordShape(item,'interpretacion_emergente')")&&m.includes('...ex.collectiveRelations, ...ex.emergentInterpretations'));});
check('Archivado en cascada conserva registros y marca dependencias',()=>{const m=section('function archiveRecord','function validateUniqueIds');assert.ok(m.includes('relation.status=\'archivado\'')&&m.includes('emergent.status=\'archivado\'')&&m.includes('archivedAt=now'));});
check('Contador de respaldo incluye nuevas colecciones',()=>{const m=section('function countExplorationRecords','function describeExplorationRecords');assert.ok(m.includes("'collectiveRelations'")&&m.includes("'emergentInterpretations'"));});
check('Snapshot y exportación JSON serializan el estado completo',()=>assert.ok(html.includes('JSON.stringify(state.exploration')||html.includes('JSON.stringify(snapshot')));
check('No se modifican las conexiones binarias existentes',()=>assert.ok(html.includes('function createSemanticConnection')&&html.includes('state.exploration.bridgesMeanings.push(record)')));
check('JavaScript inline mantiene sintaxis válida',()=>{assert.ok(scripts.length>0);scripts.forEach(m=>new vm.Script(m[2]));});
check('No hay IDs HTML duplicados',()=>{const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);});

const failed=checks.filter(x=>x.result==='FAIL');
console.log(JSON.stringify({file:htmlPath,passed:checks.length-failed.length,total:checks.length,checks},null,2));
if(failed.length)process.exitCode=1;
