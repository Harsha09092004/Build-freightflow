// ============================================================
// FreightFlow — GST Compliance Module
// ============================================================

Pages.gst = function(container) {
  const gst = FF_DATA.gstData;
  let activeTab = 'reconcile';

  function render() {
    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>GST Compliance</h2>
        <p>GSTR-2B Reconciliation & Input Tax Credit tracking</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline" onclick="showToast('Syncing with GSTN portal...','info')">
          🔄 Sync GSTN Portal
        </button>
        <button class="btn btn-primary" onclick="exportGSTReport()">
          📥 Download Report
        </button>
      </div>
    </div>

    <!-- GST HEALTH + ITC SUMMARY -->
    <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;margin-bottom:28px">
      <!-- Score -->
      <div class="card" style="min-width:220px">
        <div class="gst-health-meter">
          <canvas id="gstGauge" style="width:200px;height:120px"></canvas>
          <div style="text-align:center;margin-top:16px">
            <div style="font-size:18px;font-weight:700;color:${gst.score>=80?'var(--success)':gst.score>=60?'var(--warning)':'var(--danger)'}">
              ${gst.score >= 80 ? '✅ Excellent' : gst.score >= 60 ? '⚠️ Moderate' : '❌ Needs Attention'}
            </div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:4px">GST Compliance Health</div>
          </div>
          <div style="width:100%;margin-top:16px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
              <span style="color:var(--text-muted)">Reconciled this month</span>
              <span style="font-weight:700">${gst.items.filter(i=>i.status==='matched').length}/${gst.items.length}</span>
            </div>
            ${Components.progressBar(Math.round(gst.items.filter(i=>i.status==='matched').length/gst.items.length*100), 'green')}
          </div>
        </div>
      </div>

      <!-- ITC Summary -->
      <div>
        <div class="gst-status-row" style="margin-bottom:20px">
          ${[
            { label:'Eligible ITC', amount: formatCurrency(gst.summary.eligible), desc:'Claimable in GSTR-3B', bg:'#f0fdf4', border:'#86efac', c:'#166534', icon:'✅' },
            { label:'Blocked ITC', amount: formatCurrency(gst.summary.blocked), desc:'Ineligible under Rule 38/42', bg:'#fef2f2', border:'#fca5a5', c:'#991b1b', icon:'🚫' },
            { label:'Pending ITC', amount: formatCurrency(gst.summary.pending), desc:'Awaiting supplier filing', bg:'#fffbeb', border:'#fde68a', c:'#92400e', icon:'⏳' }
          ].map(s => `
            <div class="gst-status-card" style="background:${s.bg};border:1.5px solid ${s.border}">
              <div style="font-size:24px;margin-bottom:8px">${s.icon}</div>
              <div class="status-label" style="color:${s.c}">${s.label}</div>
              <div class="status-amount" style="color:${s.c}">${s.amount}</div>
              <div style="font-size:11px;color:${s.c};opacity:0.7;margin-top:4px">${s.desc}</div>
            </div>
          `).join('')}
        </div>

        <!-- HSN Summary -->
        <div class="card card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div style="font-size:14px;font-weight:700">HSN Code Summary</div>
            <button class="btn btn-ghost btn-sm" onclick="showToast('HSN report exported','success')">Export</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
            ${[
              { hsn:'9965', desc:'Transport of goods by road', gst:'18%', txbl: formatCurrency(8240000), itc: formatCurrency(1483200) },
              { hsn:'9967', desc:'Supporting services in transport', gst:'18%', txbl: formatCurrency(4850000), itc: formatCurrency(873000) },
              { hsn:'9968', desc:'Postal and courier services', gst:'18%', txbl: formatCurrency(1200000), itc: formatCurrency(216000) }
            ].map(h => `
              <div style="padding:14px;background:var(--bg);border-radius:10px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <span style="font-family:monospace;font-size:14px;font-weight:700;color:var(--primary)">${h.hsn}</span>
                  <span class="badge badge-info">${h.gst}</span>
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${h.desc}</div>
                <div style="font-size:12px;color:var(--text-muted)">Taxable: <strong style="color:var(--text)">${h.txbl}</strong></div>
                <div style="font-size:12px;color:var(--success)">ITC: <strong>${h.itc}</strong></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- TAB NAVIGATION -->
    <div class="tab-nav" id="gstTabs">
      <button class="tab-btn ${activeTab==='reconcile'?'active':''}" onclick="switchGstTab('reconcile')">GSTR-2B Reconciliation</button>
      <button class="tab-btn ${activeTab==='itc'?'active':''}" onclick="switchGstTab('itc')">ITC Ledger</button>
      <button class="tab-btn ${activeTab==='filing'?'active':''}" onclick="switchGstTab('filing')">Filing Calendar</button>
    </div>

    <!-- TAB CONTENT -->
    <div id="gstTabContent">
      ${renderGSTTab(activeTab)}
    </div>
    `;

    window.switchGstTab = (tab) => {
      activeTab = tab;
      render();
    };

    setTimeout(() => {
      FFCharts.renderGauge('gstGauge', gst.score, { label: 'GST Score' });
    }, 100);
  }

  function renderGSTTab(tab) {
    if (tab === 'reconcile') return renderReconcileTab();
    if (tab === 'itc') return renderITCTab();
    if (tab === 'filing') return renderFilingCalendar();
    return '';
  }

  function renderReconcileTab() {
    const matched = gst.items.filter(i => i.status === 'matched').length;
    const mismatched = gst.items.filter(i => i.status === 'mismatched').length;
    const missing = gst.items.filter(i => i.status === 'missing').length;
    const pending = gst.items.filter(i => i.status === 'pending').length;
    return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid var(--border)">
        <div style="display:flex;gap:12px">
          ${[
            { label:'Matched', count:matched, cls:'badge-success' },
            { label:'Mismatched', count:mismatched, cls:'badge-danger' },
            { label:'Missing', count:missing, cls:'badge-warning' },
            { label:'Pending', count:pending, cls:'badge-gray' }
          ].map(b => `<span class="badge ${b.cls}">${b.label}: ${b.count}</span>`).join('')}
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="showToast('Running auto-reconciliation...','info')">🤖 Auto-Reconcile</button>
          <button class="btn btn-success btn-sm" onclick="showToast('Reconciliation report exported','success')">📥 Export GSTR-2B</button>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Supplier GSTIN</th>
              <th>Supplier Name</th>
              <th>Invoice Amount</th>
              <th>ITC Amount</th>
              <th>HSN Code</th>
              <th>GSTR-2B Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${gst.items.map(item => `
              <tr>
                <td style="font-family:monospace;font-size:12px">${item.gstin}</td>
                <td style="font-weight:500">${item.vendor}</td>
                <td style="font-weight:600">${formatCurrencyFull(item.invoiceAmt)}</td>
                <td style="color:var(--success);font-weight:700">${formatCurrencyFull(item.itc)}</td>
                <td><span style="font-family:monospace;font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${item.hsn}</span></td>
                <td>${getReconcileBadge(item.status)}</td>
                <td>
                  ${item.status !== 'matched' ? `
                    <button class="btn btn-sm btn-primary" onclick="showToast('Reconciling ${item.vendor}...','info')">
                      ${item.status === 'mismatched' ? '🔧 Fix' : item.status === 'missing' ? '📤 Request' : '🔄 Process'}
                    </button>
                  ` : '<span style="color:var(--success);font-size:13px;font-weight:600">✓ Done</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mismatch Alert -->
      ${gst.items.filter(i => i.status === 'mismatched' || i.status === 'missing').length > 0 ? `
        <div style="padding:16px 24px;background:#fffbeb;border-top:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#92400e">Action Required: ${mismatched + missing} items need attention</div>
              <div style="font-size:12px;color:#78350f;margin-top:2px">Resolve mismatches before GSTR-3B filing deadline to claim full ITC of ${formatCurrency((mismatched + missing) * 25000)}</div>
            </div>
            <button class="btn btn-sm" style="background:#d97706;color:#fff;margin-left:auto" onclick="showToast('Bulk reconciliation started','info')">Fix All →</button>
          </div>
        </div>
      ` : ''}
    </div>
    `;
  }

  function renderITCTab() {
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);font-weight:700;font-size:15px">Input Tax Credit Ledger — March 2024</div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Month</th><th>Opening Balance</th><th>ITC Claimed</th><th>ITC Reversed</th><th>Closing Balance</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${[
              { month:'October 2023', open:1840000, claimed:1483200, reversed:120000, status:'filed' },
              { month:'November 2023', open:3203200, claimed:1620000, reversed:85000, status:'filed' },
              { month:'December 2023', open:4738200, claimed:2241000, reversed:210000, status:'filed' },
              { month:'January 2024', open:6769200, claimed:1960000, reversed:160000, status:'filed' },
              { month:'February 2024', open:8569200, claimed:1836000, reversed:95000, status:'filed' },
              { month:'March 2024', open:10310200, claimed:1840000, reversed:0, status:'pending' }
            ].map(r => {
              const close = r.open + r.claimed - r.reversed;
              return `<tr>
                <td style="font-weight:500">${r.month}</td>
                <td>${formatCurrencyFull(r.open)}</td>
                <td style="color:var(--success);font-weight:600">+ ${formatCurrencyFull(r.claimed)}</td>
                <td style="color:var(--danger);font-weight:600">${r.reversed > 0 ? '- ' + formatCurrencyFull(r.reversed) : '—'}</td>
                <td style="font-weight:700;color:var(--primary)">${formatCurrencyFull(close)}</td>
                <td>${r.status === 'filed' ? '<span class="badge badge-success">✓ Filed</span>' : '<span class="badge badge-warning">⏳ Pending</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f8fafc;font-weight:700">
              <td colspan="4" style="padding:14px 16px">Total ITC Available (Cumulative)</td>
              <td style="padding:14px 16px;color:var(--success);font-size:16px;font-weight:800">${formatCurrency(12150200)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>`;
  }

  function renderFilingCalendar() {
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <div class="card card-body">
        <div style="font-size:15px;font-weight:700;margin-bottom:20px">📅 GST Filing Calendar — 2024</div>
        ${[
          { form:'GSTR-1', period:'March 2024', due:'April 11, 2024', status:'pending', desc:'Outward supplies' },
          { form:'GSTR-3B', period:'March 2024', due:'April 20, 2024', status:'pending', desc:'Monthly summary return' },
          { form:'GSTR-2B', period:'March 2024', due:'April 14, 2024', status:'available', desc:'Auto-populated ITC statement' },
          { form:'GSTR-1', period:'February 2024', due:'March 11, 2024', status:'filed', desc:'Outward supplies' },
          { form:'GSTR-3B', period:'February 2024', due:'March 20, 2024', status:'filed', desc:'Monthly summary return' },
          { form:'GSTR-9', period:'FY 2022-23', due:'December 31, 2023', status:'filed', desc:'Annual return' }
        ].map(f => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f1f5f9">
            <div style="width:48px;height:48px;border-radius:10px;background:${f.status==='filed'?'#f0fdf4':f.status==='available'?'#eff6ff':'#fffbeb'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${f.status==='filed'?'#166534':f.status==='available'?'#1e40af':'#92400e'};flex-shrink:0">${f.form}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700">${f.form} — ${f.period}</div>
              <div style="font-size:12px;color:var(--text-muted)">Due: ${f.due} • ${f.desc}</div>
            </div>
            ${f.status==='filed'?'<span class="badge badge-success">✓ Filed</span>':f.status==='available'?`<button class="btn btn-primary btn-sm" onclick="showToast('Opening GSTN portal...','info')">File Now</button>`:`<span class="badge badge-warning">⏳ Upcoming</span>`}
          </div>
        `).join('')}
      </div>

      <div class="card card-body">
        <div style="font-size:15px;font-weight:700;margin-bottom:20px">🚨 Compliance Alerts</div>
        ${[
          { icon:'🔴', title:'GSTR-3B due in 8 days', desc:'March 2024 return. Estimated tax payable: ₹2.84L after ITC', type:'danger' },
          { icon:'🟡', title:'GSTR-1 due in 5 days', desc:'11 invoices pending upload for March 2024', type:'warning' },
          { icon:'🔵', title:'GSTR-2B available', desc:'Auto-populated ITC statement for March 2024 is ready', type:'info' },
          { icon:'🟢', title:'Annual ITC reconciliation', desc:'FY 2023-24 reconciliation can be done by October 2024', type:'success' }
        ].map(a => `
          <div style="display:flex;gap:12px;padding:14px;border-radius:10px;background:${a.type==='danger'?'#fef2f2':a.type==='warning'?'#fffbeb':a.type==='info'?'#eff6ff':'#f0fdf4'};margin-bottom:10px">
            <span style="font-size:20px">${a.icon}</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:${a.type==='danger'?'#991b1b':a.type==='warning'?'#92400e':a.type==='info'?'#1e40af':'#166534'}">${a.title}</div>
              <div style="font-size:12px;color:${a.type==='danger'?'#7f1d1d':a.type==='warning'?'#78350f':a.type==='info'?'#1e3a8a':'#14532d'};margin-top:3px">${a.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  render();
};

function exportGSTReport() {
  const rows = ['Supplier GSTIN,Supplier Name,Invoice Amount,ITC Amount,HSN,Status'];
  FF_DATA.gstData.items.forEach(i => rows.push(`${i.gstin},${i.vendor},${i.invoiceAmt},${i.itc},${i.hsn},${i.status}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gstr2b_reconciliation.csv';
  a.click();
  showToast('GSTR-2B reconciliation report downloaded 📊');
}
