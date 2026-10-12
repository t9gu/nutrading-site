(function(){
var d=document, html=d.documentElement, body=d.body;
var isWeChat=/MicroMessenger/i.test(navigator.userAgent);
if(isWeChat) html.classList.add('is-wechat');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var toast=d.createElement('div'); toast.className='toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite'); body.appendChild(toast);
function say(msg){toast.textContent=msg; toast.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(function(){toast.classList.remove('show');},2400);}
function words(){
var zh=(html.lang||'').indexOf('zh')===0;
return zh?{ok:'已复制邮箱',fail:'复制失败，请长按邮箱地址手动复制'}:{ok:'Email copied',fail:'Copy failed. Press and hold the email address to copy it.'};
}
function copy(text){
var w=words();
function legacy(){
var ta=d.createElement('textarea'); ta.value=text; ta.setAttribute('readonly','');
ta.style.position='fixed'; ta.style.top='0'; ta.style.opacity='0'; body.appendChild(ta);
ta.select(); ta.setSelectionRange(0,text.length);
var ok=false; try{ok=d.execCommand('copy');}catch(e){}
body.removeChild(ta); say(ok?w.ok:w.fail);
}
try{
if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){say(w.ok);},legacy);} else {legacy();}
}catch(e){legacy();}
}
d.addEventListener('click',function(e){var b=e.target.closest('[data-copy]'); if(b) copy(b.getAttribute('data-copy'));});
d.querySelectorAll('[data-menu]').forEach(function(btn){
var nav=d.getElementById(btn.getAttribute('aria-controls')), label=btn.querySelector('.menu-text');
function set(open){
btn.setAttribute('aria-expanded',open?'true':'false'); nav.classList.toggle('is-open',open);
if(label) label.textContent=open?btn.getAttribute('data-close'):btn.getAttribute('data-open');
}
btn.addEventListener('click',function(){set(btn.getAttribute('aria-expanded')!=='true');});
nav.addEventListener('click',function(e){if(e.target.closest('a')) set(false);});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){set(false); btn.focus();}});
d.addEventListener('click',function(e){if(btn.getAttribute('aria-expanded')==='true'&&!e.target.closest('.site-header')) set(false);});
});
var last=window.pageYOffset, ticking=false;
function onScroll(){
var y=window.pageYOffset;
d.querySelectorAll('[data-header]').forEach(function(h){
var open=h.querySelector('[data-menu][aria-expanded="true"]');
h.classList.toggle('is-solid', y>24 || !!open);
h.classList.toggle('is-hidden', window.innerWidth<1024 && y>160 && y>last && !open);
});
last=y; ticking=false;
}
window.addEventListener('scroll',function(){ if(ticking) return; ticking=true; requestAnimationFrame(onScroll); },{passive:true});
d.addEventListener('click',function(e){ if(e.target.closest('[data-menu]')) requestAnimationFrame(onScroll); });
requestAnimationFrame(onScroll);
if(d.querySelector('[data-bottom-bar]')) body.classList.add('has-bottom-bar');
d.querySelectorAll('img.fade').forEach(function(img){
function done(){img.classList.add('is-loaded');}
if(img.complete&&img.naturalWidth) done(); else {img.addEventListener('load',done); img.addEventListener('error',done);}
});
var hm=d.querySelector('.hero-media[data-video]');
var saveData=navigator.connection&&navigator.connection.saveData;
if(hm&&!reduce&&!saveData&&window.matchMedia('(min-width: 64rem)').matches){
var v=d.createElement('video');
v.muted=true; v.loop=true; v.playsInline=true; v.autoplay=true; v.setAttribute('muted',''); v.setAttribute('playsinline','');
v.setAttribute('aria-hidden','true'); v.preload='auto';
var img=hm.querySelector('img'); if(img) v.poster=img.currentSrc||img.src;
v.src=hm.getAttribute('data-video');
v.addEventListener('playing',function(){hm.classList.add('is-playing');});
hm.appendChild(v);
var p=v.play(); if(p&&p.catch) p.catch(function(){ if(v.parentNode) v.parentNode.removeChild(v); });
}
d.querySelectorAll('form.contact').forEach(function(form){
form.addEventListener('submit',function(e){
e.preventDefault();
var t=form.dataset, msg=form.querySelector('.form-msg'), fb=form.querySelector('.fallback'), el=form.elements;
var name=el['name'].value.trim(), email=el['email'].value.trim(), bodyText=el['message'].value.trim();
msg.textContent='';
if(!name||!email||!bodyText){msg.textContent=t.errFields; (!name?el['name']:!email?el['email']:el['message']).focus(); return;}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){msg.textContent=t.errEmail; el['email'].focus(); return;}
if(!el['consent'].checked){msg.textContent=t.errConsent; el['consent'].focus(); return;}
var org=el['org'].value.trim(), topic=el['topic'].value, phone=el['phone']?el['phone'].value.trim():'';
var subject=t.subject+'｜'+topic+(org?'｜'+org:'');
var lines=[t.lName+'：'+name, t.lOrg+'：'+(org||'-'), t.lEmail+'：'+email, t.lPhone+'：'+(phone||'-'), t.lTopic+'：'+topic, '', bodyText];
fb.hidden=false;
if(isWeChat||html.hasAttribute('data-preview')){fb.scrollIntoView({block:'center'}); return;}
msg.textContent=t.opening;
window.location.href='mailto:'+t.to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
});
});
})();
