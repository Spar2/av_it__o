/* Приветственные слайды */
(function(){
const S=[
{h:'Привет! Это прототип Авито от команды «Я тебя клодну»',p:'Даём причину заходить в Авито между сделками. Одна петля: вопрос → ответ продавца для всех → пост у вещи → «Для вас» → новый визит.',img:null},
{h:'Ответ продавца видят все',p:'Спросили под объявлением, а продавец ответил один раз для всех. Лучший ответ виден прямо у цены, так что писать в чат и ждать не нужно. Телефоны и ссылки фильтр не пропустит.',img:'img/w_qa.jpg'},
{h:'Лента теперь на главной',p:'Переключатель «Объявления | Лента» есть прямо на главной. Там советы и опыт по вещам, которые вам интересны, а фильтры и интересы можно настроить под себя.',img:'img/w_feed.jpg'},
{h:'Посты привязаны к вещи',p:'Совет про iPhone 11 живёт рядом с iPhone 11: в объявлениях, на странице модели и в «Для вас». Поделиться опытом может любой. Гипотеза: новое о своей вещи будет возвращать вас и без сделки.',img:'img/w_model.jpg'},
{h:'Как смотреть прототип',p:'<span class="new">новое</span> — то, что придумали мы, <span class="wtag">уже есть</span> — то, что у Авито уже есть. Данные демонстрационные. «Пройти демо» проведёт по шагам, а «i» в углу откроет справку и сброс.',img:null,last:true}];
let i=0;const el=document.createElement('div');el.id='welcome';el.setAttribute('role','dialog');
el.innerHTML=`<div class="wcard"><div class="wtrack">${S.map((s,k)=>`<section class="wslide" data-k="${k}">${s.img?`<div class="wimg"><img src="${s.img}" alt="" width="1140" height="640" decoding="async"></div>`:`<div class="wlogo"><i></i><i></i><i></i><i></i></div>`}<h2>${s.h}</h2><p>${s.p}</p>${s.last?`<div class="wlast"><button class="btn blue" onclick="welcome(false);setTimeout(()=>tourStart(),300)">▶ Пройти демо</button><button class="btn grey" onclick="welcome(false)">Смотреть самому</button><button class="btn grey" onclick="welcome(false);setView(isDesk()?'mobile':'desktop')">📱 Открыть ${isDesk()?'мобильную':'ПК'} версию</button></div>`:''}</section>`).join('')}</div>
<div class="wnav"><button class="btn grey sm" id="wskip" onclick="welcome(false)">Пропустить</button><span class="wdots">${S.map(()=>'<b></b>').join('')}</span><button class="btn grey sm" id="wback" onclick="wgo(-1)">Назад</button><button class="btn blue sm" id="wnext" onclick="wgo(1)">Далее</button></div></div>`;
document.body.appendChild(el);
function upd(){el.querySelectorAll('.wslide').forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('prev',k<i)});el.querySelectorAll('.wdots b').forEach((d,k)=>d.classList.toggle('on',k===i));$('#wback').style.visibility=i?'visible':'hidden';$('#wnext').style.visibility=i<S.length-1?'visible':'hidden'}
window.wgo=d=>{i=Math.max(0,Math.min(S.length-1,i+d));upd()};
window.welcome=on=>{if(on){about(false);i=0;upd();el.classList.add('on')}else{el.classList.remove('on');LS.set('welcomed',true);setTimeout(hiFeed,350)}};
function hiFeed(){const b=document.querySelector('.seg [data-mode=feed],.dseg [data-mode=feed]');if(b&&!b.classList.contains('on')){b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');setTimeout(()=>b.classList.remove('hint'),4000)}}
addEventListener('keydown',e=>{if(!el.classList.contains('on'))return;if(e.key==='ArrowRight')wgo(1);else if(e.key==='ArrowLeft')wgo(-1);else if(e.key==='Escape')welcome(false)});
const sb=document.querySelector('#about .abtns');if(sb){const b=document.createElement('button');b.className='btn grey';b.textContent='Приветственные слайды';b.onclick=()=>welcome(true);sb.prepend(b)}
upd();
if(!LS.get('welcomed',false)&&!location.search.includes('qa')){const go=()=>requestAnimationFrame(()=>welcome(true));(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(go,250))}
})();
