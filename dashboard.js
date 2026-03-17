// ============================================================
// FreightFlow — Dashboard Page
// ============================================================

Pages.dashboard = function(container) {
  const invoices = FF_DATA.invoices;
  const paid = invoices.filter(i => i.status === 'paid');
  const pending = invoices.filter(i => i.status === 'pending');
  const overdue = invoices.filter(i => i.status === 'overdue');
  const disputed = invoices.filter(i => i.status === 'disputed');
  const totalAmount = invoices.reduce((s, i) => s + i.total, 0);
  const overdueAmount = overdue.reduce((s, i) => s + i.total, 0);

  container.innerHTML = `
  <!-- KPI CARDS -->
  <div class="kpi-grid">
    ${Components.kpiCard('🧾', 'Total Invoices This Month', invoices.length, '+12%', 'up', 'blue', '#dbeafe')}
    ${Components.kpiCard('⏳', 'Pending Reconciliation', pending.length, '+3', 'down', 'orange', '#fff7ed')}
    ${Components.kpiCard('⚠️', 'Overdue Payments', formatCurrency(overdueAmount), '₹1.2L', 'down', 'red', '#fee2e2')}
    ${Components.kpiCard('📊', 'GST ITC Eligible', formatCurrency(FF_DATA.gstData.summary.eligible), '+8.4%', 'up', 'green', '#dcfce7')}
  </div>

  <!-- SECONDARY KPIS -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px">
    ${[
      { icon:'💰', label:'Total Freight Spend', val: formatCurrency(totalAmount), sub:'This month', bg:'#f0fdf4', c:'#166534' },
      { icon:'✅', label:'Invoices Paid', val: paid.length, sub:`${formatCurrency(paid.reduce((s,i)=>s+i.total,0))} value`, bg:'#f0fdf4', c:'#166534' },
      { icon:'⚡', label:'Disputed Invoices', val: disputed.length, sub:'Requires action', bg:'#fdf4ff', c:'#7e22ce' },
      { icon:'🏢', label:'Active Vendors', val: FF_DATA.vendors.length, sub:'Avg score: 85', bg:'#eff6ff', c:'#1e40af' }
    ].map(k => `
      <div class="card" style="padding:20px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:10px;background:${k.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${k.icon}</div>
          <div>
            <div style="font-size:22px;font-weight:800;color:${k.c}">${k.val}</div>
            <div style="font-size:12px;color:var(--text-muted)">${k.label}</div>
            <div style="font-size:11px;color:var(--text-light);margin-top:2px">${k.sub}</div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- CHARTS ROW -->
  <div class="grid-2-1" style="margin-bottom:24px">
    <!-- Combo Chart -->
    <div class="card">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px 0">
        <div>
          <div class="card-title">Freight Spend vs Revenue</div>
          <div class="card-subtitle">Last 6 months (in ₹ Lakhs)</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm" onclick="showToast('Exporting chart...','info')">📊 Export</button>
        </div>
      </div>
      <div class="card-body" style="padding-top:16px">
        <canvas id="comboChart" style="width:100%;height:260px;display:block"></canvas>
      </div>
    </div>

    <!-- Donut Chart -->
    <div class="card">
      <div class="card-header" style="padding:20px 24px 0">
        <div class="card-title">Invoice Status</div>
        <div class="card-subtitle">Current month breakdown</div>
      </div>
      <div class="card-body" style="padding-top:16px">
        <canvas id="donutChart" style="width:100%;height:240px;display:block"></canvas>
      </div>
    </div>
  </div>

  <!-- BOTTOM ROW -->
  <div class="grid-2">
    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px 0">
        <div>
          <div class="card-title">Recent Activity</div>
          <div class="card-subtitle">Latest system events</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing all activity...','info')">View All →</button>
      </div>
      <div class="card-body" style="padding-top:12px">
        ${Components.activityFeed(FF_DATA.activities)}
      </div>
    </div>

    <!-- Quick Actions + Top Vendors -->
    <div style="display:flex;flex-direction:column;gap:24px">
      <!-- Quick Actions -->
      <div class="card card-body">
        <div class="card-title" style="margin-bottom:16px">Quick Actions</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            { icon:'📥', label:'Upload Invoice', action:"Router.navigate('invoices')", bg:'#dbeafe', c:'#1e40af' },
            { icon:'🔄', label:'Run Reconciliation', action:"showToast('Reconciliation started...','info')", bg:'#dcfce7', c:'#166534' },
            { icon:'📊', label:'GST Report', action:"Router.navigate('gst')", bg:'#fef9c3', c:'#854d0e' },
            { icon:'💸', label:'Process Payments', action:"Router.navigate('payments')", bg:'#ede9fe', c:'#5b21b6' },
            { icon:'📋', label:'Vendor Report', action:"Router.navigate('vendors')", bg:'#fff7ed', c:'#9a3412' },
            { icon:'📤', label:'Export to Tally', action:"showToast('Exporting to Tally...','success')", bg:'#f0fdf4', c:'#166534' }
          ].map(a => `
            <button onclick="${a.action}" class="btn btn-outline" style="flex-direction:column;gap:6px;padding:16px;text-align:center;justify-content:center;height:72px">
              <span style="font-size:22px">${a.icon}</span>
              <span style="font-size:11px;font-weight:600;color:${a.c}">${a.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Top Vendors -->
      <div class="card card-body">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div class="card-title">Top Vendors by Spend</div>
          <button class="btn btn-ghost btn-sm" onclick="Router.navigate('vendors')">Details →</button>
        </div>
        ${FF_DATA.vendors.slice(0, 4).map(v => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0">${v.name.slice(0,2).toUpperCase()}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:var(--text)">${v.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${formatCurrency(v.totalPaid)} • ${v.invoices} invoices</div>
            </div>
            <div class="vendor-score ${getScoreClass(v.score)}">${v.score}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- ALERTS -->
  <div style="margin-top:24px">
    <div class="card card-body">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div class="card-title">⚠️ Action Required</div>
        <span class="badge badge-danger">4 items</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
        ${[
          { type:'danger', icon:'🚨', title:'3 Overdue Invoices', desc:'TCI Express (₹4.01L), DTDC (₹1.04L), Ecom Express', action:'View Now' },
          { type:'warning', icon:'⚡', title:'2 Disputed Invoices', desc:'XpressBees (₹49,560), INV-2024-0863 pending resolution', action:'Resolve' },
          { type:'info', icon:'📊', title:'GST Filing Due in 8 Days', desc:'GSTR-2B reconciliation pending for 3 vendors', action:'Reconcile' },
          { type:'warning', icon:'💰', title:'₹7.2L Overdue Receivables', desc:'Outstanding beyond 30 days from 3 vendors', action:'Send Reminder' }
        ].map(a => `
          <div style="display:flex;align-items:start;gap:12px;padding:14px;border-radius:10px;background:${a.type==='danger'?'#fef2f2':a.type==='warning'?'#fffbeb':'#eff6ff'};border:1px solid ${a.type==='danger'?'#fecaca':a.type==='warning'?'#fde68a':'#bfdbfe'}">
            <span style="font-size:20px">${a.icon}</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700;color:${a.type==='danger'?'#991b1b':a.type==='warning'?'#92400e':'#1e40af'}">${a.title}</div>
              <div style="font-size:12px;color:${a.type==='danger'?'#7f1d1d':a.type==='warning'?'#78350f':'#1e3a8a'};margin-top:2px">${a.desc}</div>
            </div>
            <button class="btn btn-sm" style="background:${a.type==='danger'?'#991b1b':a.type==='warning'?'#92400e':'#1e40af'};color:#fff;flex-shrink:0" onclick="showToast('${a.action} triggered','info')">${a.action}</button>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `;

  // Render charts after DOM is ready
  setTimeout(() => {
    const comboData = FF_DATA.monthlySpend.map(m => ({
      label: m.month,
      bar: m.freight,
      line: m.revenue
    }));
    FFCharts.renderCombo('comboChart', comboData, { barLabel: 'Freight Cost', lineLabel: 'Revenue' });

    const donutData = [
      { label: 'Paid', value: paid.length, name: 'Paid' },
      { label: 'Pending', value: pending.length, name: 'Pending' },
      { label: 'Overdue', value: overdue.length, name: 'Overdue' },
      { label: 'Disputed', value: disputed.length, name: 'Disputed' }
    ];
    FFCharts.renderDonut('donutChart', donutData, {
      colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      centerText: invoices.length,
      centerSubtext: 'Invoices'
    });
  }, 100);
};
