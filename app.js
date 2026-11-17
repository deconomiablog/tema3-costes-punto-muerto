(() => {
  "use strict";

  const app = document.getElementById("app");
  const banks = window.questionBanks || {};
  const COSTS = banks.costes || [];
  const POINT = banks.punto || [];

  const TOPICS = {
    costes: {
      title: "Costes de producción",
      icon: "📊",
      desc: "Costes fijos y variables, coste total, costes medios, coste marginal e interpretación."
    },
    punto: {
      title: "Umbral de rentabilidad",
      icon: "🎯",
      desc: "Ingresos, beneficio, margen de contribución, punto muerto, cambios y gráficos."
    },
    mixta: {
      title: "Prueba mixta",
      icon: "↔️",
      desc: "Cinco preguntas de costes y cinco de punto muerto para relacionar ambos bloques."
    }
  };

  const LEVELS = {
    basico: {label:"Básico", cls:"basic", desc:"Identificar conceptos, fórmulas y cálculos fundamentales."},
    aplicacion: {label:"Aplicación", cls:"medium", desc:"Interpretar resultados y aplicar las relaciones a situaciones diferentes."},
    reto: {label:"Reto", cls:"reto", desc:"Cambios, decisiones y razonamientos algo más exigentes."}
  };

  let state = {
    topic:null, level:null, questions:[], index:0, attempts:0, locked:false,
    usedHint:false, hintsUsed:0, score:0, answers:[], skillStats:{}
  };

  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const format = v => typeof v === "number" ? new Intl.NumberFormat("es-ES",{maximumFractionDigits:2}).format(v) : String(v);

  function fresh(bank){
    return bank.map(fn => {
      try { return fn(); } catch(e) { return null; }
    }).filter(Boolean);
  }

  function home(){
    state = {topic:null,level:null,questions:[],index:0,attempts:0,locked:false,usedHint:false,hintsUsed:0,score:0,answers:[],skillStats:{}};

    const cards = Object.entries(TOPICS).map(([id,t]) => {
      const count = id==="mixta" ? COSTS.length + POINT.length : (id==="costes" ? COSTS.length : POINT.length);
      return `<article class="block-card">
        <div class="icon">${t.icon}</div>
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <div class="levels">
          ${Object.entries(LEVELS).map(([key,l])=>`<button class="level-btn" type="button" data-start="${id}" data-level="${key}">${l.label}</button>`).join("")}
        </div>
        <small>${id==="mixta" ? "10 preguntas: 5 de cada bloque" : count+" preguntas en la batería · 10 aleatorias por práctica"}</small>
      </article>`;
    }).join("");

    app.innerHTML = `
      <section class="hero">
        <div class="hero-main">
          <span class="eyebrow">Economía · 1.º Bachillerato</span>
          <h1>Tema 3<br>Costes, beneficios y punto muerto</h1>
          <p class="lead">Practica con preguntas breves antes de resolver los ejercicios completos. Elige bloque y nivel: cada intento genera una selección diferente de 10 preguntas.</p>
          <div class="source-links">
            <a href="https://www.deconomiablog.com/2026/10/los-costes-de-produccion.html" target="_blank" rel="noopener">Repasar costes ↗</a>
            <a href="https://www.deconomiablog.com/2026/10/el-umbral-de-rentabilidad-o-punto-muerto.html" target="_blank" rel="noopener">Repasar punto muerto ↗</a>
          </div>
        </div>
        <aside class="hero-side">
          <h3>¿Cómo funciona?</h3>
          <ul>
            <li>3 niveles: Básico, Aplicación y Reto.</li>
            <li>10 preguntas aleatorias en cada práctica.</li>
            <li>Segundo intento en preguntas con más de dos opciones.</li>
            <li>Explicación inmediata de cada respuesta.</li>
            <li>Ayuda opcional con penalización de 0,25 puntos.</li>
            <li>Calculadora disponible en todo momento y sin penalización.</li>
          </ul>
        </aside>
      </section>
      <div class="section-head">
        <div><h2>Elige qué quieres practicar</h2><p>Costes de producción, punto muerto o una prueba mixta.</p></div>
      </div>
      <section class="blocks">${cards}</section>`;

    app.querySelectorAll("[data-start]").forEach(b => {
      b.onclick = () => startPractice(b.dataset.start,b.dataset.level);
    });
  }

  function buildQuestions(topic,level){
    if(topic==="mixta"){
      const c = shuffle(fresh(COSTS).filter(q=>q.level===level)).slice(0,5);
      const p = shuffle(fresh(POINT).filter(q=>q.level===level)).slice(0,5);
      return shuffle([...c,...p]);
    }
    const bank = topic==="costes" ? COSTS : POINT;
    return shuffle(fresh(bank).filter(q=>q.level===level)).slice(0,10);
  }

  function startPractice(topic,level){
    const questions = buildQuestions(topic,level);
    if(questions.length!==10){
      app.innerHTML = `<div class="notice"><strong>No se puede iniciar la práctica.</strong> Se han cargado ${questions.length} preguntas para esta selección en lugar de 10.</div>`;
      return;
    }
    state = {topic,level,questions,index:0,attempts:0,locked:false,usedHint:false,hintsUsed:0,score:0,answers:[],skillStats:{}};
    renderQuestion();
  }

  function visualHTML(q){
    let out="";
    if(q.table){
      out += `<table class="data-table"><thead><tr>${q.table.headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${q.table.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    if(q.visual && q.visual.kind==="break-even"){
      out += `<div class="graph-card"><svg viewBox="0 0 600 310" role="img" aria-label="Gráfico de ingresos, costes totales y costes fijos con punto muerto"><line class="graph-axis" x1="65" y1="260" x2="555" y2="260"/><line class="graph-axis" x1="65" y1="260" x2="65" y2="35"/><line class="graph-it" x1="65" y1="260" x2="530" y2="55"/><line class="graph-ct" x1="65" y1="205" x2="530" y2="95"/><line class="graph-cf" x1="65" y1="205" x2="530" y2="205"/><circle class="graph-dot" cx="260" cy="174" r="7"/><text class="graph-label" x="520" y="50">IT</text><text class="graph-label" x="520" y="90">CT</text><text class="graph-label" x="520" y="200">CF</text><text class="graph-label" x="268" y="166">Punto muerto</text></svg></div>`;
    }
    if(q.visual && q.visual.kind==="costs"){
      out += `<div class="graph-card"><svg viewBox="0 0 600 300" role="img" aria-label="Gráfico de costes fijos, variables y totales"><line class="graph-axis" x1="65" y1="250" x2="555" y2="250"/><line class="graph-axis" x1="65" y1="250" x2="65" y2="35"/><line class="graph-cf" x1="65" y1="180" x2="530" y2="180"/><line class="graph-ct" x1="65" y1="180" x2="530" y2="70"/><line class="graph-it" x1="65" y1="250" x2="530" y2="105"/><text class="graph-label" x="515" y="174">CF</text><text class="graph-label" x="515" y="66">CT</text><text class="graph-label" x="515" y="101">CV</text></svg></div>`;
    }
    return out;
  }

  function answerUI(q){
    if(q.type==="mcq"){
      return `<div class="options">${q.options.map((o,i)=>`<button class="option" type="button" data-index="${i}">${esc(o)}</button>`).join("")}</div>`;
    }
    return `<div class="number-row"><input id="numAnswer" type="text" inputmode="decimal" autocomplete="off" placeholder="Escribe tu resultado"><span class="unit">${esc(q.unit||"")}</span></div>`;
  }

  function renderQuestion(){
    const q = state.questions[state.index];
    if(!q){ finish(); return; }

    state.attempts=0;
    state.locked=false;
    state.usedHint=false;

    const level = LEVELS[q.level] || LEVELS[state.level];
    const progress = (state.index/state.questions.length)*100;
    const topicLabel = q.id && q.id.startsWith("c") ? "Costes de producción" : "Punto muerto";

    app.innerHTML = `<section class="quiz-wrap">
      <div class="quiz-meta">
        <span>${esc(TOPICS[state.topic].title)} · ${esc(LEVELS[state.level].label)}</span>
        <span>Pregunta ${state.index+1} de ${state.questions.length} · ${state.score.toFixed(2).replace(".",",")} / 10</span>
      </div>
      <div class="question-progress"><span style="width:${progress}%"></span></div>
      <article class="quiz-card">
        <span class="badge badge-${level.cls}">${esc(level.label)}</span>
        <span class="badge skill-badge">${esc(topicLabel)} · ${esc(q.skill)}</span>
        <div class="question">${esc(q.prompt)}</div>
        ${visualHTML(q)}
        <div id="answerArea">${answerUI(q)}</div>
        <div id="feedback"></div>
        <div class="quiz-actions">
          <button class="btn btn-ghost" type="button" id="quitBtn">Salir</button>
          <div class="right-actions">
            <button class="btn btn-hint" type="button" id="hintBtn">💡 Consultar ayuda (−0,25)</button>
            <button class="btn btn-primary" type="button" id="checkBtn">Comprobar</button>
          </div>
        </div>
      </article>
    </section>`;

    document.getElementById("quitBtn").onclick=home;
    document.getElementById("checkBtn").onclick=check;
    document.getElementById("hintBtn").onclick=showHint;

    const input=document.getElementById("numAnswer");
    if(input){
      input.focus();
      input.onkeydown=e=>{if(e.key==="Enter") check();};
    }
  }

  app.addEventListener("click",e=>{
    const o=e.target.closest(".option");
    if(!o || !app.contains(o) || state.locked || o.disabled) return;
    o.parentElement.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));
    o.classList.add("selected");
  });

  function userValue(q){
    if(q.type==="numeric"){
      const el=document.getElementById("numAnswer");
      return el ? el.value.trim() : "";
    }
    const s=app.querySelector(".option.selected");
    return s ? Number(s.dataset.index) : null;
  }

  function isCorrect(q,v){
    if(q.type==="numeric"){
      if(v==="") return false;
      const got=Number(String(v).replace(",",".").replace(/\s/g,""));
      return Number.isFinite(got) && Math.abs(got-Number(q.answer)) <= (q.tolerance ?? .01);
    }
    return Number.isInteger(v) && v===q.correct;
  }

  function displayAnswer(q){
    if(q.type==="numeric") return `${format(q.answer)}${q.unit ? " "+q.unit : ""}`;
    return q.options[q.correct];
  }

  function showHint(){
    const q=state.questions[state.index];
    if(state.locked || state.usedHint) return;
    state.usedHint=true;
    state.hintsUsed++;
    document.getElementById("hintBtn").disabled=true;
    showFeedback("hint","Pista",esc(q.hint || "Revisa la fórmula o relación que necesitas."));
  }

  function showFeedback(cls,title,body){
    document.getElementById("feedback").innerHTML=`<div class="feedback ${cls}"><strong>${title}</strong><div>${body}</div></div>`;
  }

  function recordFinal(q,correct,points){
    state.skillStats[q.skill] ||= {total:0,correct:0};
    state.skillStats[q.skill].total++;
    if(correct) state.skillStats[q.skill].correct++;
    state.answers.push({q,correct,points,usedHint:state.usedHint});
  }

  function markFinal(q,v,correct){
    if(q.type==="numeric"){
      const input=document.getElementById("numAnswer");
      if(input) input.disabled=true;
      return;
    }
    app.querySelectorAll(".option").forEach(o=>{
      o.disabled=true;
      const i=Number(o.dataset.index);
      if(i===q.correct) o.classList.add("correct");
      if(!correct && i===v) o.classList.add("wrong");
    });
  }

  function setNextButton(){
    const b=document.getElementById("checkBtn");
    b.textContent=state.index===state.questions.length-1 ? "Ver resultado" : "Siguiente";
    b.onclick=next;
    const hint=document.getElementById("hintBtn");
    if(hint) hint.disabled=true;
  }

  function check(){
    const q=state.questions[state.index];
    const v=userValue(q);
    if(v===null || v===""){
      showFeedback("hint","Falta una respuesta","Elige una opción o escribe un resultado antes de continuar.");
      return;
    }
    if(state.locked){ next(); return; }

    state.attempts++;
    const ok=isCorrect(q,v);

    if(ok){
      state.locked=true;
      const points=state.usedHint ? .75 : 1;
      state.score+=points;
      recordFinal(q,true,points);
      markFinal(q,v,true);
      showFeedback("good","¡Correcto!",`${esc(q.explanation)}${state.usedHint ? " · Esta pregunta suma 0,75 puntos por haber utilizado la ayuda." : ""}`);
      setNextButton();
      return;
    }

    const hasSecondAttempt=q.type==="mcq" && q.options.length>2 && state.attempts===1;
    if(hasSecondAttempt){
      const selected=app.querySelector(`.option[data-index="${v}"]`);
      if(selected){selected.classList.add("wrong");selected.disabled=true;selected.classList.remove("selected");}
      showFeedback("hint","No es correcto. Te queda un segundo intento.","Revisa el planteamiento antes de responder de nuevo.");
      return;
    }

    state.locked=true;
    recordFinal(q,false,0);
    markFinal(q,v,false);
    showFeedback("bad","Respuesta incorrecta",`La respuesta correcta es <strong>${esc(displayAnswer(q))}</strong>. ${esc(q.explanation)}`);
    setNextButton();
  }

  function next(){
    state.index++;
    renderQuestion();
  }

  function finish(){
    const total=state.answers.length;
    const correct=state.answers.filter(a=>a.correct).length;
    const score=Math.round(state.score*100)/100;
    const pct=Math.round(score/10*100);
    const skills=Object.entries(state.skillStats)
      .map(([skill,s])=>({skill,...s,pct:Math.round(s.correct/s.total*100)}))
      .sort((a,b)=>a.pct-b.pct);
    const weak=skills[0], strong=skills[skills.length-1];

    let diagnosis="";
    if(score>=8){
      diagnosis=`Buen dominio general.${strong ? " Tu mejor resultado ha sido en <strong>"+esc(strong.skill)+"</strong>." : ""}${weak && weak.pct<100 ? " Conviene revisar <strong>"+esc(weak.skill)+"</strong>." : ""}`;
    }else{
      diagnosis=`Conviene repetir la práctica y revisar especialmente <strong>${esc(weak?.skill || "las fórmulas básicas")}</strong>.`;
    }

    const review=state.answers.map((a,i)=>`<div class="review-item">
      <strong class="${a.correct?"ok":"ko"}">${a.correct?"✓":"✗"} Pregunta ${i+1}</strong>
      <p>${esc(a.q.prompt)}</p>
      <small><b>Respuesta correcta:</b> ${esc(displayAnswer(a.q))}. ${esc(a.q.explanation)}</small>
    </div>`).join("");

    app.innerHTML=`<section class="result-card">
      <span class="eyebrow">Práctica completada</span>
      <div class="score-ring" style="--score:${pct*3.6}deg"><strong>${score.toFixed(2).replace(".",",")}/10</strong></div>
      <h2>${correct} de ${total} respuestas correctas</h2>
      <div class="stats-grid">
        <div class="stat"><strong>${score.toFixed(2).replace(".",",")}</strong><span>Puntuación sobre 10</span></div>
        <div class="stat"><strong>${correct}</strong><span>Aciertos</span></div>
        <div class="stat"><strong>${state.hintsUsed}</strong><span>Ayudas utilizadas</span></div>
      </div>
      <div class="diagnosis"><strong>Diagnóstico:</strong> ${diagnosis}</div>
      <div class="source-links" style="justify-content:center">
        <button class="btn btn-primary" type="button" id="repeat">Otra práctica aleatoria</button>
        <button class="btn btn-secondary" type="button" id="backHome">Volver al inicio</button>
      </div>
      <div class="review"><h3>Revisión</h3>${review}</div>
    </section>`;

    document.getElementById("backHome").onclick=home;
    document.getElementById("repeat").onclick=()=>startPractice(state.topic,state.level);
  }

  // Calculadora: misma estructura y comportamiento base que el repositorio de referencia.
  const calc=document.getElementById("calculator");
  const display=document.getElementById("calcDisplay");

  document.getElementById("calcToggle").onclick=()=>{
    calc.classList.add("open");
    calc.setAttribute("aria-hidden","false");
  };
  document.getElementById("calcClose").onclick=()=>{
    calc.classList.remove("open");
    calc.setAttribute("aria-hidden","true");
  };
  document.querySelectorAll("[data-calc]").forEach(b=>b.onclick=()=>{
    const v=b.dataset.calc;
    if(v==="C") display.value="";
    else if(v==="⌫") display.value=display.value.slice(0,-1);
    else if(v==="="){
      try{
        const expr=display.value.replace(/,/g,".");
        if(!/^[0-9+\-*/().\s]+$/.test(expr)) throw 0;
        const value=Function('"use strict";return ('+expr+')')();
        if(!Number.isFinite(value)) throw 0;
        display.value=String(Math.round((value+Number.EPSILON)*100000000)/100000000).replace(".",",");
      }catch{display.value="Error";}
    }else{
      if(display.value==="Error") display.value="";
      display.value += v;
    }
  });

  document.getElementById("homeBtn").onclick=home;
  document.querySelectorAll("[data-home]").forEach(x=>x.onclick=e=>{e.preventDefault();home();});

  if(COSTS.length!==40 || POINT.length!==40){
    app.innerHTML=`<div class="notice"><strong>La batería necesita revisión.</strong> Se han cargado ${COSTS.length} preguntas de costes y ${POINT.length} de punto muerto; deben ser 40 en cada bloque.</div>`;
  }else{
    home();
  }
})();