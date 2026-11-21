const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(process.env.NODO_CERO_URL||'http://127.0.0.1:4173/',{waitUntil:'load',timeout:60000});
  await page.waitForSelector('#emergentInterpretationBuilder',{timeout:20000});
  if(await page.locator('#guideModal').isVisible())await page.locator('#btnCloseGuideTop').click();
  await page.locator('#collectiveTypeFilter').selectOption('territorio');
  const territories=page.locator('#collectiveCandidates input[type=checkbox]');
  await territories.nth(0).check();await territories.nth(1).check();await territories.nth(2).check();
  await page.locator('#collectiveRelationMeaning').fill('Tres territorios muestran una condición compartida que merece explorarse en conjunto.');
  await page.locator('#btnCreateCollectiveRelation').click();
  await page.getByText('Relación colectiva registrada',{exact:true}).waitFor({timeout:10000});
  const direct=page.locator('#emergentSourceCandidates input[type=checkbox]');
  await direct.nth(0).check();await direct.nth(1).check();
  await page.locator('#emergentRelationCandidates input[type=checkbox]').first().check();
  await page.locator('#emergentInterpretationText').fill('La combinación sugiere que las condiciones territoriales pueden compartir barreras de acceso que requieren contraste.');
  await page.locator('#emergentEpistemicStatus').selectOption('hipotesis');
  await page.locator('#btnCreateEmergentInterpretation').click();
  const cards=page.locator('#emergentInterpretationsList article');
  await assert.equal(await cards.count(),1);
  await assert.ok((await cards.first().innerText()).includes('Hipótesis'));
  await cards.first().getByText('Editar lectura',{exact:true}).click();
  await cards.first().locator('.emergent-inline-editor textarea').fill('La hipótesis revisada propone explorar barreras compartidas entre territorios.');
  await cards.first().locator('.emergent-inline-editor select').selectOption('inferencia');
  await cards.first().locator('.emergent-inline-editor button').filter({hasText:'Guardar cambios'}).click();
  await page.getByText('Interpretación emergente actualizada.',{exact:true}).waitFor({timeout:10000});
  await page.reload({waitUntil:'load'});
  await page.waitForSelector('#emergentInterpretationsList article');
  // Una interpretación previa puede convertirse en fuente de una nueva lectura.
  const emergentSourceLabel=page.locator('#emergentSourceCandidates label').filter({hasText:'Interpretación emergente'}).first();
  await emergentSourceLabel.locator('input').check();
  const territorySourceLabel=page.locator('#emergentSourceCandidates label').filter({hasText:'Territorio'}).first();
  await territorySourceLabel.locator('input').check();
  await page.locator('#emergentInterpretationText').fill('Una segunda lectura amplía la inferencia anterior al incorporar otra perspectiva territorial.');
  await page.locator('#emergentEpistemicStatus').selectOption('inferencia');
  await page.locator('#btnCreateEmergentInterpretation').click();
  await assert.equal(await page.locator('#emergentInterpretationsList article').count(),2);
  // Intentar que la primera dependa de la segunda crearía un ciclo y debe rechazarse.
  const firstCard=page.locator('#emergentInterpretationsList article').first();
  await firstCard.getByText('Editar lectura',{exact:true}).click();
  const cycleSource=firstCard.locator('.emergent-inline-editor label').filter({hasText:'Interpretación emergente'}).last();
  await cycleSource.locator('input').check();
  await firstCard.locator('.emergent-inline-editor button').filter({hasText:'Guardar cambios'}).click();
  await assert.ok((await firstCard.locator('.emergent-inline-editor').innerText()).includes('ciclo'));
  await firstCard.locator('.emergent-inline-editor button').filter({hasText:'Cancelar'}).click();

  await page.waitForSelector('#emergentInterpretationsList article');
  const restored=page.locator('#emergentInterpretationsList article').first();
  await assert.ok((await restored.innerText()).includes('Inferencia'));
  await restored.getByText('Historial',{exact:true}).click();
  await page.getByText('Restaurar esta versión',{exact:true}).first().click();
  await page.getByText('Versión 1 restaurada',{exact:true}).waitFor({timeout:10000});
  await page.locator('#emergentInterpretationsList article').first().getByText('Archivar',{exact:true}).click();
  await page.locator('#btnConfirmRecordAction').click();
  await page.waitForFunction(()=>document.querySelectorAll('#emergentInterpretationsList article').length===0);
  assert.deepEqual(errors,[]);
  console.log('E2E PASS: crear interpretación con fuentes y puente, diferenciar hipótesis/inferencia, editar, persistir tras recarga, restaurar historial y archivar.');
 }catch(error){console.error(error);if(errors.length)console.error('PAGE ERRORS',errors);process.exitCode=1;}
 finally{await browser.close();}
})();
