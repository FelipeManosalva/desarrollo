const express = require('express');
const app = express();
const PORT = 3000;
 
function generateRows() {
  const statuses = [
    { label: 'Estudio', cls: 'estudio' },
    { label: 'Confirmado', cls: 'confirmado' },
    { label: 'Control (seguimiento)', cls: 'control' },
    { label: 'Sospecha recaída', cls: 'sospecha-recaida' },
    { label: 'Etapificación completa', cls: 'etapificacion' },
    { label: 'Sospecha', cls: 'sospecha' },
    { label: 'Descartado/cierre', cls: 'descartado' },
    { label: 'Inicio tratamiento', cls: 'inicio' },
  ];
  const priorities = ['red','red','red','red','yellow','yellow','yellow','green','green','green','gray','gray','gray','gray','black'];
  const diags = ['C50','C44','C18','C06','C34'];
  const statusSeq = [0,1,2,3,4,5,5,7,5,3,6,7,5,5,5,5,5,5,5,5];
  const prioSeq   = [0,0,0,0,0,0,0,0,4,4,4,4,7,7,7,7,7,7,7,13];
  let rows = '';
  for (let i = 1; i <= 20; i++) {
    const id = 'ID-' + String(i).padStart(i < 10 ? 4 : 5, '0');
    const diag = diags[i % diags.length];
    const st = statuses[statusSeq[i-1]];
    const pr = priorities[prioSeq[i-1]];
    rows += `<tr>
      <td class="id-cell">${id}</td>
      <td class="patient-cell">Texto texto texto</td>
      <td class="rut-cell">12.345.678-9</td>
      <td class="dx-cell">${diag}</td>
      <td><span class="badge badge-${st.cls}"><span class="badge-dot"></span>${st.label}</span></td>
      <td><span class="priority priority-${pr}"></span></td>
      <td>DD-MM-AAAA</td>
      <td><button class="action-btn">&#x229E;</button></td>
    </tr>`;
  }
  return rows;
}
 
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trazabilidad Oncológica</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1117; --surface: #181c27; --surface2: #1e2333; --border: #2a2f42;
      --text: #e8eaf0; --text-muted: #6b7280; --text-dim: #9ca3af;
      --accent: #3b82f6; --accent2: #6366f1;
    }
    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; }
    header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
    .logo { display: flex; align-items: center; gap: .75rem; }
    .logo-icon { width: 38px; height: 38px; background: linear-gradient(135deg,#14b8a6,#3b82f6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .logo-text .clinic { font-size: .65rem; color: var(--text-muted); letter-spacing: .05em; text-transform: uppercase; }
    .logo-text .name { font-size: .9rem; font-weight: 600; }
    .header-title { font-family: 'DM Serif Display', serif; font-size: 1.25rem; }
    .user-info { display: flex; align-items: center; gap: .6rem; cursor: pointer; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#3b82f6); display: flex; align-items: center; justify-content: center; font-size: .8rem; font-weight: 600; }
    .user-name { font-size: .875rem; font-weight: 500; }
    .layout { display: flex; flex: 1; }
    aside { width: 200px; background: var(--surface); border-right: 1px solid var(--border); padding: 1.5rem 0; }
    .nav-item { display: flex; align-items: center; gap: .75rem; padding: .6rem 1.25rem; font-size: .875rem; color: var(--text-muted); cursor: pointer; border-left: 3px solid transparent; transition: all .15s; }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: var(--surface2); color: var(--accent); border-left-color: var(--accent); }
    main { flex: 1; padding: 1.75rem 2rem; overflow-x: auto; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .page-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; }
    .actions { display: flex; gap: .75rem; }
    .btn { display: flex; align-items: center; gap: .4rem; padding: .45rem .9rem; border-radius: 8px; font-size: .8rem; font-weight: 500; cursor: pointer; border: none; transition: all .15s; font-family: 'DM Sans', sans-serif; }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--surface2); color: var(--text); }
    .table-wrapper { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: .825rem; }
    thead { background: var(--surface2); border-bottom: 1px solid var(--border); }
    th { padding: .75rem 1rem; text-align: left; font-size: .72rem; font-weight: 600; color: var(--text-muted); letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
    td { padding: .7rem 1rem; border-bottom: 1px solid var(--border); color: var(--text-dim); white-space: nowrap; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255,255,255,.02); }
    .id-cell { font-weight: 600; color: var(--text); font-size: .78rem; }
    .patient-cell { color: var(--text); }
    .rut-cell { font-family: monospace; font-size: .78rem; }
    .dx-cell { font-weight: 600; color: var(--accent2); }
    .badge { display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .6rem; border-radius: 20px; font-size: .72rem; font-weight: 500; white-space: nowrap; }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .badge-estudio { background: rgba(99,102,241,.15); color: #a5b4fc; } .badge-estudio .badge-dot { background: #6366f1; }
    .badge-confirmado { background: rgba(34,197,94,.15); color: #86efac; } .badge-confirmado .badge-dot { background: #22c55e; }
    .badge-control { background: rgba(20,184,166,.15); color: #5eead4; } .badge-control .badge-dot { background: #14b8a6; }
    .badge-sospecha-recaida { background: rgba(239,68,68,.12); color: #fca5a5; } .badge-sospecha-recaida .badge-dot { background: #ef4444; }
    .badge-etapificacion { background: rgba(59,130,246,.15); color: #93c5fd; } .badge-etapificacion .badge-dot { background: #3b82f6; }
    .badge-sospecha { background: rgba(107,114,128,.15); color: #9ca3af; } .badge-sospecha .badge-dot { background: #6b7280; }
    .badge-descartado { background: rgba(107,114,128,.1); color: #6b7280; } .badge-descartado .badge-dot { background: #4b5563; }
    .badge-inicio { background: rgba(34,197,94,.2); color: #4ade80; border: 1px solid rgba(34,197,94,.3); } .badge-inicio .badge-dot { background: #22c55e; }
    .priority { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .priority-red    { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,.5); }
    .priority-yellow { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,.5); }
    .priority-green  { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,.5); }
    .priority-gray   { background: #6b7280; }
    .priority-black  { background: #1f2937; border: 1px solid #374151; }
    .action-btn { background: none; border: 1px solid var(--border); color: var(--text-muted); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .85rem; transition: all .15s; }
    .action-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--accent); }
    .pagination { display: flex; align-items: center; justify-content: flex-end; gap: .35rem; padding: .75rem 1rem; border-top: 1px solid var(--border); }
    .page-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: none; color: var(--text-muted); font-size: .78rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; transition: all .15s; }
    .page-btn:hover { background: var(--surface2); color: var(--text); }
    .page-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .page-btn.dots { border: none; cursor: default; }
    .page-nav { font-size: .78rem; color: var(--text-muted); padding: 0 .25rem; cursor: pointer; }
    .page-nav:hover { color: var(--text); }
  </style>
</head>
<body>
<header>
  <div class="logo">
    <div class="logo-icon">🩺</div>
    <div class="logo-text">
      <div class="clinic">Clínica Alemana</div>
      <div class="name">Osorno</div>
    </div>
  </div>
  <div class="header-title">Trazabilidad Oncológica</div>
  <div class="user-info">
    <div class="avatar">NA</div>
    <span class="user-name">Nombre Apellido</span>
  </div>
</header>
<div class="layout">
  <aside>
    <div class="nav-item active">🏠 &nbsp;Inicio</div>
    <div class="nav-item">🔍 &nbsp;Búsqueda de paciente</div>
    <div class="nav-item">☰ &nbsp;Nombre sección</div>
    <div class="nav-item">⊞ &nbsp;Nombre sección</div>
    <div class="nav-item">⚙ &nbsp;Configuración</div>
  </aside>
  <main>
    <div class="page-header">
      <h1 class="page-title">Listado casos Oncológicos</h1>
      <div class="actions">
        <button class="btn btn-primary">+ Agregar nuevo caso</button>
        <button class="btn btn-ghost">⊟ Filtros</button>
        <button class="btn btn-ghost">↗ Exportar</button>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID CASO</th>
            <th>NOMBRE PACIENTE ↕</th>
            <th>RUT ↕</th>
            <th>DIAGNÓSTICO ▽</th>
            <th>ESTADO DEL CASO ▽</th>
            <th>PRIORIDAD ▽</th>
            <th>ÚLTIMO EVENTO ↕</th>
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>${generateRows()}</tbody>
      </table>
      <div class="pagination">
        <span class="page-nav">← Anterior</span>
        <button class="page-btn">1</button>
        <button class="page-btn active">2</button>
        <button class="page-btn dots">…</button>
        <button class="page-btn">12</button>
        <button class="page-btn">13</button>
        <span class="page-nav">Siguiente →</span>
      </div>
    </div>
  </main>
</div>
</body>
</html>`);
});
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
