#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.resolve(process.argv[2]||path.join(__dirname,'../index.html')),'utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>!/\bsrc\s*=|\btype\s*=\s*["']module["']/.test(m[1]));
const js=scripts.map(x=>x[2]).join('\n'),checks=[];
function check(name,fn){try{fn();checks.push({name,result:'PASS'});}catch(e){checks.push({name,result:'FAIL',error:e.message});}}
check('Constructor emergente visible dentro de CONECTAR',()=>['emergentInterpretationBuilder','emergentSourceCandidates','emergentRelationCandidates','emergentInterpretationText','emergentEpistemicStatus','emergentInterpretationsList'].forEach(id=>assert.ok(html.includes('id="'+id+'"'),id)));
check('Se distingue Inferencia de Hipótesis por contrastar',()=>assert.ok(html.includes('Inferencia · lectura derivada de las fuentes')&&html.includes('Hipótesis · explicación tentativa por contrastar')));
check('La selección combina fuentes directas y relaciones colectivas',()=>assert.ok(js.includes('sourceParticipantRefs:refs')&&js.includes('sourceRelationIds:[...emergentSelectedRelations]')));
check('El modelo exige dos fuentes distintas',()=>assert.ok(js.includes('sourceKeys.size<2')));
check('Las relaciones de origen deben estar activas',()=>assert.ok(js.includes("r.id===id && r.status!=='archivado'")));
check('La interpretación exige estado epistémico permitido',()=>assert.ok(js.includes('EMERGENT_EPISTEMIC_STATUSES.has(epistemicStatus)')));
check('Texto de interpretación limitado a 2000 caracteres',()=>assert.ok(js.includes('validateRecordText(data.text,2000)')));
check('Edición conserva ID y registra snapshot completo',()=>assert.ok(js.includes("reason:'Edición de interpretación emergente'")&&js.includes('record.history.push(version)')));
check('La edición valida fuentes y estado',()=>assert.ok(js.includes('function updateEmergentInterpretation')&&js.includes('validateEmergentSourceRefs(refs,record.id)')));
check('Restauración recupera fuentes, relaciones y estado',()=>assert.ok(js.includes("record.recordType==='interpretacion_emergente'")&&js.includes('record.sourceRelationIds=[...snapshot.sourceRelationIds]')));
check('Historial y archivado usan la colección emergente',()=>assert.ok(js.includes("interpretacion_emergente:'emergentInterpretations'")));
check('La lista expone edición, historial y archivado',()=>assert.ok(js.includes('Editar lectura')&&js.includes("openRecordAction(record,'interpretación emergente',mode,card)")));
check('La vista identifica fuentes directas y puentes',()=>assert.ok(js.includes("source.textContent='Fuentes: '+[...direct,...rels].join(' + ')")));
check('El render se actualiza con la exploración',()=>assert.ok(js.includes('renderEmergentInterpretationBuilder();')));
check('Los controles están conectados a sus acciones',()=>assert.ok(js.includes("btnCreateEmergentInterpretation')?.addEventListener('click',createEmergentInterpretationFromUI")));
check('Las interpretaciones emergentes pueden ser fuentes tipadas',()=>assert.ok(js.includes("interpretacion_emergente:'emergentInterpretations'")&&js.includes("add('interpretacion_emergente',ex.emergentInterpretations")));
check('La creación y edición bloquean dependencias circulares',()=>assert.ok(js.includes('function validateEmergentSourceRefs')&&js.includes('reaches(ref.entityId,currentId)')));
check('La integridad global detecta ciclos importados',()=>assert.ok(js.includes('const emergentVisit=new Set(),emergentStack=new Set()')&&js.includes('Se detectó un ciclo entre interpretaciones emergentes.')));
check('El editor impide autorreferencia directa',()=>assert.ok(js.includes("x.entityType==='interpretacion_emergente'&&x.entityId===record.id")));
const fails=checks.filter(x=>x.result==='FAIL');console.log(checks.map(x=>x.result+' '+x.name+(x.error?' — '+x.error:'')).join('\n'));console.log('\n'+(checks.length-fails.length)+'/'+checks.length+' PASS');if(fails.length)process.exit(1);
