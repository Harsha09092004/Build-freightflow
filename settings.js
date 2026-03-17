// ============================================================
// FreightFlow — Settings Page
// ============================================================

Pages.settings = function(container) {
  let activeTab = 'company';

  function render() {
    container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h2>Settings</h2>
        <p>Company profile, users, integrations & preferences</p>
      </div>
      <div class="page-header-right">
        <span class="badge badge-success" style="font-size:13px;padding:6px 14px">✅ Growth Plan Active</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:220px 1fr;gap:24px">
      <!-- Settings Sidebar -->
      <div class="card" style="height:fit-content">
        <div style="padding:8px">
          ${[
            { id:'company', icon:'🏢', label:'Company Profile' },
            { id:'users', icon:'👥', label:'User Management' },
            { id:'notifications', icon:'🔔', label:'Notifications' },
            { id:'integrations', icon:'🔗', label:'Integrations' },
            { id:'api', icon:'⚡', label:'API Keys' },
            { id:'billing', icon:'💳', label:'Billing & Plan' },
            { id:'security', icon:'🔐', label:'Security' }
          ].map(t => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;cursor:pointer;transition:all .15s;${activeTab === t.id ? 'background:var(--primary);color:#fff;' : 'color:var(--text-muted);'}" onclick="switchSettingsTab('${t.id}')">
              <span style="font-size:16px">${t.icon}</span>
              <span style="font-size:13px;font-weight:${activeTab === t.id ? '700' : '500'}">${t.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Settings Content -->
      <div id="settingsContent">
        ${renderSettingsTab(activeTab)}
      </div>
    </div>
    `;

    window.switchSettingsTab = (tab) => { activeTab = tab; render(); };
  }

  function renderSettingsTab(tab) {
    if (tab === 'company') return renderCompanyProfile();
    if (tab === 'users') return renderUsers();
    if (tab === 'notifications') return renderNotifications();
    if (tab === 'integrations') return renderIntegrations();
    if (tab === 'api') return renderAPI();
    if (tab === 'billing') return renderBilling();
    if (tab === 'security') return renderSecurity();
    return '';
  }

  function renderCompanyProfile() {
    const u = FF_DATA.user;
    return `
    <div class="card card-body">
      <div style="font-size:17px;font-weight:700;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)">🏢 Company Profile</div>

      <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;padding:20px;background:var(--bg);border-radius:12px">
        <div style="width:72px;height:72px;border-radius:16px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700">${u.avatar}</div>
        <div>
          <div style="font-size:18px;font-weight:700">${u.company}</div>
          <div style="font-size:14px;color:var(--text-muted);margin-top:2px">GSTIN: ${u.gst}</div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px" onclick="showToast('Company logo upload opened','info')">📷 Update Logo</button>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company Name</label>
          <input class="form-input" value="${u.company}" oninput="showToast('Changes will be saved','info')">
        </div>
        <div class="form-group">
          <label class="form-label">Industry</label>
          <select class="form-input">
            <option selected>3PL / Freight Forwarding</option>
            <option>E-commerce Logistics</option>
            <option>Cold Chain Logistics</option>
            <option>Express Courier</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">GSTIN</label>
          <input class="form-input" value="${u.gst}" style="font-family:monospace">
          <div class="form-hint">✅ GSTIN verified</div>
        </div>
        <div class="form-group">
          <label class="form-label">PAN Number</label>
          <input class="form-input" value="${u.pan}" style="font-family:monospace">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Registered Address</label>
          <input class="form-input" value="Plot 42, MIDC Industrial Area, Andheri East, Mumbai - 400069">
        </div>
        <div class="form-group">
          <label class="form-label">State</label>
          <select class="form-input">
            <option selected>Maharashtra</option>
            <option>Tamil Nadu</option>
            <option>Karnataka</option>
            <option>Delhi</option>
            <option>Telangana</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Contact Email</label>
          <input class="form-input" type="email" value="${u.email}">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input class="form-input" value="${u.phone}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Invoice Payment Terms</label>
        <select class="form-input" style="max-width:240px">
          <option>Net 30 days</option>
          <option selected>Net 45 days</option>
          <option>Net 60 days</option>
          <option>Immediate</option>
        </select>
      </div>

      <div style="display:flex;gap:12px;padding-top:8px">
        <button class="btn btn-primary" onclick="showToast('Company profile saved successfully ✓')">Save Changes</button>
        <button class="btn btn-outline" onclick="showToast('Changes discarded')">Cancel</button>
      </div>
    </div>`;
  }

  function renderUsers() {
    const users = [
      { name:'Rajesh Kumar', email:'rajesh@mahindralogistics.in', role:'Admin', status:'active', lastActive:'Today' },
      { name:'Priya Sharma', email:'priya@mahindralogistics.in', role:'Finance Manager', status:'active', lastActive:'2 hours ago' },
      { name:'Amit Singh', email:'amit@mahindralogistics.in', role:'Operations', status:'active', lastActive:'Yesterday' },
      { name:'Deepa Nair', email:'deepa@mahindralogistics.in', role:'Viewer', status:'invited', lastActive:'—' }
    ];
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:17px;font-weight:700">👥 User Management</div>
        <button class="btn btn-primary btn-sm" onclick="showInviteModal()">+ Invite User</button>
      </div>
      <div style="padding:20px 24px">
        ${users.map(u => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f1f5f9">
            <div style="width:40px;height:40px;border-radius:50%;background:${u.status==='invited'?'#e2e8f0':'var(--primary)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">${u.name.split(' ').map(n=>n[0]).join('')}</div>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:600">${u.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${u.email} • Last active: ${u.lastActive}</div>
            </div>
            <select style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px" onchange="showToast('Role updated for ${u.name}')">
              ${['Admin','Finance Manager','Operations','Viewer'].map(r => `<option ${r===u.role?'selected':''}>${r}</option>`).join('')}
            </select>
            <span class="badge ${u.status==='active'?'badge-success':'badge-warning'}">${u.status}</span>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Removed ${u.name} from team','warning')">✕</button>
          </div>
        `).join('')}
      </div>
      <div style="padding:16px 24px;background:#eff6ff;border-top:1px solid var(--border);font-size:13px;color:#1e40af">
        <strong>Growth Plan:</strong> 5 user seats • 4 used • 1 available — <a href="#" style="color:var(--primary)" onclick="showToast('Upgrade options opened','info');return false">Upgrade for unlimited users</a>
      </div>
    </div>`;
  }

  function renderNotifications() {
    return `
    <div class="card card-body">
      <div style="font-size:17px;font-weight:700;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)">🔔 Notification Preferences</div>
      ${[
        { section:'Invoice Alerts', items:[
          { label:'Invoice uploaded', desc:'When a new invoice is added to the system', email:true, whatsapp:true, sms:false },
          { label:'Reconciliation complete', desc:'When auto-reconciliation finishes', email:true, whatsapp:false, sms:false },
          { label:'Mismatch detected', desc:'When GST or amount mismatch found', email:true, whatsapp:true, sms:true }
        ]},
        { section:'Payment Alerts', items:[
          { label:'Payment due reminder', desc:'3 days before payment due date', email:true, whatsapp:true, sms:true },
          { label:'Invoice overdue', desc:'When payment is past due date', email:true, whatsapp:true, sms:true },
          { label:'Payment processed', desc:'When a payment is successfully made', email:true, whatsapp:false, sms:false }
        ]},
        { section:'GST Alerts', items:[
          { label:'Filing deadline reminder', desc:'7 days before GST filing due', email:true, whatsapp:true, sms:false },
          { label:'GSTR-2B available', desc:'When GSTR-2B is published on portal', email:true, whatsapp:false, sms:false }
        ]}
      ].map(section => `
        <div style="margin-bottom:28px">
          <div style="font-size:14px;font-weight:700;color:var(--primary);margin-bottom:14px">${section.section}</div>
          <div style="overflow-x:auto">
            <table style="width:100%;font-size:13px">
              <thead><tr style="color:var(--text-muted)">
                <th style="text-align:left;padding:8px 0;min-width:200px">Alert Type</th>
                <th style="text-align:center;padding:8px 16px">Email</th>
                <th style="text-align:center;padding:8px 16px">WhatsApp</th>
                <th style="text-align:center;padding:8px 16px">SMS</th>
              </tr></thead>
              <tbody>
                ${section.items.map(item => `
                  <tr style="border-bottom:1px solid #f1f5f9">
                    <td style="padding:12px 0">
                      <div style="font-weight:500">${item.label}</div>
                      <div style="font-size:12px;color:var(--text-muted)">${item.desc}</div>
                    </td>
                    ${['email','whatsapp','sms'].map(ch => `
                      <td style="text-align:center;padding:12px 16px">
                        <label style="cursor:pointer;display:flex;align-items:center;justify-content:center">
                          <input type="checkbox" ${item[ch]?'checked':''} onchange="showToast('Notification preference saved')" style="width:16px;height:16px;cursor:pointer">
                        </label>
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="showToast('Notification preferences saved ✓')">Save Preferences</button>
    </div>`;
  }

  function renderIntegrations() {
    const integrations = [
      { name:'Tally Prime', icon:'📊', desc:'Sync invoices, payments & ledger entries', status:'connected', category:'ERP' },
      { name:'Zoho Books', icon:'📚', desc:'Two-way sync of invoices and vendor data', status:'available', category:'ERP' },
      { name:'SAP Business One', icon:'⚙️', desc:'Enterprise ERP integration via SAP B1', status:'available', category:'ERP' },
      { name:'WhatsApp Business', icon:'💬', desc:'Send payment reminders & alerts via WhatsApp', status:'connected', category:'Communication' },
      { name:'Gmail / G Suite', icon:'📧', desc:'Auto-extract invoices from email attachments', status:'connected', category:'Communication' },
      { name:'GSTN Portal', icon:'🇮🇳', desc:'Auto-sync GSTR-2B data from government portal', status:'connected', category:'GST' },
      { name:'ICICI NetBanking', icon:'🏦', desc:'Initiate NEFT/RTGS payments directly', status:'available', category:'Banking' },
      { name:'HDFC Bank API', icon:'🏦', desc:'Account statement sync and payment initiation', status:'available', category:'Banking' }
    ];
    return `
    <div class="card">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);font-size:17px;font-weight:700">🔗 Integrations</div>
      <div style="padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        ${integrations.map(i => `
          <div style="padding:18px;border:1.5px solid ${i.status==='connected'?'var(--success)':'var(--border)'};border-radius:12px;transition:all .2s;cursor:pointer" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='${i.status==='connected'?'var(--success)':'var(--border)'}'">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:28px">${i.icon}</span>
                <div>
                  <div style="font-size:14px;font-weight:700">${i.name}</div>
                  <span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">${i.category}</span>
                </div>
              </div>
              <span class="badge ${i.status==='connected'?'badge-success':'badge-gray'}">${i.status==='connected'?'✓ Connected':'Available'}</span>
            </div>
            <div style="font-size:12px;color:var(--text-muted);margin:10px 0">${i.desc}</div>
            <button class="btn btn-sm ${i.status==='connected'?'btn-outline':'btn-primary'}" onclick="showToast('${i.status==='connected'?'Opening '+i.name+' settings':'Connecting to '+i.name}...')">
              ${i.status === 'connected' ? '⚙️ Configure' : '+ Connect'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function renderAPI() {
    return `
    <div class="card card-body">
      <div style="font-size:17px;font-weight:700;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)">⚡ API Key Management</div>
      <div style="padding:16px;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;color:#92400e">🔐 Security Notice</div>
        <div style="font-size:13px;color:#78350f;margin-top:4px">Keep your API keys secure. Never share them publicly or in client-side code. Rotate keys regularly.</div>
      </div>
      ${[
        { name:'Production API Key', key:'ff_prod_8f4j2k9m3n7p...x8y', created:'March 1, 2024', lastUsed:'2 minutes ago', status:'active' },
        { name:'Development API Key', key:'ff_dev_2d6h1k4n8q2r...m4s', created:'January 15, 2024', lastUsed:'2 days ago', status:'active' },
        { name:'Webhook Secret', key:'ff_wh_5g8j3l7p1q4t...v9w', created:'February 10, 2024', lastUsed:'1 hour ago', status:'active' }
      ].map(k => `
        <div style="padding:18px;background:var(--bg);border-radius:12px;margin-bottom:16px;border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
            <div>
              <div style="font-size:14px;font-weight:700">${k.name}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Created: ${k.created} • Last used: ${k.lastUsed}</div>
            </div>
            <span class="badge badge-success">${k.status}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <code style="flex:1;padding:10px 14px;background:#1e293b;color:#7dd3fc;border-radius:8px;font-size:13px;font-family:monospace">${k.key}</code>
            <button class="btn btn-outline btn-sm" onclick="navigator.clipboard&&navigator.clipboard.writeText('${k.key}').then(()=>showToast('API key copied!'))">📋 Copy</button>
            <button class="btn btn-outline btn-sm" onclick="showToast('API key rotated — update your integrations','warning')">🔄 Rotate</button>
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="showToast('New API key generated','success')">+ Generate New API Key</button>
    </div>`;
  }

  function renderBilling() {
    return `
    <div style="display:flex;flex-direction:column;gap:24px">
      <div class="card card-body">
        <div style="font-size:17px;font-weight:700;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)">💳 Current Plan</div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:24px;background:linear-gradient(135deg,var(--primary),var(--primary-light));border-radius:14px;color:#fff;margin-bottom:24px">
          <div>
            <div style="font-size:12px;opacity:0.7;text-transform:uppercase;letter-spacing:1px">Current Plan</div>
            <div style="font-size:28px;font-weight:800;margin-top:4px">Growth Plan</div>
            <div style="font-size:14px;opacity:0.8;margin-top:4px">₹12,999/month • Billed Monthly</div>
            <div style="font-size:13px;opacity:0.7;margin-top:8px">Next billing: April 1, 2024 • ₹12,999</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;opacity:0.7">Trial ends in</div>
            <div style="font-size:36px;font-weight:900;color:var(--accent)">8 days</div>
            <button class="btn btn-accent btn-sm" onclick="showToast('Subscription upgraded to annual plan — save 20%!','success')">Upgrade to Annual</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
          ${[
            { label:'Invoices This Month', val:'284 / Unlimited', icon:'🧾' },
            { label:'Vendor Profiles', val:'8 / Unlimited', icon:'🤝' },
            { label:'Users', val:'4 / 5', icon:'👥' }
          ].map(u => `
            <div style="padding:16px;background:var(--bg);border-radius:10px">
              <div style="font-size:20px;margin-bottom:8px">${u.icon}</div>
              <div style="font-size:14px;font-weight:700">${u.val}</div>
              <div style="font-size:12px;color:var(--text-muted)">${u.label}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:12px">
          <button class="btn btn-primary" onclick="showToast('Upgrade to Enterprise plan — contact sales','info')">Upgrade Plan</button>
          <button class="btn btn-outline" onclick="showToast('Annual plan saves ₹31,188/year','success')">Annual Plan (Save 20%)</button>
        </div>
      </div>
    </div>`;
  }

  function renderSecurity() {
    return `
    <div class="card card-body">
      <div style="font-size:17px;font-weight:700;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)">🔐 Security Settings</div>
      ${[
        { title:'Two-Factor Authentication', desc:'Add an extra layer of security with OTP via SMS or authenticator app', enabled:true, action:'Configure 2FA' },
        { title:'Session Timeout', desc:'Automatically log out after 30 minutes of inactivity', enabled:true, action:'Change Timeout' },
        { title:'Login Notifications', desc:'Get email alerts when a new device logs into your account', enabled:true, action:'Configure' },
        { title:'IP Whitelist', desc:'Restrict access to FreightFlow from specific IP addresses', enabled:false, action:'Set IPs' },
        { title:'Audit Log', desc:'Track all user actions and system changes for compliance', enabled:true, action:'View Log' }
      ].map(s => `
        <div style="display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #f1f5f9">
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600">${s.title}</div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:3px">${s.desc}</div>
          </div>
          <span class="badge ${s.enabled ? 'badge-success' : 'badge-gray'}">${s.enabled ? '✓ Enabled' : 'Disabled'}</span>
          <button class="btn btn-outline btn-sm" onclick="showToast('${s.action} opened','info')">${s.action}</button>
        </div>
      `).join('')}
      <div style="margin-top:24px;padding:16px;background:#fef2f2;border-radius:10px;border:1px solid #fecaca">
        <div style="font-size:14px;font-weight:700;color:#991b1b;margin-bottom:8px">⚠️ Danger Zone</div>
        <div style="display:flex;gap:12px">
          <button class="btn btn-danger btn-sm" onclick="showToast('Password change email sent','info')">Change Password</button>
          <button class="btn btn-danger btn-sm" onclick="showToast('All active sessions terminated','warning')">Sign Out All Devices</button>
        </div>
      </div>
    </div>`;
  }

  render();
};

function showInviteModal() {
  openModal(`
    <div class="modal modal-sm">
      <div class="modal-header">
        <div class="modal-title">👥 Invite Team Member</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input class="form-input" type="email" placeholder="colleague@yourcompany.in">
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <select class="form-input">
            <option>Finance Manager</option>
            <option>Operations</option>
            <option>Viewer</option>
            <option>Admin</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Message (optional)</label>
          <textarea class="form-input" rows="3" placeholder="I'm inviting you to manage freight invoices on FreightFlow..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="showToast('Invitation sent successfully ✉️');closeModal()">Send Invitation</button>
      </div>
    </div>
  `);
}
