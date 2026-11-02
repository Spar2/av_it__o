const D=window.DATA, $=s=>document.querySelector(s);
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('avp3_'+k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('avp3_'+k,JSON.stringify(v))}catch(e){}}};
let st={mode:LS.get('mode','search'),tab:'foryou',chip:'all',q:'',role:LS.get('role','all'),sort:LS.get('sort','new'),useInt:LS.get('useInt',true),onlySubs:false,fmodel:'',
 interests:LS.get('interests',D.interestsDefault),subs:LS.get('subs',['Алексей','Ника']),myQ:LS.get('myQ',{}),cm:LS.get('cm',{}),liked:LS.get('liked',{}),askAll:true,mega:false,megaCat:0};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1900)}
function about(on){$('#about').classList.toggle('on',on)}
function modal(html){const m=$('#modal');if(!html){m.classList.remove('on');return}m.querySelector('.sheet').innerHTML=html;m.classList.add('on')}
const ICONS={
phone:'<svg viewBox="0 0 100 100"><rect x="30" y="8" width="40" height="84" rx="9" fill="#1d1d1f"/><rect x="33" y="12" width="34" height="76" rx="6" fill="url(#g)"/><rect x="43" y="14" width="14" height="4" rx="2" fill="#1d1d1f"/><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#7fd0ff"/><stop offset="1" stop-color="#965EEB"/></linearGradient></defs></svg>',
camera:'<svg viewBox="0 0 100 100"><rect x="12" y="30" width="76" height="48" rx="8" fill="#2b2b2e"/><rect x="18" y="24" width="22" height="10" rx="3" fill="#2b2b2e"/><circle cx="56" cy="54" r="19" fill="#111"/><circle cx="56" cy="54" r="12" fill="#3a5a8a"/><circle cx="52" cy="50" r="4" fill="#9cc8ff"/></svg>',
laptop:'<svg viewBox="0 0 100 100"><rect x="18" y="22" width="64" height="42" rx="4" fill="#c9cbd1"/><rect x="22" y="26" width="56" height="34" rx="2" fill="url(#l)"/><path d="M8 68h84l-6 8H14z" fill="#b5b8bf"/><defs><linearGradient id="l" x2="1" y2="1"><stop offset="0" stop-color="#965EEB"/><stop offset="1" stop-color="#00AAFF"/></linearGradient></defs></svg>',
buds:'<svg viewBox="0 0 100 100"><rect x="22" y="40" width="56" height="42" rx="16" fill="#fff" stroke="#ddd" stroke-width="2"/><path d="M36 18c-8 0-10 12-4 15l2 18h6V22z" fill="#fff" stroke="#ccc" stroke-width="2"/><path d="M64 18c8 0 10 12 4 15l-2 18h-6V22z" fill="#fff" stroke="#ccc" stroke-width="2"/><circle cx="50" cy="62" r="3" fill="#00C853"/></svg>',
console:'<svg viewBox="0 0 100 100"><path d="M34 10c10 0 14 4 14 10v62c0 6-4 8-14 8z" fill="#fff" stroke="#ccc" stroke-width="2"/><path d="M66 10c-10 0-14 4-14 10v62c0 6 4 8 14 8z" fill="#fff" stroke="#ccc" stroke-width="2"/><rect x="47" y="12" width="6" height="76" fill="#111"/></svg>',
watch:'<svg viewBox="0 0 100 100"><rect x="38" y="6" width="24" height="88" rx="6" fill="#8a5a2b"/><circle cx="50" cy="50" r="24" fill="#d8b46a"/><circle cx="50" cy="50" r="19" fill="#1d2b4a"/><path d="M50 50V37M50 50l9 5" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
reader:'<svg viewBox="0 0 100 100"><rect x="24" y="8" width="52" height="84" rx="7" fill="#222"/><rect x="29" y="14" width="42" height="64" rx="2" fill="#e9ece6"/><path d="M35 26h30M35 34h30M35 42h24M35 50h30M35 58h18" stroke="#9aa" stroke-width="3"/></svg>'};
const CATEMO={phones:'📱',photo:'📷',laptops:'💻',audio:'🎧',games:'🎮',vintage:'⌚',books:'📖'};
const memo=m=>CATEMO[D.models[m].cat]||'🏷';
let img=(m,cls='img',extra='',sty='')=>{const M=D.models[m];return `<div class="${cls}" style="${sty}background:linear-gradient(150deg,${M.color[0]},${M.color[1]})">${ICONS[M.icon]}${extra}</div>`};
const L=id=>D.listings.find(x=>x.id===id), P=id=>D.posts.find(x=>x.id===id);
const modelByName=n=>Object.keys(D.models).find(k=>D.models[k].name===n);
const allQ=l=>l.questions.concat(st.myQ[l.id]||[]);
const comments=p=>p.comments.concat(st.cm[p.id]||[]);
function plural(n,a,b,c){n=Math.abs(n)%100;const m=n%10;return n>10&&n<20?c:m>1&&m<5?b:m===1?a:c}
const isSub=n=>st.subs.includes(n);
function subBtn(n,cls=''){return `<button class="subbtn ${isSub(n)?'on':''} ${cls}" data-sub="${esc(n)}" onclick="event.preventDefault();event.stopPropagation();toggleSub('${esc(n)}')">${isSub(n)?'✓ Вы подписаны':'+ Подписаться'}</button>`}
function toggleSub(n){const i=st.subs.indexOf(n);i<0?st.subs.push(n):st.subs.splice(i,1);LS.set('subs',st.subs);toast(i<0?`Вы подписались на ${n}`:`Вы отписались от ${n}`);render()}
function qaHint(l){const qs=l.questions.filter(q=>q.answer);if(!qs.length)return `<div class="qa none">Вопросов пока нет — задайте первым</div>`;
 const t=qs.find(q=>q.top)||qs[0];return `<div class="qa"><b>💬 ${qs.length} ${plural(qs.length,'ответ','ответа','ответов')} продавца</b><br>«${esc(t.answer.length>48?t.answer.slice(0,46)+'…':t.answer)}»</div>`}
function card(l){return `<a class="card" href="#/item/${l.id}">${img(l)}<div class="cb"><div class="ct">${esc(l.title)}</div><div class="pr">${l.price}${l.old?`<span class="old">${l.old}</span>`:''}</div>${qaHint(l)}<div class="pl">${l.place}</div></div></a>`}
function dcard(l){return `<a class="dcard" href="#/item/${l.id}">${img(l,'img dimg')}<div class="dct"><span>${esc(l.title)}</span><b class="hrt" onclick="event.preventDefault();toast('Добавлено в избранное')">♡</b></div><div class="dpr">${l.price}${l.old?`<span class="old">${l.old}</span>`:''}</div>${qaHint(l)}<div class="pl">📍 ${l.place}</div></a>`}
const roleTag=r=>r==='Продавец'?'<span class="tag t-s">Продавец</span>':r==='Покупатель'?'<span class="tag t-b">Покупатель</span>':'<span class="tag t-ad">Реклама · ERID 2Vtzq…</span>';
function postCard(p){const M=D.models[p.model];const liked=st.liked[p.id];return `<a class="post" href="#/post/${p.id}">${img(p,'img','',`aspect-ratio:1/${p.h};`)}<div class="cb">${roleTag(p.role)} <span class="au">${esc(p.author)}${isSub(p.author)?' <i class="subdot" title="Вы подписаны">✓</i>':''}</span><div class="pt" style="margin-top:5px">${esc(p.title)}</div><div class="pm"><span class="mchip" onclick="event.preventDefault();location.hash='#/model/${p.model}'">${memo(p.model)} ${M.name}</span>${p.ad?'':`<span onclick="event.preventDefault();like('${p.id}')">${liked?'❤️':'♡'} ${p.likes+(liked?1:0)}</span>`}</div></div></a>`}
function like(id){st.liked[id]=!st.liked[id];LS.set('liked',st.liked);render()}
function mason(list,n=2){const cols=Array.from({length:n},()=>({h:0,a:[]}));list.forEach(p=>{const c=cols.reduce((m,c)=>c.h<m.h-0.01?c:m,cols[0]);c.a.push(p);c.h+=p.h+.6});return `<div class="mason">${cols.map(c=>`<div class="col">${c.a.map(postCard).join('')}</div>`).join('')}</div>`}
const EMPTY=()=>st.tab==='subs'||st.onlySubs?'<div class="empty">В подписках пока нет постов по этим фильтрам.<br>Подпишитесь на продавцов и покупателей — кнопка «Подписаться» есть в постах и объявлениях.</div>':'<div class="empty">Ничего не нашлось.<br>Попробуйте другой запрос или категорию.</div>';

/* ---------- лента: фильтры ---------- */
function feedList(){const q=st.q.trim().toLowerCase();let ps=D.posts.slice();
 const subsOnly=st.tab==='subs'||st.onlySubs;
 if(subsOnly)ps=ps.filter(p=>!p.ad&&isSub(p.author));
 if(st.chip!=='all')ps=ps.filter(p=>D.models[p.model].cat===st.chip);
 if(st.fmodel)ps=ps.filter(p=>p.model===st.fmodel);
 if(st.role!=='all')ps=ps.filter(p=>p.role===st.role);
 if(q)ps=ps.filter(p=>(p.title+' '+p.text+' '+p.author+' '+D.models[p.model].name).toLowerCase().includes(q));
 const ad=ps.find(p=>p.ad);ps=ps.filter(p=>!p.ad);
 ps.sort(st.sort==='pop'?(a,b)=>b.likes-a.likes:(a,b)=>a.ago-b.ago);
 if(st.useInt&&!subsOnly){const ids=st.interests.map(modelByName);ps=ps.filter(p=>ids.includes(p.model)).concat(ps.filter(p=>!ids.includes(p.model)))}
 if(ad&&!subsOnly)ps.splice(Math.min(3,ps.length),0,ad);return ps}
function setF(k,v){st[k]=v;if(['role','sort','useInt'].includes(k))LS.set(k,v);render()}
function setMode(m){st.mode=m;LS.set('mode',m);st.mega=false;if(location.hash.startsWith('#/feed')&&m==='search')location.hash='#/';else if(location.hash.length>2&&!location.hash.startsWith('#/feed'))location.hash=m==='feed'?'#/feed':'#/';else render()}
function toggleI(n){const i=st.interests.indexOf(n);i<0?st.interests.push(n):st.interests.splice(i,1);LS.set('interests',st.interests);render();if($('#modal').classList.contains('on'))openInterests()}
function openInterests(){modal(`<h3>Интересы ленты</h3><p class="muted">Посты об этих моделях идут первыми во вкладке «Для вас». Собраны из просмотренного и избранного — можно поправить вручную.</p>
 <div class="tgl">${D.interestsAll.map(n=>{const id=modelByName(n);return `<label class="trow"><span>${id?memo(id):''} ${n}</span><span class="sw ${st.interests.includes(n)?'on':''}" data-int="${esc(n)}" onclick="toggleI('${esc(n)}')"></span></label>`}).join('')}</div>
 <label class="trow"><span><b>Учитывать интересы</b><br><span class="muted">выкл — лента без персонализации</span></span><span class="sw ${st.useInt?'on':''}" onclick="setF('useInt',!st.useInt);openInterests()"></span></label>
 <button class="btn blue full" onclick="modal()">Готово</button>`)}
const seg3=(k,opts)=>`<div class="seg3">${opts.map(([v,t])=>`<button class="${st[k]===v?'on':''}" onclick="setF('${k}','${v}')">${t}</button>`).join('')}</div>`;
function feedSettingsHTML(){return `<div class="fset"><div class="fl">Автор</div>${seg3('role',[['all','Все'],['Продавец','Продавцы'],['Покупатель','Покупатели']])}
 <div class="fl">Сортировка</div>${seg3('sort',[['new','Новое'],['pop','Популярное']])}
 <label class="trow"><span>Только подписки</span><span class="sw ${st.onlySubs?'on':''}" onclick="setF('onlySubs',!st.onlySubs)"></span></label>
 <label class="trow"><span>Учитывать интересы</span><span class="sw ${st.useInt?'on':''}" onclick="setF('useInt',!st.useInt)"></span></label>
 <div class="fl">Модель</div><select onchange="setF('fmodel',this.value)"><option value="">Любая модель</option>${Object.entries(D.models).map(([k,M])=>`<option value="${k}" ${st.fmodel===k?'selected':''}>${M.name}</option>`).join('')}</select></div>`}
function openFeedSettings(){modal(`<h3>Настройки ленты</h3>${feedSettingsHTML()}<button class="btn grey full" style="margin-top:10px" onclick="modal();openInterests()">✨ Изменить интересы</button><button class="btn blue full" style="margin-top:8px" onclick="modal()">Показать посты</button>`)}
function subsList(){return st.subs.length?st.subs.map(n=>`<div class="subrow"><span class="ava a2">${esc(n[0])}</span><b>${esc(n)}</b><span class="muted">${D.posts.filter(p=>p.author===n).length} пост.</span><button class="unsub" onclick="toggleSub('${esc(n)}')">Отписаться</button></div>`).join(''):'<div class="muted">Вы ни на кого не подписаны</div>'}
const activeCount=()=>(st.role!=='all')+(st.sort!=='new')+st.onlySubs+(!st.useInt)+!!st.fmodel;

/* ---------- МОБИЛЬНАЯ ---------- */
function mTabs(){return `<div class="ftabs">${[['foryou','Для вас'],['subs','Подписки'],['models','Модели']].map(([v,t])=>`<button class="${st.tab===v?'on':''}" data-tab="${v}" onclick="setF('tab','${v}')">${t}${v==='subs'?` <small>${st.subs.length}</small>`:''}</button>`).join('')}</div>`}
function home(){
 const hdr=`<div class="hero"><div class="sbar"><div class="search">🔍 ${st.mode==='feed'?`<input id="fq" placeholder="Поиск по ленте" value="${esc(st.q)}">`:'<span>Найти рядом</span>'}<span style="margin-left:auto">⚙︎</span></div><div class="cart">🛒<b>44</b></div></div><div class="car">За машиной сюда ›<span style="font-size:34px">🚙</span></div></div>
 <div class="cats"><div class="cat c2">Все<span>🟩</span></div><div class="cat c2">Недвижимость<span>🏠</span></div><div class="cat c2">Работа и подработка<span>👜</span></div><div class="cat" style="grid-column:span 3">Авто<span>🚗</span></div><div class="cat" style="grid-column:span 3">Жильё для путешествий<span>🧳</span></div><div class="cat" style="grid-column:span 3;height:60px">Электроника<span>📱</span></div><div class="cat" style="grid-column:span 3;height:60px">Услуги<span>🧯</span></div></div>
 <div class="seg"><button class="${st.mode==='search'?'on':''}" data-mode="search" onclick="setMode('search')">Поиск<small>объявления</small></button><button class="${st.mode==='feed'?'on':''}" data-mode="feed" onclick="setMode('feed')">Лента<small>советы о вещах</small></button></div>`;
 if(st.mode==='search') return hdr+`<div class="grid">${D.listings.map(card).join('')}</div>`;
 return hdr+mTabs()+mFeedBody();
}
function mFeedBody(){
 if(st.tab==='models'){const ids=st.interests.map(modelByName).filter(Boolean);const rest=Object.keys(D.models).filter(k=>!ids.includes(k));
  const tile=k=>{const M=D.models[k];return `<a class="mtile" href="#/model/${k}">${img(k,'img')}<b>${M.name}</b><span class="muted">${D.posts.filter(p=>p.model===k&&!p.ad).length} пост. · ${D.listings.filter(l=>l.model===k).length} объявл.</span></a>`};
  return `<div class="intr"><div class="h"><span>✨ Мои модели</span><a onclick="openInterests()">Изменить</a></div></div><div class="mgrid">${ids.map(tile).join('')||'<div class="muted">Нет моделей</div>'}</div><div class="sub-h">Другие модели</div><div class="mgrid">${rest.map(tile).join('')}</div>`}
 const list=feedList(),n=activeCount();
 return `<div class="chips"><button class="chip set" onclick="openFeedSettings()">⚙ Фильтры${n?` · ${n}`:''}</button>${D.chips.map(c=>`<button class="chip ${st.chip===c.id?'on':''}" data-chip="${c.id}" onclick="setF('chip','${c.id}')">${c.name}</button>`).join('')}</div>
 ${st.tab==='subs'?`<div class="intr subs"><div class="h"><span>👤 Мои подписки · ${st.subs.length}</span></div>${subsList()}<div class="muted" style="font-size:11.5px;margin-top:6px">Подписки — дополнительный слой. Основное в ленте всё равно привязано к моделям вещей.</div></div>`:
 `<div class="intr"><div class="h"><span>✨ ${st.useInt?'По вашим интересам':'Интересы выключены'}</span><a data-act="editInt" onclick="openInterests()">Изменить</a></div>
 <div class="list">${st.useInt?st.interests.map(n=>`<button class="ichip on" onclick="location.hash='#/model/${modelByName(n)}'">${n}</button>`).join('')||'<span class="muted">Интересы не выбраны</span>':'<span class="muted">Показываем всё подряд</span>'}</div></div>`}
 <div id="feedres">${list.length?mason(list):EMPTY()}</div>`}
function favM(){return `<div class="top">Избранное</div><div class="chips"><button class="chip on">Объявления</button><button class="chip">Поиски</button><button class="chip">Продавцы</button></div>
 <div class="stub"><div style="font-size:44px">➜🏠</div><h3>Лента переехала на главную</h3><p class="muted">Раньше Лента пряталась в Избранном. Теперь она на главной: переключатель «Поиск | Лента», вкладки «Для вас», «Подписки», «Модели» и фильтры.</p><button class="btn blue full" onclick="st.mode='feed';LS.set('mode','feed');location.hash='#/feed'">Открыть Ленту</button></div>`}
const CONTACT=/(\+?\d[\d\s\-()]{8,}\d)|@\w|(https?:\/\/)|(www\.)|\b[\w-]+\.(ru|com|me|org|net|io)\b|t\.me|telegram|телеграм|вотсап|whatsapp/i;
function checkQ(){const v=$('#askq').value;$('#warn').classList.toggle('on',CONTACT.test(v))}
function sendQ(id){const v=$('#askq').value.trim();if(!v)return;if(CONTACT.test(v)){checkQ();toast('Уберите контакты из вопроса');return}
 if(!st.askAll){toast('Отправлено в чат с продавцом');$('#askq').value='';return}
 (st.myQ[id]=st.myQ[id]||[]).push({user:'Вы',text:v,answer:'',mine:true});LS.set('myQ',st.myQ);render();toast('Вопрос отправлен');setTimeout(()=>$('#askq')?.scrollIntoView({block:'center'}),50)}
function addC(id){const i=$('#cmi'),v=i.value.trim();if(!v)return;if(CONTACT.test(v)){toast('Уберите контакты из комментария');return}
 (st.cm[id]=st.cm[id]||[]).push({user:'Вы',text:v});LS.set('cm',st.cm);render();toast('Комментарий опубликован')}
function qThread(l){const qs=allQ(l);return `<h2><span>Вопросы о вещи (${qs.length})<span class="new">новое</span></span></h2>
 <div class="muted" style="margin-bottom:6px">Продавец отвечает один раз — ответ видят все покупатели.</div>
 ${qs.map(q=>`<div class="q"><div class="u"><span class="ava a3">${esc(q.user[0])}</span>${esc(q.user)}</div>❓ ${esc(q.text)}
  ${q.answer?`<div class="ans"><span class="tag t-s">Продавец</span> ${esc(q.answer)}</div><div class="qact"><button onclick="toast('Спасибо, учтём')">👍 Полезно · ${q.likes}</button><button onclick="toast('Жалоба отправлена модераторам')">Пожаловаться</button></div>`:q.mine?'<div class="sent">✓ Отправлен · продавец получит уведомление</div>':'<div class="wait">⏳ Ждёт ответа продавца</div>'}</div>`).join('')}
 <div id="askbox"><div class="ask"><input id="askq" placeholder="${st.askAll?'Задать вопрос всем':'Сообщение продавцу в чат'}" oninput="checkQ()"><button class="btn blue" id="asksend" onclick="sendQ('${l.id}')">➤</button></div>
 <div class="warn" id="warn">Похоже на контакты (телефон, @ник или ссылка). В публичных вопросах их нельзя — общайтесь в чате Авито.</div>
 <div class="hint"><span class="sw ${st.askAll?'on':''}" onclick="st.askAll=!st.askAll;render();setTimeout(()=>$('#askq').focus())"></span>${st.askAll?'Публично: ответ увидят все. Вопрос про этот лот (торг, встреча)? → в чат':'Приватно: вопрос уйдёт в чат с продавцом'}</div></div>`}
const askChips=`<h2><span>Спросите у продавца<span class="exist">уже есть</span></span></h2><div class="qchips"><span>Ещё продаёте?</span><span>Торг уместен?</span><span>Когда можно посмотреть?</span><span>Есть доставка?</span></div>`;
function topAns(l){const top=l.questions.find(q=>q.top&&q.answer),n=l.questions.filter(q=>q.answer).length;return top?`<div class="topans"><span class="tag t-s">Продавец</span> ответил всем · 💬 ${n} ${plural(n,'ответ','ответа','ответов')} <span class="new">новое</span><div style="margin-top:5px;color:#555">❓ ${esc(top.text)}</div><div style="margin-top:3px"><b>${esc(top.answer)}</b></div><a class="lnk" onclick="document.getElementById('qsec').scrollIntoView({behavior:'smooth'})">Все вопросы ›</a></div>`:''}
function sellerBox(l){return `<div class="ib"><span class="ava" style="width:40px;height:40px;font-size:18px;background:var(--blue)">${l.seller[0]}</span><div style="flex:1"><b style="color:#111">${esc(l.seller)}</b><br>★ ${l.sellerRating} · ${l.sellerDeals} сделок <span class="exist">уже есть</span></div>${subBtn(l.seller)}</div>`}
function item(id){const l=L(id),M=D.models[l.model];const posts=D.posts.filter(p=>p.model===l.model&&!p.ad);
 return `<div class="top"><a class="back" onclick="history.back()">‹</a><span style="flex:1"></span>♡ &nbsp; ⤴</div>
 ${img(l,'gal',`<span class="cnt">1 / 6</span>`)}
 <div class="sec" style="margin-top:0"><div class="h1">${esc(l.title)}</div><div class="bigp">${l.price}${l.old?`<span class="old" style="font-size:15px">${l.old}</span>`:''}</div>
 <a class="mchip" style="margin-top:8px" href="#/model/${l.model}">${memo(l.model)} Модель: ${M.name} ›</a>${topAns(l)}
 <div class="pl" style="margin-top:10px">${l.place} · ${l.date}</div></div>
 <div class="sec" id="qsec">${qThread(l)}</div><div class="sec">${askChips}</div>
 <div class="sec"><h2><span>Посты об ${M.name}<span class="new">новое</span></span><a href="#/model/${l.model}">Все</a></h2><div class="hs">${posts.map(postCard).join('')||'<span class="muted">Пока нет постов</span>'}</div></div>
 <div class="sec"><h2>Описание</h2><div style="font-size:14px;line-height:1.45">${esc(l.desc)}</div><div style="margin-top:14px">${sellerBox(l)}</div>
 <button class="btn grey full" style="margin-top:14px" onclick="st.mode='feed';st.tab='foryou';st.chip='all';st.fmodel='${l.model}';location.hash='#/feed'">Лента про ${M.name} ›</button></div>
 <div class="bottom"><button class="btn green" onclick="toast('Звонок через Авито (подменный номер)')">Позвонить</button><button class="btn blue" onclick="toast('Открыт чат Авито')">Написать</button></div>`}
function commentsHTML(p){const cs=comments(p);return `<h2>Комментарии (${cs.length})</h2>${cs.map(c=>`<div class="comment"><b>${esc(c.user)}</b> ${c.author?'<span class="tag t-a">Автор</span>':''}<br>${esc(c.text)}</div>`).join('')||'<div class="muted">Пока нет комментариев</div>'}
 <div class="ask"><input id="cmi" placeholder="Комментарий о вещи" onkeydown="if(event.key==='Enter')addC('${p.id}')"><button class="btn blue" id="cmsend" onclick="addC('${p.id}')">➤</button></div>`}
function postHead(p){const M=D.models[p.model];return `<div class="phd">${roleTag(p.role)} <b>${esc(p.author)}</b>${p.ad?'':subBtn(p.author,'sm')}</div><div class="h1" style="margin-top:8px">${esc(p.title)}</div>
 <div style="font-size:15px;line-height:1.5;margin-top:8px">${esc(p.text)}</div>
 <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><a class="mchip" href="#/model/${p.model}">${memo(p.model)} ${M.name} ›</a>${p.ad?'':`<button onclick="like('${p.id}')">${st.liked[p.id]?'❤️':'♡'} ${p.likes+(st.liked[p.id]?1:0)}</button>`}</div>`}
function post(id){const p=P(id),ls=D.listings.filter(l=>l.model===p.model);
 return `<div class="top"><a class="back" onclick="history.back()">‹</a>Пост</div>${img(p,'gal')}
 <div class="sec" style="margin-top:0">${postHead(p)}</div>
 <div class="sec"><h2><span>Объявления этой модели</span><a href="#/model/${p.model}">Все ${ls.length}</a></h2><div class="hs">${ls.map(card).join('')||'<span class="muted">Нет объявлений</span>'}</div></div>
 <div class="sec">${commentsHTML(p)}</div>`}
function bestAns(id){return D.listings.filter(l=>l.model===id).flatMap(l=>l.questions.filter(q=>q.answer).map(q=>({...q,l}))).sort((a,b)=>b.likes-a.likes).slice(0,4)}
function modelHead(id){const M=D.models[id],ls=D.listings.filter(l=>l.model===id),on=st.interests.includes(M.name);
 return `<div class="h1">${memo(id)} ${M.name}</div><div class="bigp" style="font-size:20px">${M.price} · ${ls.length} ${plural(ls.length,'объявление','объявления','объявлений')}</div>
 <div style="font-size:14px;line-height:1.45;margin-top:8px;color:#444">${M.summary}</div>
 <div class="dbl" style="margin-top:10px">${M.specs.map(s=>`<div style="background:#F6F7F8;border-radius:10px;padding:8px"><div class="muted">${s[0]}</div><b style="font-size:13px">${s[1]}</b></div>`).join('')}</div>
 <button class="btn ${on?'grey':'blue'} full" style="margin-top:12px" onclick="toggleI('${M.name}')">${on?'✓ В ваших интересах ленты':'+ Добавить в интересы ленты'}</button>`}
const revHTML=id=>`<h2><span>Отзывы о модели<span class="exist">уже есть</span></span></h2><div class="rev"><span class="big">${D.models[id].rating}</span><div><span class="stars">★★★★★</span><div class="muted">${D.models[id].reviews} отзывов · демо</div></div></div>`;
const bestHTML=id=>`<h2><span>Лучшие ответы о модели<span class="new">новое</span></span></h2><div class="muted" style="margin-bottom:4px">Собраны из публичных ответов продавцов в объявлениях</div>
 ${bestAns(id).map(q=>`<div class="q">❓ ${esc(q.text)}<div class="ans"><span class="tag t-s">Продавец</span> ${esc(q.answer)}</div><div class="qact"><span>👍 ${q.likes}</span><a style="color:var(--blue)" href="#/item/${q.l.id}">из «${esc(q.l.title)}»</a></div></div>`).join('')||'<div class="muted">Пока нет ответов</div>'}`;
function model(id){const ls=D.listings.filter(l=>l.model===id),ps=D.posts.filter(p=>p.model===id&&!p.ad);
 return `<div class="top"><a class="back" onclick="history.back()">‹</a>${D.models[id].name}</div>${img(id,'gal')}
 <div class="sec" style="margin-top:0">${modelHead(id)}</div><div class="sec">${revHTML(id)}</div><div class="sec" id="bestans">${bestHTML(id)}</div>
 <div class="sec"><h2><span>Посты о модели<span class="new">новое</span></span></h2>${ps.length?mason(ps).replace('class="mason"','class="mason" style="padding:0"'):'<div class="muted">Пока нет постов</div>'}</div>
 <div class="sec"><h2>Все объявления модели (${ls.length})</h2><div class="grid" style="padding:0">${ls.map(card).join('')}</div></div>`}

/* ---------- ПК ---------- */
const DCATS=[['Авто','🚗'],['Недвижимость','🏠'],['Жильё для путешествия','🧳'],['Для дома и дачи','🪴'],['Запчасти','⚙️'],['Услуги','🧯'],['Электроника','📱'],['Работа и подработка','👜'],['Бизнес 360','🏭'],['Одежда, обувь, аксессуары','👕']];
const MEGA=[['Авто',['Автомобили','Мотоциклы и мототехника','Грузовики и спецтехника','Водный транспорт','Запчасти и аксессуары']],['Недвижимость',['Квартиры','Комнаты','Дома, дачи, коттеджи','Земельные участки','Гаражи и машиноместа','Коммерческая недвижимость']],['Электроника',['Телефоны','Аудио и видео','Товары для компьютера','Игры, приставки и программы','Ноутбуки','Фототехника','Планшеты и электронные книги']],['Работа',['Вакансии','Резюме']],['Услуги',['Ремонт и отделка','Красота','Обучение','Перевозки']],['Личные вещи',['Одежда, обувь, аксессуары','Часы и украшения','Детская одежда']],['Для дома и дачи',['Мебель','Бытовая техника','Ремонт и строительство','Растения']],['Хобби и отдых',['Билеты и путешествия','Книги и журналы','Коллекционирование','Спорт и отдых']],['Животные',['Собаки','Кошки','Птицы']]];
function dHeader(){const hh=location.hash.slice(2).split('/')[0];const f=st.mode==='feed'&&(hh===''||hh==='feed');return `<header class="dh"><div class="wrap"><div class="dtop"><a>💼 Для бизнеса</a><a>Карьера в Авито</a><a>Помощь</a><a>Каталоги</a><a>#яПомогаю</a><span style="flex:1"></span>
 <a class="ic" href="#/fav">♡<b>44</b></a><a class="ic">🛒<b>3</b></a><a class="ic">💬<b>22</b></a><a class="ic">🔔<b>44</b></a><a class="wal">👛 7 940 ₽</a><a class="ava dava">Т</a><a class="dpost" onclick="toast('Размещение — вне прототипа')">Разместить объявление</a><a>Мои объявления</a></div>
 <div class="dsr"><a class="logo" href="#/" onclick="setMode('search')"><span class="dots"><i></i><i></i><i></i><i></i></span>Avito</a>
 <button class="dall ${st.mega?'on':''}" id="megabtn" onclick="st.mega=!st.mega;render()">${st.mega?'✕':'☰'} Все категории</button>
 <button class="dfeed ${f?'on':''}" data-mode="feed" onclick="setMode(${f?"'search'":"'feed'"})">✨ Лента<span class="new">новое</span></button>
 <div class="dsearch">${f?`<input id="fq" placeholder="Поиск по ленте: модели, советы, авторы" value="${esc(st.q)}">`:'<input placeholder="Поиск по объявлениям">'}<button class="btn blue">Найти</button></div>
 <a class="geo">📍 Москва и Московская область</a></div></div>${st.mega?megaHTML():''}</header>`}
function megaHTML(){const c=MEGA[st.megaCat];return `<div class="mega"><div class="wrap mg"><div class="ml">${MEGA.map((m,i)=>`<a class="${i===st.megaCat?'on':''}" onmouseenter="st.megaCat=${i};render()" onclick="st.megaCat=${i};render()">${m[0]}</a>`).join('')}<a class="mfeed" onclick="setMode('feed')">✨ Лента о вещах <span class="new">новое</span></a></div>
 <div class="mr"><h3>${c[0]}</h3><div class="mcols">${c[1].map(s=>`<a>${s}</a>`).join('')}</div></div></div></div>`}
function dTiles(){return `<div class="dtiles"><div class="tgrid">${DCATS.map(([n,e])=>`<div class="dtile"><span>${n}</span><i>${e}</i></div>`).join('')}</div>
 <div class="biz"><b>Всё для бизнеса</b><div class="bz"><span>🖨<br>Оборудо&shy;вание</span><span>🏢<br>Помещения</span><span>📦<br>Товары</span></div><button class="btn grey full sm">🔍 Искать в Бизнес 360</button></div></div>`}
function dSwitch(){return `<div class="dseg"><button class="${st.mode==='search'?'on':''}" data-mode="search" onclick="setMode('search')">Объявления</button><button class="${st.mode==='feed'?'on':''}" data-mode="feed" onclick="setMode('feed')">Лента <span class="new">новое</span></button><span class="muted">${st.mode==='feed'?'Советы и опыт, привязанные к моделям вещей. Публикуют продавцы и покупатели.':'Рекомендации для вас'}</span></div>`}
function dHome(){if(st.mode==='feed')return dFeed();return `<div class="wrap">${dTiles()}${dSwitch()}<div class="dgrid">${D.listings.map(dcard).join('')}</div></div>`}
function dFeed(){const list=feedList(),ids=st.interests.map(modelByName).filter(Boolean);
 return `<div class="wrap">${dSwitch()}<div class="dfeedl"><aside class="fcol"><h3>Фильтры ленты</h3>
 <div class="ftabs v">${[['foryou','Для вас'],['subs','Подписки'],['models','По моделям']].map(([v,t])=>`<button class="${st.tab===v?'on':''}" data-tab="${v}" onclick="setF('tab','${v}')">${t}</button>`).join('')}</div>
 <div class="fl">Категории</div><div class="catl">${D.chips.map(c=>`<a class="${st.chip===c.id?'on':''}" data-chip="${c.id}" onclick="setF('chip','${c.id}')">${c.id==='all'?'Все категории':c.name}</a>`).join('')}</div>
 ${feedSettingsHTML()}<button class="btn grey full" style="margin-top:10px" onclick="st.role='all';st.sort='new';st.onlySubs=false;st.useInt=true;st.fmodel='';st.chip='all';st.q='';render()">Сбросить фильтры</button></aside>
 <section class="fmain"><div class="fhead"><b>${st.tab==='subs'?'Подписки':st.tab==='models'?'По моделям':'Для вас'}</b><span class="muted">${list.length} ${plural(list.length,'пост','поста','постов')}${st.useInt&&st.tab==='foryou'?' · сначала ваши интересы':''}</span></div>
 ${st.tab==='models'?ids.map(k=>{const ps=list.filter(p=>p.model===k);return `<div class="mblock"><a class="mchip big" href="#/model/${k}">${memo(k)} ${D.models[k].name} ›</a><div class="pgrid">${ps.map(postCard).join('')||'<span class="muted">Нет постов по фильтрам</span>'}</div></div>`}).join('')||EMPTY():`<div class="dmason" id="feedres">${list.length?mason(list,3):EMPTY()}</div>`}</section>
 <aside class="rcol"><div class="box"><h3>Мои подписки <span class="muted">${st.subs.length}</span></h3>${subsList()}<div class="muted" style="margin-top:8px;font-size:12px">Ещё авторы:</div>${['Кирилл','Рома','Антиквар','Гоша','Миша'].filter(n=>!isSub(n)).slice(0,3).map(n=>`<div class="subrow"><span class="ava a2">${n[0]}</span><b>${n}</b>${subBtn(n,'sm')}</div>`).join('')}</div>
 <div class="box"><h3>Мои модели <a class="lnk" data-act="editInt" onclick="openInterests()">Изменить</a></h3>${ids.map(k=>`<a class="mrow" href="#/model/${k}">${img(k,'img mi')}<span><b>${D.models[k].name}</b><br><span class="muted">${D.models[k].price}</span></span></a>`).join('')||'<div class="muted">Нет интересов</div>'}</div></aside></div></div>`}
function crumbs(a){return `<div class="crumbs">${a.map(x=>x[1]?`<a href="${x[1]}">${x[0]}</a>`:`<span>${x[0]}</span>`).join(' › ')}</div>`}
function dItem(id){const l=L(id),M=D.models[l.model],posts=D.posts.filter(p=>p.model===l.model&&!p.ad);
 return `<div class="wrap">${crumbs([['Главная','#/'],['Электроника','#/'],[M.name,'#/model/'+l.model],[l.title]])}<h1 class="dh1">${esc(l.title)}</h1>
 <div class="two"><div class="lc">${img(l,'gal dgal',`<span class="cnt">1 / 6</span>`)}<div class="thumbs">${[0,1,2,3].map(i=>img({model:l.model,ph:i,id:'t'+i},'img')).join('')}</div>
 <div class="dsec" id="qsec">${qThread(l)}</div><div class="dsec">${askChips}</div>
 <div class="dsec"><h2>Описание</h2><div style="font-size:15px;line-height:1.5">${esc(l.desc)}</div><div class="pl" style="margin-top:8px">📍 ${l.place} · ${l.date}</div></div>
 <div class="dsec"><h2><span>Посты об ${M.name}<span class="new">новое</span></span><a href="#/model/${l.model}">Все</a></h2><div class="pgrid c4">${posts.map(postCard).join('')||'<span class="muted">Пока нет постов</span>'}</div></div></div>
 <aside class="rc"><div class="bigp dp">${l.price}${l.old?`<span class="old" style="font-size:16px">${l.old}</span>`:''}</div>${topAns(l)}
 <button class="btn green full lg" onclick="toast('Звонок через Авито (подменный номер)')">Показать телефон</button><button class="btn blue full lg" onclick="toast('Открыт чат Авито')">Написать продавцу</button>
 <a class="mchip" style="margin-top:12px" href="#/model/${l.model}">${memo(l.model)} Модель: ${M.name} ›</a>
 <div class="box" style="margin-top:14px">${sellerBox(l)}</div>
 <button class="btn grey full" style="margin-top:10px" onclick="st.mode='feed';st.fmodel='${l.model}';st.tab='foryou';location.hash='#/feed'">Лента про ${M.name} ›</button></aside></div></div>`}
function dModel(id){const M=D.models[id],ls=D.listings.filter(l=>l.model===id),ps=D.posts.filter(p=>p.model===id&&!p.ad);
 return `<div class="wrap">${crumbs([['Главная','#/'],['Модели'],[M.name]])}<div class="two"><div class="lc">
 <div class="dsec" style="display:flex;gap:20px">${img(id,'gal dgal sm')}<div style="flex:1">${modelHead(id)}</div></div>
 <div class="dsec"><h2>Объявления модели (${ls.length})</h2><div class="dgrid c4">${ls.map(dcard).join('')}</div></div>
 <div class="dsec"><h2><span>Посты о модели<span class="new">новое</span></span></h2><div class="pgrid c4">${ps.map(postCard).join('')||'<span class="muted">Пока нет постов</span>'}</div></div></div>
 <aside class="rc"><div class="box">${revHTML(id)}</div><div class="box" id="bestans" style="margin-top:12px">${bestHTML(id)}</div></aside></div></div>`}
function dPost(id){const p=P(id),ls=D.listings.filter(l=>l.model===p.model);
 return `<div class="wrap">${crumbs([['Лента','#/feed'],[D.models[p.model].name,'#/model/'+p.model],['Пост']])}<div class="two"><div class="lc"><div class="dsec" style="display:flex;gap:20px">${img(p,'gal dgal sm')}<div style="flex:1">${postHead(p)}</div></div>
 <div class="dsec">${commentsHTML(p)}</div></div><aside class="rc"><div class="box"><h2>Объявления этой модели</h2><div class="dgrid c2">${ls.slice(0,4).map(dcard).join('')||'<span class="muted">Нет объявлений</span>'}</div></div></aside></div></div>`}
function dFav(){return `<div class="wrap"><h1 class="dh1">Избранное</h1><div class="stub">${favM().split('<div class="stub">')[1]}</div>`}

/* ---------- роутинг и вид ---------- */
const qp=new URLSearchParams(location.search).get('view');if(qp)LS.set('view',qp==='auto'?null:qp);
function isDesk(){const v=LS.get('view',null);return v==='desktop'?true:v==='mobile'?false:matchMedia('(min-width:1024px)').matches}
function setView(v){LS.set('view',v==='auto'?null:v);about(false);render()}
function render(){const desk=isDesk();document.body.className=desk?'desk':'mob';
 const host=desk?document.body:$('.screen');['#about','#modal','#toast'].forEach(s=>{const e=$(s);if(e.parentNode!==host)host.appendChild(e)});
 const h=location.hash.slice(2).split('/');if(h[0]==='feed')st.mode='feed';
 const root=desk?$('#dapp'):$('#app');const sc=desk?scrollY:root.scrollTop;let html;
 if(h[0]==='item'&&L(h[1]))html=desk?dItem(h[1]):item(h[1]);else if(h[0]==='post'&&P(h[1]))html=desk?dPost(h[1]):post(h[1]);
 else if(h[0]==='model'&&D.models[h[1]])html=desk?dModel(h[1]):model(h[1]);else if(h[0]==='fav')html=desk?dFav():favM();else html=desk?dHome():home();
 root.innerHTML=(desk?dHeader():'')+html;const same=render._h===location.hash+desk;if(desk)scrollTo(0,same?sc:0);else root.scrollTop=same?sc:0;render._h=location.hash+desk;
 document.querySelectorAll('.tabbar .tab').forEach(t=>t.classList.toggle('on',(t.dataset.r==='fav')===(h[0]==='fav')&&(t.dataset.r==='fav'||t.dataset.r==='home')));
 const fq=$('#fq');if(fq){fq.oninput=()=>{st.q=fq.value;const r=$('#feedres');if(!r)return;const l=feedList();r.innerHTML=l.length?mason(l,desk?3:2):EMPTY()}}}
window.addEventListener('hashchange',()=>{st.mega=false;render()});let _rw;window.addEventListener('resize',()=>{clearTimeout(_rw);_rw=setTimeout(()=>{if(!LS.get('view',null))render()},150)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal();about(false);if(st.mega){st.mega=false;render()}}});
//boot moved
if(false&&!LS.get('seenAbout',false)&&!location.search.includes('qa')){LS.set('seenAbout',true);setTimeout(()=>about(true),400)}
