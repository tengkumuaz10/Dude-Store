const body = document.body;
const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const cartBtn = document.querySelector('.cart-btn');
const cartClose = document.querySelector('.cart-close');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const quickAdds = document.querySelectorAll('.quick-add');
const searchBtn = document.querySelector('.search-btn');
const searchClose = document.querySelector('.search-close');
const searchInput = document.getElementById('searchInput');
const heroStage = document.getElementById('heroStage');
const glow = document.querySelector('.cursor-glow');
let cart = JSON.parse(localStorage.getItem('dudeCart') || '[]');

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>8));

menuBtn.addEventListener('click',()=>{
  body.classList.toggle('menu-open');
  mobileMenu.setAttribute('aria-hidden', body.classList.contains('menu-open') ? 'false' : 'true');
});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>body.classList.remove('menu-open')));

const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) entry.target.classList.add('visible');
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

window.addEventListener('mousemove',e=>{
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
});

heroStage.addEventListener('mousemove',e=>{
  if(innerWidth<760) return;
  const r=heroStage.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;
  heroStage.style.transform=`rotateY(${x*5}deg) rotateX(${y*-4}deg)`;
});
heroStage.addEventListener('mouseleave',()=>heroStage.style.transform='');

function save(){localStorage.setItem('dudeCart',JSON.stringify(cart));}
function rm(v){return `RM${v}`;}
function openCart(){body.classList.add('cart-open','locked');}
function closeCart(){body.classList.remove('cart-open','locked');}
cartBtn.addEventListener('click',openCart); cartClose.addEventListener('click',closeCart); cartOverlay.addEventListener('click',closeCart);

function add(product){
  const found=cart.find(x=>x.name===product.name);
  found ? found.qty++ : cart.push({...product,qty:1});
  save(); render(); openCart();
}

function render(){
  cartItems.innerHTML='';
  const totalQty=cart.reduce((s,x)=>s+x.qty,0);
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  cartCount.textContent=totalQty; cartTotal.textContent=rm(total);
  cartEmpty.classList.toggle('show',cart.length===0);
  cart.forEach(item=>{
    const el=document.createElement('div'); el.className='cart-item';
    el.innerHTML=`<img src="${item.image}" alt="${item.name}"><div><h4>${item.name}</h4><p>${rm(item.price)}</p><div class="cart-item-row"><div class="qty"><button data-act="minus" data-name="${item.name}">−</button><span>${item.qty}</span><button data-act="plus" data-name="${item.name}">+</button></div><button class="remove" data-act="remove" data-name="${item.name}">Remove</button></div></div>`;
    cartItems.appendChild(el);
  });
}

quickAdds.forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.product-card');
  add({name:card.dataset.name,price:Number(card.dataset.price),image:card.dataset.image});
  btn.textContent='✓'; setTimeout(()=>btn.textContent='+',800);
}));

cartItems.addEventListener('click',e=>{
  const act=e.target.dataset.act,name=e.target.dataset.name;if(!act)return;
  const item=cart.find(x=>x.name===name);
  if(act==='plus') item.qty++;
  if(act==='minus') item.qty--;
  if(act==='remove'||item?.qty<=0) cart=cart.filter(x=>x.name!==name);
  save();render();
});

searchBtn.addEventListener('click',()=>{body.classList.add('search-open','locked');setTimeout(()=>searchInput.focus(),280)});
searchClose.addEventListener('click',()=>body.classList.remove('search-open','locked'));

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){body.classList.remove('cart-open','search-open','menu-open','locked');}
});

document.querySelector('.checkout').addEventListener('click',()=>{
  if(!cart.length)return;
  alert('Checkout demo ready. Next we can connect this button to WhatsApp, ToyyibPay, Stripe or your preferred payment flow.');
});

render();
