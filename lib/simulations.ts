export type Lesson={id:string,title:string,subject:string,grade:string,description:string,kind:string,html?:string};
export const catalog:Lesson[]=[
{id:'water-boiling',title:'Sự sôi và chuyển thể của nước (Bay hơi)',subject:'Khoa học tự nhiên',grade:'Lớp 6',description:'Đun nước bằng đèn cồn: quan sát sự tăng nhiệt độ, bọt khí xuất hiện, nước sôi sùng sục ở 100°C và khói hơi nước bốc lên nghi ngút.',kind:'water-boiling'},
{id:'iron-sulfur',title:'Phản ứng giữa Sắt và Lưu huỳnh (Fe + S)',subject:'Khoa học tự nhiên',grade:'Lớp 8',description:'Nung hỗn hợp bột Fe và S: quan sát lưu huỳnh nóng chảy, phản ứng tỏa nhiệt đỏ rực, bốc khói và thử từ tính của FeS.',kind:'iron-sulfur'},
{id:'ohm',title:'Khám phá định luật Ohm',subject:'Vật lý',grade:'Lớp 9',description:'Thay đổi điện áp, điện trở và quan sát cường độ dòng điện.',kind:'ohm'},
{id:'refraction',title:'Khúc xạ ánh sáng',subject:'Vật lý',grade:'Lớp 9',description:'Khám phá đường truyền ánh sáng khi đi qua hai môi trường.',kind:'refraction'},
{id:'quadratic',title:'Đồ thị hàm số bậc hai',subject:'Toán học',grade:'Lớp 10',description:'Điều chỉnh hệ số a, b, c và khám phá sự thay đổi của parabol.',kind:'quadratic'},
{id:'ph',title:'Thang pH và môi trường dung dịch',subject:'Hóa học',grade:'Lớp 11',description:'Tìm hiểu mối liên hệ giữa pH và nồng độ ion H⁺.',kind:'ph'},
{id:'waves',title:'Sóng cơ học',subject:'Vật lý',grade:'Lớp 11',description:'Quan sát ảnh hưởng của biên độ, tần số và tốc độ truyền sóng.',kind:'waves'}];

export function secureHTML(html:string){
const csp=`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'">`;
return '<!doctype html>'+csp+html.replace(/<!doctype[^>]*>/ig,'');
}

function waterBoilingHTML():string{
return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Mô phỏng Sự chuyển thể của Nước</title><style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}
body{background-color:#f0f4f8;color:#333;padding:15px;display:flex;flex-direction:column;align-items:center;min-height:100vh}
header{text-align:center;margin-bottom:15px;width:100%;max-width:1000px}
h1{color:#1a365d;font-size:1.6rem;margin-bottom:5px}
p.subtitle{color:#4a5568;font-size:0.95rem}
.main-container{display:flex;flex-wrap:wrap;gap:15px;width:100%;max-width:1000px;justify-content:center}
.canvas-card{background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);padding:15px;display:flex;flex-direction:column;align-items:center;flex:1 1 450px;min-width:320px}
.controls-card{background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);padding:15px;flex:1 1 450px;min-width:320px;display:flex;flex-direction:column;gap:12px}
canvas{background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0}
.status-box{background:#ebf8ff;border-left:4px solid #3182ce;padding:10px 12px;border-radius:4px;font-size:0.9rem;line-height:1.4}
.status-title{font-weight:bold;color:#2b6cb0;margin-bottom:3px}
.control-group{display:flex;flex-direction:column;gap:5px}
label{font-weight:600;font-size:0.85rem;color:#2d3748}
.btn-group{display:flex;gap:8px;flex-wrap:wrap}
button{flex:1;padding:10px 12px;border:none;border-radius:6px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-size:0.9rem;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-burn{background-color:#dd6b20;color:white}
.btn-burn:hover{background-color:#c05621}
.btn-burn.active{background-color:#e53e3e;box-shadow:inset 0 2px 4px rgba(0,0,0,0.2)}
.btn-cool{background-color:#3182ce;color:white}
.btn-cool:hover{background-color:#2b6cb0}
.btn-cool.active{background-color:#2c5282;box-shadow:inset 0 2px 4px rgba(0,0,0,0.2)}
.btn-reset{background-color:#718096;color:white}
.btn-reset:hover{background-color:#4a5568}
.data-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;background:#f7fafc;padding:10px;border-radius:6px;border:1px solid #edf2f7}
.data-item{display:flex;flex-direction:column}
.data-label{font-size:0.75rem;color:#718096;text-transform:uppercase}
.data-value{font-size:1.1rem;font-weight:bold;color:#2d3748}
.chart-container{width:100%;height:140px;margin-top:5px}
.question{margin-top:15px;border:1px solid #e0e8d4;background:#f8faef;border-radius:10px;padding:15px;width:100%;max-width:1000px}
.question b{font-size:15px;color:#253f36}
.answers{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}
.feedback{font-size:14px;margin:12px 0 0;color:#137746;font-weight:600}
.quiz-btn{padding:8px 12px;font-size:13px;background:#fff;border:1px solid #9dd9be;color:#147d57;border-radius:6px;cursor:pointer}
@media(max-width:650px){.main-container{flex-direction:column}canvas{max-width:100%;height:auto}}
</style></head><body>
<header>
<h1>THÍ NGHIỆM MÔ PHỎNG: SỰ CHUYỂN THỂ CỦA NƯỚC</h1>
<p class="subtitle">Quan sát hiện tượng đá tan (0°C), nóng dần, nước sôi sùng sục (100°C) và khói hơi nước bốc lên nghi ngút</p>
</header>
<div class="main-container">
<div class="canvas-card">
<canvas id="canvas" width="400" height="380" aria-label="Biểu diễn thí nghiệm đun nước"></canvas>
</div>
<div class="controls-card">
<div class="status-box">
<div class="status-title" id="phaseTitle">Giai đoạn: Nước đá đang tan</div>
<div id="phaseDesc">Đá rắn đang hấp thụ nhiệt từ môi trường để chuyển thành nước lỏng. Nhiệt độ duy trì xấp xỉ 0 °C.</div>
</div>
<div class="data-grid">
<div class="data-item"><span class="data-label">Nhiệt độ</span><span class="data-value" id="tempDisplay">0.0 °C</span></div>
<div class="data-item"><span class="data-label">Trạng thái chính</span><span class="data-value" id="stateDisplay">Rắn + Lỏng</span></div>
<div class="data-item"><span class="data-label">Tỉ lệ đá</span><span class="data-value" id="icePercentDisplay">100%</span></div>
<div class="data-item"><span class="data-label">Thời gian</span><span class="data-value" id="timeDisplay">00:00</span></div>
</div>
<div class="control-group">
<label>Tác động nhiệt:</label>
<div class="btn-group">
<button id="burnBtn" class="btn-burn">🔥 Đun đèn cồn</button>
<button id="coolBtn" class="btn-cool">❄️ Làm lạnh</button>
<button id="reset" class="btn-reset">🔄 Làm lại</button>
</div>
</div>
<div class="control-group">
<label>Tốc độ đun / cấp nhiệt: <span id="speedVal">2x</span></label>
<input type="range" id="heatSpeed" min="1" max="5" value="2" step="1">
</div>
<div class="control-group">
<label>Đồ thị Nhiệt độ theo Thời gian (°C / giây):</label>
<div class="chart-container">
<canvas id="chartCanvas" width="400" height="130"></canvas>
</div>
</div>
<output id="result" aria-live="polite" style="display:none"></output>
</div>
</div>
<div class="question">
<b id="question">Trong suốt thời gian nước đang sôi ở áp suất khí quyển chuẩn (1 atm), nhiệt độ của nước…</b>
<div class="answers" id="answers"></div>
<p class="feedback" id="feedback" role="status"></p>
</div>
<script>
const cv=document.getElementById('canvas'),ctx=cv?cv.getContext('2d'):null;
const chartCanvas=document.getElementById('chartCanvas'),chartCtx=chartCanvas&&chartCanvas.getContext?chartCanvas.getContext('2d'):null;
let simTime=0,temperature=-2.0,iceRatio=1.0,heatMode=0,isRunning=true;
let steamParticles=[],bubbleParticles=[],historyData=[];
const BEAKER={x:130,y:140,w:140,h:170};
const BURNER={x:150,y:320,w:100,h:50};
const burnBtn=document.getElementById('burnBtn'),coolBtn=document.getElementById('coolBtn'),resetBtn=document.getElementById('reset');
const heatSpeedInput=document.getElementById('heatSpeed'),speedVal=document.getElementById('speedVal');
const tempDisplay=document.getElementById('tempDisplay'),stateDisplay=document.getElementById('stateDisplay');
const icePercentDisplay=document.getElementById('icePercentDisplay'),timeDisplay=document.getElementById('timeDisplay');
const phaseTitle=document.getElementById('phaseTitle'),phaseDesc=document.getElementById('phaseDesc');
const result=document.getElementById('result');

burnBtn.onclick=()=>{heatMode=(heatMode===1)?0:1;updateBtnStates()};
coolBtn.onclick=()=>{heatMode=(heatMode===-1)?0:-1;updateBtnStates()};
resetBtn.onclick=()=>{resetSimulation()};
heatSpeedInput.oninput=()=>{speedVal.textContent=heatSpeedInput.value+'x';updateUI()};

function updateBtnStates(){
if(burnBtn&&burnBtn.classList){burnBtn.classList.toggle('active',heatMode===1)}
if(coolBtn&&coolBtn.classList){coolBtn.classList.toggle('active',heatMode===-1)}
}
function resetSimulation(){
simTime=0;temperature=-2.0;iceRatio=1.0;heatMode=0;historyData=[];steamParticles=[];bubbleParticles=[];
updateBtnStates();updateUI();
}
function updatePhysics(){
const speed=parseFloat(heatSpeedInput.value)||2,dt=0.1*speed;
simTime+=dt;
if(heatMode===1){
if(iceRatio>0){
if(temperature<0){temperature+=0.5*dt;if(temperature>0)temperature=0}
else{temperature=0.0;iceRatio-=0.015*dt;if(iceRatio<0)iceRatio=0}
}else if(temperature<100){temperature+=0.8*dt;if(temperature>100)temperature=100}
else{temperature=100.0+(Math.random()*0.4-0.2)}
}else if(heatMode===-1){
if(temperature>0){temperature-=0.9*dt;if(temperature<0)temperature=0}
else if(iceRatio<1.0){temperature=0.0;iceRatio+=0.012*dt;if(iceRatio>1.0)iceRatio=1.0}
else{temperature-=0.4*dt;if(temperature<-15)temperature=-15}
}else{
const roomTemp=25.0;
if(iceRatio>0){if(temperature<0)temperature+=0.1*dt;else{temperature=0.0;iceRatio-=0.003*dt;if(iceRatio<0)iceRatio=0}}
else{if(temperature<roomTemp){temperature+=0.15*dt;if(temperature>roomTemp)temperature=roomTemp}else if(temperature>roomTemp){temperature-=0.2*dt;if(temperature<roomTemp)temperature=roomTemp}}
}
if(historyData.length===0||simTime-historyData[historyData.length-1].time>=0.5){
historyData.push({time:simTime,temp:temperature});if(historyData.length>120)historyData.shift();
}
updateParticles();updateUI();
}
function updateParticles(){
if(temperature>30&&temperature<85&&heatMode===1&&Math.random()<0.2){
bubbleParticles.push({x:BEAKER.x+15+Math.random()*(BEAKER.w-30),y:BEAKER.y+BEAKER.h-15,r:1+Math.random()*2,speed:0.5+Math.random()*0.8,type:'air'});
}
if(temperature>=98){
for(let i=0;i<3;i++){
bubbleParticles.push({x:BEAKER.x+10+Math.random()*(BEAKER.w-20),y:BEAKER.y+BEAKER.h-10,r:3+Math.random()*5,speed:2+Math.random()*2.5,type:'steam'});
}
if(Math.random()<0.6){
steamParticles.push({x:BEAKER.x+20+Math.random()*(BEAKER.w-40),y:BEAKER.y+20,vx:(Math.random()-0.5)*0.8,vy:-(1+Math.random()*1.5),alpha:0.4+Math.random()*0.3,size:8+Math.random()*10});
}
}
const waterSurfaceY=BEAKER.y+BEAKER.h-(50+(1-iceRatio*0.1)*80);
for(let i=bubbleParticles.length-1;i>=0;i--){
let b=bubbleParticles[i];b.y-=b.speed;if(b.y<=waterSurfaceY)bubbleParticles.splice(i,1);
}
for(let i=steamParticles.length-1;i>=0;i--){
let p=steamParticles[i];p.x+=p.vx;p.y+=p.vy;p.alpha-=0.008;p.size+=0.2;if(p.alpha<=0)steamParticles.splice(i,1);
}
}
function updateUI(){
tempDisplay.innerText=\`\${temperature.toFixed(1)} °C\`;
icePercentDisplay.innerText=\`\${Math.round(iceRatio*100)}%\`;
const mins=Math.floor(simTime/60).toString().padStart(2,'0'),secs=Math.floor(simTime%60).toString().padStart(2,'0');
timeDisplay.innerText=\`\${mins}:\${secs}\`;
let stateText='Rắn + Lỏng',phaseT='a. Nước đá đang tan',phaseD='Hỗn hợp đá và nước lỏng cùng tồn tại. Trong quá trình nóng chảy, nhiệt độ giữ ổn định ở xấp xỉ 0 °C.';
if(iceRatio===0&&temperature<98){stateText='Thể Lỏng';phaseT='b. Nước đá đã tan hết / Đang nóng dần';phaseD='Các viên đá đã tan hoàn toàn. Nước lỏng nhận nhiệt và nhiệt độ đang tăng dần.'}
else if(temperature>=98){stateText='Lỏng + Khí (Sôi)';phaseT='c. Nước đang sôi';phaseD='Bọt khí hơi nước hình thành mạnh từ đáy và vỡ ở mặt thoáng. Trong suốt quá trình sôi, nhiệt độ giữ không đổi ở 100 °C.'}
else if(iceRatio===1.0&&temperature<0){stateText='Thể Rắn (Nước đá)';phaseT='Đông đặc hoàn toàn';phaseD='Nước đã đông đặc hoàn toàn thành đá rắn. Nhiệt độ tiếp tục giảm dưới 0 °C.'}
stateDisplay.innerText=stateText;phaseTitle.innerText=phaseT;phaseDesc.innerText=phaseD;
result.textContent=\`Nhiệt độ: \${temperature.toFixed(1)} °C | Trạng thái: \${stateText} | Tỉ lệ đá: \${Math.round(iceRatio*100)}% | Giai đoạn: \${phaseT} - \${phaseD}\`;
}
function drawSimulation(){
if(!ctx)return;
ctx.clearRect(0,0,cv.width,cv.height);
ctx.strokeStyle='#4a5568';ctx.lineWidth=4;ctx.beginPath();
ctx.moveTo(BEAKER.x-20,350);ctx.lineTo(BEAKER.x+10,BEAKER.y+BEAKER.h+5);
ctx.lineTo(BEAKER.x+BEAKER.w-10,BEAKER.y+BEAKER.h+5);ctx.lineTo(BEAKER.x+BEAKER.w+20,350);ctx.stroke();
ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(BEAKER.x-25,BEAKER.y+BEAKER.h+5);ctx.lineTo(BEAKER.x+BEAKER.w+25,BEAKER.y+BEAKER.h+5);ctx.stroke();
drawBurner();
const waterHeight=60+(1-iceRatio*0.15)*60,waterTopY=BEAKER.y+BEAKER.h-waterHeight;
ctx.fillStyle='rgba(147,197,253,0.6)';ctx.fillRect(BEAKER.x+4,waterTopY,BEAKER.w-8,waterHeight-2);
bubbleParticles.forEach(b=>{
ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=b.type==='steam'?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.5)';
ctx.strokeStyle='#93c5fd';ctx.fill();ctx.stroke();
});
if(iceRatio>0)drawIceCubes(waterTopY);
ctx.strokeStyle='#cbd5e1';ctx.lineWidth=4;ctx.strokeRect(BEAKER.x,BEAKER.y,BEAKER.w,BEAKER.h);
ctx.fillStyle='#64748b';ctx.font='10px sans-serif';
for(let i=1;i<=4;i++){let my=BEAKER.y+BEAKER.h-(i*30);ctx.fillRect(BEAKER.x+4,my,12,2);ctx.fillText(\`\${i*50}ml\`,BEAKER.x+20,my+3)}
steamParticles.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=\`rgba(241,245,249,\${p.alpha})\`;ctx.fill()});
drawThermometer();
}
function drawBurner(){
if(!ctx)return;
ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(BURNER.x+BURNER.w/2,BURNER.y+30,25,0,Math.PI*2);ctx.fill();
ctx.fillRect(BURNER.x+BURNER.w/2-8,BURNER.y+5,16,15);
if(heatMode===1){
let flameH=30+Math.sin(Date.now()*0.02)*5;
let grad=ctx.createRadialGradient(BURNER.x+BURNER.w/2,BURNER.y,2,BURNER.x+BURNER.w/2,BURNER.y-flameH/2,20);
grad.addColorStop(0,'#fff5f5');grad.addColorStop(0.2,'#feebc8');grad.addColorStop(0.5,'#f6ad55');grad.addColorStop(1,'rgba(229,62,62,0)');
ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(BURNER.x+BURNER.w/2-12,BURNER.y+5);
ctx.quadraticCurveTo(BURNER.x+BURNER.w/2,BURNER.y-flameH-10,BURNER.x+BURNER.w/2+12,BURNER.y+5);ctx.fill();
}
}
function drawIceCubes(waterTopY){
if(!ctx)return;
const size=28*Math.pow(iceRatio,0.4);
if(size>3){
ctx.fillStyle='rgba(224,242,254,0.85)';ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.5;
[{x:BEAKER.x+35,y:waterTopY+10},{x:BEAKER.x+75,y:waterTopY+20},{x:BEAKER.x+55,y:waterTopY+45}].forEach((p,idx)=>{
if(iceRatio>idx*0.25){
ctx.beginPath();if(ctx.roundRect)ctx.roundRect(p.x,p.y,size,size,4);else ctx.rect(p.x,p.y,size,size);ctx.fill();ctx.stroke();
}
});
}
}
function drawThermometer(){
if(!ctx)return;
const tx=BEAKER.x+BEAKER.w-35,ty=BEAKER.y-20,th=200;
ctx.fillStyle='rgba(255,255,255,0.85)';ctx.strokeStyle='#64748b';ctx.lineWidth=2;
ctx.beginPath();if(ctx.roundRect)ctx.roundRect(tx,ty,12,th,6);else ctx.rect(tx,ty,12,th);ctx.fill();ctx.stroke();
ctx.fillStyle='#e53e3e';ctx.beginPath();ctx.arc(tx+6,ty+th-10,10,0,Math.PI*2);ctx.fill();
let clamped=Math.max(-15,Math.min(110,temperature)),mercuryH=((clamped+20)/130)*(th-30);
ctx.fillStyle='#e53e3e';ctx.fillRect(tx+4,ty+th-15-mercuryH,4,mercuryH);
ctx.fillStyle='#1e293b';ctx.font='bold 9px sans-serif';
let y0=ty+th-15-((0+20)/130)*(th-30);ctx.fillRect(tx-4,y0,8,1);ctx.fillText('0°C',tx-26,y0+3);
let y100=ty+th-15-((100+20)/130)*(th-30);ctx.fillRect(tx-4,y100,8,1);ctx.fillText('100°C',tx-36,y100+3);
}
function drawChart(){
if(!chartCtx)return;
chartCtx.clearRect(0,0,chartCanvas.width,chartCanvas.height);
const padL=35,padB=20,w=chartCanvas.width-padL-10,h=chartCanvas.height-padB-10;
chartCtx.strokeStyle='#94a3b8';chartCtx.lineWidth=1;chartCtx.beginPath();
chartCtx.moveTo(padL,10);chartCtx.lineTo(padL,10+h);chartCtx.lineTo(padL+w,10+h);chartCtx.stroke();
if(chartCtx.setLineDash)chartCtx.setLineDash([3,3]);chartCtx.strokeStyle='#cbd5e1';
let y0=10+h-((0+20)/130)*h;chartCtx.beginPath();chartCtx.moveTo(padL,y0);chartCtx.lineTo(padL+w,y0);chartCtx.stroke();
let y100=10+h-((100+20)/130)*h;chartCtx.beginPath();chartCtx.moveTo(padL,y100);chartCtx.lineTo(padL+w,y100);chartCtx.stroke();
if(chartCtx.setLineDash)chartCtx.setLineDash([]);
chartCtx.fillStyle='#64748b';chartCtx.font='10px sans-serif';
chartCtx.fillText('100°C',2,y100+3);chartCtx.fillText('0°C',10,y0+3);
if(historyData.length>1){
chartCtx.strokeStyle='#e53e3e';chartCtx.lineWidth=2;chartCtx.beginPath();
let maxT=Math.max(60,simTime);
historyData.forEach((pt,idx)=>{
let x=padL+(pt.time/maxT)*w,clamped=Math.max(-20,Math.min(110,pt.temp)),y=10+h-((clamped+20)/130)*h;
if(idx===0)chartCtx.moveTo(x,y);else chartCtx.lineTo(x,y);
});
chartCtx.stroke();
}
}
function loop(){
if(isRunning&&!document.hidden)updatePhysics();
drawSimulation();drawChart();
requestAnimationFrame(loop);
}
const quiz={
question:'Trong suốt thời gian nước đang sôi ở áp suất khí quyển chuẩn (1 atm), nhiệt độ của nước…',
answers:['Không đổi ở 100 °C dù tiếp tục đun nóng','Tiếp tục tăng lên trên 100 °C','Giảm dần do nước bay hơi'],
correct:0,
explanation:'Ở 100 °C (áp suất 1 atm), nhiệt lượng tiếp tục cung cấp dùng để làm nước chuyển thể từ lỏng sang hơi (nhiệt hóa hơi) nên nhiệt độ nước giữ không đổi ở 100 °C.'
};
document.getElementById('question').textContent=quiz.question;
quiz.answers.forEach((ans,i)=>{
const b=document.createElement('button');b.className='quiz-btn';
b.textContent=ans;b.onclick=()=>{document.getElementById('feedback').textContent=(i===quiz.correct?'Chính xác! ':'Chưa đúng. ')+quiz.explanation};
document.getElementById('answers').append(b);
});
updateUI();loop();
</script></body></html>`;
}

function ironSulfurHTML():string{
return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Mô Phỏng Thí Nghiệm: Sắt Tác Dụng Với Lưu Huỳnh</title><style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}
body{background-color:#f0f4f8;color:#333;padding:20px;display:flex;flex-direction:column;align-items:center}
header{text-align:center;margin-bottom:20px;width:100%;max-width:1000px}
h1{color:#1a365d;font-size:1.8rem;margin-bottom:8px}
p.subtitle{color:#4a5568;font-size:0.95rem}
.main-container{display:flex;flex-direction:column;gap:20px;max-width:1000px;width:100%}
@media(min-width:850px){.main-container{flex-direction:row}}
.simulation-card{background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);padding:15px;flex:2;display:flex;flex-direction:column;align-items:center}
canvas{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;width:100%;max-width:650px;height:auto;aspect-ratio:16/9}
.controls-card{background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);padding:20px;flex:1;display:flex;flex-direction:column;gap:15px}
.section-title{font-size:1.1rem;font-weight:600;color:#2b6cb0;border-bottom:2px solid #e2e8f0;padding-bottom:5px}
.step-btn{background-color:#3182ce;color:white;border:none;padding:10px 14px;border-radius:6px;cursor:pointer;font-weight:600;transition:all 0.2s;text-align:left;display:flex;align-items:center;gap:8px;font-size:0.9rem}
.step-btn:hover:not(:disabled){background-color:#2b6cb0;transform:translateY(-1px)}
.step-btn:disabled{background-color:#cbd5e0;cursor:not-allowed;opacity:0.7}
.step-btn.active{background-color:#2c5282;border-left:4px solid #dd6b20}
.btn-reset{background-color:#e53e3e;margin-top:10px}
.btn-reset:hover{background-color:#c53030}
.status-box{background-color:#ebf8ff;border-left:4px solid #3182ce;padding:12px;border-radius:4px;font-size:0.9rem;line-height:1.4;min-height:80px}
.info-table{width:100%;border-collapse:collapse;margin-top:10px;font-size:0.85rem}
.info-table th,.info-table td{border:1px solid #cbd5e0;padding:6px 8px;text-align:center}
.info-table th{background-color:#edf2f7;color:#2d3748}
.badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:0.75rem;font-weight:bold}
.badge-fe{background-color:#a0aec0;color:#1a202c}
.badge-s{background-color:#ecc94b;color:#744210}
.badge-fes{background-color:#4a5568;color:white}
.question{margin-top:15px;border:1px solid #e0e8d4;background:#f8faef;border-radius:10px;padding:15px;width:100%;max-width:1000px}
.question b{font-size:15px;color:#253f36}
.answers{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}
.feedback{font-size:14px;margin:12px 0 0;color:#137746;font-weight:600}
.quiz-btn{padding:8px 12px;font-size:13px;background:#fff;border:1px solid #9dd9be;color:#147d57;border-radius:6px;cursor:pointer}
</style></head><body>
<header>
<h1>MÔ PHỎNG THÍ NGHIỆM HÓA HỌC LỚP 8</h1>
<p class="subtitle">Phản ứng giữa Sắt (Fe) và Lưu huỳnh (S) tạo thành Sắt(II) sulfide (FeS)</p>
</header>
<div class="main-container">
<div class="simulation-card">
<canvas id="canvas" width="650" height="365" aria-label="Mô phỏng ống nghiệm Fe và S"></canvas>
</div>
<div class="controls-card">
<div class="section-title">Các bước thí nghiệm</div>
<button class="step-btn" id="btnStep1">1. Trộn bột Fe và S (Tỉ lệ 7:4)</button>
<button class="step-btn" id="btnStep2" disabled>2. Thử nam châm với Ống (1)</button>
<button class="step-btn" id="btnStep3" disabled>3. Đun nóng Ống (2)</button>
<button class="step-btn" id="btnStep4" disabled>4. Thử nam châm với Ống (2)</button>
<button class="step-btn btn-reset" id="reset">🔄 Làm lại thí nghiệm</button>
<div class="section-title">Trạng thái & Hiện tượng</div>
<div class="status-box" id="statusText">Sẵn sàng. Bấm <b>"1. Trộn bột Fe và S"</b> để bắt đầu thí nghiệm.</div>
<output id="result" aria-live="polite" style="display:none"></output>
</div>
</div>
<div class="main-container" style="margin-top:20px">
<div style="background:white;width:100%;padding:20px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
<div class="section-title">Bảng so sánh kết quả thí nghiệm</div>
<table class="info-table">
<thead>
<tr><th>Tiêu chí</th><th>Ống nghiệm (1): Chỉ trộn bột</th><th>Ống nghiệm (2): Sau khi đun nóng & để nguội</th></tr>
</thead>
<tbody>
<tr><td><b>Thành phần</b></td><td>Hỗn hợp <span class="badge badge-fe">Fe</span> và <span class="badge badge-s">S</span></td><td>Hợp chất <span class="badge badge-fes">FeS</span> (Sắt II sulfide)</td></tr>
<tr><td><b>Màu sắc</b></td><td>Xám vàng lẫn lộn (màu của Fe và S)</td><td>Màu xám đen / đen dạng khối</td></tr>
<tr><td><b>Tương tác với Nam châm</b></td><td>Bột Fe bị hút dính về phía nam châm</td><td>Không bị hút mạnh như Fe ban đầu</td></tr>
<tr><td><b>Tạo chất mới?</b></td><td><b>Không</b> (Biến đổi vật lý)</td><td><b>Có</b> (Biến đổi hóa học: Fe + S &rarr; FeS)</td></tr>
</tbody>
</table>
</div>
</div>
<div class="question">
<b id="question">Dấu hiệu nào chứng tỏ ống (2) đã xảy ra phản ứng hóa học tạo chất mới FeS?</b>
<div class="answers" id="answers"></div>
<p class="feedback" id="feedback" role="status"></p>
</div>
<script>
const canvas=document.getElementById('canvas'),ctx=canvas?canvas.getContext('2d'):null;
const statusText=document.getElementById('statusText'),result=document.getElementById('result');
let currentStep=0,animId=null;
let tube1Particles=[],tube2Particles=[];
let magnetPos={x:-100,y:-100,targetX:-100,targetY:-100};
let burnerOn=false,heatingProgress=0,reactionProgress=0,cooledDown=false;
const TUBE1_X=220,TUBE2_X=430,TUBE_Y=80,TUBE_W=40,TUBE_H=160;

class Particle{
constructor(x,y,type){
this.x=x;this.y=y;this.origX=x;this.origY=y;this.type=type;this.vx=0;this.vy=0;this.radius=2.5+Math.random()*1.5;
}
draw(){
if(!ctx)return;
ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
if(this.type==='Fe')ctx.fillStyle='#616161';
else if(this.type==='S')ctx.fillStyle='#fbc02d';
else if(this.type==='FeS')ctx.fillStyle='#212121';
ctx.fill();ctx.closePath();
}
}

function init(){
tube1Particles=[];tube2Particles=[];
magnetPos={x:-100,y:-100,targetX:-100,targetY:-100};
burnerOn=false;heatingProgress=0;reactionProgress=0;cooledDown=false;currentStep=0;
document.getElementById('btnStep1').disabled=false;
document.getElementById('btnStep2').disabled=true;
document.getElementById('btnStep3').disabled=true;
document.getElementById('btnStep4').disabled=true;
document.querySelectorAll('.step-btn').forEach(btn=>{if(btn.classList)btn.classList.remove('active')});
statusText.innerHTML="Sẵn sàng. Bấm <b>'1. Trộn bột Fe và S'</b> để bắt đầu thí nghiệm.";
result.textContent="Ống (1) chứa Fe và S. Ống (2) chứa Fe và S. Đang chuẩn bị thí nghiệm.";
if(!animId)animate();
}

function createParticles(centerX,bottomY){
let arr=[];
for(let i=0;i<90;i++){
let px=centerX-(TUBE_W/2-5)+Math.random()*(TUBE_W-10);
let py=bottomY-5-Math.random()*35;
let type=(i%11<7)?'Fe':'S';
arr.push(new Particle(px,py,type));
}
return arr;
}

function runStep(step){
currentStep=step;
document.querySelectorAll('.step-btn').forEach(btn=>{if(btn.classList)btn.classList.remove('active')});
if(step===1){
const b1=document.getElementById('btnStep1');if(b1&&b1.classList)b1.classList.add('active');
tube1Particles=createParticles(TUBE1_X,TUBE_Y+TUBE_H);
tube2Particles=createParticles(TUBE2_X,TUBE_Y+TUBE_H);
magnetPos.targetX=-100;burnerOn=false;
statusText.innerHTML="<b>Đã trộn hỗn hợp:</b> Bột Sắt (Fe) màu xám, bột Lưu huỳnh (S) màu vàng phân bố lẫn nhau. Không có sinh nhiệt, không tạo chất mới.";
result.textContent="Ống (1) & Ống (2): Đã trộn bột Fe (xám) và S (vàng) tỉ lệ 7:4. Chưa có phản ứng.";
document.getElementById('btnStep2').disabled=false;
}else if(step===2){
const b2=document.getElementById('btnStep2');if(b2&&b2.classList)b2.classList.add('active');
magnetPos.targetX=TUBE1_X-45;magnetPos.targetY=TUBE_Y+TUBE_H-25;
statusText.innerHTML="<b>Đưa nam châm lại gần Ống (1):</b> Bột sắt (Fe, xám) bị hút tiến về phía thành ống gần nam châm. Bột lưu huỳnh (S, vàng) không bị hút.";
result.textContent="Ống (1): Bột Fe bị hút dạt về phía nam châm, S không bị hút (hiện tượng vật lý).";
document.getElementById('btnStep3').disabled=false;
}else if(step===3){
const b3=document.getElementById('btnStep3');if(b3&&b3.classList)b3.classList.add('active');
magnetPos.targetX=-100;burnerOn=true;heatingProgress=0;reactionProgress=0;cooledDown=false;
statusText.innerHTML="<b>Đun nóng Ống (2):</b> Lưu huỳnh nóng chảy, sau đó xuất hiện <i>vùng cháy sáng đỏ-cam</i>. Phản ứng Fe + S tỏa nhiều nhiệt và tự lan truyền!";
result.textContent="Ống (2): Đun nóng bằng đèn cồn. Lưu huỳnh nóng chảy vàng sánh, phản ứng Fe + S phát sáng đỏ cam lan dần tạo FeS.";
document.getElementById('btnStep4').disabled=true;
}else if(step===4){
const b4=document.getElementById('btnStep4');if(b4&&b4.classList)b4.classList.add('active');
magnetPos.targetX=TUBE2_X+45;magnetPos.targetY=TUBE_Y+TUBE_H-25;
statusText.innerHTML="<b>Đưa nam châm lại gần Ống (2):</b> Sản phẩm màu xám đen (FeS) không bị nam châm hút mạnh như sắt ban đầu. Biến đổi hóa học đã xảy ra hoàn toàn.";
result.textContent="Ống (2): Sản phẩm FeS xám đen KHÔNG bị nam châm hút mạnh như Fe ban đầu (hiện tượng hóa học).";
}
}

document.getElementById('btnStep1').onclick=()=>runStep(1);
document.getElementById('btnStep2').onclick=()=>runStep(2);
document.getElementById('btnStep3').onclick=()=>runStep(3);
document.getElementById('btnStep4').onclick=()=>runStep(4);
document.getElementById('reset').onclick=()=>init();

function update(){
magnetPos.x+=(magnetPos.targetX-magnetPos.x)*0.1;
magnetPos.y+=(magnetPos.targetY-magnetPos.y)*0.1;
if(currentStep===2){
tube1Particles.forEach(p=>{if(p.type==='Fe')p.x+=(TUBE1_X-TUBE_W/2+4-p.x)*0.1});
}else{
tube1Particles.forEach(p=>{p.x+=(p.origX-p.x)*0.1});
}
if(burnerOn){
if(heatingProgress<1){heatingProgress+=0.008}
else if(reactionProgress<1){reactionProgress+=0.006}
else{
burnerOn=false;cooledDown=true;
document.getElementById('btnStep4').disabled=false;
statusText.innerHTML="<b>Phản ứng kết thúc & Đã nguội:</b> Sản phẩm thu được là khối chất rắn màu xám đen (Sắt(II) sulfide - FeS).";
result.textContent="Ống (2): Phản ứng kết thúc, tạo khối FeS xám đen. Hãy thử nam châm.";
}
}
if(reactionProgress>0){
let countToTransform=Math.floor(reactionProgress*tube2Particles.length);
for(let i=0;i<countToTransform;i++)tube2Particles[i].type='FeS';
}
}

function draw(){
if(!ctx)return;
ctx.clearRect(0,0,canvas.width,canvas.height);
drawStand(120,TUBE1_X,TUBE_Y);drawStand(330,TUBE2_X,TUBE_Y);
drawAlcoholLamp(TUBE2_X,TUBE_Y+TUBE_H+20,burnerOn);
drawTestTube(TUBE1_X,TUBE_Y,TUBE_W,TUBE_H,"(1) Chỉ trộn");
drawTestTube(TUBE2_X,TUBE_Y,TUBE_W,TUBE_H,"(2) Đun nóng");
tube1Particles.forEach(p=>p.draw());
if(reactionProgress<1&&!cooledDown){tube2Particles.forEach(p=>p.draw())}
if(reactionProgress>0&&reactionProgress<1){
let glowY=TUBE_Y+TUBE_H-20;
let rad=ctx.createRadialGradient(TUBE2_X,glowY,2,TUBE2_X,glowY,30);
rad.addColorStop(0,'rgba(255,100,0,0.9)');rad.addColorStop(0.6,'rgba(255,50,0,0.6)');rad.addColorStop(1,'rgba(255,0,0,0)');
ctx.fillStyle=rad;ctx.beginPath();ctx.arc(TUBE2_X,glowY,35,0,Math.PI*2);ctx.fill();
}
if(cooledDown||reactionProgress>=1){
ctx.beginPath();ctx.fillStyle='#2d3748';
if(ctx.roundRect)ctx.roundRect(TUBE2_X-TUBE_W/2+3,TUBE_Y+TUBE_H-35,TUBE_W-6,30,[0,0,10,10]);
else ctx.rect(TUBE2_X-TUBE_W/2+3,TUBE_Y+TUBE_H-35,TUBE_W-6,30);
ctx.fill();ctx.strokeStyle='#1a202c';ctx.stroke();
}
if(magnetPos.x>0)drawMagnet(magnetPos.x,magnetPos.y,magnetPos.x>300);
}

function drawTestTube(x,y,w,h,label){
if(!ctx)return;
ctx.save();ctx.beginPath();
ctx.moveTo(x-w/2,y);ctx.lineTo(x-w/2,y+h-w/2);ctx.arc(x,y+h-w/2,w/2,Math.PI,0,true);ctx.lineTo(x+w/2,y);
ctx.fillStyle='rgba(226,232,240,0.2)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#a0aec0';ctx.stroke();
ctx.beginPath();if(ctx.ellipse)ctx.ellipse(x,y,w/2+3,4,0,0,Math.PI*2);ctx.stroke();
ctx.fillStyle='#2d3748';ctx.font='bold 13px Segoe UI';ctx.textAlign='center';ctx.fillText(label,x,y-15);
ctx.restore();
}
function drawStand(baseX,tubeX,tubeY){
if(!ctx)return;
ctx.save();ctx.fillStyle='#718096';
ctx.fillRect(baseX,TUBE_Y+TUBE_H+50,100,10);
ctx.fillRect(baseX+20,tubeY-10,8,TUBE_H+60);
ctx.fillStyle='#4a5568';ctx.fillRect(baseX+20,tubeY+30,tubeX-(baseX+20)+5,8);
ctx.restore();
}
function drawAlcoholLamp(x,y,isOn){
if(!ctx)return;
ctx.save();ctx.fillStyle='#cbd5e0';ctx.beginPath();
ctx.moveTo(x-20,y+30);ctx.lineTo(x+20,y+30);ctx.lineTo(x+15,y+10);ctx.lineTo(x-15,y+10);ctx.closePath();
ctx.fill();ctx.stroke();
ctx.fillStyle='#a0aec0';ctx.fillRect(x-4,y,8,10);
if(isOn){
let flameH=20+Math.random()*5;
let grad=ctx.createLinearGradient(x,y,x,y-flameH);
grad.addColorStop(0,'#ecc94b');grad.addColorStop(0.5,'#dd6b20');grad.addColorStop(1,'rgba(229,62,62,0)');
ctx.beginPath();ctx.moveTo(x-6,y);ctx.quadraticCurveTo(x,y-flameH,x+6,y);ctx.fillStyle=grad;ctx.fill();
}
ctx.restore();
}
function drawMagnet(x,y,isRightSide){
if(!ctx)return;
ctx.save();ctx.translate(x,y);if(isRightSide)ctx.scale(-1,1);
ctx.lineWidth=12;
ctx.strokeStyle='#e53e3e';ctx.beginPath();ctx.arc(0,0,18,-Math.PI/2,0);ctx.stroke();
ctx.strokeStyle='#3182ce';ctx.beginPath();ctx.arc(0,0,18,Math.PI,-Math.PI/2);ctx.stroke();
ctx.fillStyle='white';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
ctx.fillText('N',0,-14);ctx.fillText('S',-14,2);
ctx.restore();
}
function animate(){
if(!document.hidden){update();draw()}
animId=requestAnimationFrame(animate);
}

const quizFe={
question:'Dấu hiệu nào chứng tỏ ống (2) đã xảy ra phản ứng hóa học tạo chất mới FeS?',
answers:['Vùng phản ứng phát sáng đỏ cam lan dần và sản phẩm FeS không còn bị nam châm hút','Lưu huỳnh chỉ nóng chảy thành chất lỏng vàng rồi đông đặc lại','Chất rắn sau khi nguội vẫn bị nam châm hút mạnh như sắt ban đầu'],
correct:0,
explanation:'Phương trình: Fe + S --(t°)--> FeS (phản ứng tỏa nhiệt). Hợp chất sắt(II) sunfua (FeS) màu xám đen/đen, không còn từ tính như sắt ban đầu, chứng minh chất mới đã hình thành.'
};
document.getElementById('question').textContent=quizFe.question;
quizFe.answers.forEach((ans,i)=>{
const b=document.createElement('button');b.className='quiz-btn';
b.textContent=ans;b.onclick=()=>{document.getElementById('feedback').textContent=(i===quizFe.correct?'Chính xác! ':'Chưa đúng. ')+quizFe.explanation};
document.getElementById('answers').append(b);
});
init();
</script></body></html>`;
}

function genericSimulationHTML(kind:string):string{
return `<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{font:16px Arial,sans-serif;margin:0;background:#f5faf8;color:#253f36;padding:24px}main{max-width:950px;margin:auto}h1{font-size:22px;margin:0 0 9px}p{line-height:1.7;color:#637e71;margin:0 0 18px;font-size:14px}.layout{display:grid;grid-template-columns:1fr 250px;gap:20px}canvas{width:100%;height:320px;background:white;border:1px solid #dcebe2;border-radius:12px}.controls{background:white;border:1px solid #dcebe2;border-radius:12px;padding:18px}label{display:block;font-size:14px;margin-bottom:22px}label span{float:right;color:#06966f;font-weight:bold}input{display:block;width:100%;margin-top:14px;accent-color:#0ba47c}output{display:block;background:#e8f7ed;color:#147749;border-radius:8px;padding:13px;font-size:15px;line-height:1.8;margin:12px 0}.btn{background:white;border:1px solid #9dd9be;color:#147d57;padding:10px 14px;border-radius:7px;cursor:pointer;font-size:14px}button:focus-visible,input:focus-visible{outline:3px solid #39bc96}.buttons{display:flex;gap:8px}.question{margin-top:20px;border:1px solid #e0e8d4;background:#f8faef;border-radius:10px;padding:18px}.question b{font-size:15px}.answers{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}.feedback{font-size:14px;margin:14px 0 0;color:#137746}.note{font-size:12px;margin-top:13px}@media(max-width:650px){body{padding:16px}.layout{grid-template-columns:1fr}canvas{height:270px}.controls{padding:16px}h1{font-size:19px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style></head><body><main><h1 id="title"></h1><p id="intro"></p><div class="layout"><section><canvas id="canvas" aria-label="Biểu diễn mô phỏng tương tác"></canvas><output id="result" aria-live="polite"></output><div class="buttons"><button class="btn" id="reset">Đặt lại</button><button class="btn" id="play">Tạm dừng</button></div></section><section class="controls" id="controls"></section></div><div class="question"><b id="question"></b><div class="answers" id="answers"></div><p class="feedback" id="feedback" role="status"></p></div><p class="note" id="note"></p></main><script>
const kind=${JSON.stringify(kind)};
const configs={ohm:{title:'Khám phá định luật Ohm',intro:'Giữ điện trở không đổi, tăng điện áp. Cường độ dòng điện thay đổi như thế nào?',params:[['Điện áp U','V',0,24,12,.5],['Điện trở R','Ω',1,100,20,1]],question:'Giữ R không đổi và tăng U lên gấp đôi, cường độ dòng điện sẽ…',answers:['Tăng gấp đôi','Giảm một nửa','Không đổi'],correct:0,explanation:'I = U/R. Khi R không đổi, I tỉ lệ thuận với U.',note:'Mô hình điện trở thuần lý tưởng, nhiệt độ không đổi. Vị trí chấm sáng minh họa dòng điện quy ước, không biểu diễn tốc độ electron.'},refraction:{title:'Khúc xạ ánh sáng',intro:'Thay đổi góc tới và chiết suất để quan sát tia khúc xạ, tia phản xạ.',params:[['Góc tới i','°',0,89,40,1],['Chiết suất n₁','',1,2.5,1,.05],['Chiết suất n₂','',1,2.5,1.33,.01]],question:'Tia sáng đi vuông góc với mặt phân cách thì góc khúc xạ bằng…',answers:['90°','0°','45°'],correct:1,explanation:'Theo n₁ sin(i) = n₂ sin(r), i = 0° thì r = 0°.',note:'Môi trường trong suốt, đồng nhất. Khi n₁ > n₂ và góc tới vượt góc giới hạn, xảy ra phản xạ toàn phần.'},quadratic:{title:'Đồ thị hàm số bậc hai',intro:'Thử thay đổi a, b và c. Hãy tìm hệ số quyết định chiều mở của parabol.',params:[['Hệ số a','',-3,3,1,.1],['Hệ số b','',-5,5,0,.5],['Hệ số c','',-5,5,0,.5]],question:'Khi a < 0, parabol có bề lõm hướng…',answers:['Lên trên','Xuống dưới','Sang phải'],correct:1,explanation:'Dấu của a quyết định chiều mở: a > 0 hướng lên, a < 0 hướng xuống.',note:'Khi a = 0, hàm số không còn là hàm bậc hai. Trục hoành x, trục tung y, mỗi ô lớn tương ứng 1 đơn vị.'},ph:{title:'Thang pH và môi trường dung dịch',intro:'Di chuyển thanh pH và quan sát nồng độ H⁺ biến đổi theo thang logarit.',params:[['Độ pH','',0,14,7,.1]],question:'Khi pH giảm 1 đơn vị, nồng độ H⁺ sẽ…',answers:['Tăng 10 lần','Giảm 10 lần','Tăng 1 mol/L'],correct:0,explanation:'[H⁺] = 10⁻ᵖᴴ mol/L. Giảm pH một đơn vị làm [H⁺] tăng 10 lần.',note:'Mô hình dung dịch nước loãng lý tưởng ở 25 °C, pH ≈ −log₁₀[H⁺]. Màu là quy ước minh họa thang pH, không phải màu thật của dung dịch.'},waves:{title:'Sóng cơ học',intro:'Thay đổi tần số khi tốc độ truyền không đổi và quan sát khoảng cách giữa hai đỉnh sóng.',params:[['Biên độ A','cm',0,5,2,.1],['Tần số f','Hz',.2,3,1,.1],['Tốc độ v','cm/s',2,10,5,.5]],question:'Giữ tốc độ truyền không đổi, tăng tần số thì bước sóng…',answers:['Tăng','Giảm','Không đổi'],correct:1,explanation:'Bước sóng λ = v/f nên giảm khi f tăng, với v không đổi.',note:'Sóng hình sin lý tưởng, không suy giảm. Phần tử môi trường dao động tại chỗ; dạng sóng truyền theo chiều dương.'}};
const cfg=configs[kind]||configs.ohm;let vals=cfg.params.map(p=>p[4]),running=!matchMedia('(prefers-reduced-motion: reduce)').matches,t=0,last=0,raf;
const $=id=>document.getElementById(id),cv=$('canvas'),ctx=cv?cv.getContext('2d'):null;if(cv){cv.width=800;cv.height=450;}
$('title').textContent=cfg.title;$('intro').textContent=cfg.intro;$('question').textContent=cfg.question;$('note').textContent=cfg.note;
cfg.params.forEach((p,i)=>{const l=document.createElement('label');l.textContent=p[0];const v=document.createElement('span');v.id='v'+i;v.textContent=vals[i]+' '+p[1];const s=document.createElement('input');s.type='range';s.min=p[2];s.max=p[3];s.step=p[5];s.value=vals[i];s.setAttribute('aria-label',p[0]);s.oninput=()=>{vals[i]=Number(s.value);v.textContent=s.value+' '+p[1];draw()};l.append(v,s);$('controls').append(l)});
cfg.answers.forEach((text,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=text;b.onclick=()=>{$('feedback').textContent=(i===cfg.correct?'Chính xác! ':'Chưa đúng. ')+cfg.explanation};$('answers').append(b)});
$('reset').onclick=()=>{vals=cfg.params.map(p=>p[4]);document.querySelectorAll('input').forEach((s,i)=>{s.value=vals[i];$('v'+i).textContent=vals[i]+' '+cfg.params[i][1]});t=0;$('feedback').textContent='';draw()};$('play').hidden=!['waves','ohm'].includes(kind);$('play').onclick=()=>{running=!running;$('play').textContent=running?'Tạm dừng':'Tiếp tục'};$('play').textContent=running?'Tạm dừng':'Tiếp tục';
function line(x1,y1,x2,y2,color='#138d71',w=3){if(!ctx)return;ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function text(s,x,y,color='#648474',size=20){if(!ctx)return;ctx.fillStyle=color;ctx.font=size+'px Arial';ctx.fillText(s,x,y)}
function dot(x,y,r=6,c='#13ac82'){if(!ctx)return;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function draw(){
if(!ctx)return;ctx.clearRect(0,0,800,450);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,800,450);
if(kind==='ohm'){const [u,r]=vals,i=u/r;line(150,100,650,100);line(650,100,650,350);line(650,350,150,350);line(150,100,150,195);line(150,255,150,350);line(115,205,185,205,'#384f49',5);line(130,240,170,240,'#384f49',5);ctx.fillStyle='#fff';ctx.fillRect(325,73,150,54);ctx.strokeStyle='#139779';ctx.strokeRect(325,73,150,54);text('R = '+r+' Ω',345,108,'#16846d',22);text('U = '+u+' V',25,290,'#16846d',22);text('I = '+i.toFixed(3)+' A',300,250,'#16846d',36);if(u>0)for(let j=0;j<14;j++){let p=(t*90*Math.min(i,3)+j*1500/14)%1500;if(p<500)dot(150+p,100);else if(p<750)dot(650,100+p-500);else if(p<1250)dot(650-(p-750),350);else dot(150,350-(p-1250))}$('result').textContent='I = U/R = '+i.toFixed(3)+' A · Công suất P = UI = '+(u*i).toFixed(2)+' W';}
else if(kind==='refraction'){const [angle,n1,n2]=vals,a=angle*Math.PI/180,k=n1*Math.sin(a)/n2;ctx.fillStyle='#e4f3fb';ctx.fillRect(0,225,800,225);line(0,225,800,225,'#86b7cf',2);if(ctx.setLineDash)ctx.setLineDash([8,7]);line(400,10,400,440,'#97aaa7',2);if(ctx.setLineDash)ctx.setLineDash([]);line(400-220*Math.sin(a),225-220*Math.cos(a),400,225,'#ecac33',4);line(400,225,400+220*Math.sin(a),225-220*Math.cos(a),'#d8b977',2);if(k<=1){const r=Math.asin(k);line(400,225,400+220*Math.sin(r),225+220*Math.cos(r),'#07a69a',4);$('result').textContent='n₁ sin(i) = n₂ sin(r) · Góc khúc xạ r = '+(r*180/Math.PI).toFixed(1)+'°'}else $('result').textContent='Phản xạ toàn phần · Không có tia khúc xạ truyền vào môi trường 2.';text('n₁ = '+n1,35,70);text('n₂ = '+n2,35,350);text('i = '+angle+'°',435,140);}
else if(kind==='quadratic'){const [a,b,c]=vals;line(0,225,800,225,'#92aaa0',2);line(400,0,400,450,'#92aaa0',2);for(let x=-9;x<=9;x++)if(x!==0)text(x,400+x*40-5,245,'#9bafa5',13);text('x',776,212);text('y',412,22);ctx.strokeStyle='#8a78d9';ctx.lineWidth=3;ctx.beginPath();for(let px=0;px<=800;px++){const x=(px-400)/40,y=225-(a*x*x+b*x+c)*40;if(px===0)ctx.moveTo(px,y);else ctx.lineTo(px,y)}ctx.stroke();if(Math.abs(a)>.0001){const xv=-b/(2*a),yv=a*xv*xv+b*xv+c;dot(400+xv*40,225-yv*40,6,'#8a78d9');$('result').textContent='y = '+a+'x² + ('+b+')x + ('+c+') · Đỉnh ('+xv.toFixed(2)+'; '+yv.toFixed(2)+')'}else $('result').textContent='a = 0: y = '+b+'x + '+c+' — không phải hàm bậc hai.';}
else if(kind==='ph'){const ph=vals[0];for(let i=0;i<14;i++){ctx.fillStyle='hsl('+(i*20)+',70%,60%)';ctx.fillRect(50+i*50,180,50,80);text(String(i),48+i*50,290,'#7b8a82',16)}text('14',745,290,'#7b8a82',16);line(50+ph*50,160,50+ph*50,280,'#223e33',4);text('pH '+ph.toFixed(1),300,115,'#306d53',44);text('AXIT',65,345,'#c36645');text('TRUNG TÍNH',337,345,'#669946');text('BAZƠ',660,345,'#6661a8');$('result').textContent=(ph<7?'Môi trường axit':ph>7?'Môi trường bazơ':'Môi trường trung tính')+' · [H⁺] ≈ '+Math.pow(10,-ph).toExponential(2)+' mol/L';}
else if(kind==='waves'){const [a,f,v]=vals,lambda=v/f;line(0,225,800,225,'#a9bcaf',2);ctx.strokeStyle='#3594c2';ctx.lineWidth=3;ctx.beginPath();for(let px=0;px<=800;px++){const x=px/40,y=225-a*32*Math.sin(2*Math.PI*(x/lambda-f*t));if(px===0)ctx.moveTo(px,y);else ctx.lineTo(px,y)}ctx.stroke();dot(400,225-a*32*Math.sin(2*Math.PI*(10/lambda-f*t)),8,'#f0b83f');text('y (cm)',20,32);text('x (cm) →',680,425);$('result').textContent='λ = v/f = '+lambda.toFixed(2)+' cm · Chu kỳ T = 1/f = '+(1/f).toFixed(2)+' s';}
}
function tick(now){if(running&&!document.hidden){t+=Math.min((now-last)/1000,.05);if(['ohm','waves'].includes(kind))draw()}last=now;raf=requestAnimationFrame(tick)}draw();raf=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
</script></body></html>`;
}

export function simulationHTML(kind:string):string{
if(kind==='water-boiling')return waterBoilingHTML();
if(kind==='iron-sulfur')return ironSulfurHTML();
return genericSimulationHTML(kind);
}
