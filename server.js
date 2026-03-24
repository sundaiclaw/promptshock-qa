import express from 'express';
const app = express();
app.use(express.json({limit:'1mb'}));
const PORT = process.env.PORT || 8080;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';

app.get('/healthz', (_,res)=>res.json({ok:true,model:OPENROUTER_MODEL}));
app.get('/', (_,res)=>res.type('html').send(`<!doctype html><html><head><meta charset='utf-8'><title>PromptShock QA</title><style>body{font-family:system-ui;max-width:860px;margin:40px auto;padding:0 16px}.card{border:1px solid #ddd;border-radius:12px;padding:14px}textarea{width:100%;min-height:180px}button{padding:10px 14px;border-radius:10px;border:1px solid #999;cursor:pointer}pre{white-space:pre-wrap;background:#0f172a;color:#e2e8f0;padding:12px;border-radius:10px}</style></head><body><h1>PromptShock QA</h1><p>Paste your launch claim / product pitch. Get red-team questions + fixes powered by AI.</p><div class='card'><textarea id='input' placeholder='Paste your launch copy...'></textarea><br/><button onclick='run()'>Stress test</button><p id='s'></p><pre id='o'></pre></div><script>
async function run(){const v=document.getElementById('input').value.trim();if(!v)return;document.getElementById('s').textContent='Analyzing...';document.getElementById('o').textContent='';const r=await fetch('/api/stress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:v})});const j=await r.json();document.getElementById('s').textContent='Done';document.getElementById('o').textContent=j.output||j.error||'No output';}
</script></body></html>`));

app.post('/api/stress', async (req,res)=>{
  try{
    const text=(req.body?.text||'').slice(0,8000);
    if(!text) return res.status(400).json({error:'text required'});
    const prompt = `You are a brutally honest launch reviewer. Analyze this pitch and return markdown with sections:\n1) Top 5 attack questions investors/users will ask\n2) Hidden assumptions\n3) Risky claims to rewrite\n4) Better tighter version (max 120 words)\n\nPitch:\n${text}`;
    const r = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.OPENROUTER_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({model: OPENROUTER_MODEL,messages:[{role:'user',content:prompt}],temperature:0.7})
    });
    const data = await r.json();
    const output = data?.choices?.[0]?.message?.content || JSON.stringify(data).slice(0,2000);
    res.json({output, model: OPENROUTER_MODEL});
  } catch(e){res.status(500).json({error:String(e)})}
});

app.listen(PORT, ()=>console.log('listening',PORT));
