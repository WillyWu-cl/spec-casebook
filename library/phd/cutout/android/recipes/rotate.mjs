// Two-finger rotate on Android through Appium W3C actions (device-android.ts has no rotate command).
// usage: node library/phd/cutout/android/recipes/rotate.mjs $(cat <run dir>/.session) <cx> <cy> <radius px> <degrees> <hold ms before lift>
const [sid,cx,cy,r,deg,hold]=process.argv.slice(2).map((v,i)=>i?Number(v):v);
const steps=8, f=(id,phase)=>{const a=[];for(let i=0;i<=steps;i++){const t=(phase+deg*i/steps)*Math.PI/180;const x=Math.round(cx+r*Math.cos(t)),y=Math.round(cy+r*Math.sin(t));
 if(i===0){a.push({type:'pointerMove',duration:0,x,y},{type:'pointerDown',button:0},{type:'pause',duration:150});} else a.push({type:'pointerMove',duration:120,x,y});}
 a.push({type:'pause',duration:hold},{type:'pointerUp',button:0});return {type:'pointer',id,parameters:{pointerType:'touch'},actions:a};};
const res=await fetch(`http://127.0.0.1:4724/session/${sid}/actions`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({actions:[f('f1',180),f('f2',0)]})});
console.log('rotate',res.status,(await res.text()).slice(0,200));
