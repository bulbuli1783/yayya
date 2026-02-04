// ===== ULTRA LOVE ENGINE =====

// setup
document.body.style.margin=0;
document.body.style.overflow="hidden";
document.body.style.background="black";

const c=document.createElement("canvas");
document.body.appendChild(c);
const ctx=c.getContext("2d");

let w,h;
function resize(){
  w=c.width=innerWidth;
  h=c.height=innerHeight;
}
resize();
addEventListener("resize",resize);

// ===== GALAXY BG =====
function galaxy(){
  let g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,h);
  g.addColorStop(0,"#1a0033");
  g.addColorStop(.4,"#000010");
  g.addColorStop(1,"#000");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);

  for(let i=0;i<3;i++){
    ctx.fillStyle="rgba(255,255,255,.3)";
    ctx.beginPath();
    ctx.arc(Math.random()*w,Math.random()*h,Math.random()*1.5,0,6.28);
    ctx.fill();
  }
}

// ===== HEART SHAPE =====
function heart(x,y,s){
  ctx.beginPath();
  for(let t=0;t<6.28;t+=0.05){
    let X=16*Math.sin(t)**3;
    let Y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    ctx.lineTo(x+X*s,y-Y*s);
  }
  ctx.closePath();
}

// ===== PARTICLE =====
class Particle{
  constructor(x,y,col){
    this.x=x; this.y=y;
    this.vx=(Math.random()-0.5)*6;
    this.vy=(Math.random()-0.5)*6;
    this.a=1;
    this.s=2+Math.random()*3;
    this.col=col;
  }
  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    this.vy+=0.05;
    this.a-=0.015;
  }
  draw(){
    ctx.globalAlpha=this.a;
    ctx.fillStyle=this.col;
    ctx.shadowBlur=15;
    ctx.shadowColor=this.col;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.s,0,6.28);
    ctx.fill();
    ctx.globalAlpha=1;
  }
}

// ===== FLOATING HEART =====
class Heart{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.s=.3+Math.random()*.6;
    this.vy=1+Math.random()*2;
    this.a=1;
    this.h=330+Math.random()*30;
  }
  update(){
    this.y-=this.vy;
    this.a-=.004;
  }
  draw(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.scale(this.s,this.s);

    let col=`hsl(${this.h},100%,60%)`;
    ctx.fillStyle=col;
    ctx.shadowBlur=30;
    ctx.shadowColor=col;
    ctx.globalAlpha=this.a;

    heart(0,0,1.4);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha=1;
  }
}

// ===== TEXT PARTICLES =====
function loveText(){
  const txt="LOVE";
  ctx.font="bold 140px sans-serif";
  ctx.fillStyle="#fff";
  ctx.textAlign="center";
  ctx.fillText(txt,w/2,h/2);

  const data=ctx.getImageData(0,0,w,h).data;

  for(let y=0;y<h;y+=6){
    for(let x=0;x<w;x+=6){
      let i=(y*w+x)*4;
      if(data[i+3]>150){
        parts.push(new Particle(x,y,"#ff2a6d"));
      }
    }
  }
}

// ===== SYSTEM =====
let parts=[];
let hearts=[];

// spawn
function burst(x,y){
  for(let i=0;i<40;i++)
    parts.push(new Particle(x,y,`hsl(${Math.random()*360},100%,60%)`));
}

addEventListener("click",e=>{
  burst(e.clientX,e.clientY);
  for(let i=0;i<6;i++)
    hearts.push(new Heart(e.clientX,e.clientY));
});

addEventListener("mousemove",e=>{
  if(Math.random()<.2)
    parts.push(new Particle(e.clientX,e.clientY,"#ff66aa"));
});

// auto fireworks
setInterval(()=>{
  let x=Math.random()*w;
  let y=Math.random()*h*.6;
  burst(x,y);
  hearts.push(new Heart(x,y));
},1200);

// init LOVE text once
setTimeout(loveText,500);

// ===== LOOP =====
function loop(){
  ctx.fillStyle="rgba(0,0,0,.25)";
  ctx.fillRect(0,0,w,h);

  galaxy();

  parts=parts.filter(p=>p.a>0);
  hearts=hearts.filter(h=>h.a>0);

  parts.forEach(p=>{p.update();p.draw();});
  hearts.forEach(h=>{h.update();h.draw();});

  requestAnimationFrame(loop);
}
loop();