// ============================================================
// FreightFlow — Payments & Aging Reports
// ============================================================

Pages.payments = function(container) {
  let activeTab = 'aging';
  let currentMonth = new Date(2024, 2, 1); // March 2024

  function render() {
    const overdue = FF_DATA.agingData.reduce((s, d) => s + (d.bucket !== 'Current' ? d.amount : 0), 0);
    const total = FF_DATA.agingData.reduce((s, d) => s + d.amount, 0);

    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Payments & Aging Analysis</h2>
        <p>Outstanding: ${formatCurrency(total)} • Overdue: ${formatCurrency(overdue)}</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline" onclick="showToast('Sending bulk reminders to all overdue vendors...','info')">📧 Bulk Reminders</button>
        <button class="btn btn-primary" onclick="exportAgingReport()">📥 Export Aging Report</button>
      </div>
    </div>

    <!-- AGING CARDS -->
    <div class="aging-grid">
      ${FF_DATA.agingData.map(d => `
        <div class="aging-card ${d.bucket === 'Current' ? 'current' : d.bucket === '1-30 Days' ? 'days-30' : d.bucket === '31-60 Days' ? 'days-60' : d.bucket === '61-90 Days' ? 'days-90' : 'overdue'}">
          <div class="aging-label" style="color:${d.color}">${d.bucket}</div>
          <div class="aging-amount" style="color:${d.color}">${formatCurrency(d.amount)}</div>
          <div class="aging-count" style="color:${d.color}88">${d.count} invoice${d.count !== 1 ? 's' : ''}</div>
          ${d.bucket !== 'Current' ? `<div style="margin-top:10px"><button class="btn btn-sm" style="background:${d.color}22;color:${d.color};border:1px solid ${d.color}44;font-size:11px" onclick="showToast('Sending reminder for ${d.bucket} invoices','warning')">Send Reminder</button></div>` : ''}
        </div>
      `).join('')}
    </div>

    <!-- TAB NAVIGATION -->
    <div class="tab-nav">
      <button class="tab-btn ${activeTab === 'aging' ? 'active' : ''}" onclick="switchPayTab('aging')">Aging Analysis</button>
      <button class="tab-btn ${activeTab === 'schedule' ? 'active' : ''}" onclick="switchPayTab('schedule')">Payment Schedule</button>
      <button class="tab-btn ${activeTab === 'calendar' ? 'active' : ''}" onclick="switchPayTab('calendar')">Calendar View</button>
      <button class="tab-btn ${activeTab === 'history' ? 'active' : ''}" onclick="switchPayTab('history')">Payment History</button>
    </div>

    <div id="payTabContent">
      ${renderPayTab(activeTab)}
    </div>
    `;

    window.switchPayTab = (tab) => { activeTab = tab; render(); };
    window.processPayment = (id) => {
      const p = FF_DATA.payments.find(p => p.id === id);
      if (p) { p.status = 'processed'; showToast(`Payment ${id} processed via ${p.mode} ✓`); render(); }
    };
    window.schedulePayment = (id) => {
      showToast('Payment scheduled for next business day 📅', 'success');
    };

    setTimeout(() => {
      if (activeTab === 'aging') renderAgingChart();
    }, 100);
  }

  function renderPayTab(tab) {
    if (tab === 'aging') return renderAgingTab();
    if (tab === 'schedule') return renderScheduleTab();
    if (tab === 'calendar') return renderCalendarTab();
    if (tab === 'history') return renderHistoryTab();
    return '';
  }

  function renderAgingTab() {
    return `
    <div class="grid-2-1" style="gap:24px">
      <div class="card">
        <div class="card-header" style="padding:20px 24px 0">
          <div class="card-title">Aging Distribution</div>
          <div class="card-subtitle">Outstanding payables by age (₹)</div>
        </div>
        <div class="card-body" style="padding-top:16px">
          <canvas id="agingChart" style="width:100%;height:250px;display:block"></canvas>
        </div>
      </div>

      <div class="card card-body">
        <div style="font-size:15px;font-weight:700;margin-bottom:20px">📊 Aging Summary</div>
        ${FF_DATA.agingData.map(d => `
          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;font-weight:600">${d.bucket}</span>
              <span style="font-size:13px;font-weight:700;color:${d.color}">${formatCurrency(d.amount)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="background:${d.color};width:${Math.round(d.amount / FF_DATA.agingData.reduce((s,d)=>s+d.amount,0) * 100)}%"></div>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${d.count} invoices • ${Math.round(d.amount / FF_DATA.agingData.reduce((s,d)=>s+d.amount,0) * 100)}% of total</div>
          </div>
        `).join('')}
        <div style="border-top:2px solid var(--border);padding-top:14px;margin-top:4px;display:flex;justify-content:space-between">
          <span style="font-weight:700">Total Outstanding</span>
          <span style="font-weight:800;color:var(--primary);font-size:16px">${formatCurrency(FF_DATA.agingData.reduce((s,d)=>s+d.amount,0))}</span>
        </div>
      </div>
    </div>

    <!-- Vendor-wise Outstanding -->
    <div class="card" style="margin-top:24px">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:15px;font-weight:700">Vendor-wise Outstanding</div>
        <button class="btn btn-outline btn-sm" onclick="exportAgingReport()">📥 Export</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Vendor</th>
            <th>Current</th>
            <th>1-30 Days</th>
            <th>31-60 Days</th>
            <th>60+ Days</th>
            <th>Total Outstanding</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            ${FF_DATA.vendors.slice(0, 6).map(v => {
              const rand = () => Math.floor(Math.random() * 400000 + 50000);
              const curr = rand(), d30 = rand() * 0.7, d60 = rand() * 0.4, d90 = rand() * 0.2;
              const total = curr + d30 + d60 + d90;
              return `
              <tr>
                <td><div style="display:flex;align-items:center;gap:8px">
                  <div style="width:30px;height:30px;border-radius:6px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${v.name.slice(0,2)}</div>
                  <span style="font-weight:500">${v.name}</span>
                </div></td>
                <td style="color:var(--success)">${formatCurrency(curr)}</td>
                <td style="color:var(--warning)">${formatCurrency(d30)}</td>
                <td style="color:var(--accent)">${formatCurrency(d60)}</td>
                <td style="color:var(--danger)">${formatCurrency(d90)}</td>
                <td style="font-weight:700">${formatCurrency(total)}</td>
                <td><button class="btn btn-sm btn-primary" onclick="showToast('Payment reminder sent to ${v.name}','success')">📧 Remind</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function renderScheduleTab() {
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:15px;font-weight:700">💳 Payment Schedule</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Scheduling all pending payments...','info')">⚡ Pay All Pending</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Payment ID</th>
            <th>Vendor</th>
            <th>Invoice Ref</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Mode</th>
            <th>UTR/Ref</th>
            <th>Status</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            ${FF_DATA.payments.map(p => `
              <tr>
                <td style="font-family:monospace;font-size:12px;color:var(--primary)">${p.id}</td>
                <td style="font-weight:500">${p.vendor}</td>
                <td style="font-family:monospace;font-size:12px">${p.invoiceId}</td>
                <td style="font-weight:700">${formatCurrencyFull(p.amount)}</td>
                <td style="font-size:12px;color:${p.status==='overdue'?'var(--danger)':''};font-weight:${p.status==='overdue'?'700':'400'}">${p.dueDate}</td>
                <td><span class="badge badge-gray">${p.mode}</span></td>
                <td style="font-family:monospace;font-size:11px;color:var(--text-muted)">${p.utr || '—'}</td>
                <td>${getStatusBadge(p.status)}</td>
                <td>
                  ${p.status !== 'processed' ? `
                    <button class="btn btn-sm btn-success" onclick="processPayment('${p.id}')">💸 Pay Now</button>
                  ` : '<span style="color:var(--success);font-size:12px;font-weight:600">✓ Done</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="padding:16px 24px;background:#eff6ff;border-top:1px solid var(--border);display:flex;align-items:center;gap:12px">
        <span style="font-size:16px">💡</span>
        <div style="font-size:13px;color:#1e40af">
          <strong>Payment Optimization Tip:</strong> Paying 2 overdue invoices immediately (TCI Express ₹4.01L, DTDC ₹1.04L) will save ₹8,200 in interest charges at 1.5% per month.
        </div>
        <button class="btn btn-sm" style="background:#1e40af;color:#fff;flex-shrink:0" onclick="showToast('Bulk payment of ₹5.05L initiated for overdue invoices','success')">Pay Now → Save ₹8.2K</button>
      </div>
    </div>`;
  }

  function renderCalendarTab() {
    const days = [];
    const daysInMonth = 31;
    const firstDay = 5; // March 1 is Friday
    const paymentDays = [11, 14, 18, 22, 31];

    // Empty cells
    for (let i = 0; i < firstDay; i++) days.push({ day: null });
    for (let i = 1; i <= daysInMonth; i++) {
      const hasPayment = paymentDays.includes(i);
      const isToday = i === 17;
      days.push({ day: i, hasPayment, isToday });
    }

    return `
    <div class="card card-body">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:18px;font-weight:700">📅 March 2024 — Payment Calendar</h3>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="showToast('February 2024','info')">← Feb</button>
          <button class="btn btn-outline btn-sm" onclick="showToast('April 2024','info')">Apr →</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div style="text-align:center;font-size:12px;font-weight:700;color:var(--text-muted);padding:8px 0">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
        ${days.map(d => d.day === null ? '<div></div>' : `
          <div style="aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;background:${d.isToday ? 'var(--primary)' : d.hasPayment ? '#dbeafe' : '#f8fafc'};border:${d.hasPayment && !d.isToday ? '2px solid var(--info)' : '1px solid transparent'};transition:all .15s" onclick="${d.hasPayment ? `showToast('Payment due on March ${d.day}','warning')` : `showToast('No payments on March ${d.day}','info')`}">
            <span style="font-size:14px;font-weight:${d.isToday || d.hasPayment ? '700' : '400'};color:${d.isToday ? '#fff' : d.hasPayment ? 'var(--info)' : 'var(--text)'}">${d.day}</span>
            ${d.hasPayment ? `<span style="font-size:8px;color:${d.isToday ? '#fff' : 'var(--accent)'}">₹ Due</span>` : ''}
          </div>
        `).join('')}
      </div>
      <div style="margin-top:20px;display:flex;gap:16px;justify-content:center;font-size:12px">
        <div style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:12px;background:var(--primary);border-radius:2px"></div> Today</div>
        <div style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:12px;background:#dbeafe;border:1.5px solid var(--info);border-radius:2px"></div> Payment Due</div>
      </div>
    </div>`;
  }

  function renderHistoryTab() {
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);font-size:15px;font-weight:700">💳 Payment History</div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr>
            <th>Date</th><th>Payment ID</th><th>Vendor</th><th>Amount</th><th>Mode</th><th>UTR Number</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${[
              { date:'2024-03-15', id:'PAY-0233', vendor:'Delhivery Ltd', amount:336300, mode:'RTGS', utr:'HDFC2024031500234', status:'processed' },
              { date:'2024-03-12', id:'PAY-0232', vendor:'BlueDart Express', amount:312700, mode:'NEFT', utr:'ICIC2024031200567', status:'processed' },
              { date:'2024-03-10', id:'PAY-0231', vendor:'VRL Logistics', amount:167560, mode:'NEFT', utr:'HDFC2024031000891', status:'processed' },
              { date:'2024-03-08', id:'PAY-0230', vendor:'Delhivery Ltd', amount:112100, mode:'RTGS', utr:'HDFC2024030800112', status:'processed' },
              { date:'2024-03-05', id:'PAY-0229', vendor:'TCI Express', amount:218300, mode:'RTGS', utr:'ICIC2024030500445', status:'processed' },
              { date:'2024-03-03', id:'PAY-0228', vendor:'Gati Logistics', amount:184080, mode:'NEFT', utr:'KOTAK2024030300778', status:'processed' }
            ].map(p => `
              <tr>
                <td style="font-size:12px;color:var(--text-muted)">${p.date}</td>
                <td style="font-family:monospace;font-size:12px;color:var(--primary)">${p.id}</td>
                <td style="font-weight:500">${p.vendor}</td>
                <td style="font-weight:700">${formatCurrencyFull(p.amount)}</td>
                <td><span class="badge badge-gray">${p.mode}</span></td>
                <td style="font-family:monospace;font-size:11px;color:var(--text-muted)">${p.utr}</td>
                <td>${getStatusBadge(p.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  function renderAgingChart() {
    const data = FF_DATA.agingData.map(d => ({ label: d.bucket, value: d.amount }));
    FFCharts.renderBar('agingChart', data, {
      colors: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#991b1b'],
      formatY: v => formatCurrency(v)
    });
  }

  render();
};

function exportAgingReport() {
  const rows = ['Bucket,Amount,Count'];
  FF_DATA.agingData.forEach(d => rows.push(`${d.bucket},${d.amount},${d.count}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aging_report.csv';
  a.click();
  showToast('Aging report exported 📊');
}
