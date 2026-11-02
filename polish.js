/* ===== polish layer: route transitions, images, directed demo ===== */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)');
/* images: async decode, lazy, fade-in */
function prepImg(im){if(im._p)return;im._p=1;im.decoding='async';if(!im.closest('.dtiles'))im.loading='lazy';
 const done=()=>{im.classList.add('ld');im.parentElement&&im.parentElement.classList.add('lded')};
 if(im.complete&&im.naturalWidth)done();else{im.addEventListener('load',()=>{(im.decode?im.decode().catch(()=>{}):Promise.resolve()).then(()=>requestAnimationFrame(done))},{once:true});im.addEventListener('error',done,{once:true})}}
function prepAll(r){(r||document).querySelectorAll('img').forEach(prepImg)}
new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='IMG')prepImg(n);else prepAll(n)})}).observe(document.body,{childList:true,subtree:true});
/* route enter animation only on navigation, not on in-place rerenders */
const _render=window.render;let lastKey=null;
window.render=function(){const r=_render.apply(this,arguments);const desk=document.body.classList.contains('desk');const root=document.getElementById(desk?'dapp':'app');const key=location.hash+desk;
 if(root){root.querySelectorAll('.grid>.card,.dgrid>.dcard,.post,.fpost').forEach((c,i)=>c.style.setProperty('--i',Math.min(i,10)));
  if(key!==lastKey&&!RM.matches){root.classList.remove('r-enter');void root.offsetWidth;root.classList.add('r-enter');clearTimeout(root._re);root._re=setTimeout(()=>root.classList.remove('r-enter'),1100)}}
 lastKey=key;prepAll(root);
 const fq=$('#fq');if(fq){fq.oninput=()=>{st.q=fq.value;const rr=$('#feedres');if(!rr)return;clearTimeout(rr._t);rr.classList.add('swap');rr._t=setTimeout(()=>{const l=feedList();rr.innerHTML=l.length?mason(l,desk?3:2):EMPTY();rr.classList.remove('swap');rr.classList.remove('r-enter');void rr.offsetWidth;rr.classList.add('r-enter')},150)}}
 return r};
/* ---- directed demo: one timer, transform-only spotlight ---- */
const T=document.getElementById('tour');const spot=T.querySelector('.spot'),tip=T.querySelector('.tip');
let seq=0,auto=false,timer=0,paused=false,prog=null;
const wait=ms=>new Promise(r=>setTimeout(r,RM.matches?0:ms));
const host=()=>isDesk()?{left:0,top:0,W:innerWidth,H:innerHeight}:(()=>{const s=$('.screen'),b=s.getBoundingClientRect();return{left:b.left,top:b.top,W:s.clientWidth,H:s.clientHeight}})();
const scroller=()=>isDesk()?null:$('#app');
function smoothTo(el,start){return new Promise(res=>{const h=host(),r=el.getBoundingClientRect();const tall=r.height>h.H-260;const delta=tall||start?(r.top-h.top-90):(r.top-h.top+r.height/2)-h.H/2;
 const sc=scroller();const from=sc?sc.scrollTop:scrollY;const max=sc?sc.scrollHeight-sc.clientHeight:document.documentElement.scrollHeight-innerHeight;const to=Math.max(0,Math.min(max,from+delta));
 if(Math.abs(to-from)<2){res();return}
 if(RM.matches){sc?sc.scrollTop=to:scrollTo({top:to,behavior:'auto'});res();return}
 const dur=400,t0=performance.now(),e=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 (function f(now){const p=Math.min(1,(now-t0)/dur),y=from+(to-from)*e(p);sc?sc.scrollTop=y:scrollTo(0,y);p<1?requestAnimationFrame(f):res()})(t0)})}
const dwell=i=>((i===3||i===6)?2500:2000)*(window.DEMO_SLOW||1);
function tipHTML(s){const n=STEPS.length,i=tour.i;return `<div class="tbody"><div class="tstep">Шаг ${i+1} из ${n}<span class="tdots">${STEPS.map((_,k)=>`<b class="${k===i?'on':''}"></b>`).join('')}</span></div><div class="ttext">${s.t}</div></div><div class="tprog"><i></i></div><div class="tbtns"><button class="btn grey sm" id="tclose" onclick="tourEnd()">Закрыть</button><button class="btn grey sm" id="tauto" onclick="tourAuto()">${auto&&!paused?'❚❚ Пауза':'▶ Авто'}</button><span style="flex:1"></span>${i?'<button class="btn grey sm" id="tback" onclick="tourStep(-1)">Назад</button>':''}<button class="btn blue sm" id="tnext" onclick="${i<n-1?'tourStep(1)':'tourEnd()'}">${i<n-1?'Далее':'Готово'}</button></div>`}
function setProg(p,ms){const bar=tip.querySelector('.tprog i');if(!bar)return;prog&&prog.cancel();prog=null;tip.querySelector('.tprog').style.visibility=auto?'visible':'hidden';
 if(ms&&bar.animate){prog=bar.animate([{transform:`scaleX(${p})`},{transform:'scaleX(1)'}],{duration:ms,easing:'linear',fill:'forwards'})}else bar.style.transform=`scaleX(${p})`}
let dwellStart=0,dwellLeft=0;
function arm(ms){clearTimeout(timer);if(!auto||paused||!tour.on)return;dwellLeft=ms;dwellStart=performance.now();const total=dwell(tour.i);setProg(1-ms/total,ms);
 timer=setTimeout(()=>{if(!auto||!tour.on)return;tour.i<STEPS.length-1?tourStep(1):tourEnd()},ms)}
function typeInto(my){return new Promise(res=>{const i=$('#askq');if(!i){res();return}const txt='Позвоните мне +7 916 123-45-67';i.value='';let k=0;
 if(RM.matches){i.value=txt;checkQ();res();return}
 (function t(){if(my!==seq){res();return}i.value=txt.slice(0,++k);if(k===txt.length){checkQ();res()}else setTimeout(t,40)})()})}
async function place(my){if(!tour.on||my!==seq)return;const s=STEPS[tour.i];const sel=isDesk()?s.sel:(s.msel||s.sel);const el=sel&&$(sel);
 T.classList.add('on');const h=host();tip.innerHTML=tipHTML(s);const tw=Math.min(340,h.W-20);tip.style.width=tw+'px';setProg(0);
 if(!el){T.classList.add('dim');spot.style.opacity='0';const th=tip.offsetHeight;tip.style.transform=`translate3d(${(h.W-tw)/2}px,${(h.H-th)/2}px,0)`;requestAnimationFrame(()=>{if(my===seq)tip.classList.remove('hide')});arm(dwell(tour.i));return}
 await smoothTo(el,tour.i===2);if(my!==seq)return;
 const r=el.getBoundingClientRect();let x=r.left-h.left-6,y=r.top-h.top-6,w=r.width+12,hh=r.height+12;
 if(y<6){hh+=y-6;y=6}hh=Math.min(hh,h.H-y-230);hh=Math.max(hh,40);
 T.classList.remove('dim');spot.style.opacity='';spot.style.display='block';spot.style.width=w+'px';spot.style.height=hh+'px';spot.style.borderRadius='14px';spot.style.transform=`translate3d(${x}px,${y}px,0)`;
 const th=tip.offsetHeight,below=h.H-(y+hh)-12,above=y-12;let ty=below>=th+10||below>=above?y+hh+12:y-12-th;ty=Math.max(10,Math.min(ty,h.H-th-10));
 const tx=Math.min(Math.max(10,x),h.W-tw-10);tip.style.transform=`translate3d(${tx}px,${ty}px,0)`;
 requestAnimationFrame(()=>{if(my!==seq)return;spot.classList.remove('hide');tip.classList.remove('hide');spot.classList.remove('pulse');void spot.offsetWidth;spot.classList.add('pulse')});
 await wait(400);if(my!==seq)return;
 if(tour.i===3)await typeInto(my);if(my!==seq)return;arm(dwell(tour.i))}
async function go(){const my=++seq;clearTimeout(timer);prog&&prog.cancel();
 if(T.classList.contains('on')){spot.classList.add('hide');tip.classList.add('hide');await wait(150)}if(my!==seq||!tour.on)return;
 const s=STEPS[tour.i];const hsh=s.go();if(location.hash!==hsh)location.hash=hsh;else if(!/^#\/item\//.test(hsh))render();
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(my!==seq||!tour.on)return;place(my)}
STEPS[3].after=null;
window.tourGo=go;window.tourPlace=()=>{};
window.tourStep=d=>{tour.i=Math.max(0,Math.min(STEPS.length-1,tour.i+d));go()};
function pauseToggle(){if(!auto){auto=true;paused=false;arm(dwell(tour.i))}else if(paused){paused=false;arm(dwellLeft)}else{paused=true;clearTimeout(timer);prog&&prog.pause();dwellLeft=Math.max(0,dwellLeft-(performance.now()-dwellStart))}const b=$('#tauto');if(b)b.textContent=auto&&!paused?'❚❚ Пауза':'▶ Авто'}
window.tourAuto=pauseToggle;
T.addEventListener('click',e=>{if(e.target===T||e.target===spot)pauseToggle()});
window.tourStart=(a)=>{about(false);modal();const my=++seq;tour.on=true;tour.i=0;paused=false;auto=a!==false;spot.classList.add('hide');tip.classList.add('hide');const imgs=[...document.images].filter(i=>!i.complete).slice(0,24).map(i=>new Promise(r=>{i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true})}));Promise.race([Promise.all([document.fonts?document.fonts.ready:0,...imgs]),new Promise(r=>setTimeout(r,1200))]).then(()=>setTimeout(()=>{if(my===seq&&tour.on)go()},350))};
window.tourEnd=()=>{seq++;clearTimeout(timer);prog&&prog.cancel();tour.on=false;auto=false;paused=false;spot.classList.add('hide');tip.classList.add('hide');T.classList.remove('on');setTimeout(()=>{if(!tour.on)T.classList.remove('dim')},260);toast('Демо завершено')};
addEventListener('keydown',e=>{if(!tour.on)return;if(e.key==='Escape')tourEnd();else if(e.key===' '&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();pauseToggle()}else if(e.key==='ArrowRight'){tour.i<STEPS.length-1?tourStep(1):tourEnd()}else if(e.key==='ArrowLeft'&&tour.i)tourStep(-1)});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>tour.on&&place(seq),120)});
prepAll();
})();
