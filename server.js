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
    rows += `<tr
      data-id="${i}"
      data-patient="Texto texto texto"
      data-rut="12.345.678-9"
      data-diag="${diag}"
      data-status="${st.label}"
      data-priority="${prioSeq[i-1]}"
      data-date="2024-${String((i%12)+1).padStart(2,'0')}-${String((i%28)+1).padStart(2,'0')}">
      <td class="id-cell">${id}</td>
      <td class="patient-cell">Texto texto texto</td>
      <td class="rut-cell">12.345.678-9</td>
      <td class="dx-cell">${diag}</td>
      <td><span class="badge badge-${st.cls}"><span class="badge-dot"></span>${st.label}</span></td>
      <td><span class="priority priority-${pr}"></span></td>
      <td>2024-${String((i%12)+1).padStart(2,'0')}-${String((i%28)+1).padStart(2,'0')}</td>
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
    th { padding: .75rem 1rem; text-align: left; font-size: .72rem; font-weight: 600; color: var(--text-muted); letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; user-select: none; }
    th.sortable { cursor: pointer; }
    th.sortable:hover { color: var(--text); }
    th.sort-asc .sort-icon::after { content: ' ↑'; color: var(--accent); }
    th.sort-desc .sort-icon::after { content: ' ↓'; color: var(--accent); }
    th:not(.sort-asc):not(.sort-desc) .sort-icon::after { content: ' ↕'; opacity: 0.35; }
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

    /* MODAL */
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 200; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
    .modal-overlay.open { display: flex; }
    .modal { background: #fff; border-radius: 14px; width: 760px; max-width: 95vw; max-height: 90vh; overflow-y: auto; color: #1a1a2e; box-shadow: 0 25px 60px rgba(0,0,0,.4); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem .75rem; border-bottom: 1px solid #e5e7eb; }
    .modal-title { font-size: 1rem; font-weight: 600; color: #111827; }
    .modal-close { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 1.1rem; padding: .25rem; border-radius: 4px; }
    .modal-close:hover { background: #f3f4f6; color: #111; }

    /* STEPS */
    .steps { display: flex; align-items: center; padding: .75rem 1.5rem; border-bottom: 1px solid #e5e7eb; gap: 0; }
    .step { flex: 1; display: flex; align-items: center; gap: .5rem; padding: .5rem .75rem; border-radius: 8px; font-size: .82rem; font-weight: 500; color: #9ca3af; cursor: default; }
    .step.active { background: #1a1a2e; color: #fff; }
    .step.done { color: #22c55e; }
    .step .step-num { width: 22px; height: 22px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: .72rem; font-weight: 700; flex-shrink: 0; }
    .step.active .step-num { background: #3b82f6; border-color: #3b82f6; color: #fff; }
    .step.done .step-num { background: #22c55e; border-color: #22c55e; color: #fff; }
    .step-divider { flex: 0; width: 30px; height: 1px; background: #e5e7eb; }

    /* MODAL BODY */
    .modal-body { padding: 1.5rem; min-height: 280px; }
    .modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; }

    /* FORM ELEMENTS */
    .form-label { font-size: .8rem; font-weight: 500; color: #374151; margin-bottom: .35rem; display: block; }
    .form-label .req { color: #ef4444; margin-left: 2px; }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .form-input { width: 100%; padding: .55rem .75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: .875rem; font-family: 'DM Sans', sans-serif; color: #111827; background: #fff; outline: none; transition: border .15s; }
    .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
    .form-input:disabled { background: #f9fafb; color: #6b7280; cursor: not-allowed; }
    .form-input.error { border-color: #ef4444; }
    .form-hint { font-size: .72rem; color: #9ca3af; margin-top: .25rem; }
    .form-error { font-size: .72rem; color: #ef4444; margin-top: .25rem; display: none; }
    .form-error.show { display: block; }
    .input-with-btn { display: flex; gap: .5rem; }
    .input-with-btn .form-input { flex: 1; }
    .select-wrapper { position: relative; }
    .select-wrapper select { width: 100%; padding: .55rem .75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: .875rem; font-family: 'DM Sans', sans-serif; color: #111827; background: #fff; outline: none; appearance: none; cursor: pointer; }
    .select-wrapper select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
    .select-arrow { position: absolute; right: .75rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: #6b7280; font-size: .75rem; }
    textarea.form-input { resize: vertical; min-height: 80px; }

    /* PATIENT RESULT CARD */
    .patient-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; display: flex; gap: 1rem; align-items: flex-start; margin-top: 1rem; }
    .patient-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#3b82f6); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; color: #fff; }
    .patient-info h3 { font-size: .95rem; font-weight: 600; color: #111827; margin-bottom: .2rem; }
    .patient-info p { font-size: .8rem; color: #6b7280; margin-bottom: .15rem; }
    .patient-info p span { color: #374151; font-weight: 500; }
    .patient-meta { display: grid; grid-template-columns: 1fr 1fr; gap: .4rem .75rem; margin-top: .5rem; padding-top: .5rem; border-top: 1px solid #f3f4f6; }
    .patient-meta-item { font-size: .78rem; color: #6b7280; }
    .patient-meta-item span { color: #374151; font-weight: 500; }
    .patient-warning { display: flex; align-items: center; gap: .4rem; font-size: .78rem; color: #d97706; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: .4rem .7rem; margin-top: .6rem; }
    .patient-profile-btn { display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: .78rem; font-weight: 500; color: #374151; background: #fff; cursor: pointer; margin-top: .6rem; transition: all .15s; }
    .patient-profile-btn:hover { background: #f9fafb; border-color: #9ca3af; }

    /* STEP INDICATOR ID */
    .case-id-badge { display: inline-block; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: .3rem .75rem; font-size: .82rem; font-weight: 600; color: #374151; font-family: monospace; }

    /* SUCCESS */
    .success-screen { text-align: center; padding: 2rem 1rem; }
    .success-icon { width: 64px; height: 64px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem; }
    .success-title { font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: .5rem; }
    .success-sub { font-size: .875rem; color: #6b7280; }

    /* MODAL BTNS */
    .btn-modal-cancel { background: none; border: 1px solid #d1d5db; color: #374151; padding: .5rem 1rem; border-radius: 8px; font-size: .85rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
    .btn-modal-cancel:hover { background: #f9fafb; }
    .btn-modal-next { background: #1a1a2e; color: #fff; border: none; padding: .5rem 1.25rem; border-radius: 8px; font-size: .85rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: .4rem; transition: all .15s; }
    .btn-modal-next:hover { background: #2d2d4e; }
    .btn-modal-next:disabled { opacity: .5; cursor: not-allowed; }
    .section-title { font-size: .85rem; font-weight: 600; color: #374151; margin-bottom: 1rem; padding-bottom: .5rem; border-bottom: 1px solid #f3f4f6; }
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
        <button class="btn btn-primary" id="btnNuevoCaso">+ Agregar nuevo caso</button>
        <button class="btn btn-ghost">⊟ Filtros</button>
        <button class="btn btn-ghost">↗ Exportar</button>
      </div>
    </div>
    <div class="table-wrapper">
      <table id="mainTable">
        <thead>
          <tr>
            <th class="sortable" data-col="id">ID CASO<span class="sort-icon"></span></th>
            <th class="sortable" data-col="patient">NOMBRE PACIENTE<span class="sort-icon"></span></th>
            <th class="sortable" data-col="rut">RUT<span class="sort-icon"></span></th>
            <th class="sortable" data-col="diag">DIAGNÓSTICO<span class="sort-icon"></span></th>
            <th class="sortable" data-col="status">ESTADO DEL CASO<span class="sort-icon"></span></th>
            <th class="sortable" data-col="priority">PRIORIDAD<span class="sort-icon"></span></th>
            <th class="sortable" data-col="date">ÚLTIMO EVENTO<span class="sort-icon"></span></th>
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody id="tableBody">${generateRows()}</tbody>
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

<!-- MODAL -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">Agregar nuevo caso</span>
      <button class="modal-close" id="modalClose">✕</button>
    </div>

    <!-- STEPS NAV -->
    <div class="steps">
      <div class="step" id="step-tab-1">
        <div class="step-num" id="step-num-1">1</div>
        <span>Paciente</span>
      </div>
      <div class="step-divider"></div>
      <div class="step" id="step-tab-2">
        <div class="step-num" id="step-num-2">2</div>
        <span>Caso</span>
      </div>
      <div class="step-divider"></div>
      <div class="step" id="step-tab-3">
        <div class="step-num" id="step-num-3">3</div>
        <span>Evento inicial</span>
      </div>
    </div>

    <!-- STEP 1: PACIENTE -->
    <div class="modal-body" id="step1">
      <div class="form-group">
        <label class="form-label">Ingrese Rut/Pasaporte</label>
        <div class="input-with-btn">
          <input type="text" class="form-input" id="inputRut" placeholder="Rut">
          <button class="btn btn-primary" id="btnBuscar">🔍 Buscar</button>
        </div>
        <div class="form-hint">Ingresa el RUT con puntos y guión.</div>
        <div class="form-error" id="rutError">RUT inválido. Usa el formato 12.345.678-9</div>
      </div>
      <div id="patientResult" style="display:none"></div>
    </div>

    <!-- STEP 2: CASO -->
    <div class="modal-body" id="step2" style="display:none">
      <div class="section-title">Datos del caso</div>
      <div class="form-group">
        <label class="form-label">ID de Caso</label>
        <div class="case-id-badge" id="caseIdBadge">ID-000123</div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">Paciente</label>
          <input type="text" class="form-input" id="casePatient" disabled>
        </div>
        <div>
          <label class="form-label">Rut</label>
          <input type="text" class="form-input" id="caseRut" disabled>
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">Diagnóstico (CIE-10) <span class="req">*</span></label>
          <div class="select-wrapper">
            <select id="caseDiag">
              <option value="">Seleccionar diagnóstico</option>
              <option value="C501">C501 - Tumor maligno de la porción central de la mama</option>
              <option value="C44">C44 - Tumor maligno de piel</option>
              <option value="C18">C18 - Tumor maligno del colon</option>
              <option value="C06">C06 - Tumor maligno de otras partes de la boca</option>
              <option value="C34">C34 - Tumor maligno de los bronquios y del pulmón</option>
              <option value="C50">C50 - Tumor maligno de la mama</option>
              <option value="C61">C61 - Tumor maligno de la próstata</option>
              <option value="C16">C16 - Tumor maligno del estómago</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
          <div class="form-error" id="diagError">Selecciona un diagnóstico</div>
        </div>
        <div>
          <label class="form-label">Fecha creación de caso <span class="req">*</span></label>
          <input type="date" class="form-input" id="caseDate">
          <div class="form-error" id="caseDateError">Selecciona una fecha</div>
        </div>
      </div>
    </div>

    <!-- STEP 3: EVENTO INICIAL -->
    <div class="modal-body" id="step3" style="display:none">
      <div class="section-title">Evento inicial</div>
      <div class="form-row">
        <div>
          <label class="form-label">Tipo de evento <span class="req">*</span></label>
          <div class="select-wrapper">
            <select id="eventoTipo">
              <option value="">Seleccionar tipo</option>
              <option value="Sospecha">Sospecha</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Estudio">Estudio</option>
              <option value="Etapificación completa">Etapificación completa</option>
              <option value="Inicio tratamiento">Inicio tratamiento</option>
              <option value="Control (seguimiento)">Control (seguimiento)</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
          <div class="form-error" id="eventoTipoError">Selecciona un tipo de evento</div>
        </div>
        <div>
          <label class="form-label">Fecha del evento <span class="req">*</span></label>
          <input type="date" class="form-input" id="eventoFecha">
          <div class="form-error" id="eventoFechaError">Selecciona una fecha</div>
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="form-label">Prioridad <span class="req">*</span></label>
          <div class="select-wrapper">
            <select id="eventoPrioridad">
              <option value="">Seleccionar prioridad</option>
              <option value="red">Alta</option>
              <option value="yellow">Media</option>
              <option value="green">Baja</option>
              <option value="gray">Sin prioridad</option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
          <div class="form-error" id="eventoPrioridadError">Selecciona una prioridad</div>
        </div>
        <div>
          <label class="form-label">Médico responsable</label>
          <input type="text" class="form-input" id="eventoMedico" placeholder="Nombre del médico">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Observaciones</label>
        <textarea class="form-input" id="eventoObs" placeholder="Ingresa observaciones del evento inicial..."></textarea>
      </div>
    </div>

    <!-- SUCCESS -->
    <div class="modal-body" id="stepSuccess" style="display:none">
      <div class="success-screen">
        <div class="success-icon">✅</div>
        <div class="success-title">Caso registrado exitosamente</div>
        <div class="success-sub" id="successMsg">El caso ha sido agregado al listado.</div>
      </div>
    </div>

    <div class="modal-footer" id="modalFooter">
      <button class="btn-modal-cancel" id="btnCancelar">Cancelar</button>
      <button class="btn-modal-next" id="btnSiguiente">Siguiente →</button>
    </div>
  </div>
</div>

<script>
  // ── SORT ──
  let currentCol = null, currentDir = 'asc';
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (currentCol === col) { currentDir = currentDir === 'asc' ? 'desc' : 'asc'; }
      else { currentCol = col; currentDir = 'asc'; }
      document.querySelectorAll('th.sortable').forEach(h => h.classList.remove('sort-asc','sort-desc'));
      th.classList.add(currentDir === 'asc' ? 'sort-asc' : 'sort-desc');
      sortTable(col, currentDir);
    });
  });
  function sortTable(col, dir) {
    const tbody = document.getElementById('tableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      let valA = a.dataset[col] || '', valB = b.dataset[col] || '';
      if (col === 'id' || col === 'priority') {
        valA = parseFloat(valA)||0; valB = parseFloat(valB)||0;
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      if (col === 'date') {
        valA = new Date(valA).getTime()||0; valB = new Date(valB).getTime()||0;
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      return dir === 'asc' ? valA.localeCompare(valB,'es') : valB.localeCompare(valA,'es');
    });
    rows.forEach(r => tbody.appendChild(r));
  }

  // ── MODAL ──
  let currentStep = 1;
  let foundPatient = null;

  const overlay = document.getElementById('modalOverlay');
  const btnNuevo = document.getElementById('btnNuevoCaso');
  const btnClose = document.getElementById('modalClose');
  const btnCancelar = document.getElementById('btnCancelar');
  const btnSiguiente = document.getElementById('btnSiguiente');

  function openModal() {
    currentStep = 1;
    foundPatient = null;
    document.getElementById('inputRut').value = '';
    document.getElementById('patientResult').style.display = 'none';
    document.getElementById('rutError').classList.remove('show');
    resetStep2();
    resetStep3();
    showStep(1);
    overlay.classList.add('open');
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  function showStep(n) {
    currentStep = n;
    [1,2,3].forEach(i => {
      document.getElementById('step' + i).style.display = i === n ? '' : 'none';
    });
    document.getElementById('stepSuccess').style.display = 'none';

    // Update tabs
    [1,2,3].forEach(i => {
      const tab = document.getElementById('step-tab-' + i);
      const num = document.getElementById('step-num-' + i);
      tab.classList.remove('active','done');
      if (i === n) { tab.classList.add('active'); }
      else if (i < n) {
        tab.classList.add('done');
        num.textContent = '✓';
      } else {
        num.textContent = i;
      }
    });

    // Footer
    const footer = document.getElementById('modalFooter');
    footer.style.display = '';
    if (n === 1) {
      btnCancelar.textContent = 'Cancelar';
      btnSiguiente.textContent = 'Siguiente →';
    } else if (n === 2) {
      btnCancelar.textContent = '← Anterior';
      btnSiguiente.textContent = 'Siguiente →';
    } else if (n === 3) {
      btnCancelar.textContent = '← Anterior';
      btnSiguiente.textContent = 'Guardar caso ✓';
    }
  }

  function showSuccess() {
    [1,2,3].forEach(i => document.getElementById('step' + i).style.display = 'none');
    document.getElementById('stepSuccess').style.display = '';
    document.getElementById('modalFooter').style.display = 'none';
    [1,2,3].forEach(i => {
      document.getElementById('step-tab-' + i).classList.remove('active');
      document.getElementById('step-tab-' + i).classList.add('done');
      document.getElementById('step-num-' + i).textContent = '✓';
    });
    if (foundPatient) {
      document.getElementById('successMsg').textContent =
        'El caso de ' + foundPatient.name + ' fue agregado correctamente al listado.';
    }
    setTimeout(() => closeModal(), 2500);
  }

  // Mock patient DB
  const patients = {
    '12.123.456-7': { name: 'Nombre Nombre Apellido Apellido', rut: '12.123.456-7', age: 30, gender: 'Masculino', lastEvent: '12 de marzo 2023', phone: '+56 9 123 5678', cases: 2 },
    '11.111.111-1': { name: 'María González López', rut: '11.111.111-1', age: 45, gender: 'Femenino', lastEvent: '5 de enero 2024', phone: '+56 9 876 5432', cases: 1 },
    '9.999.999-9':  { name: 'Carlos Rodríguez Muñoz', rut: '9.999.999-9', age: 62, gender: 'Masculino', lastEvent: '20 de febrero 2024', phone: '+56 9 111 2233', cases: 0 },
  };

  document.getElementById('btnBuscar').addEventListener('click', buscarPaciente);
  document.getElementById('inputRut').addEventListener('keydown', e => { if (e.key === 'Enter') buscarPaciente(); });

  function buscarPaciente() {
    const rut = document.getElementById('inputRut').value.trim();
    const errEl = document.getElementById('rutError');
    if (!rut) { errEl.classList.add('show'); errEl.textContent = 'Ingresa un RUT'; return; }
    errEl.classList.remove('show');
    const p = patients[rut];
    const resultEl = document.getElementById('patientResult');
    if (p) {
      foundPatient = p;
      resultEl.style.display = '';
      resultEl.innerHTML = \`
        <div style="font-size:.82rem;font-weight:600;color:#374151;margin-bottom:.5rem;">Resultado de la búsqueda:</div>
        <div class="patient-card">
          <div class="patient-avatar">👤</div>
          <div style="flex:1">
            <div class="patient-info">
              <h3>\${p.name}</h3>
              <p>RUT: <span>\${p.rut}</span></p>
              <p>Edad: <span>\${p.age} años</span></p>
              <p>Genero: <span>\${p.gender}</span></p>
            </div>
            <div class="patient-meta">
              <div class="patient-meta-item">Último evento registrado: <span>\${p.lastEvent}</span></div>
              <div class="patient-meta-item">Teléfono de contacto: <span>\${p.phone}</span></div>
            </div>
            \${p.cases > 0 ? \`<div class="patient-warning">⚠ El paciente cuenta con (\${p.cases}) Casos activos.</div>\` : ''}
            <button class="patient-profile-btn">Entrar al perfil 👤</button>
          </div>
        </div>\`;
    } else {
      foundPatient = null;
      resultEl.style.display = '';
      resultEl.innerHTML = \`<div style="color:#ef4444;font-size:.85rem;padding:.75rem;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">No se encontró ningún paciente con RUT <strong>\${rut}</strong>. Verifica el formato e intenta nuevamente.</div>\`;
    }
  }

  function resetStep2() {
    document.getElementById('casePatient').value = '';
    document.getElementById('caseRut').value = '';
    document.getElementById('caseDiag').value = '';
    document.getElementById('caseDate').value = '';
    document.getElementById('diagError').classList.remove('show');
    document.getElementById('caseDateError').classList.remove('show');
    // Generate random case ID
    const id = 'ID-' + String(Math.floor(Math.random()*9000)+1000);
    document.getElementById('caseIdBadge').textContent = id;
  }

  function resetStep3() {
    document.getElementById('eventoTipo').value = '';
    document.getElementById('eventoFecha').value = '';
    document.getElementById('eventoPrioridad').value = '';
    document.getElementById('eventoMedico').value = '';
    document.getElementById('eventoObs').value = '';
    ['eventoTipoError','eventoFechaError','eventoPrioridadError'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });
  }

  function validateStep2() {
    let ok = true;
    if (!document.getElementById('caseDiag').value) {
      document.getElementById('diagError').classList.add('show'); ok = false;
    } else { document.getElementById('diagError').classList.remove('show'); }
    if (!document.getElementById('caseDate').value) {
      document.getElementById('caseDateError').classList.add('show'); ok = false;
    } else { document.getElementById('caseDateError').classList.remove('show'); }
    return ok;
  }

  function validateStep3() {
    let ok = true;
    if (!document.getElementById('eventoTipo').value) {
      document.getElementById('eventoTipoError').classList.add('show'); ok = false;
    } else { document.getElementById('eventoTipoError').classList.remove('show'); }
    if (!document.getElementById('eventoFecha').value) {
      document.getElementById('eventoFechaError').classList.add('show'); ok = false;
    } else { document.getElementById('eventoFechaError').classList.remove('show'); }
    if (!document.getElementById('eventoPrioridad').value) {
      document.getElementById('eventoPrioridadError').classList.add('show'); ok = false;
    } else { document.getElementById('eventoPrioridadError').classList.remove('show'); }
    return ok;
  }

  btnSiguiente.addEventListener('click', () => {
    if (currentStep === 1) {
      if (!foundPatient) {
        const errEl = document.getElementById('rutError');
        errEl.classList.add('show');
        errEl.textContent = 'Primero busca y selecciona un paciente';
        return;
      }
      resetStep2();
      document.getElementById('casePatient').value = foundPatient.name;
      document.getElementById('caseRut').value = foundPatient.rut;
      showStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      showStep(3);
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
      showSuccess();
    }
  });

  btnCancelar.addEventListener('click', () => {
    if (currentStep === 1) { closeModal(); }
    else if (currentStep === 2) { showStep(1); }
    else if (currentStep === 3) { showStep(2); }
  });

  btnNuevo.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
</script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});