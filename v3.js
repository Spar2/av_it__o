/* v3: фото, авторы, поиск, избранное, создание постов, онбординг, демо-тур */
const PH=D.photos||{};
const SVG={heart:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/></svg>',
 heartF:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#FF4053" stroke="#FF4053" stroke-width="1.8"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/></svg>',
 bell:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/></svg>',
 chat:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 cart:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
 pin:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2"/></svg>',
 search:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#888" stroke-width="2"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
 grid:'<svg viewBox="0 0 16 16" width="14" height="14" fill="#fff"><circle cx="3" cy="3" r="1.5"/><circle cx="8" cy="3" r="1.5"/><circle cx="13" cy="3" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/><circle cx="3" cy="13" r="1.5"/><circle cx="8" cy="13" r="1.5"/><circle cx="13" cy="13" r="1.5"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 11l18-8-8 18-2-8z"/></svg>'};
const hsh=s=>[...String(s)].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7);
img=function(m,cls='img',extra='',sty=''){const o=typeof m==='object'?m:{model:m};const M=D.models[o.model],list=PH[o.model];
 const bg=`background:linear-gradient(150deg,${M.color[0]},${M.color[1]})`;
 if(o.photo)return `<div class="${cls} ph" style="${sty}"><img src="${o.photo}" alt="">${extra}</div>`;
 if(!list||!list.length)return `<div class="${cls}" style="${sty}${bg}">${ICONS[M.icon]}${extra}</div>`;
 const i=o.ph!=null?o.ph:(o.id?hsh(o.id):0);const src=list[i%list.length];
 return `<div class="${cls} ph" style="${sty}${bg}"><img src="${src}" alt="${esc(M.name)}" loading="lazy" onerror="this.outerHTML=ICONS['${M.icon}']">${extra}</div>`};
/* ---- состояние v3 ---- */
st.fav=LS.get('fav',[]);st.myPosts=LS.get('myPosts',[]);st.chat=LS.get('chat',[]);st.intCats=LS.get('intCats',[]);st.atab='posts';
st.myPosts.slice().reverse().forEach(p=>{if(!P(p.id))D.posts.unshift(p)});
/* ---- авторы ---- */
const AUTH={};(()=>{const add=(n,role)=>{if(!AUTH[n])AUTH[n]={id:'a'+(Object.keys(AUTH).length+1),name:n,role,rating:4.8}};
 D.listings.forEach(l=>{add(l.seller,'Продавец');AUTH[l.seller].rating=l.sellerRating});D.posts.filter(p=>!p.ad).forEach(p=>add(p.author,p.role));add('Тихон','Покупатель')})();
const authorById=id=>Object.values(AUTH).find(a=>a.id===id);
const aHref=n=>AUTH[n]?'#/author/'+AUTH[n].id:'#/';
const aSpan=n=>`<span class="alink" onclick="event.preventDefault();event.stopPropagation();location.hash='${aHref(n)}'">${esc(n)}</span>`;
const TYPES={tip:'Совет',review:'Отзыв',question:'Вопрос',compare:'Сравнение'};
postCard=function(p){const M=D.models[p.model];const liked=st.liked[p.id];return `<a class="post" href="#/post/${p.id}">${img(p,'img','',`aspect-ratio:1/${p.h};`)}<div class="cb">${roleTag(p.role)}${p.type?` <span class="tag t-ty">${TYPES[p.type]}</span>`:''} <span class="au">${p.ad?esc(p.author):aSpan(p.author)}${isSub(p.author)?' <i class="subdot" title="Вы подписаны">✓</i>':''}</span><div class="pt" style="margin-top:5px">${esc(p.title)}</div><div class="pm"><span class="mchip" onclick="event.preventDefault();location.hash='#/model/${p.model}'">${memo(p.model)} ${M.name}</span>${p.ad?'':`<span onclick="event.preventDefault();like('${p.id}')">${liked?'❤️':'♡'} ${p.likes+(liked?1:0)}</span>`}</div></div></a>`};
const _postHead=postHead;postHead=p=>_postHead(p).replace(`<b>${esc(p.author)}</b>`,`<a class="alink b" href="${aHref(p.author)}">${esc(p.author)}</a>`);
const _sellerBox=sellerBox;sellerBox=l=>_sellerBox(l).replace(`<b style="color:#111">${esc(l.seller)}</b>`,`<a class="alink b" href="${aHref(l.seller)}">${esc(l.seller)}</a>`);
/* ---- избранное ---- */
const isFav=id=>st.fav.includes(id);
function toggleFav(id){const i=st.fav.indexOf(id);i<0?st.fav.push(id):st.fav.splice(i,1);LS.set('fav',st.fav);toast(i<0?'Добавлено в избранное':'Убрано из избранного');render()}
const heartBtn=id=>`<b class="hrt ${isFav(id)?'on':''}" data-fav="${id}" onclick="event.preventDefault();event.stopPropagation();toggleFav('${id}')">${isFav(id)?SVG.heartF:SVG.heart}</b>`;
dcard=function(l){return `<a class="dcard" href="#/item/${l.id}">${img(l,'img dimg')}<div class="dct"><span>${esc(l.title)}</span>${heartBtn(l.id)}</div><div class="dpr">${l.price}${l.old?`<span class="old">${l.old}</span>`:''}</div>${qaHint(l)}<div class="pl">${SVG.pin} ${l.place.replace('Москва, ','Москва, ')}</div></a>`};
const _card=card;card=l=>_card(l).replace('</div><div class="cb">',`${heartBtn(l.id)}</div><div class="cb">`).replace('class="card"','class="card rel"');
/* ---- шапка ПК ---- */
const SUG=[['Мобильные телефоны','phones'],['Ноутбуки','laptops'],['Фототехника','photo'],['Аудио','audio'],['Игры, приставки','games'],['Часы','vintage']];
dHeader=function(){const hh=location.hash.slice(2).split(/[/?]/)[0];const f=st.mode==='feed'&&(hh===''||hh==='feed');const sq=st.sq||'';
 return `<header class="dh"><div class="wrap"><div class="dtop"><a>💼 Для бизнеса ⌄</a><a>Карьера в Авито</a><a>Помощь</a><a>Каталоги ⌄</a><a>#яПомогаю</a><span style="flex:1"></span>
 <a class="dlink" onclick="toast('Размещение — вне прототипа')">＋ Разместить объявление</a><a class="dlink" onclick="toast('Мои объявления — вне прототипа')">▢ Мои объявления</a>
 <a class="ic" href="#/fav" title="Избранное">${SVG.heart}<b>${44+st.fav.length}</b></a><a class="ic" onclick="toast('Уведомления — вне прототипа')">${SVG.bell}<b>3</b></a><a class="ic" href="#/chat" title="Сообщения">${SVG.chat}<b>${22+st.chat.length}</b></a><a class="ic" onclick="toast('Корзина — вне прототипа')">${SVG.cart}<b>44</b></a><a class="wal" onclick="toast('Кошелёк — вне прототипа')"><i class="coin"></i>7 940</a><a class="ava dava" onclick="toast('Профиль — вне прототипа')">Т</a></div>
 <div class="dsr"><a class="logo" href="#/" onclick="st.mode='search';LS.set('mode','search')"><span class="dots"><i></i><i></i><i></i><i></i></span>Avito</a>
 <button class="dall ${st.mega?'on':''}" id="megabtn" onclick="st.mega=!st.mega;render()">${st.mega?'✕':SVG.grid} Все категории</button>
 <div class="dsearch">${SVG.search}${f?`<input id="fq" placeholder="Поиск по ленте" value="${esc(st.q)}">`:`<input id="sq" placeholder="Поиск по объявлениям" value="${esc(sq)}" autocomplete="off" onfocus="sugShow()" oninput="st.sq=this.value;sugShow()" onkeydown="if(event.key==='Enter')doSearch()">`}<button class="btn blue" id="findbtn" onclick="${f?'':'doSearch()'}">Найти</button><div id="sug"></div></div>
 <a class="geo">${SVG.arrow} Москва и Московская<br>область</a></div></div>${st.mega?megaHTML():''}</header>`};
function sugShow(){const box=$('#sug');if(!box)return;const q=(st.sq||'').trim().toLowerCase();
 const ms=Object.entries(D.models).filter(([k,M])=>!q||M.name.toLowerCase().includes(q)).slice(0,5);const cs=SUG.filter(c=>!q||c[0].toLowerCase().includes(q));
 box.innerHTML=(ms.map(([k,M])=>`<a onmousedown="st.sq='${esc(M.name)}';doSearch()">${img(k,'img si')}<span>${q?M.name.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','i'),'<b>$1</b>'):M.name}</span><em>${D.listings.filter(l=>l.model===k).length} объявл.</em></a>`).join('')+cs.map(c=>`<a onmousedown="st.sq='';location.hash='#/search?cat=${c[1]}'"><span class="sico">▤</span><span>${c[0]}</span></a>`).join(''))||'<div class="muted" style="padding:10px 14px">Ничего не нашлось</div>';
 box.classList.add('on')}
document.addEventListener('mousedown',e=>{if(!e.target.closest('.dsearch'))$('#sug')?.classList.remove('on')});
function doSearch(){$('#sug')?.classList.remove('on');location.hash='#/search?q='+encodeURIComponent(st.sq||'')}
/* категории: плитки и мегаменю */
const TILEMAP={'Электроника':'el','Авто':'auto','Недвижимость':'realty','Жильё для путешествия':'travel','Для дома и дачи':'home','Запчасти':'parts','Услуги':'serv','Работа и подработка':'job','Бизнес 360':'biz','Одежда, обувь, аксессуары':'wear'};
const TILEIMG={'Электроника':'iphone11_7','Для дома и дачи':null};
dTiles=function(){return `<div class="dtiles"><div class="tgrid">${DCATS.map(([n,e],i)=>`<a class="dtile t${i}" data-tile="${TILEMAP[n]}" href="#/search?cat=${TILEMAP[n]}"><span>${n}</span>${n==='Электроника'?`<img src="img/iphone11_7.jpg" alt="">`:`<i>${e}</i>`}</a>`).join('')}</div>
 <div class="biz"><b>Всё для бизнеса</b><div class="bz"><span><i>🖨</i>Оборудо&shy;вание</span><span><i>🏢</i>Помещения</span><span><i>📦</i>Товары</span></div><button class="bzbtn" onclick="toast('Бизнес 360 — вне прототипа')">◎ Искать в Бизнес 360</button></div></div>`};
const ELSUB={'Телефоны':'phones','Ноутбуки':'laptops','Фототехника':'photo','Аудио и видео':'audio','Игры, приставки и программы':'games','Планшеты и электронные книги':'books','Часы и украшения':'vintage'};
const _mega=megaHTML;megaHTML=()=>_mega().replace(/<a>([^<]+)<\/a>/g,(m,t)=>`<a href="#/search?cat=${ELSUB[t]||(MEGA[st.megaCat][0]==='Электроника'?'el':'other')}">${t}</a>`).replace(/<h3>([^<]+)<\/h3>/,(m,t)=>`<h3><a href="#/search?cat=${t==='Электроника'?'el':'other'}">${t} ›</a></h3>`);
/* ---- поиск ---- */
const CATN={el:'Электроника',phones:'Телефоны',laptops:'Ноутбуки',photo:'Фототехника',audio:'Аудио',games:'Игры, приставки',vintage:'Часы',books:'Электронные книги'};
const pnum=s=>+String(s).replace(/\D/g,'');
function searchParams(){const q=location.hash.split('?')[1]||'';return Object.fromEntries(new URLSearchParams(q))}
function searchRes(p){const q=(p.q||'').toLowerCase().trim();const cat=p.cat||'';
 if(cat&&!CATN[cat])return null;let ls=D.listings.filter(l=>{const M=D.models[l.model];return (!q||(l.title+' '+M.name+' '+(CATN[M.cat]||'')).toLowerCase().includes(q))&&(!cat||cat==='el'||M.cat===cat)});
 if(p.from)ls=ls.filter(l=>pnum(l.price)>=+p.from);if(p.to)ls=ls.filter(l=>pnum(l.price)<=+p.to);if(p.ans)ls=ls.filter(l=>l.questions.some(x=>x.answer));
 if(p.sort==='cheap')ls.sort((a,b)=>pnum(a.price)-pnum(b.price));return ls}
function setSP(k,v){const p=searchParams();if(v===''||v==null||v===false)delete p[k];else p[k]=v;location.hash='#/search?'+new URLSearchParams(p)}
function dSearch(){const p=searchParams(),ls=searchRes(p);const title=p.q?`«${esc(p.q)}»`:p.cat?(CATN[p.cat]||'Категория'):'Все объявления';
 return `<div class="wrap">${crumbs([['Главная','#/'],['Москва и МО'],[p.cat&&CATN[p.cat]?CATN[p.cat]:'Поиск']])}<h1 class="dh1 s">${p.q?'Объявления по запросу ':''}${title} <span class="cnt2">${ls?ls.length:0}</span></h1>
 <div class="sres"><aside class="sfil"><div class="fl">Категория</div><div class="catl">${[['','Любая'],['el','Электроника'],['phones','Телефоны'],['laptops','Ноутбуки'],['photo','Фототехника'],['audio','Аудио'],['games','Игры, приставки'],['vintage','Часы'],['books','Электронные книги']].map(([k,n])=>`<a class="${(p.cat||'')===k?'on':''}" onclick="setSP('cat','${k}')">${n}</a>`).join('')}</div>
 <div class="fl">Цена, ₽</div><div class="prr"><input id="pf" placeholder="от" value="${p.from||''}" inputmode="numeric"><input id="pt" placeholder="до" value="${p.to||''}" inputmode="numeric"></div>
 <label class="cbx"><input type="checkbox" id="ansf" ${p.ans?'checked':''} onchange="setSP('ans',this.checked?'1':'')"> Только с ответами продавца <span class="new">новое</span></label>
 <button class="btn blue full" id="applyf" onclick="const p=searchParams();p.from=$('#pf').value;p.to=$('#pt').value;Object.keys(p).forEach(k=>!p[k]&&delete p[k]);location.hash='#/search?'+new URLSearchParams(p)">Показать ${ls?ls.length:0} объявл.</button>
 <a class="lnk" href="#/search">Сбросить фильтры</a></aside>
 <section><div class="sbar2"><span class="muted">Сортировка:</span> <a class="${p.sort!=='cheap'?'on':''}" onclick="setSP('sort','')">По умолчанию</a> <a class="${p.sort==='cheap'?'on':''}" onclick="setSP('sort','cheap')">Дешевле</a></div>
 ${ls===null?`<div class="stub"><div style="font-size:40px">🗂</div><h3>В прототипе есть только Электроника</h3><p class="muted">Раздел есть на Авито, но для демо мы наполнили только электронику.</p><a class="btn blue" href="#/search?cat=el" style="display:inline-block;margin-top:12px">Открыть Электронику</a></div>`:ls.length?`<div class="dgrid c4" id="sresgrid">${ls.map(dcard).join('')}</div>`:`<div class="stub"><h3>Ничего не нашлось</h3><p class="muted">Попробуйте изменить запрос или фильтры.</p></div>`}</section></div></div>`}
function mSearch(){const p=searchParams(),ls=searchRes(p);return `<div class="top"><a class="back" onclick="history.back()">‹</a>${p.q?esc(p.q):CATN[p.cat]||'Поиск'}</div>${ls===null?'<div class="stub"><h3>В прототипе есть только Электроника</h3></div>':`<div class="grid">${ls.map(card).join('')}</div>`}`}
/* ---- избранное и чат ---- */
function favGrid(desk){const ls=D.listings.filter(l=>isFav(l.id));return ls.length?(desk?`<div class="dgrid">${ls.map(dcard).join('')}</div>`:`<div class="grid">${ls.map(card).join('')}</div>`):`<div class="muted" style="padding:16px 8px">Нажмите ♡ на объявлении — оно появится здесь.</div>`}
const moved=`<div class="movednote">✨ <b>Лента переехала на главную.</b> Раньше она была во вкладке Избранного, теперь — переключатель «Объявления | Лента» на главной. <a onclick="st.mode='feed';LS.set('mode','feed');location.hash='#/feed'">Открыть Ленту ›</a></div>`;
dFav=()=>`<div class="wrap">${crumbs([['Главная','#/'],['Избранное']])}<h1 class="dh1">Избранное</h1><div class="dsegt"><a class="on">Объявления ${st.fav.length}</a><a onclick="toast('Поиски — вне прототипа')">Поиски</a><a onclick="toast('Продавцы — вне прототипа')">Продавцы</a></div>${moved}<div id="favgrid">${favGrid(true)}</div></div>`;
favM=()=>`<div class="top">Избранное</div>${moved}<div id="favgrid">${favGrid(false)}</div>`;
function chatPage(desk){const msgs=st.chat;const body=msgs.length?msgs.map(m=>{const l=L(m.l);return `<div class="chrow"><div class="chl">${img(l,'img mi')}<div><b>${esc(l.seller)}</b> · <span class="muted">${esc(l.title)}</span><div class="bub">${esc(m.text)}</div><div class="muted" style="font-size:12px">Приватный вопрос по лоту · ✓ доставлено</div></div></div></div>`}).join(''):`<div class="muted">Пока пусто. В объявлении переключите «Публично» → «Приватно» и задайте вопрос — он придёт сюда.</div>`;
 return desk?`<div class="wrap">${crumbs([['Главная','#/'],['Сообщения']])}<h1 class="dh1">Сообщения</h1><div class="box">${body}</div></div>`:`<div class="top">Сообщения</div><div class="sec">${body}</div>`}
sendQ=function(id){const v=$('#askq').value.trim();if(!v)return;if(CONTACT.test(v)){checkQ();toast('Уберите контакты из вопроса');return}
 if(!st.askAll){st.chat.push({l:id,text:v});LS.set('chat',st.chat);toast('Отправлено продавцу в чат — см. «Сообщения»');$('#askq').value='';render();return}
 (st.myQ[id]=st.myQ[id]||[]).push({user:'Вы',text:v,answer:'',mine:true});LS.set('myQ',st.myQ);render();toast('Вопрос опубликован');setTimeout(()=>$('#askq')?.scrollIntoView({block:'center'}),50)};
/* ---- страница автора ---- */
function authorPage(id,desk){const a=authorById(id);const ps=D.posts.filter(p=>p.author===a.name),ls=D.listings.filter(l=>l.seller===a.name);
 const ans=ls.flatMap(l=>l.questions.filter(q=>q.answer).map(q=>({...q,l})));const models=[...new Set(ps.map(p=>p.model).concat(ls.map(l=>l.model)))];
 const stars='★'.repeat(Math.round(a.rating))+'☆'.repeat(5-Math.round(a.rating));
 const tab=st.atab;const tabs=[['posts','Посты',ps.length],['lots','Объявления',ls.length],['ans','Ответы',ans.length]];
 const content=tab==='posts'?(ps.length?(desk?`<div class="dmason">${mason(ps,5)}</div>`:mason(ps)):'<div class="muted">Постов пока нет</div>'):tab==='lots'?(ls.length?(desk?`<div class="dgrid c4">${ls.map(dcard).join('')}</div>`:`<div class="grid">${ls.map(card).join('')}</div>`):'<div class="muted">Объявлений нет</div>')
  :(ans.length?ans.map(q=>`<div class="q">❓ ${esc(q.text)}<div class="ans"><span class="tag t-s">Продавец</span> ${esc(q.answer)}</div><div class="qact"><span>👍 ${q.likes}</span><a style="color:var(--blue)" href="#/item/${q.l.id}">«${esc(q.l.title)}»</a></div></div>`).join(''):'<div class="muted">Ответов нет</div>');
 const head=`<div class="ahead"><span class="ava abig">${esc(a.name[0])}</span><div style="flex:1"><h1 class="dh1" style="margin:0">${esc(a.name)}</h1><div style="margin-top:4px">${roleTag(a.role)} <span class="stars">${stars}</span> <b>${a.rating.toFixed(1)}</b> <span class="muted">· рейтинг демо · на Авито с 2019</span></div>
  <div class="mlist">${models.map(k=>`<a class="mchip" href="#/model/${k}">${memo(k)} ${D.models[k].name}</a>`).join(' ')}</div></div>${a.name==='Тихон'?'<span class="muted">Это вы</span>':subBtn(a.name)}</div>`;
 const tb=`<div class="dsegt">${tabs.map(([k,n,c])=>`<a class="${tab===k?'on':''}" data-atab="${k}" onclick="st.atab='${k}';render()">${n} <span class="muted">${c}</span></a>`).join('')}</div>`;
 return desk?`<div class="wrap">${crumbs([['Главная','#/'],['Лента','#/feed'],[a.name]])}${head}${tb}<div style="padding-bottom:40px">${content}</div></div>`:`<div class="top"><a class="back" onclick="history.back()">‹</a>Профиль</div><div class="sec">${head}</div><div class="sec">${tb}${content}</div>`}
/* ---- создание поста ---- */
let draft=null;
function openCreate(model){draft={model:model||'',type:'tip',title:'',text:'',photo:'',mq:''};drawCreate()}
function drawCreate(){const d=draft;const ms=Object.entries(D.models).filter(([k,M])=>!d.mq||M.name.toLowerCase().includes(d.mq.toLowerCase()));
 const role=D.listings.some(l=>l.seller==='Тихон'&&l.model===d.model)?'Продавец':'Покупатель';
 modal(`<div class="mhead"><h3>Поделиться опытом <span class="new">новое</span></h3><button class="x" onclick="modal()">✕</button></div>
 <div class="fl">Модель</div>${d.model?`<div class="selm">${img(d.model,'img mi')}<b>${D.models[d.model].name}</b><a class="lnk" onclick="draft.model='';drawCreate()">Изменить</a></div>`:
 `<input class="inp" id="cmq" placeholder="Найти модель: iPhone, MacBook, Seiko…" value="${esc(d.mq)}" oninput="draft.mq=this.value;drawCreate();const e=$('#cmq');e.focus();e.setSelectionRange(99,99)"><div class="mpick">${ms.map(([k,M])=>`<a data-pick="${k}" onclick="draft.model='${k}';drawCreate()">${img(k,'img mi')}<span>${M.name}</span></a>`).join('')||'<span class="muted">Нет такой модели в каталоге</span>'}</div>`}
 <div class="fl">Тип поста</div><div class="seg3">${Object.entries(TYPES).map(([k,n])=>`<button class="${d.type===k?'on':''}" onclick="saveDraft();draft.type='${k}';drawCreate()">${n}</button>`).join('')}</div>
 <div class="fl">Заголовок</div><input class="inp" id="ctitle" maxlength="90" placeholder="Например: Как проверить батарею перед покупкой" value="${esc(d.title)}">
 <div class="fl">Текст</div><textarea class="inp" id="ctext" rows="4" placeholder="Что важно знать о вещи. Без телефонов и ссылок.">${esc(d.text)}</textarea>
 <div class="fl">Фото</div><label class="upl">${d.photo?`<img src="${d.photo}" alt="">`:'＋ Добавить фото'}<input type="file" accept="image/*" id="cfile" onchange="pickPhoto(this)" hidden></label>
 <div class="muted" style="margin-top:8px">Метка автора: ${roleTag(role)} — ставится автоматически (${role==='Продавец'?'у вас есть объявление этой модели':'у вас нет объявлений этой модели'}).</div>
 <div class="warn" id="cwarn">Похоже на контакты (телефон, @ник или ссылка). В постах их нельзя — общайтесь в чате Авито.</div>
 <button class="btn blue full" id="cpub" style="margin-top:12px" onclick="publish()">Опубликовать</button>`)}
function saveDraft(){if(!$('#ctitle'))return;draft.title=$('#ctitle').value;draft.text=$('#ctext').value}
function pickPhoto(inp){saveDraft();const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,600/Math.max(im.width,im.height));c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);
 let u=c.toDataURL('image/jpeg',.7);if(u.length>300000){draft.photoNote=true;u=URL.createObjectURL(f);toast('Фото большое — сохранится только до перезагрузки')}draft.photo=u;drawCreate()};im.src=r.result};r.readAsDataURL(f)}
function publish(){saveDraft();const d=draft;if(!d.model){toast('Выберите модель');return}if(d.title.trim().length<3){toast('Добавьте заголовок');return}
 if(CONTACT.test(d.title+' '+d.text)){$('#cwarn').classList.add('on');toast('Уберите контакты из поста');return}
 const role=D.listings.some(l=>l.seller==='Тихон'&&l.model===d.model)?'Продавец':'Покупатель';
 const p={id:'u'+Date.now(),ago:0,model:d.model,role,author:'Тихон',type:d.type,h:1.2,title:d.title.trim(),text:d.text.trim()||'—',likes:0,comments:[],mine:true};if(d.photo&&d.photo.startsWith('data:'))p.photo=d.photo;
 D.posts.unshift(p);st.myPosts.unshift(p);LS.set('myPosts',st.myPosts.filter(x=>!x.photo||x.photo.startsWith('data:')));if(d.photo&&!p.photo)p.photo=d.photo;
 modal();st.mode='feed';LS.set('mode','feed');st.tab='foryou';st.chip='all';st.fmodel='';st.q='';st.sort='new';
 if(location.hash==='#/feed')render();else location.hash='#/feed';toastLink('Пост опубликован',`#/post/${p.id}`)}
function toastLink(t,h){const e=$('#toast');e.innerHTML=`${t} · <a href="${h}" style="color:#7fd0ff;pointer-events:auto">Открыть</a>`;e.classList.add('on','link');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on','link'),4000)}
const shareBtn=m=>`<button class="btn share" id="sharebtn" onclick="openCreate('${m||''}')">✍ Поделиться опытом <span class="new">новое</span></button>`;
/* ---- онбординг ---- */
let pick=null;
function needOnb(){return !LS.get('onb',false)}
function openOnb(){pick=pick||{m:[],c:[]};const n=pick.m.length+pick.c.length;
 modal(`<div class="onb"><h3>Что вам интересно?</h3><p class="muted">Выберите 3–5 моделей или категорий — с них начнётся ваша Лента. Мы также учтём то, что вы смотрели и сохраняли.</p>
 <div class="ogrid">${Object.entries(D.models).map(([k,M])=>`<a class="ot ${pick.m.includes(M.name)?'on':''}" data-onb="${k}" onclick="onbT('m','${esc(M.name)}')">${img(k,'img')}<span>${M.name}</span></a>`).join('')}</div>
 <div class="fl">Категории</div><div class="qchips">${D.chips.filter(c=>c.id!=='all').map(c=>`<span class="oc ${pick.c.includes(c.id)?'on':''}" data-onbc="${c.id}" onclick="onbT('c','${c.id}')">${c.name}</span>`).join('')}</div>
 <div class="obtns"><button class="btn grey" onclick="onbDone(true)">Пропустить</button><button class="btn blue" id="onbdone" ${n<3?'disabled':''} onclick="onbDone()">${n<3?`Выберите ещё ${3-n}`:`Готово · ${n}`}</button></div></div>`)}
function onbT(k,v){const a=pick[k],i=a.indexOf(v);if(i>=0)a.splice(i,1);else{if(pick.m.length+pick.c.length>=5){toast('Не больше 5 — можно поменять потом');return}a.push(v)}openOnb()}
function onbDone(skip){LS.set('onb',true);if(!skip){st.interests=pick.m.slice();st.intCats=pick.c.slice();LS.set('interests',st.interests);LS.set('intCats',st.intCats);st.useInt=true;toast('Лента настроена под ваши интересы')}modal();pick=null;render()}
feedList=function(){const q=st.q.trim().toLowerCase();let ps=D.posts.slice();const subsOnly=st.tab==='subs'||st.onlySubs;
 if(subsOnly)ps=ps.filter(p=>!p.ad&&isSub(p.author));if(st.chip!=='all')ps=ps.filter(p=>D.models[p.model].cat===st.chip);if(st.fmodel)ps=ps.filter(p=>p.model===st.fmodel);
 if(st.role!=='all')ps=ps.filter(p=>p.role===st.role);if(q)ps=ps.filter(p=>(p.title+' '+p.text+' '+p.author+' '+D.models[p.model].name).toLowerCase().includes(q));
 const ad=ps.find(p=>p.ad);ps=ps.filter(p=>!p.ad);ps.sort(st.sort==='pop'?(a,b)=>b.likes-a.likes:(a,b)=>a.ago-b.ago);
 if(st.useInt&&!subsOnly){const ids=st.interests.map(modelByName);const r=p=>p.mine&&p.ago===0?-1:ids.includes(p.model)?0:st.intCats.includes(D.models[p.model].cat)?1:2;ps=ps.map((p,i)=>[p,i]).sort((a,b)=>r(a[0])-r(b[0])||a[1]-b[1]).map(x=>x[0])}
 if(ad&&!subsOnly)ps.splice(Math.min(3,ps.length),0,ad);return ps};
const _dFeed=dFeed;dFeed=()=>_dFeed().replace('<section class="fmain"><div class="fhead">',`<section class="fmain"><div class="fhead">`).replace(/(<section class="fmain"><div class="fhead">.*?<\/span>)(<\/div>)/s,`$1<span style="flex:1"></span>${shareBtn()}$2`);
const _mFeedBody=mFeedBody;mFeedBody=()=>(st.tab!=='models'?`<div style="padding:6px 8px 0">${shareBtn()}</div>`:'')+_mFeedBody();
const _dModel=dModel;dModel=id=>_dModel(id).replace(/(Посты о модели<span class="new">новое<\/span><\/span>)/,`$1${shareBtn(id).replace('id="sharebtn"','id="sharebtn" style="height:36px"')}`);
const _model=model;model=id=>_model(id).replace(/(Посты о модели<span class="new">новое<\/span><\/span>)/,`$1${shareBtn(id).replace('class="btn share"','class="btn share sm"')}`);
/* ---- сброс ---- */
function resetDemo(){Object.keys(localStorage).filter(k=>k.startsWith('avp3_')).forEach(k=>localStorage.removeItem(k));location.hash='#/';location.reload()}
/* ---- роутер ---- */
render=function(){const desk=isDesk();const h0=location.hash.slice(2).split('?')[0].split('/')[0];document.body.className=(desk?'desk':'mob')+(desk&&((st.mode==='feed'&&(h0===''||h0==='feed'))||h0==='author')?' wide':'');
 const host=desk?document.body:$('.screen');['#about','#modal','#toast','#tour','.demobtn'].forEach(s=>{const e=$(s);if(e&&e.parentNode!==host)host.appendChild(e)});
 const h=location.hash.slice(2).split('?')[0].split('/');if(h[0]==='feed')st.mode='feed';
 const root=desk?$('#dapp'):$('#app');const sc=desk?scrollY:root.scrollTop;let html;
 if(h[0]==='item'&&L(h[1]))html=desk?dItem(h[1]):item(h[1]);else if(h[0]==='post'&&P(h[1]))html=desk?dPost(h[1]):post(h[1]);
 else if(h[0]==='model'&&D.models[h[1]])html=desk?dModel(h[1]):model(h[1]);else if(h[0]==='fav')html=desk?dFav():favM();
 else if(h[0]==='author'&&authorById(h[1]))html=authorPage(h[1],desk);else if(h[0]==='search')html=desk?dSearch():mSearch();else if(h[0]==='chat')html=chatPage(desk);
 else html=desk?dHome():home();
 root.innerHTML=(desk?dHeader():'')+html;const key=location.hash+desk;const same=render._h===key;if(desk)scrollTo(0,same?sc:0);else root.scrollTop=same?sc:0;render._h=key;
 document.querySelectorAll('.tabbar .tab').forEach(t=>t.classList.toggle('on',t.dataset.r===(h[0]==='fav'?'fav':h[0]==='chat'?'chat':'home')));
 const fq=$('#fq');if(fq){fq.oninput=()=>{st.q=fq.value;const r=$('#feedres');if(!r)return;const l=feedList();r.innerHTML=l.length?mason(l,desk?3:2):EMPTY()}}
 const onFeed=st.mode==='feed'&&(h[0]===''||h[0]==='feed');if(onFeed&&needOnb()&&!tour.on&&!$('#modal').classList.contains('on'))setTimeout(openOnb,120);
 };
/* ---- демо-тур ---- */
const tour={on:false,i:0};
const STEPS=[
 {go:()=>{st.mode='search';LS.set('mode','search');return '#/'},sel:'.dgrid .dcard:first-child .qa',msel:'.grid .card:first-child .qa',t:'Ответы продавца видны прямо в карточке, рядом с ценой — ещё до того, как вы открыли объявление.'},
 {go:()=>'#/item/l1',sel:'.rc .topans',msel:'.topans',t:'В объявлении главный ответ продавца стоит рядом с ценой. Не нужно писать в чат и ждать.'},
 {go:()=>'#/item/l1',sel:'#qsec',t:'Вопросы о вещи: продавец отвечает один раз, ответ видят все покупатели.'},
 {go:()=>'#/item/l1',sel:'#askbox',after:()=>{const i=$('#askq');if(i){i.value='Позвоните мне +7 916 123-45-67';checkQ()}},t:'Если в вопросе есть телефон или ник в мессенджере, мы его не пропустим: сделка остаётся на Авито.'},
 {go:()=>'#/model/iphone11',sel:'#bestans',t:'На странице модели собраны лучшие ответы продавцов из всех объявлений iPhone 11.'},
 {go:()=>{st.mode='search';LS.set('mode','search');return '#/'},sel:'.dseg',msel:'.seg',t:'Над выдачей появился переключатель: обычные объявления или Лента с опытом владельцев.'},
 {go:()=>{st.mode='feed';LS.set('mode','feed');LS.set('onb',true);return '#/feed'},sel:'.fcol',msel:'.chips',t:'Ленту можно настроить: категории, кто пишет, свежее или популярное, только подписки, учёт интересов.'},
 {go:()=>'#/feed',sel:'.rcol .box:first-child',msel:'.ftabs',t:'На интересных авторов можно подписаться. Но главное в Ленте — по-прежнему модели вещей.'},
 {go:()=>'#/author/'+AUTH['Алексей'].id,sel:'.ahead',t:'У автора есть страница: его посты, объявления, ответы и модели, о которых он пишет.'},
 {go:()=>'#/feed',sel:'#sharebtn',t:'Любой может поделиться опытом: выбрать модель, тип поста, добавить текст и фото.'},
 {go:()=>'#/',sel:null,t:'Это всё. Данные в прототипе условные — можно кликать дальше самостоятельно.'}];
function tourStart(){about(false);modal();tour.on=true;tour.i=0;tourGo()}
function tourGo(){const s=STEPS[tour.i];const h=s.go();if(location.hash!==h)location.hash=h;else render();setTimeout(()=>{s.after&&s.after();tourPlace()},250)}
function tourPlace(){if(!tour.on)return;const s=STEPS[tour.i],T=$('#tour');T.classList.add('on');const sel=isDesk()?s.sel:(s.msel||s.sel);const el=sel&&$(sel);
 const spot=T.querySelector('.spot'),tip=T.querySelector('.tip');
 tip.innerHTML=`<div class="tstep">Шаг ${tour.i+1} из ${STEPS.length}</div><div class="ttext">${s.t}</div><div class="tbtns"><button class="btn grey sm" id="tclose" onclick="tourEnd()">Закрыть</button><span style="flex:1"></span>${tour.i?'<button class="btn grey sm" id="tback" onclick="tour.i--;tourGo()">Назад</button>':''}<button class="btn blue sm" id="tnext" onclick="${tour.i<STEPS.length-1?'tour.i++;tourGo()':'tourEnd()'}">${tour.i<STEPS.length-1?'Далее':'Готово'}</button></div>`;
 if(!el){spot.style.cssText='display:none';T.classList.add('dim');tip.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%)';return}
 T.classList.remove('dim');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect(),base=isDesk()?{left:0,top:0}:$('.screen').getBoundingClientRect(),W=isDesk()?innerWidth:$('.screen').clientWidth,H=isDesk()?innerHeight:$('.screen').clientHeight;
 const x=r.left-base.left-6,y=r.top-base.top-6,w=r.width+12,hh=Math.min(r.height+12,H-20);spot.style.cssText=`display:block;left:${x}px;top:${y}px;width:${w}px;height:${hh}px`;
 const tw=Math.min(340,W-20);let tx=Math.min(Math.max(10,x),W-tw-10),ty=y+hh+12;if(ty+170>H)ty=Math.max(10,y-182);if(ty<10||(ty+170>H))ty=H-190;tip.style.cssText=`left:${tx}px;top:${ty}px;width:${tw}px`}
function tourEnd(){tour.on=false;$('#tour').classList.remove('on');toast('Демо завершено')}
window.addEventListener('resize',()=>tour.on&&tourPlace());
/* ---- старт ---- */
render();
if(!LS.get('seenAbout',false)&&!location.search.includes('qa')){LS.set('seenAbout',true);setTimeout(()=>about(true),400)}
