const breakEvenQuestions=[];
const P=(level,defs)=>defs.forEach(d=>breakEvenQuestions.push(S(mcq(d[0],level,d[1],d[2],d[3],d[4],d[5],d[6],d[7]||{}))));
const PT=(level,defs)=>defs.forEach(d=>breakEvenQuestions.push(S(tf(d[0],level,d[1],d[2],d[3],d[4],d[5],d[6]||{}))));

P('basico',[
['p01','Concepto','¿Qué ocurre en el punto muerto?',['IT > CT','IT = CT','IT < CT','CF = 0'],1,'En el punto muerto los ingresos igualan a los costes totales.','Recuerda: beneficio = 0.'],
['p02','Ingresos','¿Cómo se calculan los ingresos totales?',['p × Q','CF + CV','CF / Q','p − CVu'],0,'IT = precio × cantidad vendida.','Precio por cantidad.'],
['p03','Costes','Si CVu es constante, ¿cómo se calcula CT?',['CF + CVu × Q','p × Q','CF / Q','p − CVu'],0,'CT = CF + CVu × Q.','Suma costes fijos y variables.'],
['p04','Fórmula','¿Cuál es la fórmula del punto muerto?',['CF / (p − CVu)','p / (CF − CVu)','CF × (p − CVu)','CT / Q'],0,'Q* = CF / (p − CVu).','El denominador es el margen unitario.'],
['p05','Margen','¿Qué representa p − CVu?',['Beneficio total','Margen de contribución unitario','Coste fijo medio','Ingresos totales'],1,'Cada unidad aporta ese margen para cubrir CF y después generar beneficio.','Precio menos coste variable unitario.'],
['p06','Interpretación','Si Q* = 800 y se venden 600 unidades...',['Hay beneficios','Hay pérdidas','Beneficio = 0','CF = 0'],1,'Por debajo del punto muerto hay pérdidas.','Compara ventas con Q*.'],
['p07','Interpretación','Si Q* = 800 y se venden 1.000 unidades...',['Hay beneficios','Hay pérdidas','Beneficio = 0','No se puede saber'],0,'Por encima del punto muerto hay beneficios.','Compara ventas con Q*.'],
['p08','Gráfico','La recta de ingresos totales comienza...',['En el origen','En CF','En Q*','En CVu'],0,'Si Q=0, IT=0.','IT = p × Q.'],
['p09','Gráfico','La recta de costes totales comienza...',['En 0 siempre','En CF','En p','En el margen'],1,'Si Q=0, CT=CF.','CT = CF + CVu × Q.']
]);
PT('basico',[
['p10','Concepto','En el punto muerto el beneficio es 0.',true,'Porque IT = CT.','Usa Bº = IT − CT.']
]);
breakEvenQuestions.push(
()=>{let p=pick([10,12,15,20]),q=pick([500,1000,1500]);return num('p11','basico','Ingresos',`Se venden ${q} unidades a ${p} €. Calcula IT.`,p*q,'€',`IT=${p*q} €.`,'IT=p×Q.');},
()=>{let cf=pick([6000,8000,10000,12000]),m=pick([5,10,20]),p=m+10,v=10;return num('p12','basico','Punto muerto',`CF=${cf} €, p=${p} €, CVu=${v} €. Calcula Q*.`,cf/m,'ud',`Margen=${m}; Q*=${fmt(cf/m)}.`,'CF/(p−CVu).');},
()=>{let cf=pick([5000,8000,12000]),v=pick([4,6,8]),q=pick([500,1000,1500]);return num('p13','basico','Costes',`CF=${cf} €, CVu=${v} €, Q=${q}. Calcula CT.`,cf+v*q,'€',`CT=${cf+v*q} €.`,'CF + CVu×Q.');},
S(mcq('p14','basico','Gráfico','¿Qué representa el corte entre IT y CT?',['Máximo beneficio','Punto muerto','Coste variable','Precio'],1,'En ese punto IT = CT.','Es la condición del umbral.',{visual:{kind:'break-even'}}))
);

P('aplicacion',[
['p15','Margen','p=30 € y CVu=18 €. Un margen de 12 € significa...',['Cada unidad aporta 12 € a cubrir CF y después al beneficio','El beneficio total es 12 €','CF = 12 €','CT = 12 €'],0,'Margen unitario = p − CVu.','Aporte de cada unidad.'],
['p16','Cambios','Si suben los costes fijos y p y CVu no cambian, Q*...',['Aumenta','Disminuye','No cambia','Es 0'],0,'Con mayor CF hacen falta más unidades para cubrirlos.','Q*=CF/margen.'],
['p17','Cambios','Si sube el precio y los costes no cambian, Q*...',['Aumenta','Disminuye','No cambia','Se duplica siempre'],1,'Sube el margen y se necesitan menos unidades.','Mayor p−CVu.'],
['p18','Cambios','Si sube CVu y p no cambia, Q*...',['Aumenta','Disminuye','No cambia','Es negativo'],0,'El margen disminuye y hacen falta más ventas.','Menor p−CVu.'],
['p19','Gráfico','A la izquierda del punto muerto suele haber...',['Beneficios','Pérdidas','CF=0','Máximo beneficio'],1,'Antes de Q*, IT < CT.','Compara ambas rectas.',{visual:{kind:'break-even'}}],
['p20','Gráfico','Si aumentan CF, manteniéndose p y CVu, la recta CT...',['Sube paralela y Q* se desplaza a la derecha','Baja','No cambia','Pasa por el origen'],0,'Aumenta el intercepto de CT, no su pendiente.','CT=CF+CVu×Q.'],
['p21','Decisión','Bajar el precio aumenta Q*. ¿Es siempre una mala decisión?',['Sí','No: hay que considerar cómo cambian las ventas y el beneficio','Sí, porque IT siempre cae','El punto muerto no importa'],1,'El punto muerto ayuda, pero no sustituye al análisis completo.','Hay que considerar la reacción de las ventas.']
]);
breakEvenQuestions.push(
()=>{let cf=12000,p=20,v=8,q=pick([800,1000,1200]);let it=p*q,ct=cf+v*q;return num('p22','aplicacion','Beneficio',`CF=12.000 €, p=20 €, CVu=8 €, Q=${q}. Calcula Bº.`,it-ct,'€',`IT=${it}; CT=${ct}; Bº=${it-ct} €.`,'Bº=IT−CT.');},
()=>{let cf=12000,p1=10,p2=9,v=4;let q1=cf/(p1-v),q2=cf/(p2-v);return mcq('p23','aplicacion','Precio',`CF=12.000 €, CVu=4 €. Si p baja de 10 a 9 €, Q* pasa de ${fmt(q1)} a...`,[fmt(q2),fmt(q1),fmt(q1-200),fmt(q2+1000)],0,`El nuevo Q* es ${fmt(q2)} unidades.`,'Recalcula con el nuevo margen.');},
()=>{let cf1=15000,cf2=18000,p=12,v=7;return num('p24','aplicacion','Costes fijos',`p=12 €, CVu=7 €. Si CF sube de 15.000 a 18.000 €, ¿cuál es el nuevo Q*?`,cf2/(p-v),'ud',`Q*=${fmt(cf2/(p-v))}.`,'Usa los nuevos CF.');},
()=>{let cf=9000,p=20,v1=11,v2=14;return mcq('p25','aplicacion','Coste variable',`CF=9.000 €, p=20 €. CVu sube de 11 a 14 €. ¿Qué ocurre con Q*?`,[`Sube de ${fmt(cf/(p-v1))} a ${fmt(cf/(p-v2))}`,`Baja de ${fmt(cf/(p-v1))} a ${fmt(cf/(p-v2))}`,'No cambia','Se hace 0'],0,'Al reducirse el margen, aumenta Q*.','Calcula ambos márgenes.');},
()=>{let cf=8000,p=20,v=10,q=1000;let it=p*q,ct=cf+v*q;return mcq('p26','aplicacion','Interpretación',`CF=8.000, p=20, CVu=10. Si vende ${q} unidades, el resultado es...`,[`Beneficio de ${it-ct} €`,`Pérdida de ${ct-it} €`,'Beneficio 0','No puede saberse'],0,`IT=${it}; CT=${ct}; beneficio=${it-ct}.`,'Calcula IT y CT.');},
S(mcq('p27','aplicacion','Gráfico','En este gráfico genérico, ¿qué zona queda a la derecha del punto muerto?',['Pérdidas','Beneficios','CF=0','Ingresos nulos'],1,'A la derecha, IT supera a CT.','Observa qué recta queda por encima.',{visual:{kind:'break-even'}}))
);

P('reto',[
['p28','Cambios simultáneos','Si suben CF y también sube el precio, ¿qué ocurre necesariamente con Q*?',['Siempre sube','Siempre baja','Puede subir o bajar según la magnitud de ambos cambios','No cambia'],2,'Un cambio aumenta Q* y el otro lo reduce.','Analiza efectos opuestos.'],
['p29','Cambios simultáneos','Si bajan CF y baja CVu, Q*...',['Aumenta necesariamente','Disminuye necesariamente','Puede no cambiar','Siempre se duplica'],1,'Ambos cambios tienden a reducir Q*.','Numerador menor y denominador mayor.'],
['p30','Margen','Si p = CVu, ¿qué sucede con el punto muerto?',['Q*=CF','No existe un punto muerto finito','Q*=0','Q*=p'],1,'Cada unidad aporta margen 0, así que no cubre CF.','Mira el denominador.'],
['p31','Margen','Si p < CVu y existen CF positivos...',['Vender más mejora siempre el resultado','Cada unidad vendida empeora el resultado','Q* es positivo y normal','CF desaparecen'],1,'Cada unidad tiene margen negativo.','p−CVu es negativo.'],
['p32','Gráfico','Si aumenta el precio, la recta IT...',['Se hace más inclinada','Se desplaza paralela hacia arriba','Se hace horizontal','No cambia'],0,'La pendiente de IT es p.','IT=p×Q.'],
['p33','Gráfico','Si aumenta CVu, la recta CT...',['Se hace más inclinada','Sube paralela','Baja paralela','Se hace horizontal'],0,'La pendiente de CT es CVu.','CT=CF+CVu×Q.'],
['p34','Decisión','Una nueva máquina aumenta CF pero reduce mucho CVu. ¿Qué conclusión es correcta?',['Siempre conviene','Nunca conviene','Depende del nivel de ventas previsto','El punto muerto no cambia'],2,'La estructura de costes importa junto al volumen.','Compara escenarios para distintos Q.']
]);
PT('reto',[
['p35','Interpretación','Si una empresa está exactamente en Q*, cualquier unidad adicional vendida, manteniéndose p y CVu, aporta el margen unitario al beneficio.',true,'Una vez cubiertos CF, el margen adicional se convierte en beneficio.','Piensa en qué ocurre después de cubrir CF.']
]);
breakEvenQuestions.push(
()=>{let cf=30000,p=150,v=90,q=650;let qstar=cf/(p-v),b=p*q-(cf+v*q);return mcq('p36','reto','Caso completo',`CF=30.000 €, p=150 €, CVu=90 €, ventas previstas=650. ¿Qué afirmación es correcta?`,[`Q*=${fmt(qstar)} y beneficio=${fmt(b)} €`,`Q*=650 y beneficio=0`,`Q*=${fmt(qstar+100)} y pérdida`,'No puede calcularse'],0,`Q*=${fmt(qstar)}; Bº=${fmt(b)} €.`,'Calcula primero el margen.');},
()=>{let cf1=30000,v1=90,cf2=36000,v2=78,p=150;let q1=cf1/(p-v1),q2=cf2/(p-v2);return mcq('p37','reto','Nueva maquinaria',`Situación A: CF 30.000 y CVu 90. Situación B: CF 36.000 y CVu 78. p=150. ¿Qué ocurre con Q*?`,[`B baja de ${fmt(q1)} a ${fmt(q2)}`,`B sube de ${fmt(q1)} a ${fmt(q2)}`,'No cambia','No existe'],q2<q1?0:1,`A: ${fmt(q1)}; B: ${fmt(q2)}.`,'Calcula ambos márgenes.');},
()=>{let cf=24000,p=30,v=18,qstar=cf/(p-v),q=qstar+500,b=(p-v)*(q-qstar);return num('p38','reto','Beneficio',`CF=24.000 €, p=30 €, CVu=18 €. Si se venden ${q} unidades, calcula el beneficio.`,b,'€',`Q*=${fmt(qstar)}. Las ${q-qstar} unidades por encima aportan 12 € cada una: Bº=${b} €.`,'Puedes calcular IT−CT o usar el margen sobre Q*.');},
()=>{let cf=20000,p=25,v=15,qstar=cf/(p-v);return mcq('p39','reto','Sensibilidad',`CF=20.000, p=25, CVu=15. ¿Qué cambio reduciría más claramente Q*?`,['Subir CF a 25.000','Subir CVu a 18','Subir p a 30','Bajar p a 22'],2,`Q* inicial=${fmt(qstar)}. Subir p aumenta el margen y reduce Q*.`,'Busca aumentar p−CVu o reducir CF.');},
S(mcq('p40','reto','Síntesis','En una representación correcta del punto muerto deben aparecer como referencias esenciales...',['Solo IT','Solo CT','IT, CT, CF y el punto de corte','Únicamente Q* en el eje X'],2,'La gráfica permite ver origen de IT, CF, CT y el cruce IT=CT.','Piensa en todo lo necesario para interpretar pérdidas y beneficios.',{visual:{kind:'break-even'}}))
);
window.questionBanks.punto=breakEvenQuestions;