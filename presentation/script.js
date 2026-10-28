/* Vanilla JS. Edit chart definitions below and values in assets/data.js. */
'use strict';
const data = window.BENCHMARK;
const colors = { GraphX:'#176cbb', GraphFrames:'#c66a24', RandomVertexCut:'#176cbb', EdgePartition1D:'#7953b5', EdgePartition2D:'#078276' };
const frameworks = ['GraphX','GraphFrames'];
const strategies = ['RandomVertexCut','EdgePartition1D','EdgePartition2D'];
const short = {RandomVertexCut:'Random',EdgePartition1D:'1D',EdgePartition2D:'2D'};
const format = (n,digits=2) => Number(n).toFixed(digits);
const frameworkRow = (f,phase) => data.framework.find(d=>d.framework===f && d.phase===phase);
const partitionRow = (s,p) => data.partition.find(d=>d.strategy===s && d.partitions===p);
const ns = 'http://www.w3.org/2000/svg';
function svgNode(tag,attrs={},text){ const node=document.createElementNS(ns,tag); for(const [k,v] of Object.entries(attrs)) node.setAttribute(k,v); if(text!==undefined) node.textContent=text; return node; }
function bars(id,rows,{partition=false,digits=2}={}){
  const target=document.getElementById(id);
  const height=partition?324:220, width=680, left=154, plotWidth=438;
  const maxMeasured=Math.max(...rows.map(r=>r.value.max));
  const maximum=Math.ceil(maxMeasured*1.16*10**(1-Math.floor(Math.log10(maxMeasured))))/10**(1-Math.floor(Math.log10(maxMeasured)));
  const x=v=>left+v/maximum*plotWidth;
  const svg=svgNode('svg',{viewBox:'0 0 '+width+' '+height,role:'img','aria-labelledby':id+'-title '+id+'-desc'});
  const caption=target.closest('figure').querySelector('figcaption').firstChild.textContent;
  svg.append(svgNode('title',{id:id+'-title'},caption));
  svg.append(svgNode('desc',{id:id+'-desc'},rows.map(r=>r.group+' '+r.label+': median '+format(r.value.median,3)+', min '+format(r.value.min,3)+', max '+format(r.value.max,3)).join('. ')));
  const top=partition?34:30,bottom=partition?276:165;
  for(let i=0;i<=4;i++){
    const tick=maximum*i/4;
    svg.append(svgNode('line',{x1:x(tick),x2:x(tick),y1:top,y2:bottom,class:'grid'}));
    svg.append(svgNode('text',{x:x(tick),y:bottom+23,'text-anchor':'middle',class:'axis-label'},format(tick,maximum>10?0:1)));
  }
  if(partition){
    svg.append(svgNode('text',{x:0,y:24,class:'group-label'},'P = 4'));
    svg.append(svgNode('text',{x:0,y:181,class:'group-label'},'P = 16'));
  }
  rows.forEach((r,i)=>{
    const y=partition?(i<3?54+i*32:207+(i-3)*28):62+i*70;
    const barHeight=partition?22:37;
    svg.append(svgNode('text',{x:0,y:y+7,class:'bar-label'},r.label));
    svg.append(svgNode('rect',{x:left,y:y-barHeight/2,width:Math.max(0,x(r.value.median)-left),height:barHeight,fill:colors[r.color]}));
    svg.append(svgNode('line',{x1:x(r.value.min),x2:x(r.value.max),y1:y,y2:y,class:'error'}));
    for(const v of [r.value.min,r.value.max]) svg.append(svgNode('line',{x1:x(v),x2:x(v),y1:y-6,y2:y+6,class:'error'}));
    svg.append(svgNode('text',{x:x(r.value.max)+12,y:y+7,class:'value-label'},format(r.value.median,digits)));
  });
  svg.append(svgNode('text',{x:left,y:height-1,class:'axis-label'},'Median; thanh sai số: min/max của 3 lượt đo'));
  target.replaceChildren(svg);
}
function frameworkChart(id,phase,metric,digits=2){
  bars(id,frameworks.map(f=>({label:f,color:f,group:phase,value:frameworkRow(f,phase)[metric]})),{digits});
}
function partitionChart(id,metric,digits=2){
  bars(id,[4,16].flatMap(p=>strategies.map(s=>({label:short[s],color:s,group:'P='+p,value:partitionRow(s,p)[metric]}))),{partition:true,digits});
}
// Slide 4: build. Slide 6: one aggregation. Slide 8: PR setup+5 loops / shuffle5loops.
frameworkChart('build-time','build','time_s');
frameworkChart('build-cache','build','cache_MiB',1);
frameworkChart('aggregate-time','aggregate','time_s',3);
frameworkChart('aggregate-shuffle','aggregate','read_MiB',2);
frameworkChart('pr-time','pr_total','time_s');
frameworkChart('pr-shuffle','pr_iteration','read_MiB',1);
partitionChart('load','load_max_over_mean',3);
partitionChart('replication','replication_factor',3);
partitionChart('partition-shuffle','read_MiB',1);
partitionChart('partition-time','total_s',2);
document.querySelectorAll('[data-ratio]').forEach(el=>{
  const phase=el.dataset.ratio;
  const gx=frameworkRow('GraphX',phase).time_s.median, gf=frameworkRow('GraphFrames',phase).time_s.median;
  el.textContent=format(phase==='build'?gx/gf:gf/gx,1)+'×';
});
// Small, dependency-free Scala highlighter. It never interprets source as HTML.
const keywords=new Set(['val','var','def','case','for','if','else','import','new','true','false','yield','return']);
function highlight(code){
  const text=code.textContent;
  const pattern=/\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b\d+(?:\.\d+)?(?:[Ll])?\b|\b[A-Za-z_][A-Za-z0-9_]*\b/g;
  let cursor=0; const fragment=document.createDocumentFragment();
  for(const match of text.matchAll(pattern)){
    fragment.append(document.createTextNode(text.slice(cursor,match.index)));
    const token=match[0]; let type='';
    if(token.startsWith('//'))type='comment';else if(token.startsWith('"'))type='string';else if(/^\d/.test(token))type='number';else if(keywords.has(token))type='keyword';else if(/^[A-Z]/.test(token))type='type';
    if(type){const span=document.createElement('span');span.className='tok-'+type;span.textContent=token;fragment.append(span);}else fragment.append(document.createTextNode(token));
    cursor=match.index+token.length;
  }
  fragment.append(document.createTextNode(text.slice(cursor)));code.replaceChildren(fragment);
}
document.querySelectorAll('code.scala').forEach(highlight);
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
