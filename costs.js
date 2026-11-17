const costQuestions=[];
const C=(level,defs)=>defs.forEach(d=>costQuestions.push(S(mcq(d[0],level,d[1],d[2],d[3],d[4],d[5],d[6],d[7]||{}))));
const T=(level,defs)=>defs.forEach(d=>costQuestions.push(S(tf(d[0],level,d[1],d[2],d[3],d[4],d[5],d[6]||{}))));
C('basico',[
['c01','Clasificación','¿Cuál es normalmente un coste fijo?',['Harina','Alquiler','Envases','Comisión por unidad'],1,'El alquiler no depende de Q a corto plazo.','Un CF no cambia con Q.'],
['c02','Clasificación','¿Cuál es normalmente un coste variable?',['Seguro fijo','Alquiler','Materia prima','Licencia fija'],2,'La materia prima aumenta al producir más.','Busca el coste ligado a Q.'],
['c03','Fórmulas','¿Cómo se calcula CT?',['CF+CV','CF/Q','CV×Q','CF−CV'],0,'CT suma costes fijos y variables.','Suma todos los costes.'],
['c04','Fórmulas','Si CVu es constante, ¿cómo calculamos CV?',['CVu+Q','CVu×Q','CF/Q','CT−Q'],1,'CV = CVu×Q.','Coste por unidad × unidades.'],
['c05','Coste marginal','¿Qué mide CMg?',['CF por unidad','Aumento de CT al producir más','Ingreso por unidad','CT con Q=0'],1,'CMg mide el coste adicional.','Piensa en ΔCT/ΔQ.'],
['c06','Interpretación','¿Qué significa CMeT = 8 €/ud?',['Cada unidad extra cuesta 8','El coste medio por unidad es 8','CF=8','El precio debe ser 8'],1,'CMeT es un promedio.','“Medio” significa promedio.']
]);
T('basico',[
['c07','Clasificación','Si Q=0, los costes fijos son necesariamente 0.',false,'Puede haber alquiler, seguros u otros CF.','Los CF existen aunque Q sea 0.'],
['c08','Costes medios','CMeT = CMeF + CMeV.',true,'Al dividir CT=CF+CV entre Q obtenemos esa relación.','Divide cada término entre Q.']
]);
costQuestions.push(
()=>{let cf=ri(1000,5000,500),cv=ri(2000,6000,500);return num('c09','basico','Coste total',`CF=${cf} € y CV=${cv} €. Calcula CT.`,cf+cv,'€',`CT=${cf+cv} €.`,'CT=CF+CV.');},
()=>{let v=pick([2,3,4,5]),q=ri(500,2000,250);return num('c10','basico','Costes variables',`CVu=${v} € y Q=${q}. Calcula CV.`,v*q,'€',`CV=${v*q} €.`,'CV=CVu×Q.');},
()=>{let cf=ri(2000,8000,1000),q=pick([500,1000,2000,4000]);return num('c11','basico','CMeF',`CF=${cf} € y Q=${q}. Calcula CMeF.`,cf/q,'€/ud',`CMeF=${fmt(cf/q)} €/ud.`,'CF/Q.');},
()=>{let ct=ri(8000,24000,2000),q=pick([1000,2000,4000]);return num('c12','basico','CMeT',`CT=${ct} € y Q=${q}. Calcula CMeT.`,ct/q,'€/ud',`CMeT=${fmt(ct/q)} €/ud.`,'CT/Q.');},
()=>{let a=ri(8000,12000,500),inc=ri(1500,3500,500);return num('c13','basico','CMg',`CT pasa de ${a} € con 1.000 ud a ${a+inc} € con 1.500. Calcula CMg.`,inc/500,'€/ud',`CMg=${fmt(inc/500)} €/ud.`,'ΔCT/ΔQ.');},
S(mcq('c14','basico','Gráfico','En el gráfico, ¿qué línea representa CF?',['Horizontal discontinua','Ascendente desde 0','Ascendente desde un valor positivo','Ninguna'],0,'CF no cambia con Q.','Un CF es horizontal.',{visual:{kind:'costs'}}))
);

C('aplicacion',[
['c15','Clasificación','La Espiga produce más: usa más harina pero paga el mismo alquiler.',['Ambos variables','Harina variable; alquiler fijo','Harina fija; alquiler variable','Ambos fijos'],1,'Harina depende de Q; alquiler no.','Observa qué cambia con Q.'],
['c16','CMeF','Si CF se mantiene y Q aumenta, CMeF…',['Aumenta','Disminuye','No cambia','Iguala a CVu'],1,'El mismo CF se reparte entre más unidades.','CMeF=CF/Q.'],
['c17','Estructura de costes','¿Qué actividad suele tener gran peso de CF?',['App digital con desarrollo fijo','Compra cada unidad al venderla','Comisión solo por venta','Actividad sin instalaciones'],0,'Una app puede tener altos costes de desarrollo y bajo CVu.','Piensa en inversión previa.'],
['c18','Coste medio vs marginal','CMeT=12 € y CMg=7 €. ¿Qué sabemos?',['El aumento cuesta menos que el promedio actual','CF=7','Precio=12','Hay pérdidas'],0,'Solo comparamos costes medio y marginal.','No deduzcas precios.'],
['c19','CMg','Si CMg empieza a subir con fuerza, una posible causa es…',['Limitaciones de capacidad fija','Desaparecen CF','Baja el precio','No hay CV'],0,'La saturación puede elevar el coste adicional.','Relaciona con rendimientos decrecientes.'],
['c20','Decisión','¿Basta CMg para decidir si producir más?',['Sí','No: falta el ingreso adicional esperado','Da el beneficio total','Hace innecesario el precio'],1,'Hay que comparar coste e ingreso adicionales.','Análisis marginal.']
]);
T('aplicacion',[
['c21','Interpretación','Producir más siempre reduce CMeT.',false,'CMeF cae, pero CV y CMg pueden crecer.','La capacidad puede saturarse.']
]);
costQuestions.push(
()=>{let v=pick([3,4,5]),q=pick([1000,1500,2000]),cf=6000;return num('c22','aplicacion','CT',`CF=6.000 €, CVu=${v} €, Q=${q}. Calcula CT.`,cf+v*q,'€',`CT=${cf+v*q} €.`,'Primero CV; después suma CF.');},
()=>{let q=pick([1000,2000,4000]),cf=8000,v=4,ct=cf+v*q;return num('c23','aplicacion','CMeT',`CF=8.000 €, CVu=4 €, Q=${q}. Calcula CMeT.`,ct/q,'€/ud',`CMeT=${fmt(ct/q)} €/ud.`,'CT/Q.');},
()=>mcq('c24','aplicacion','Lectura de tablas','Según la tabla, ¿cuál es CF?',['8.000 €','10.000 €','18.000 €','31.000 €'],1,'Con Q=0, CT=CF.','Mira CT cuando Q=0.',{table:{headers:['Q','CT (€)'],rows:[[0,10000],[10000,18000],[20000,25000],[30000,31000]]}}),
()=>num('c25','aplicacion','CMg','Según la tabla, calcula CMg al pasar de 100 a 150 mesas.',80,'€/ud','ΔCT=4.000 y ΔQ=50: CMg=80.','ΔCT/ΔQ.',.01,{table:{headers:['Q','CT (€)'],rows:[[100,12000],[150,16000]]}}),
()=>{let cf=12000,q1=1000,q2=2000;return mcq('c26','aplicacion','CMeF',`CF=${cf} €. Q pasa de ${q1} a ${q2}. ¿Qué ocurre con CMeF?`,['Baja de 12 a 6 €/ud','Sube de 6 a 12 €/ud','No cambia','Se duplica'],0,'El mismo CF se reparte entre más unidades.','Calcula CF/Q.');},
S(mcq('c27','aplicacion','Gráfico','En un gráfico CT–Q, CT parte de un valor positivo porque…',['existen CF','CV siempre es positivo','el precio es positivo','CMg=0'],0,'Con Q=0, CT=CF.','Sustituye Q=0 en CT=CF+CVu×Q.',{visual:{kind:'costs'}}))
);

C('reto',[
['c28','Cambios','Si sube CVu y Q se mantiene…',['Suben CV y CT','Baja CF','Baja CMeV','CT no cambia'],0,'CV=CVu×Q.','Misma Q, mayor CVu.'],
['c29','Cambios','Si sube CF y lo demás no cambia, ¿qué NO cambia directamente?',['CT','CMeF','CMeT','CMeV'],3,'CMeV depende de CV y Q.','CF no entra en CMeV.'],
['c30','Largo plazo','Una fábrica saturada quiere producir mucho más de forma permanente.',['Horas extra','Nueva línea de producción','Más materia prima mañana','Más envases'],1,'A largo plazo puede cambiar la capacidad.','Busca una inversión en capacidad.'],
['c31','Estructura','A: CF altos/CVu bajos. B: CF bajos/CVu altos. ¿Cuál es mejor?',['A siempre','B siempre','Depende de Q','Siempre igual CT'],2,'La conveniencia depende del volumen.','CT=CF+CVu×Q.'],
['c32','Decisión','Fabricar 1.000 unidades más cuesta 9.000 €. ¿Qué falta para decidir?',['Color','Ingreso adicional esperado','CF históricos','Trabajadores de otra empresa'],1,'Compara coste e ingreso adicionales.','Análisis marginal.'],
['c33','Gráfico','Si sube CF pero CVu no cambia, la recta CT…',['Sube paralela','Gira desde el mismo punto','Baja','Se hace horizontal'],0,'Cambia el intercepto, no la pendiente.','CT=CF+CVu×Q.'],
['c34','Síntesis','¿Por qué producir más no garantiza bajar CMeT?',['CF siempre sube','El ahorro en CMeF puede ser superado por mayores costes variables/marginales','CMeT no depende de Q','CV es fijo'],1,'Puede aparecer saturación productiva.','Separa CMeF de otros costes.']
]);
T('reto',[
['c35','CMg','Si CMg > CMeT, el coste marginal está por encima del promedio actual.',true,'Es una comparación directa entre dos costes.','Lee literalmente.']
]);
costQuestions.push(
()=>{let q=ri(2000,5000,500),a=20000+8*q,b=32000+5*q;return mcq('c36','reto','Estructura',`Para Q=${q}: A) CF 20.000, CVu 8; B) CF 32.000, CVu 5. ¿Menor CT?`,[a<b?`A (${a} €)`:`B (${b} €)`,a<b?`B (${b} €)`:`A (${a} €)`,'Iguales','No puede saberse'],0,`CTA=${a}; CTB=${b}.`,'Calcula ambos CT.');},
()=>mcq('c37','reto','CMg','¿En qué tramo es menor CMg?',['0–1.000','1.000–2.000','2.000–3.000','3.000–4.000'],2,'ΔCT: 7.000, 6.000, 5.000 y 8.000.','Compara ΔCT.',{table:{headers:['Q','CT (€)'],rows:[[0,20000],[1000,27000],[2000,33000],[3000,38000],[4000,46000]]}}),
()=>mcq('c38','reto','CMg','¿Qué sucede con CMg en el último tramo?',['Cae','Aumenta','Es 0','Iguala CF'],1,'Pasa de 5.000 a 8.000 € por cada 1.000 unidades.','Compara los dos últimos ΔCT.',{table:{headers:['Q','CT (€)'],rows:[[2000,33000],[3000,38000],[4000,46000]]}}),
()=>{let q=pick([2000,4000]),cf=10000,v=5,b=(cf+v*q)/q,q2=q*2,a=(cf+v*q2)/q2;return mcq('c39','reto','CMeT',`CF=10.000, CVu=5. Q pasa de ${q} a ${q2}. ¿CMeT?`,[`Baja de ${fmt(b)} a ${fmt(a)}`,`Sube de ${fmt(a)} a ${fmt(b)}`,'No cambia','Se duplica'],0,'Cae CMeF; CMeV sigue en 5.','CMeT=CMeF+CMeV.');},
S(mcq('c40','reto','Economías de escala','Una empresa digital duplica usuarios con poco coste variable adicional. Es razonable que…',['CMeF baje mucho','CF se duplique','CVu suba necesariamente','CMeT se duplique'],0,'Los CF se reparten entre más usuarios.','Economías de escala.'))
);
window.questionBanks.costes=costQuestions;
