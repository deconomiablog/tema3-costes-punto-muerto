/* Banco de preguntas · Tema 3 · Economía 1º Bachillerato
   Cada bloque contiene 40 plantillas: 14 básicas, 13 de aplicación y 13 de reto.
   Varias plantillas generan datos nuevos en cada intento. */

const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (min,max,step=1) => min + Math.floor(Math.random()*((max-min)/step+1))*step;
const fmt = n => Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.',',');
const clone = o => JSON.parse(JSON.stringify(o));
const S = o => () => clone(o);

function mcq(id,level,skill,prompt,options,correct,explanation,hint,extra={}){
  return {id,level,skill,type:'mcq',prompt,options,correct,explanation,hint,...extra};
}
function tf(id,level,skill,prompt,correct,explanation,hint,extra={}){
  return mcq(id,level,skill,prompt,['Verdadero','Falso'],correct?0:1,explanation,hint,extra);
}
function num(id,level,skill,prompt,answer,unit,explanation,hint,tolerance=.01,extra={}){
  return {id,level,skill,type:'numeric',prompt,answer,unit,tolerance,explanation,hint,...extra};
}


window.questionBanks = window.questionBanks || {};
