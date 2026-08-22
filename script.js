const $=(q,s=document)=>s.querySelector(q),$$=(q,s=document)=>[...s.querySelectorAll(q)],body=document.body;
const products=[
{id:'black',name:'Black Zip Tribal',price:159,cat:'jeans',img:'product-black-tribal.jpg',tag:'NEW',sizes:['S','M','L','XL'],desc:'Wide black denim with contrast stitching, zip-open panels and oversized tribal graphics.'},
{id:'light',name:'Raw Seam Light Wash',price:139,cat:'jeans',img:'product-light-seam.jpg',tag:'DROP',sizes:['S','M','L','XL'],desc:'Light washed wide-leg denim with exposed side construction and raw seam detailing.'},
{id:'blue',name:'Blue Panel Baggy',price:149,cat:'jeans',img:'product-blue-panel.jpg',tag:'LIMITED',sizes:['S','M','L'],desc:'Baggy blue denim with contrasting panel work and a long stacked silhouette.'},
{id:'grey',name:'Grey Tribal Wash',price:149,cat:'jeans',img:'product-grey-tribal.jpg',tag:'HOT',sizes:['S','M','L','XL'],desc:'Acid-grey wide denim with bold graphic side panel and relaxed street proportion.'},
{id:'asym',name:'Asym Tribal Panel',price:169,cat:'jeans',img:'product-asym-grey.jpg',tag:'ART',sizes:['M','L','XL'],desc:'Asymmetric grey denim construction with dark side insert and hand-drawn tribal movement.'},
{id:'floral',name:'Cherry Blossom Distorted',price:179,cat:'jeans',img:'product-floral-denim.jpg',tag:'ART',sizes:['S','M','L'],desc:'Heavy reconstructed denim with floral embroidery, distressed seam maps and exaggerated stacked legs.'},
{id:'woman',name:'Blue Street Denim Jacket',price:189,cat:'jacket',img:'product-womens-denim-jacket.jpg',tag:'NEW',sizes:['S','M','L'],desc:'Oversized blue denim jacket with strong volume and everyday wearability.'},
{id:'cord',name:'Sand Corduroy Overshirt',price:169,cat:'jacket',img:'campaign-corduroy-01.jpg',tag:'ESSENTIAL',sizes:['S','M','L','XL'],desc:'Warm sand corduroy overshirt with soft structure and an oversized fit.'},
{id:'earth',name:'Earth Reworked Sweat',price:129,cat:'top',img:'product-earth-sweat.jpg',tag:'ONE-OFF',sizes:['M','L'],desc:'Earth-tone reconstructed sweatshirt with exposed panels and altered proportion.'},
{id:'armor',name:'Denim Armor Top',price:229,cat:'jacket',img:'product-denim-armor.jpg',tag:'ONE-OFF',sizes:['M'],desc:'Experimental denim armor combining quilted black structure and raw indigo panels.'},
{id:'kurta',name:'Sand Modern Kurta',price:139,cat:'kurta',img:'product-sand-top.jpg',tag:'HERITAGE',sizes:['S','M','L','XL'],desc:'Minimal sand kurta with a clean neckline and contemporary relaxed shape.'}
];
let cart=JSON.parse(localStorage.getItem('dudeCart')||'[]'),active=null,qty=1,size='',rot=0,drag=false,startX=0,startRot=0,gallery=[],gi=0;
const lock=v=>body.classList.toggle('lock',v);
addEventListener('load',()=>setTimeout(()=>$('#boot').classList.add('hide'),850));setTimeout(()=>$('#boot').classList.add('hide'),2600);
addEventListener('scroll',()=>$('.topbar').classList.toggle('sc',scrollY>20));addEventListener('mousemove',e=>{$('.cursor').style.left=e.clientX+'px';$('.cursor').style.top=e.clientY+'px'});
const c=$('#particles'),ctx=c.getContext('2d');let pts=[];function rs(){c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:Math.min(60,Math.floor(innerWidth/20))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.08+Math.random()*.18,r:.3+Math.random()}))}function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle='rgba(150,185,235,.2)';pts.forEach(p=>{p.y-=p.v;if(p.y<0){p.y=innerHeight;p.x=Math.random()*innerWidth}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill()});requestAnimationFrame(draw)}addEventListener('resize',rs);rs();draw();
function menu(v){$('#menu').classList.toggle('open',v);$('#menuShade').classList.toggle('show',v);lock(v)}$('#menuOpen').onclick=()=>menu(1);$('#menuClose').onclick=()=>menu(0);$('#menuShade').onclick=()=>menu(0);
function page(id){menu(0);search(0);$('#wipe').classList.remove('go');void $('#wipe').offsetWidth;$('#wipe').classList.add('go');setTimeout(()=>{$$('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===id));scrollTo(0,0)},320)}$$('.nav').forEach(b=>b.onclick=()=>page(b.dataset.page));
function search(v){$('#searchLayer').classList.toggle('open',v);lock(v);if(v){$('#searchInput').value='';find('');setTimeout(()=>$('#searchInput').focus(),150)}}$('#searchOpen').onclick=()=>search(1);$('#searchClose').onclick=()=>search(0);$('#searchInput').oninput=e=>find(e.target.value);function find(q){q=q.toLowerCase();let a=products.filter(p=>!q||(p.name+' '+p.cat+' '+p.tag).toLowerCase().includes(q)).slice(0,6);$('#searchResults').innerHTML=a.map(p=>`<div class="sres" data-s="${p.id}"><img src="${p.img}"><b>${p.name}</b><small>RM${p.price}</small></div>`).join('');$$('[data-s]').forEach(x=>x.onclick=()=>{search(0);openProduct(x.dataset.s)})}
function render(f='all'){let a=f==='all'?products:products.filter(p=>p.cat===f);$('#count').textContent=a.length+' OBJECTS';$('#products').innerHTML=a.map(p=>`<article class="product" data-id="${p.id}"><div class="pm"><img src="${p.img}"><span class="tag">${p.tag}</span><button class="quick" data-q="${p.id}">+</button></div><div class="pc"><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><strong>RM${p.price}</strong></div></article>`).join('');$$('.product').forEach(x=>x.onclick=e=>{if(!e.target.dataset.q)openProduct(x.dataset.id)});$$('[data-q]').forEach(x=>x.onclick=e=>{e.stopPropagation();openProduct(x.dataset.q)})}render();$$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');render(b.dataset.f)});
function openProduct(id){active=products.find(p=>p.id===id);qty=1;size=active.sizes[0];$('#mImg').src=active.img;$('#mCat').textContent=(active.cat+' / '+active.tag).toUpperCase();$('#mName').textContent=active.name;$('#mPrice').textContent='RM'+active.price;$('#mDesc').textContent=active.desc;$('#qty').textContent=qty;$('#sizes').innerHTML=active.sizes.map((s,i)=>`<button class="${i?'':'on'}" data-size="${s}">${s}</button>`).join('');$$('[data-size]').forEach(b=>b.onclick=()=>{$$('[data-size]').forEach(x=>x.classList.remove('on'));b.classList.add('on');size=b.dataset.size});$('#productModal').classList.add('open');lock(1)}function closeProduct(){$('#productModal').classList.remove('open');lock(0)}$('#productClose').onclick=closeProduct;$('#minus').onclick=()=>$('#qty').textContent=qty=Math.max(1,qty-1);$('#plus').onclick=()=>$('#qty').textContent=++qty;$('#add').onclick=()=>{addCart(active,size,qty);closeProduct()};
function addCart(p,s,q){let k=p.id+'-'+s,x=cart.find(i=>i.key===k);x?x.qty+=q:cart.push({key:k,id:p.id,name:p.name,price:p.price,img:p.img,size:s,qty:q});save();toast(p)}function save(){localStorage.setItem('dudeCart',JSON.stringify(cart));renderCart()}function renderCart(){let n=cart.reduce((a,x)=>a+x.qty,0),t=cart.reduce((a,x)=>a+x.price*x.qty,0);$('#bagCount').textContent=n;$('#subtotal').textContent='RM'+t;$('#empty').classList.toggle('show',!cart.length);$('#cartItems').innerHTML=cart.map((x,i)=>`<div class="ci"><img src="${x.img}"><div><small>SIZE ${x.size}</small><h3>${x.name}</h3><strong>RM${x.price}</strong><div class="ciline"><div class="qmini"><button data-mi="${i}">−</button><span>${x.qty}</span><button data-pl="${i}">+</button></div><button class="remove" data-rm="${i}">Remove</button></div></div></div>`).join('');$$('[data-mi]').forEach(b=>b.onclick=()=>{let x=cart[+b.dataset.mi];x.qty--;if(x.qty<=0)cart.splice(+b.dataset.mi,1);save()});$$('[data-pl]').forEach(b=>b.onclick=()=>{cart[+b.dataset.pl].qty++;save()});$$('[data-rm]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);save()})}function cartOpen(v){$('#cart').classList.toggle('open',v);$('#cartShade').classList.toggle('show',v);lock(v)}$('#bagOpen').onclick=()=>cartOpen(1);$('#cartClose').onclick=()=>cartOpen(0);$('#cartShade').onclick=()=>cartOpen(0);$('#toastBag').onclick=()=>{cartOpen(1);$('#toast').classList.remove('show')};let tt;function toast(p){$('#toastImg').style.backgroundImage=`url(${p.img})`;$('#toastName').textContent=p.name;$('#toast').classList.add('show');clearTimeout(tt);tt=setTimeout(()=>$('#toast').classList.remove('show'),2500)}$('#checkout').onclick=()=>{if(!cart.length)return;let total=cart.reduce((a,x)=>a+x.price*x.qty,0),lines=cart.map(x=>`• ${x.name} | Size ${x.size} | Qty ${x.qty} | RM${x.price*x.qty}`),msg=`Hi DUDE STORE, I would like to order:\n\n${lines.join('\n')}\n\nSubtotal: RM${total}\n\nName:\nDelivery address:`;open('https://wa.me/60192412569?text='+encodeURIComponent(msg),'_blank')};renderCart();
function openGal(arr){gallery=arr.split(',');gi=0;showGal();$('#gallery').classList.add('open');lock(1)}function showGal(){$('#galleryImg').src=gallery[gi];$('#galleryCount').textContent=String(gi+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0')}function closeGal(){$('#gallery').classList.remove('open');lock(0)}$$('.collections article').forEach(a=>$('button',a).onclick=()=>openGal(a.dataset.gallery));$('#galleryClose').onclick=closeGal;$('#prev').onclick=()=>{gi=(gi-1+gallery.length)%gallery.length;showGal()};$('#next').onclick=()=>{gi=(gi+1)%gallery.length;showGal()};let tx=0;$('#gallery').ontouchstart=e=>tx=e.touches[0].clientX;$('#gallery').ontouchend=e=>{let d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)(d<0?$('#next'):$('#prev')).click()};
document.onkeydown=e=>{if(e.key==='Escape'){menu(0);cartOpen(0);search(0);closeProduct();closeGal()}if($('#gallery').classList.contains('open')){if(e.key==='ArrowRight')$('#next').click();if(e.key==='ArrowLeft')$('#prev').click()}};


/* ===== DUDE HOME 360 FIX ===== */
(() => {
  const viewer = document.getElementById('jeansViewer');
  if (!viewer) return;

  const views = [...viewer.querySelectorAll('.jeans-view')];
  const status = document.getElementById('jeansStatus');
  const prev = document.getElementById('jeansPrev');
  const next = document.getElementById('jeansNext');
  let index = 0;
  let downX = 0;
  let dragging = false;

  function showView(nextIndex, direction = 1) {
    const old = views[index];
    nextIndex = (nextIndex + views.length) % views.length;
    if (nextIndex === index) return;

    old.classList.remove('active');
    old.classList.remove('exit-left', 'exit-right');
    old.classList.add(direction > 0 ? 'exit-left' : 'exit-right');

    index = nextIndex;
    const current = views[index];
    current.classList.remove('exit-left', 'exit-right');
    current.classList.add('active');

    status.textContent = `${current.dataset.view} / ${current.dataset.angle}°`;

    setTimeout(() => old.classList.remove('exit-left', 'exit-right'), 600);
  }

  prev.addEventListener('click', () => showView(index - 1, -1));
  next.addEventListener('click', () => showView(index + 1, 1));

  viewer.addEventListener('pointerdown', e => {
    dragging = true;
    downX = e.clientX;
    viewer.setPointerCapture?.(e.pointerId);
  });

  viewer.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    const delta = e.clientX - downX;
    if (Math.abs(delta) > 35) {
      showView(index + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
    }
  });

  viewer.addEventListener('pointercancel', () => dragging = false);
})();

