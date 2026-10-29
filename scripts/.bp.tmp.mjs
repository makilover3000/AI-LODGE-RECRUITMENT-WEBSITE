import { spawn } from "node:child_process";
const edge = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", ["--headless=new","--disable-gpu","--remote-debugging-port=9337","--user-data-dir="+process.env.TEMP+"/cdp-prof5","about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 40 && !t; i++) { await sleep(250); try { t = (await (await fetch("http://127.0.0.1:9337/json")).json()).find((x) => x.type === "page"); } catch {} }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = {}; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && P[m.id]) { P[m.id](m.result); delete P[m.id]; } };
const send = (m, p = {}) => new Promise((r) => { P[++id] = r; ws.send(JSON.stringify({ id, method: m, params: p })); });
const slugs = process.argv.slice(2);
const rows = [];
for (const s of slugs) {
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `http://localhost:3100/${s}` }); await sleep(2200);
  const v = (await send("Runtime.evaluate", { expression: `[...document.querySelectorAll('.ail-ticker-track,.ail-belt-track')].map(t=>({cls:t.className.split(' ')[0],half:Math.round(t.scrollWidth/2),dur:getComputedStyle(t).animationDuration}))`, returnByValue: true })).result.value;
  rows.push([s, JSON.stringify(v)]);
}
for (const r of rows) console.log(r[0].padEnd(24), r[1]);
ws.close(); edge.kill(); process.exit(0);
