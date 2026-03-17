// ============================================================
// FreightFlow — Reports & Analytics Page
// ============================================================

Pages.reports = function(container) {
  let dateFrom = '2023-10-01';
  let dateTo = '2024-03-31';
  let activeTab = 'overview';

  function render() {
    const totalSpend = FF_DATA.monthlySpend.reduce((s, m) => s + m.freight, 0);
    const totalRevenue = FF_DATA.monthlySpend.reduce((s, m) => s + m.revenue, 0);
    const freightRatio = (totalSpend / totalRevenue * 100).toFixed(1);
    const predictedNext = Math.round(FF_DATA.monthlySpend[FF_DATA.monthlySpend.length - 1].freight * 1.08);

    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Reports & Analytics</h2>
        <p>Business intelligence & freight insights</p>
      </div>
      <div class="page-header-right">
        <div style="display:flex;align-items:center;gap:8px">
          <input class="filter-input" type="date" value="${dateFrom}" onchange="window._repFrom=this.value">
          <span style="color:var(--text-muted)">to</span>
          <input class="filter-input" type="date" value="${dateTo}" onchange="window._repTo=this.value">
        </div>
        <div class="dropdown" id="exportDropdown">
          <button class="btn btn-primary" onclick="toggleExportMenu()">📥 Export ▾</button>
          <div class="dropdown-menu hidden" id="exportMenu">
            <div class="dropdown-item" onclick="exportReportCSV()">📊 Export as CSV</div>
            <div class="dropdown-item" onclick="exportReportPDF()">📄 Export as PDF</div>
            <div class="dropdown-item" onclick="showToast('Excel export coming soon','info')">📗 Export as Excel</div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" onclick="showToast('Report scheduled for email delivery','success')">📧 Schedule Email</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PREDICTIVE INSIGHTS -->
    <div style="padding:20px 24px;background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:var(--radius);margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:36px">🤖</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:#fff">AI Predictive Insights</div>
          <div style="font-size:14px;color:rgba(255,255,255,.8);margin-top:4px">
            Based on 6-month trend analysis: <strong style="color:var(--accent)">April freight spend projected at ${formatCurrency(predictedNext)}</strong> (+8% MoM)
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,.65);margin-top:6px">
            💡 Tip: Consolidating Mumbai→Delhi shipments could save ${formatCurrency(280000)}/month
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-sm" style="background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.3)" onclick="showToast('Optimization report opened','info')">View Optimization →</button>
      </div>
    </div>

    <!-- KPI SUMMARY -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px">
      ${[
        { icon:'💰', label:'Total Freight Spend (6M)', val: formatCurrency(totalSpend), sub:'Oct 23 — Mar 24', bg:'#eff6ff', c:'var(--primary)' },
        { icon:'📈', label:'Total Revenue (6M)', val: formatCurrency(totalRevenue), sub:''+freightRatio+'% freight-to-revenue', bg:'#f0fdf4', c:'var(--success)' },
        { icon:'🚛', label:'Total Invoices Processed', val: '284', sub:'98.7% reconciled', bg:'#fff7ed', c:'var(--accent)' },
        { icon:'⏱️', label:'Avg Processing Time', val: '4.2 hrs', sub:'Down from 48 hrs manually', bg:'#fdf4ff', c:'var(--purple)' }
      ].map(k => `
        <div class="card" style="padding:20px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:10px;background:${k.bg};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${k.icon}</div>
            <div>
              <div style="font-size:20px;font-weight:800;color:${k.c}">${k.val}</div>
              <div style="font-size:12px;color:var(--text-muted)">${k.label}</div>
              <div style="font-size:11px;color:var(--text-light);margin-top:2px">${k.sub}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- TAB NAV -->
    <div class="tab-nav">
      <button class="tab-btn ${activeTab === 'overview' ? 'active' : ''}" onclick="switchRepTab('overview')">Overview Charts</button>
      <button class="tab-btn ${activeTab === 'routes' ? 'active' : ''}" onclick="switchRepTab('routes')">Route Analysis</button>
      <button class="tab-btn ${activeTab === 'trends' ? 'active' : ''}" onclick="switchRepTab('trends')">Trend Analysis</button>
      <button class="tab-btn ${activeTab === 'benchmark' ? 'active' : ''}" onclick="switchRepTab('benchmark')">Benchmarks</button>
    </div>

    <div id="repTabContent">
      ${renderRepTab(activeTab)}
    </div>
    `;

    window.switchRepTab = (tab) => { activeTab = tab; render(); };
    window.toggleExportMenu = () => {
      document.getElementById('exportMenu')?.classList.toggle('hidden');
    };
    window.exportReportCSV = () => {
      exportReportsCSV();
      document.getElementById('exportMenu')?.classList.add('hidden');
    };
    window.exportReportPDF = () => {
      showToast('PDF report generated and downloading...', 'success');
      document.getElementById('exportMenu')?.classList.add('hidden');
    };

    setTimeout(() => renderRepCharts(activeTab), 100);
  }

  function renderRepTab(tab) {
    if (tab === 'overview') return renderOverview();
    if (tab === 'routes') return renderRoutes();
    if (tab === 'trends') return renderTrends();
    if (tab === 'benchmark') return renderBenchmarks();
    return '';
  }

  function renderOverview() {
    return `
    <div class="grid-2-1" style="gap:24px;margin-bottom:24px">
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Monthly Freight Spend vs Revenue</div>
          <div class="card-subtitle">6-month comparison (₹)</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="repComboChart" style="width:100%;height:260px;display:block"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Vendor Distribution</div>
          <div class="card-subtitle">By freight spend share</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="repDonutChart" style="width:100%;height:240px;display:block"></canvas>
        </div>
      </div>
    </div>

    <!-- Delay Analysis -->
    <div class="card">
      <div class="card-header" style="padding:20px 24px 0">
        <div class="card-title">Average Delay by Route (Days)</div>
        <div class="card-subtitle">Top 5 busiest routes</div>
      </div>
      <div class="card-body" style="padding-top:16px">
        <canvas id="delayChart" style="width:100%;height:180px;display:block"></canvas>
      </div>
    </div>`;
  }

  function renderRoutes() {
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);font-size:15px;font-weight:700">Route Performance Analysis</div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Route</th><th>No. of Shipments</th><th>Avg Freight Cost</th><th>Avg Transit Days</th><th>Avg Delay</th><th>Top Carrier</th><th>Cost/KG</th>
          </tr></thead>
          <tbody>
            ${[
              { route:'Mumbai → Delhi', shipments:48, avgCost:285000, transit:2, delay:0.8, carrier:'Delhivery', costKg:118 },
              { route:'Chennai → Bangalore', shipments:32, avgCost:125000, transit:1, delay:1.2, carrier:'BlueDart', costKg:390 },
              { route:'Delhi → Kolkata', shipments:28, avgCost:192000, transit:3, delay:2.1, carrier:'Gati', costKg:160 },
              { route:'Hyderabad → Pune', shipments:24, avgCost:67000, transit:2, delay:1.8, carrier:'DTDC', costKg:78 },
              { route:'Bangalore → Mumbai', shipments:36, avgCost:340000, transit:2, delay:1.5, carrier:'TCI Express', costKg:106 },
              { route:'Mumbai → Ahmedabad', shipments:19, avgCost:450000, transit:1, delay:0.3, carrier:'TCI Express', costKg:100 }
            ].map(r => `
              <tr>
                <td style="font-weight:600">${r.route}</td>
                <td style="text-align:center">${r.shipments}</td>
                <td style="font-weight:600">${formatCurrencyFull(r.avgCost)}</td>
                <td style="text-align:center">${r.transit} days</td>
                <td style="text-align:center">
                  <span style="color:${r.delay<=1?'var(--success)':r.delay<=1.5?'var(--warning)':'var(--danger)'};font-weight:700">${r.delay}d</span>
                </td>
                <td>${r.carrier}</td>
                <td style="font-family:monospace">₹${r.costKg}/kg</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function renderTrends() {
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Freight-to-Revenue Ratio</div>
          <div class="card-subtitle">Monthly trend (ideal: <30%)</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="trendChart1" style="width:100%;height:220px;display:block"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Invoice Processing Efficiency</div>
          <div class="card-subtitle">Avg hours to reconcile</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="trendChart2" style="width:100%;height:220px;display:block"></canvas>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:24px card-body">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);font-size:15px;font-weight:700">📊 Key Trend Insights</div>
      <div style="padding:20px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${[
          { icon:'📉', title:'Freight Cost Trend', insight:'Freight costs increased 12.3% in Q4 due to diesel price surge. March shows a 3.2% stabilization.', color:'var(--accent)' },
          { icon:'⚡', title:'Processing Speed', insight:'Invoice processing time reduced from 48 hours to 4.2 hours after FreightFlow implementation.', color:'var(--success)' },
          { icon:'💰', title:'ITC Recovery Rate', insight:'ITC recovery rate improved from 67% to 94% with auto-reconciliation. ₹42L recovered in 6 months.', color:'var(--primary)' }
        ].map(i => `
          <div style="padding:20px;background:var(--bg);border-radius:12px;border-left:4px solid ${i.color}">
            <div style="font-size:24px;margin-bottom:10px">${i.icon}</div>
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">${i.title}</div>
            <div style="font-size:13px;color:var(--text-muted);line-height:1.7">${i.insight}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function renderBenchmarks() {
    return `
    <div class="card card-body">
      <div style="font-size:15px;font-weight:700;margin-bottom:20px">📊 Industry Benchmarks — Indian Logistics SMEs</div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <thead><tr style="background:var(--bg);border-bottom:2px solid var(--border)">
            <th style="padding:12px 16px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-muted)">Metric</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-muted)">Industry Avg</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--primary)">Your Company</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-muted)">Best in Class</th>
            <th style="padding:12px 16px;text-align:left">Assessment</th>
          </tr></thead>
          <tbody>
            ${[
              { metric:'Freight-to-Revenue Ratio', industry:'28-35%', yours:'27.5%', best:'<22%', status:'good', note:'You\'re slightly below industry average - good performance' },
              { metric:'Invoice Reconciliation Time', industry:'2-5 days', yours:'4.2 hours', best:'<2 hours', status:'excellent', note:'10x faster than industry average with automation' },
              { metric:'ITC Utilization Rate', industry:'72-80%', yours:'94%', best:'>95%', status:'excellent', note:'Excellent ITC capture - near best-in-class' },
              { metric:'On-Time Payment Rate', industry:'65-75%', yours:'68%', best:'>90%', status:'warning', note:'Room for improvement - 7 overdue invoices this month' },
              { metric:'Vendor Dispute Rate', industry:'8-12%', yours:'4.3%', best:'<3%', status:'good', note:'Below industry average - vendor management is strong' },
              { metric:'Invoice Accuracy Rate', industry:'82-88%', yours:'91.2%', best:'>96%', status:'good', note:'Good performance, target 95%+ with stricter vendor KPIs' },
              { metric:'Avg Delivery Delay', industry:'1.8-2.5 days', yours:'1.48 days', best:'<0.5 days', status:'good', note:'Below industry average - route optimization helping' }
            ].map(b => `
              <tr style="border-bottom:1px solid #f1f5f9">
                <td style="padding:14px 16px;font-weight:600">${b.metric}</td>
                <td style="padding:14px;text-align:center;color:var(--text-muted)">${b.industry}</td>
                <td style="padding:14px;text-align:center;font-weight:700;color:${b.status==='excellent'?'var(--success)':b.status==='good'?'var(--info)':'var(--warning)'}">${b.yours}</td>
                <td style="padding:14px;text-align:center;color:var(--text-light)">${b.best}</td>
                <td style="padding:14px">
                  <span class="badge ${b.status==='excellent'?'badge-success':b.status==='good'?'badge-info':'badge-warning'}" style="margin-bottom:4px;display:inline-block">${b.status==='excellent'?'✅ Excellent':b.status==='good'?'👍 Good':'⚠️ Improve'}</span>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${b.note}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function renderRepCharts(tab) {
    if (tab === 'overview') {
      const comboData = FF_DATA.monthlySpend.map(m => ({ label: m.month, bar: m.freight, line: m.revenue }));
      FFCharts.renderCombo('repComboChart', comboData, { barLabel: 'Freight Cost', lineLabel: 'Revenue' });
      FFCharts.renderDonut('repDonutChart', FF_DATA.vendorSpend.map(v => ({ label: v.name, value: v.value, name: v.name })), {
        colors: ['#1e3a5f', '#f97316', '#10b981', '#3b82f6', '#8b5cf6'],
        centerText: '₹', centerSubtext: 'Spend'
      });
      FFCharts.renderHBar('delayChart', FF_DATA.delayAnalysis.map(d => ({ label: d.route, value: d.avgDelay })), {
        colors: ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#10b981'],
        formatVal: v => v + ' days'
      });
    }
    if (tab === 'trends') {
      const ratioData = FF_DATA.monthlySpend.map(m => ({
        label: m.month.slice(0, 3),
        value: Math.round(m.freight / m.revenue * 100)
      }));
      FFCharts.renderLine('trendChart1', [{ data: ratioData.map(d => d.value), color: '#f97316', label: 'Freight Ratio %' }], ratioData.map(d => d.label));

      const effData = [48, 32, 18, 10, 6, 4.2];
      const effLabels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      FFCharts.renderLine('trendChart2', [{ data: effData, color: '#10b981', label: 'Processing Hours' }], effLabels);
    }
  }

  render();
};

function exportReportsCSV() {
  const rows = ['Month,Freight Spend,Revenue,Ratio%'];
  FF_DATA.monthlySpend.forEach(m => rows.push(`${m.month},${m.freight},${m.revenue},${(m.freight/m.revenue*100).toFixed(1)}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'freight_analytics_report.csv';
  a.click();
  showToast('Analytics report exported 📊');
}
