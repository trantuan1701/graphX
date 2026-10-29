'use strict';
const slides=[...document.querySelectorAll('.slide')];
let current=0;
function resize(){
  // Keep room for controls outside the canvas. Fullscreen maximizes the slide.
  const reserve=document.fullscreenElement?0:56;
  document.documentElement.style.setProperty('--slide-scale',Math.min(innerWidth/1600,(innerHeight-reserve)/900));
  document.getElementById('deck').style.top=document.fullscreenElement?'50%':'calc(50% - 22px)';
}
function show(index,updateHash=true){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current));});
  document.getElementById('counter').textContent=(current+1)+' / '+slides.length;
  document.getElementById('prev').disabled=current===0;
  document.getElementById('next').disabled=current===slides.length-1;
  document.querySelector('.progress i').style.width=((current+1)/slides.length*100)+'%';
  document.title=(current+1)+' / '+slides.length+' - '+slides[current].querySelector('h1').textContent;
  if(updateHash)history.replaceState(null,'','#'+(current+1));
}
function readHash(){const n=Number(location.hash.slice(1));show(Number.isInteger(n)&&n>=1&&n<=slides.length?n-1:0,false);}
function toggleNotes(){document.body.classList.toggle('show-notes');document.getElementById('notes').setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));}
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.body.requestFullscreen();}catch(error){document.getElementById('fullscreen').title='Trình duyệt chưa cho phép fullscreen. Có thể dùng F11.';}}
document.getElementById('prev').addEventListener('click',()=>show(current-1));
document.getElementById('next').addEventListener('click',()=>show(current+1));
document.getElementById('notes').addEventListener('click',toggleNotes);
document.getElementById('fullscreen').addEventListener('click',toggleFullscreen);
document.getElementById('print').addEventListener('click',()=>window.print());
document.addEventListener('keydown',event=>{
  if(event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select,[contenteditable=true]'))return;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)){event.preventDefault();show(current+1);}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}
  else if(event.key==='Home'){event.preventDefault();show(0);}
  else if(event.key==='End'){event.preventDefault();show(slides.length-1);}
  else if(event.key.toLowerCase()==='n')toggleNotes();
  else if(event.key.toLowerCase()==='f')toggleFullscreen();
  else if(event.key.toLowerCase()==='p'){event.preventDefault();window.print();}
  else if(event.key==='Escape'&&document.body.classList.contains('show-notes'))toggleNotes();
});
window.addEventListener('resize',resize);document.addEventListener('fullscreenchange',resize);window.addEventListener('hashchange',readHash);
readHash();resize();
