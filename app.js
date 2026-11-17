const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
const state={topic:'costes',level:'basico',questions:[],index:0,score:0,usedHint:false,attempts:0,answered:false,selected:null,skillStats:{},hintsUsed:0};
const labels={costes:'Costes de producción',punto:'Umbral de rentabilidad',mixta:'Prueba mixta',basico:'Básico',aplicacion:'Aplicación',reto:'Reto'};

$$('#topicChoices .choice-card').forEach(b=>b.onclick=()=>{$$('#topicChoices .choice-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.topic=b.dataset.topic});
$$('#levelChoices .level-btn').forEach(b=>b.onclick=()=>{$$('#levelChoices .level-btn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.level=b.dataset.level});
$('#startBtn').onclick=startQuiz;$('#repeatBtn').onclick=startQuiz;$('#homeBtn').onclick=showSetup;$('#quitBtn').onclick=showSetup;$('#checkBtn').onclick=checkAnswer;$('#nextBtn').onclick=nextQuestion;$('#hintBtn').onclick=showHint;
$('#calcToggleBtn').onclick=toggleCalculator;$('#calcCloseBtn').onclick=closeCalculator;
$('[data-calc]').forEach(b=>b.onclick=()=>handleCalculator(b.dataset.calc));

function make(bank,n){return shuffle(bank.filter(f=>f().level===state.level)).slice(0,n).map(f=>f())}
function buildQuestions(){return state.topic==='mixta'?shuffle([...make(questionBanks.costes,5),...make(questionBanks.punto,5)]):make(questionBanks[state.topic],10)}
function startQuiz(){state.questions=buildQuestions();state.index=0;state.score=0;state.skillStats={};state.hintsUsed=0;resetCalculator();closeCalculator();$('#setup').classList.add('hidden');$('#results').classList.add('hidden');$('#quiz').classList.remove('hidden');renderQuestion()}
function showSetup(){closeCalculator();$('#quiz').classList.add('hidden');$('#results').classList.add('hidden');$('#setup').classList.remove('hidden')}
const current=()=>state.questions[state.index];

function renderQuestion(){const q=current();state.usedHint=false;state.attempts=0;state.answered=false;state.selected=null;
$('#progressText').textContent=`Pregunta ${state.index+1} de 10`;$('#scoreText').textContent=`${state.score.toFixed(2).replace('.',',')} / 10`;$('#progressBar').style.width=`${(state.index+1)*10}%`;
$('#topicBadge').textContent=q.id.startsWith('c')?'Costes':'Punto muerto';$('#skillBadge').textContent=q.skill;$('#questionText').textContent=q.prompt;
$('#feedback').className='feedback hidden';$('#hintBox').className='hint-box hidden';$('#nextBtn').classList.add('hidden');$('#checkBtn').classList.remove('hidden');$('#hintBtn').disabled=false;renderVisual(q);renderAnswer(q)}

function renderVisual(q){let box=$('#visualArea');box.innerHTML='';if(q.table){box.innerHTML=`<table class="data-table"><thead><tr>${q.table.headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
if(q.visual?.kind==='break-even')box.innerHTML+=`<div class="graph-card"><svg viewBox="0 0 600 310"><line class="graph-axis" x1="65" y1="260" x2="555" y2="260"/><line class="graph-axis" x1="65" y1="260" x2="65" y2="35"/><line class="graph-it" x1="65" y1="260" x2="530" y2="55"/><line class="graph-ct" x1="65" y1="205" x2="530" y2="95"/><line class="graph-cf" x1="65" y1="205" x2="530" y2="205"/><circle class="graph-dot" cx="260" cy="174" r="7"/><text class="graph-label" x="520" y="50">IT</text><text class="graph-label" x="520" y="90">CT</text><text class="graph-label" x="520" y="200">CF</text><text class="graph-label" x="268" y="166">Punto muerto</text></svg></div>`;
if(q.visual?.kind==='costs')box.innerHTML+=`<div class="graph-card"><svg viewBox="0 0 600 300"><line class="graph-axis" x1="65" y1="250" x2="555" y2="250"/><line class="graph-axis" x1="65" y1="250" x2="65" y2="35"/><line class="graph-cf" x1="65" y1="180" x2="530" y2="180"/><line class="graph-ct" x1="65" y1="180" x2="530" y2="70"/><line class="graph-it" x1="65" y1="250" x2="530" y2="105"/><text class="graph-label" x="515" y="174">CF</text><text class="graph-label" x="515" y="66">CT</text><text class="graph-label" x="515" y="101">CV</text></svg></div>`}

function renderAnswer(q){let a=$('#answerArea');a.innerHTML='';if(q.type==='mcq'){let w=document.createElement('div');w.className='options';q.options.forEach((o,i)=>{let b=document.createElement('button');b.className='option';b.textContent=o;b.dataset.i=i;b.onclick=()=>{if(state.answered)return;$$('.option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.selected=i};w.appendChild(b)});a.appendChild(w)}else{a.innerHTML=`<div class="numeric-wrap"><input id="numericAnswer" class="numeric-input" inputmode="decimal" placeholder="Escribe el resultado"><span class="unit">${q.unit||''}</span></div>`;$('#numericAnswer').onkeydown=e=>{if(e.key==='Enter')checkAnswer()}}}

function showHint(){let q=current();if(state.usedHint||state.answered)return;state.usedHint=true;state.hintsUsed++;$('#hintBtn').disabled=true;$('#hintBox').textContent=q.hint;$('#hintBox').classList.remove('hidden')}
function getResponse(q){if(q.type==='mcq')return state.selected;let raw=$('#numericAnswer')?.value.trim().replace(',','.');return raw===''?null:Number(raw)}
function correct(q,r){return q.type==='mcq'?r===q.correct:Number.isFinite(r)&&Math.abs(r-q.answer)<=q.tolerance}
function feedback(kind,msg){let f=$('#feedback');f.textContent=msg;f.className=`feedback ${kind}`}

function checkAnswer(){if(state.answered)return;let q=current(),r=getResponse(q);if(r===null||(q.type==='numeric'&&!Number.isFinite(r))){feedback('try','Selecciona o escribe una respuesta antes de comprobar.');return}state.attempts++;let ok=correct(q,r);
if(!ok&&q.type==='mcq'&&q.options.length>2&&state.attempts===1){document.querySelector(`.option[data-i="${r}"]`)?.classList.add('wrong');state.selected=null;feedback('try','No es correcta. Tienes un segundo intento antes de ver la solución.');return}
state.answered=true;let pts=ok?Math.max(0,1-(state.usedHint?.25:0)):0;state.score+=pts;if(!state.skillStats[q.skill])state.skillStats[q.skill]={total:0,correct:0};state.skillStats[q.skill].total++;if(ok)state.skillStats[q.skill].correct++;
if(q.type==='mcq'){$$('.option').forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct')});if(!ok&&Number.isInteger(r))document.querySelector(`.option[data-i="${r}"]`)?.classList.add('wrong')}else $('#numericAnswer').disabled=true;
$('#checkBtn').classList.add('hidden');$('#hintBtn').disabled=true;feedback(ok?'good':'bad',(ok?`✓ Correcto${state.usedHint?' (0,75 puntos)':''}. `:'✗ Revisa la idea. ')+q.explanation);$('#scoreText').textContent=`${state.score.toFixed(2).replace('.',',')} / 10`;$('#nextBtn').textContent=state.index===9?'Ver resultado →':'Siguiente →';$('#nextBtn').classList.remove('hidden')}

function nextQuestion(){if(!state.answered)return;if(state.index<9){state.index++;renderQuestion()}else showResults()}
function showResults(){$('#quiz').classList.add('hidden');$('#results').classList.remove('hidden');let score=Math.round(state.score*100)/100;$('#resultScore').textContent=score.toFixed(2).replace('.',',');let title=score>=9?'Dominio excelente':score>=7?'Buen dominio':score>=5?'Base conseguida':'Conviene reforzar algunas ideas';$('#resultTitle').textContent=title;$('#resultSummary').textContent=`${labels[state.topic]} · Nivel ${labels[state.level]}. Has usado ${state.hintsUsed} ${state.hintsUsed===1?'ayuda':'ayudas'}.`;
let es=Object.entries(state.skillStats).map(([skill,s])=>({skill,...s,pct:Math.round(100*s.correct/s.total)})).sort((a,b)=>a.pct-b.pct),weak=es[0],strong=es[es.length-1];
$('#diagnosis').innerHTML=score>=8?`<strong>Diagnóstico:</strong> buena comprensión general. Mejor resultado: <strong>${strong.skill}</strong>${weak&&weak.pct<100?`; revisa <strong>${weak.skill}</strong>`:''}.`:`<strong>Diagnóstico:</strong> repasa especialmente <strong>${weak?.skill||'las fórmulas básicas'}</strong>. Repite otra prueba: las preguntas y varios datos cambiarán.`;
$('#skillResults').innerHTML=es.map(e=>`<div class="skill-line"><strong>${e.skill}</strong><span>${e.correct}/${e.total}</span><div class="skill-bar"><span style="width:${e.pct}%"></span></div></div>`).join('')}


function openCalculator(){
  const calc=$('#calculator');
  calc.classList.add('open');
  calc.setAttribute('aria-hidden','false');
}
function closeCalculator(){
  const calc=$('#calculator');
  if(!calc)return;
  calc.classList.remove('open');
  calc.setAttribute('aria-hidden','true');
}
function resetCalculator(){
  if($('#calcDisplay')) $('#calcDisplay').value='';
}
function handleCalculator(key){
  const display=$('#calcDisplay');
  if(!display)return;
  if(key==='C') display.value='';
  else if(key==='⌫') display.value=display.value.slice(0,-1);
  else if(key==='='){
    try{
      const expr=display.value.replace(/,/g,'.');
      if(!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error('invalid');
      const value=Function('"use strict";return ('+expr+')')();
      if(!Number.isFinite(value)) throw new Error('invalid');
      display.value=String(Math.round((value+Number.EPSILON)*100000000)/100000000).replace('.',',');
    }catch(e){display.value='Error'}
  }else{
    if(display.value==='Error') display.value='';
    display.value+=key;
  }
}
