// ============================================================
// FreightFlow — Invoice Management Page
// ============================================================

Pages.invoices = function(container) {
  let invoices = [...FF_DATA.invoices];
  let selected = new Set();
  let sortCol = 'date';
  let sortDir = 'desc';
  let filterStatus = 'all';
  let filterVendor = 'all';
  let searchText = '';

  function getFiltered() {
    return invoices.filter(inv => {
      const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
      const matchVendor = filterVendor === 'all' || inv.vendorId === filterVendor;
      const matchSearch = !searchText || inv.id.toLowerCase().includes(searchText.toLowerCase()) ||
        inv.vendor.toLowerCase().includes(searchText.toLowerCase()) ||
        inv.route.toLowerCase().includes(searchText.toLowerCase());
      return matchStatus && matchVendor && matchSearch;
    }).sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }

  function render() {
    const filtered = getFiltered();
    const allSelected = filtered.length > 0 && filtered.every(i => selected.has(i.id));
    const selCount = filtered.filter(i => selected.has(i.id)).length;
    const totalFiltered = filtered.reduce((s, i) => s + i.total, 0);

    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Invoice Management</h2>
        <p>${invoices.length} invoices • ${formatCurrency(invoices.reduce((s,i)=>s+i.total,0))} total value</p>
      </div>
      <div class="page-header-right">
        <button class="btn btn-outline" onclick="showUploadModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Invoice
        </button>
        <button class="btn btn-primary" onclick="exportCSV()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>
    </div>

    <!-- SUMMARY CARDS -->
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:24px">
      ${[
        { label:'Total', count:invoices.length, amt:invoices.reduce((s,i)=>s+i.total,0), color:'var(--primary)', bg:'#eff6ff' },
        { label:'Paid', count:invoices.filter(i=>i.status==='paid').length, amt:invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total,0), color:'var(--success)', bg:'#f0fdf4' },
        { label:'Pending', count:invoices.filter(i=>i.status==='pending').length, amt:invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.total,0), color:'var(--warning)', bg:'#fffbeb' },
        { label:'Overdue', count:invoices.filter(i=>i.status==='overdue').length, amt:invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.total,0), color:'var(--danger)', bg:'#fef2f2' },
        { label:'Disputed', count:invoices.filter(i=>i.status==='disputed').length, amt:invoices.filter(i=>i.status==='disputed').reduce((s,i)=>s+i.total,0), color:'var(--purple)', bg:'#faf5ff' }
      ].map(s => `
        <div style="padding:16px;background:${s.bg};border-radius:12px;cursor:pointer;border:2px solid ${filterStatus===s.label.toLowerCase()||filterStatus==='all'&&s.label==='Total'?s.color:'transparent'};transition:all .2s"
          onclick="setFilter('${s.label.toLowerCase()==='total'?'all':s.label.toLowerCase()}')">
          <div style="font-size:22px;font-weight:800;color:${s.color}">${s.count}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${s.label}</div>
          <div style="font-size:11px;color:var(--text-light);margin-top:2px">${formatCurrency(s.amt)}</div>
        </div>
      `).join('')}
    </div>

    <!-- FILTERS -->
    <div class="filters-bar">
      <div style="position:relative;flex:1;max-width:320px">
        <input class="filter-input w-full" style="padding-left:36px" type="text" placeholder="Search by invoice #, vendor, route..." 
          id="invSearch" value="${searchText}" oninput="updateSearch(this.value)">
        <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <select class="filter-select" onchange="updateVendorFilter(this.value)">
        <option value="all">All Vendors</option>
        ${FF_DATA.vendors.map(v => `<option value="${v.id}" ${filterVendor===v.id?'selected':''}>${v.name}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="updateStatusFilter(this.value)">
        ${['all','paid','pending','overdue','disputed'].map(s => `<option value="${s}" ${filterStatus===s?'selected':''}>${s==='all'?'All Status':s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
      </select>
      <input class="filter-input" type="date" title="From date">
      <input class="filter-input" type="date" title="To date">
      <button class="btn btn-ghost btn-sm" onclick="clearFilters()">✕ Clear</button>
    </div>

    ${selCount > 0 ? `
    <div class="bulk-action-bar">
      <span>${selCount} invoice${selCount>1?'s':''} selected (${formatCurrency(filtered.filter(i=>selected.has(i.id)).reduce((s,i)=>s+i.total,0))})</span>
      <button class="btn btn-success btn-sm" onclick="bulkApprove()">✓ Bulk Approve</button>
      <button class="btn btn-sm" style="background:#22c55e;color:#fff" onclick="bulkPay()">💸 Mark Paid</button>
      <button class="btn btn-sm" style="background:#f59e0b;color:#fff" onclick="bulkExport()">📤 Export Selected</button>
      <button class="btn btn-danger btn-sm" onclick="clearSelection()">✕ Clear</button>
    </div>` : ''}

    <!-- TABLE -->
    <div class="card">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-col"><input type="checkbox" ${allSelected?'checked':''} onchange="toggleAllSelection(this.checked)" style="width:16px;height:16px;cursor:pointer"></th>
              <th onclick="sortBy('id')">Invoice # ${sortCol==='id'?sortDir==='asc'?'↑':'↓':''}</th>
              <th onclick="sortBy('vendor')">Vendor ${sortCol==='vendor'?sortDir==='asc'?'↑':'↓':''}</th>
              <th onclick="sortBy('date')">Date ${sortCol==='date'?sortDir==='asc'?'↑':'↓':''}</th>
              <th onclick="sortBy('amount')">Amount ${sortCol==='amount'?sortDir==='asc'?'↑':'↓':''}</th>
              <th>GST (18%)</th>
              <th onclick="sortBy('total')">Total ${sortCol==='total'?sortDir==='asc'?'↑':'↓':''}</th>
              <th>HSN</th>
              <th>Route</th>
              <th>Reconcile</th>
              <th onclick="sortBy('status')">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(inv => `
              <tr class="${selected.has(inv.id)?'selected':''}">
                <td><input type="checkbox" ${selected.has(inv.id)?'checked':''} onchange="toggleSelect('${inv.id}',this.checked)" style="width:16px;height:16px;cursor:pointer"></td>
                <td><span style="font-family:monospace;font-weight:600;color:var(--primary);font-size:12px">${inv.id}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:28px;height:28px;border-radius:6px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">${inv.vendor.slice(0,2)}</div>
                    <span style="font-size:13px;font-weight:500">${inv.vendor}</span>
                  </div>
                </td>
                <td style="font-size:12px;color:var(--text-muted)">${inv.date}</td>
                <td style="font-weight:600">${formatCurrencyFull(inv.amount)}</td>
                <td style="color:var(--text-muted);font-size:13px">${formatCurrencyFull(inv.gst)}</td>
                <td style="font-weight:700;color:var(--primary)">${formatCurrencyFull(inv.total)}</td>
                <td><span style="font-family:monospace;font-size:12px;background:#f1f5f9;padding:2px 6px;border-radius:4px">${inv.hsn}</span></td>
                <td style="font-size:12px;color:var(--text-muted);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${inv.route}</td>
                <td>${getReconcileBadge(inv.reconciled)}</td>
                <td>${getStatusBadge(inv.status)}</td>
                <td>
                  <div style="display:flex;gap:4px">
                    <button class="btn btn-sm btn-outline" onclick="viewInvoice('${inv.id}')" title="View Details">👁</button>
                    <button class="btn btn-sm btn-outline" onclick="approveInvoice('${inv.id}')" title="Approve">✓</button>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Invoice ${inv.id} flagged for dispute','warning')" title="Dispute">⚡</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${filtered.length === 0 ? '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No invoices found</h3><p>Try adjusting your filters</p></div>' : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-top:1px solid var(--border);font-size:13px;color:var(--text-muted)">
        <span>Showing ${filtered.length} of ${invoices.length} invoices • Total: <strong style="color:var(--text)">${formatCurrency(totalFiltered)}</strong></span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm">← Prev</button>
          <button class="btn btn-primary btn-sm">1</button>
          <button class="btn btn-outline btn-sm">Next →</button>
        </div>
      </div>
    </div>
    `;

    // Wire up window functions for this page
    window.toggleSelect = (id, checked) => {
      checked ? selected.add(id) : selected.delete(id);
      render();
    };
    window.toggleAllSelection = (checked) => {
      getFiltered().forEach(i => checked ? selected.add(i.id) : selected.delete(i.id));
      render();
    };
    window.clearSelection = () => { selected.clear(); render(); };
    window.sortBy = (col) => {
      sortDir = sortCol === col && sortDir === 'asc' ? 'desc' : 'asc';
      sortCol = col;
      render();
    };
    window.setFilter = (s) => { filterStatus = s; render(); };
    window.updateStatusFilter = (v) => { filterStatus = v; render(); };
    window.updateVendorFilter = (v) => { filterVendor = v; render(); };
    window.updateSearch = (v) => { searchText = v; render(); };
    window.clearFilters = () => { filterStatus = 'all'; filterVendor = 'all'; searchText = ''; render(); };

    window.bulkApprove = () => {
      const ids = [...selected];
      ids.forEach(id => { const inv = invoices.find(i => i.id === id); if (inv && inv.status === 'pending') inv.status = 'paid'; });
      showToast(`${ids.length} invoices approved ✓`);
      selected.clear(); render();
    };
    window.bulkPay = () => {
      showToast(`Payment initiated for ${selected.size} invoices`, 'success');
      selected.clear(); render();
    };
    window.bulkExport = () => { exportSelectedCSV([...selected]); };

    window.approveInvoice = (id) => {
      const inv = invoices.find(i => i.id === id);
      if (inv) { inv.status = 'paid'; showToast(`Invoice ${id} approved ✓`); render(); }
    };
    window.viewInvoice = (id) => { openInvoiceModal(id); };
  }

  render();
};

function openInvoiceModal(id) {
  const inv = FF_DATA.invoices.find(i => i.id === id);
  if (!inv) return;
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <div>
          <div class="modal-title">${inv.id}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:2px">${inv.vendor} • ${inv.date}</div>
        </div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-muted);margin-bottom:4px">Vendor</div>
            <div style="font-weight:700;font-size:15px">${inv.vendor}</div>
            <div style="font-size:12px;color:var(--text-muted)">GSTIN: ${FF_DATA.vendors.find(v=>v.id===inv.vendorId)?.gstin || 'N/A'}</div>
          </div>
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-muted);margin-bottom:4px">Status</div>
            ${getStatusBadge(inv.status)} ${getReconcileBadge(inv.reconciled)}
          </div>
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-muted);margin-bottom:4px">Route</div>
            <div style="font-weight:600">${inv.route}</div>
            <div style="font-size:12px;color:var(--text-muted)">${inv.mode} • ${inv.weight}</div>
          </div>
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-muted);margin-bottom:4px">Due Date</div>
            <div style="font-weight:600">${inv.dueDate}</div>
          </div>
        </div>

        <div style="background:var(--bg);border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:16px">Invoice Line Items</div>
          <table style="width:100%;font-size:13px">
            <thead><tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:8px;color:var(--text-muted)">Description</th>
              <th style="text-align:right;padding:8px;color:var(--text-muted)">HSN</th>
              <th style="text-align:right;padding:8px;color:var(--text-muted)">Qty</th>
              <th style="text-align:right;padding:8px;color:var(--text-muted)">Rate</th>
              <th style="text-align:right;padding:8px;color:var(--text-muted)">Amount</th>
            </tr></thead>
            <tbody>
              <tr><td style="padding:10px 8px">Freight Charges - ${inv.route}</td><td style="text-align:right;padding:8px;font-family:monospace">${inv.hsn}</td><td style="text-align:right;padding:8px">1 Trip</td><td style="text-align:right;padding:8px">${formatCurrencyFull(inv.amount)}</td><td style="text-align:right;padding:8px;font-weight:600">${formatCurrencyFull(inv.amount)}</td></tr>
              <tr><td style="padding:10px 8px;color:var(--text-muted)">CGST @ 9%</td><td style="text-align:right;padding:8px"></td><td></td><td></td><td style="text-align:right;padding:8px;color:var(--text-muted)">${formatCurrencyFull(Math.round(inv.gst/2))}</td></tr>
              <tr><td style="padding:10px 8px;color:var(--text-muted)">SGST @ 9%</td><td style="text-align:right;padding:8px"></td><td></td><td></td><td style="text-align:right;padding:8px;color:var(--text-muted)">${formatCurrencyFull(Math.round(inv.gst/2))}</td></tr>
            </tbody>
            <tfoot><tr style="border-top:2px solid var(--border)">
              <td colspan="4" style="padding:12px 8px;font-weight:700">Total</td>
              <td style="text-align:right;padding:12px 8px;font-weight:800;font-size:16px;color:var(--primary)">${formatCurrencyFull(inv.total)}</td>
            </tr></tfoot>
          </table>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="padding:16px;background:#f0fdf4;border-radius:10px">
            <div style="font-size:12px;color:#166534;font-weight:600">ITC Available</div>
            <div style="font-size:20px;font-weight:800;color:#166534">${formatCurrencyFull(inv.gst)}</div>
          </div>
          <div style="padding:16px;background:#eff6ff;border-radius:10px">
            <div style="font-size:12px;color:#1e40af;font-weight:600">Reconciliation</div>
            <div style="font-size:15px;font-weight:700;color:#1e40af;margin-top:4px">${getReconcileBadge(inv.reconciled)}</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Close</button>
        <button class="btn btn-success" onclick="showToast('Invoice approved!');closeModal()">✓ Approve Invoice</button>
        <button class="btn btn-primary" onclick="showToast('Payment initiated','success');closeModal()">💸 Pay Now</button>
      </div>
    </div>
  `);
}

function showUploadModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">📥 Upload Invoice</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="upload-zone" onclick="showToast('File picker opened','info')">
          <div class="upload-icon">📄</div>
          <p><strong>Click to upload</strong> or drag & drop your invoice</p>
          <div class="upload-hint">Supports PDF, CSV, Excel • Max 25MB per file</div>
        </div>
        <div style="margin-top:20px">
          <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px">Or connect your invoice source:</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
            ${['📧 Email Inbox', '🔗 ERP (Tally/SAP)', '📊 Excel/CSV'].map(s => `
              <button class="btn btn-outline" style="flex-direction:column;gap:6px;padding:14px;height:64px;justify-content:center" onclick="showToast('Connecting ${s.split(' ').slice(1).join(' ')}...','info')">
                <span>${s}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="showToast('Invoice uploaded successfully! Processing...');closeModal()">Upload & Process</button>
      </div>
    </div>
  `);
}

function exportCSV() {
  const inv = FF_DATA.invoices;
  const rows = ['Invoice #,Vendor,Date,Amount,GST,Total,Status,Route,HSN,Reconcile'];
  inv.forEach(i => rows.push(`${i.id},${i.vendor},${i.date},${i.amount},${i.gst},${i.total},${i.status},"${i.route}",${i.hsn},${i.reconciled}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'freightflow_invoices.csv';
  a.click();
  showToast('CSV exported successfully 📊');
}

function exportSelectedCSV(ids) {
  const inv = FF_DATA.invoices.filter(i => ids.includes(i.id));
  const rows = ['Invoice #,Vendor,Date,Amount,GST,Total,Status'];
  inv.forEach(i => rows.push(`${i.id},${i.vendor},${i.date},${i.amount},${i.gst},${i.total},${i.status}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'selected_invoices.csv';
  a.click();
  showToast(`${ids.length} invoices exported 📊`);
}
