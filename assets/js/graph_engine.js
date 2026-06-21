/* Learning Biology For Life: dependency-free graph renderer */
(function(){
  'use strict';
  function GraphEngine(canvasId){
    this.canvas=document.getElementById(canvasId);
    if(!this.canvas)return;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    this.ctx=this.canvas.getContext('2d');
    if(!this.ctx)return;
    this.mobile=window.matchMedia('(max-width:768px)').matches;
    this.nodes=[];this.edges=[];this.frame=null;this.tick=0;this.max=this.mobile?80:140;this.resizeTimer=null;
    this.colors={biology:'#0D9488',cellular:'#0D9488',genetics:'#6366F1',evolution:'#D97706',ecology:'#059669',biostatistics:'#DB2777',cognitive:'#00D4B2',synaptic:'#38BDF8',practices:'#F59E0B',default:'#1E293B'};
    this.resize=this.resize.bind(this);this.draw=this.draw.bind(this);this.debouncedResize=this.debouncedResize.bind(this);
    this.resize();this.bind();this.load();
  }
  GraphEngine.prototype.resize=function(){
    var parent=this.canvas.parentElement||this.canvas,rect=parent.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    this.w=Math.max(320,Math.floor(rect.width||640));this.h=this.mobile?360:520;
    this.canvas.width=Math.floor(this.w*dpr);this.canvas.height=Math.floor(this.h*dpr);
    this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';
    this.ctx.setTransform(dpr,0,0,dpr,0,0);this.seed();this.draw();
  };
  GraphEngine.prototype.debouncedResize=function(){
    var self=this;clearTimeout(this.resizeTimer);this.resizeTimer=setTimeout(function(){self.resize();},150);
  };
  GraphEngine.prototype.bind=function(){
    var self=this;window.addEventListener('resize',this.debouncedResize,{passive:true});
    document.addEventListener('visibilitychange',function(){if(document.hidden&&self.frame){cancelAnimationFrame(self.frame);self.frame=null;}});
    if(this.mobile){['touchstart','touchend','touchcancel'].forEach(function(evt){self.canvas.addEventListener(evt,function(){document.body.classList.toggle('graph-scrolling-locked',evt==='touchstart');},{passive:true});});}
  };
  GraphEngine.prototype.load=function(){
    var self=this;
    fetch('/assets/data/graph_manifest.json',{cache:'force-cache'}).then(function(r){return r.json();}).then(function(g){self.setData(g);}).catch(function(){self.setData({nodes:[{id:'dot',title:'DOT',discipline:'cognitive'},{id:'line',title:'LINE',discipline:'synaptic'},{id:'circle',title:'CIRCLE',discipline:'practices'}],edges:[{source:'dot',target:'line'},{source:'line',target:'circle'}]});});
  };
  GraphEngine.prototype.setData=function(g){
    var rawNodes=Array.isArray(g.nodes)?g.nodes:[],rawEdges=Array.isArray(g.edges)?g.edges:[];
    if(this.mobile){this.fold(rawNodes,rawEdges);}else{this.nodes=rawNodes.slice(0,90).map(function(n){return{id:String(n.id||n.slug||n.title),title:String(n.title||n.label||n.id||'Node'),discipline:String(n.discipline||n.group||'default').toLowerCase(),x:0,y:0,vx:0,vy:0};});var ids=new Set(this.nodes.map(function(n){return n.id;}));this.edges=rawEdges.filter(function(e){return ids.has(String(e.source))&&ids.has(String(e.target));}).slice(0,160).map(function(e){return{source:String(e.source),target:String(e.target)};});}
    this.seed();this.tick=0;this.simulate();
  };
  GraphEngine.prototype.fold=function(rawNodes,rawEdges){
    var clusters={},map={};
    rawNodes.forEach(function(n){var d=String(n.discipline||n.group||'default').toLowerCase(),id=String(n.id||n.slug||n.title);clusters[d]=clusters[d]||{id:'cluster-'+d,title:d.replace(/-/g,' ')+' Cluster',discipline:d,isCluster:true,x:0,y:0,vx:0,vy:0};map[id]='cluster-'+d;});
    var seen=new Set();this.edges=[];rawEdges.forEach(function(e){var s=map[String(e.source)],t=map[String(e.target)],k=s+'>'+t;if(!s||!t||s===t||seen.has(k))return;seen.add(k);this.edges.push({source:s,target:t});},this);
    this.nodes=Object.values(clusters);
  };
  GraphEngine.prototype.seed=function(){
    if(!this.nodes.length)return;var r=Math.min(this.w,this.h)*0.34,cx=this.w/2,cy=this.h/2;
    this.nodes.forEach(function(n,i){if(n.x&&n.y)return;var a=(i/this.nodes.length)*Math.PI*2;n.x=cx+Math.cos(a)*r;n.y=cy+Math.sin(a)*r;n.vx=0;n.vy=0;},this);
  };
  GraphEngine.prototype.simulate=function(){
    var self=this;if(!this.nodes.length||document.hidden)return;var k=.6*Math.sqrt((this.w*this.h)/(this.nodes.length||1)),byId=new Map(this.nodes.map(function(n){return[n.id,n];}));
    function step(){self.tick++;for(var i=0;i<self.nodes.length;i++){for(var j=i+1;j<self.nodes.length;j++){var a=self.nodes[i],b=self.nodes[j],dx=a.x-b.x||.01,dy=a.y-b.y||.01,d=Math.max(8,Math.sqrt(dx*dx+dy*dy)),f=(k*k)/d*.005;a.vx+=dx/d*f;a.vy+=dy/d*f;b.vx-=dx/d*f;b.vy-=dy/d*f;}}
      self.edges.forEach(function(e){var s=byId.get(e.source),t=byId.get(e.target);if(!s||!t)return;var dx=t.x-s.x,dy=t.y-s.y,d=Math.max(8,Math.sqrt(dx*dx+dy*dy)),f=(d*d)/k*.0008;s.vx+=dx/d*f;s.vy+=dy/d*f;t.vx-=dx/d*f;t.vy-=dy/d*f;});
      self.nodes.forEach(function(n){n.vx*=.82;n.vy*=.82;n.x=Math.min(self.w-24,Math.max(24,n.x+n.vx));n.y=Math.min(self.h-24,Math.max(24,n.y+n.vy));});self.draw();if(self.tick<self.max&&!document.hidden)self.frame=requestAnimationFrame(step);else self.frame=null;}
    cancelAnimationFrame(this.frame);this.frame=requestAnimationFrame(step);
  };
  GraphEngine.prototype.draw=function(){
    if(!this.ctx)return;var c=this.ctx;c.clearRect(0,0,this.w,this.h);c.fillStyle='#070B14';c.fillRect(0,0,this.w,this.h);var byId=new Map(this.nodes.map(function(n){return[n.id,n];}));
    c.strokeStyle='rgba(255,255,255,.13)';c.lineWidth=1.2;this.edges.forEach(function(e){var s=byId.get(e.source),t=byId.get(e.target);if(!s||!t)return;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(t.x,t.y);c.stroke();});
    this.nodes.forEach(function(n){var r=n.isCluster?15:9;c.beginPath();c.arc(n.x,n.y,r,0,Math.PI*2);c.fillStyle=this.colors[n.discipline]||this.colors.default;c.fill();c.strokeStyle='rgba(255,255,255,.28)';c.stroke();c.fillStyle='#E2E8F0';c.font='700 11px Inter,system-ui,sans-serif';c.textAlign='center';c.fillText(n.title.slice(0,24),n.x,n.y+r+14);},this);
  };
  window.BiologicalGraphEngine=GraphEngine;
  document.addEventListener('DOMContentLoaded',function(){var canvas=document.getElementById('interactive-canvas-element')||document.getElementById('neural-network');if(canvas&&!window.GraphRenderer)window.GraphRenderer=new GraphEngine(canvas.id);},{once:true});
})();
