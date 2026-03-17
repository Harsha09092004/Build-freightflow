// ============================================================
// FreightFlow — Vendor Performance Scoring
// ============================================================

Pages.vendors = function(container) {
  let sortCol = 'score';
  let sortDir = 'desc';
  let filterRating = 'all';

  function getFiltered() {
    return FF_DATA.vendors
      .filter(v => filterRating === 'all' || v.rating === filterRating)
      .sort((a, b) => {
        let av = a[sortCol], bv = b[sortCol];
        return sortDir === 'desc' ? bv - av : av - bv;
      });
  }

  function render() {
    const vendors = getFiltered();
    const avgScore = Math.round(FF_DATA.vendors.reduce((s, v) => s + v.score, 0) / FF_DATA.vendors.length);
    const topVendor = FF_DATA.vendors.reduce((a, b) => a.score > b.score ? a : b);
    const riskVendors = FF_DATA.vendors.filter(v => v.score < 75).length;

    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Vendor Performance Scoring</h2>
        <p>${FF_DATA.vendors.length} active vendors • Average score: ${avgScore}</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline" onclick="showToast('Vendor performance report generated','success')">📊 Full Report</button>
        <button class="btn btn-primary" onclick="exportVendorReport()">📥 Export Scorecard</button>
      </div>
    </div>

    <!-- SUMMARY CARDS -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px">
      ${[
        { icon:'⭐', label:'Average Vendor Score', val: avgScore, sub:'Overall performance', bg:'#eff6ff', c:'var(--primary)' },
        { icon:'🏆', label:'Top Performer', val: topVendor.name.split(' ')[0], sub:`Score: ${topVendor.score} (${topVendor.rating})`, bg:'#f0fdf4', c:'var(--success)' },
        { icon:'⚠️', label:'At-Risk Vendors', val: riskVendors, sub:'Score below 75', bg:'#fef2f2', c:'var(--danger)' },
        { icon:'🤝', label:'Total Paid to Vendors', val: formatCurrency(FF_DATA.vendors.reduce((s,v)=>s+v.totalPaid,0)), sub:'This financial year', bg:'#fff7ed', c:'var(--accent)' }
      ].map(k => `
        <div class="card" style="padding:20px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:10px;background:${k.bg};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${k.icon}</div>
            <div>
              <div style="font-size:22px;font-weight:800;color:${k.c}">${k.val}</div>
              <div style="font-size:12px;color:var(--text-muted)">${k.label}</div>
              <div style="font-size:11px;color:var(--text-light);margin-top:2px">${k.sub}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- TOP VENDORS CHART -->
    <div class="grid-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Top 5 Vendors by Score</div>
          <div class="card-subtitle">Performance comparison</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="vendorScoreChart" style="width:100%;height:240px;display:block"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Vendor Spend Distribution</div>
          <div class="card-subtitle">Share of total freight cost</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="vendorSpendChart" style="width:100%;height:240px;display:block"></canvas>
        </div>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="filters-bar" style="margin-bottom:16px">
      <span style="font-size:14px;font-weight:600;color:var(--text-muted)">Filter by Rating:</span>
      ${['all', 'A+', 'A', 'B+', 'B', 'C', 'D'].map(r => `
        <button class="btn btn-sm ${filterRating === r ? 'btn-primary' : 'btn-outline'}" onclick="setVendorFilter('${r}')">${r === 'all' ? 'All' : r}</button>
      `).join('')}
    </div>

    <!-- VENDOR SCORECARD TABLE -->
    <div class="card">
      <div style="padding:16px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:15px;font-weight:700">Vendor Scorecards</span>
        <div style="display:flex;gap:12px;font-size:12px">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:var(--success);display:inline-block"></span> A-grade (90+)</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:var(--warning);display:inline-block"></span> B-grade (70-89)</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:50%;background:var(--danger);display:inline-block"></span> C/D-grade (<70)</span>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th onclick="vendorSortBy('onTime')" style="cursor:pointer">On-Time % ↕</th>
              <th onclick="vendorSortBy('accuracy')" style="cursor:pointer">Accuracy % ↕</th>
              <th onclick="vendorSortBy('disputes')" style="cursor:pointer">Disputes ↕</th>
              <th>Outstanding</th>
              <th>Total Paid</th>
              <th>Trend (8-week)</th>
              <th onclick="vendorSortBy('score')" style="cursor:pointer">Score ↕</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${vendors.map((v, idx) => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:8px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${v.name.slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style="font-size:13px;font-weight:600">${v.name}</div>
                      <div style="font-size:11px;color:var(--text-muted)">${v.category} • ${v.city}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-weight:700;color:${v.onTime>=90?'var(--success)':v.onTime>=80?'var(--warning)':'var(--danger)'}">${v.onTime}%</span>
                    <div style="width:60px">${Components.progressBar(v.onTime, v.onTime>=90?'green':v.onTime>=80?'orange':'red')}</div>
                  </div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-weight:700;color:${v.accuracy>=90?'var(--success)':v.accuracy>=80?'var(--warning)':'var(--danger)'}">${v.accuracy}%</span>
                    <div style="width:60px">${Components.progressBar(v.accuracy, v.accuracy>=90?'green':v.accuracy>=80?'orange':'red')}</div>
                  </div>
                </td>
                <td>
                  <span style="font-weight:700;color:${v.disputes<=2?'var(--success)':v.disputes<=5?'var(--warning)':'var(--danger)'}">${v.disputes}</span>
                  <span style="font-size:11px;color:var(--text-muted)"> this month</span>
                </td>
                <td style="font-weight:600;color:${v.outstanding>500000?'var(--danger)':'var(--text)'}">${formatCurrency(v.outstanding)}</td>
                <td style="color:var(--text-muted)">${formatCurrency(v.totalPaid)}</td>
                <td>
                  <canvas id="spark_${v.id}" style="width:80px;height:28px;display:block"></canvas>
                </td>
                <td>
                  <div class="vendor-score ${getScoreClass(v.score)}">${v.score}</div>
                </td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-sm btn-outline" onclick="viewVendorDetail('${v.id}')" title="View Details">📋 Detail</button>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Negotiation request sent to ${v.name}','info')" title="Negotiate">🤝</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- RISK ANALYSIS -->
    ${riskVendors > 0 ? `
    <div class="card" style="margin-top:24px">
      <div style="padding:16px 24px;background:#fef2f2;border-radius:12px;border:1px solid #fecaca">
        <div style="font-size:15px;font-weight:700;color:#991b1b;margin-bottom:16px">🚨 Vendor Risk Assessment</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
          ${FF_DATA.vendors.filter(v => v.score < 75).map(v => `
            <div style="display:flex;align-items:start;gap:12px;padding:14px;background:#fff;border-radius:10px;border:1px solid #fecaca">
              <div class="vendor-score score-red">${v.score}</div>
              <div>
                <div style="font-size:13px;font-weight:700;color:#991b1b">${v.name}</div>
                <div style="font-size:12px;color:#7f1d1d;margin-top:3px">On-time: ${v.onTime}% | Disputes: ${v.disputes} | Accuracy: ${v.accuracy}%</div>
                <div style="margin-top:8px;display:flex;gap:6px">
                  <button class="btn btn-sm" style="background:#991b1b;color:#fff;font-size:11px" onclick="showToast('Performance improvement plan sent to ${v.name}','warning')">📋 Action Plan</button>
                  <button class="btn btn-sm" style="background:#dc2626;color:#fff;font-size:11px" onclick="showToast('Considering vendor ${v.name} for replacement','info')">Replace</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>` : ''}
    `;

    // Register global functions
    window.vendorSortBy = (col) => {
      sortDir = sortCol === col && sortDir === 'desc' ? 'asc' : 'desc';
      sortCol = col;
      render();
    };
    window.setVendorFilter = (r) => { filterRating = r; render(); };
    window.viewVendorDetail = (id) => openVendorModal(id);

    // Render charts
    setTimeout(() => {
      const top5 = FF_DATA.vendors.slice(0, 5).sort((a, b) => b.score - a.score);
      FFCharts.renderBar('vendorScoreChart', top5.map(v => ({ label: v.name.split(' ')[0], value: v.score })), {
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
        formatY: v => v.toString()
      });
      FFCharts.renderDonut('vendorSpendChart', FF_DATA.vendorSpend.map(v => ({ label: v.name, value: v.value, name: v.name })), {
        colors: ['#1e3a5f', '#f97316', '#10b981', '#3b82f6', '#8b5cf6'],
        centerText: '100%',
        centerSubtext: 'Spend'
      });
      // Sparklines
      vendors.forEach(v => {
        const color = v.score >= 90 ? '#10b981' : v.score >= 70 ? '#f59e0b' : '#ef4444';
        FFCharts.renderSparkline('spark_' + v.id, v.trend, color);
      });
    }, 100);
  }

  render();
};

function openVendorModal(id) {
  const v = FF_DATA.vendors.find(vnd => vnd.id === id);
  if (!v) return;
  const vendorInvoices = FF_DATA.invoices.filter(i => i.vendorId === id);
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:52px;height:52px;border-radius:12px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">${v.name.slice(0,2)}</div>
          <div>
            <div class="modal-title">${v.name}</div>
            <div style="font-size:13px;color:var(--text-muted)">${v.category} • ${v.city} • GSTIN: ${v.gstin}</div>
          </div>
        </div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <!-- Score metrics -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
          ${[
            { label:'Overall Score', val: v.score, bg: v.score>=90?'#f0fdf4':v.score>=70?'#fffbeb':'#fef2f2', c: v.score>=90?'#166534':v.score>=70?'#92400e':'#991b1b' },
            { label:'On-Time Delivery', val: v.onTime + '%', bg:'#eff6ff', c:'#1e40af' },
            { label:'Invoice Accuracy', val: v.accuracy + '%', bg:'#f0fdf4', c:'#166534' },
            { label:'Disputes (Month)', val: v.disputes, bg: v.disputes<=2?'#f0fdf4':'#fef2f2', c: v.disputes<=2?'#166534':'#991b1b' }
          ].map(m => `
            <div style="padding:16px;background:${m.bg};border-radius:10px;text-align:center">
              <div style="font-size:28px;font-weight:900;color:${m.c}">${m.val}</div>
              <div style="font-size:12px;color:${m.c};margin-top:4px;opacity:0.8">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Recent invoices -->
        <div style="margin-bottom:20px">
          <div style="font-size:14px;font-weight:700;margin-bottom:12px">Recent Invoices (${vendorInvoices.length})</div>
          ${vendorInvoices.length ? `<table style="width:100%;font-size:13px;border-collapse:collapse">
            <thead><tr style="background:#f8fafc"><th style="padding:8px 12px;text-align:left">Invoice #</th><th style="padding:8px;text-align:left">Date</th><th style="padding:8px;text-align:right">Amount</th><th style="padding:8px">Status</th></tr></thead>
            <tbody>${vendorInvoices.slice(0,5).map(i => `
              <tr style="border-bottom:1px solid #f1f5f9">
                <td style="padding:10px 12px;font-family:monospace;color:var(--primary)">${i.id}</td>
                <td style="padding:10px 8px;color:var(--text-muted)">${i.date}</td>
                <td style="padding:10px 8px;text-align:right;font-weight:600">${formatCurrencyFull(i.total)}</td>
                <td style="padding:10px 8px;text-align:center">${getStatusBadge(i.status)}</td>
              </tr>
            `).join('')}</tbody>
          </table>` : '<div style="color:var(--text-muted);font-size:13px">No invoices found for this vendor</div>'}
        </div>

        <!-- Performance tips -->
        ${v.score < 80 ? `
        <div style="padding:16px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px">📋 Improvement Recommendations</div>
          <ul style="font-size:13px;color:#78350f;margin-left:16px;line-height:2">
            ${v.onTime < 85 ? '<li>Request SLA improvement plan for on-time delivery (currently ' + v.onTime + '%)</li>' : ''}
            ${v.accuracy < 90 ? '<li>Implement invoice verification checklist (accuracy: ' + v.accuracy + '%)</li>' : ''}
            ${v.disputes > 3 ? '<li>Schedule dispute resolution meeting (' + v.disputes + ' open disputes)</li>' : ''}
            <li>Consider performance-linked payment terms (early payment for KPI targets)</li>
          </ul>
        </div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Close</button>
        <button class="btn btn-outline" onclick="showToast('Performance report emailed to ${v.name}','success');closeModal()">📧 Email Report</button>
        <button class="btn btn-primary" onclick="showToast('Negotiation request sent to ${v.name}','info');closeModal()">🤝 Request Meeting</button>
      </div>
    </div>
  `);
}

function exportVendorReport() {
  const rows = ['Vendor,Category,City,OnTime%,Accuracy%,Disputes,Score,Rating,Outstanding,TotalPaid'];
  FF_DATA.vendors.forEach(v => rows.push(`${v.name},${v.category},${v.city},${v.onTime},${v.accuracy},${v.disputes},${v.score},${v.rating},${v.outstanding},${v.totalPaid}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vendor_scorecard.csv';
  a.click();
  showToast('Vendor scorecard exported 📊');
}
