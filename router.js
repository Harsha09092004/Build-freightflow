// ============================================================
// FreightFlow — Router & App Shell
// ============================================================

const Router = {
  currentPage: null,
  isLoggedIn: false,

  init() {
    // Check auth
    this.isLoggedIn = localStorage.getItem('ff_user') !== null;
    // Default to login if not authenticated
    const hash = window.location.hash.slice(1) || 'landing';
    this.navigate(hash);
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.slice(1) || 'landing';
      this.navigate(page);
    });
  },

  navigate(page) {
    // Auth guard
    const publicPages = ['landing', 'login', 'register', 'forgot'];
    if (!this.isLoggedIn && !publicPages.includes(page)) {
      page = 'login';
    }
    if (this.isLoggedIn && publicPages.includes(page) && page !== 'landing') {
      page = 'dashboard';
    }

    this.currentPage = page;
    window.location.hash = page;
    this.render(page);
    this.updateNav(page);
    window.scrollTo(0, 0);
  },

  render(page) {
    const app = document.getElementById('app');
    if (!app) return;

    const isPublic = ['landing', 'login', 'register', 'forgot'].includes(page);

    if (isPublic) {
      app.innerHTML = '';
      if (page === 'landing') { Pages.landing(app); return; }
      if (page === 'login') { Pages.login(app); return; }
      if (page === 'register') { Pages.register(app); return; }
      if (page === 'forgot') { Pages.forgot(app); return; }
    }

    // App shell
    app.innerHTML = `
      <div class="app-layout">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-logo">
            <div class="logo-icon">🚛</div>
            <div class="logo-text">
              <h2>FreightFlow</h2>
              <p>Invoice Automation</p>
            </div>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-section-title">Main</div>
            <a class="nav-item" data-page="dashboard" onclick="Router.navigate('dashboard');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Dashboard
            </a>
            <a class="nav-item" data-page="invoices" onclick="Router.navigate('invoices');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Invoices
              <span class="nav-badge">7</span>
            </a>
            <a class="nav-item" data-page="gst" onclick="Router.navigate('gst');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              GST Compliance
            </a>
            <div class="nav-section-title" style="margin-top:8px">Finance</div>
            <a class="nav-item" data-page="payments" onclick="Router.navigate('payments');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payments & Aging
            </a>
            <a class="nav-item" data-page="vendors" onclick="Router.navigate('vendors');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Vendor Scores
            </a>
            <a class="nav-item" data-page="reports" onclick="Router.navigate('reports');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Reports & Analytics
            </a>
            <div class="nav-section-title" style="margin-top:8px">Account</div>
            <a class="nav-item" data-page="settings" onclick="Router.navigate('settings');return false;" href="#">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>
              Settings
            </a>
          </nav>
          <div class="sidebar-footer">
            <div class="sidebar-user" onclick="Router.navigate('settings')">
              <div class="user-avatar">${FF_DATA.user.avatar}</div>
              <div class="user-info">
                <div class="user-name">${FF_DATA.user.name}</div>
                <div class="user-company">${FF_DATA.user.plan} Plan</div>
              </div>
            </div>
          </div>
        </aside>

        <div class="main-content">
          <header class="topbar">
            <div class="topbar-left" style="display:flex;align-items:center;gap:12px">
              <button class="btn btn-ghost btn-icon" id="menuToggle" onclick="toggleSidebar()" style="display:none;@media(max-width:900px){display:flex}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <div class="page-title" id="pageTitle">Dashboard</div>
                <div class="breadcrumb" id="pageBreadcrumb">FreightFlow / Dashboard</div>
              </div>
            </div>
            <div class="topbar-right">
              <div class="topbar-search" onclick="showToast('Search coming soon','info')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Search invoices, vendors...
              </div>
              <div class="notification-btn" onclick="showToast('3 new alerts: 2 overdue invoices, 1 GST mismatch','warning')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span class="notif-dot"></span>
              </div>
              <button class="btn btn-outline btn-sm" onclick="AppAuth.logout()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </header>
          <main class="page-content" id="pageContent"></main>
        </div>
      </div>
      <div class="toast-container" id="toastContainer"></div>
      <div id="modalContainer"></div>
    `;

    this.updateNav(page);
    this.setPageTitle(page);
    this.renderPage(page);
  },

  renderPage(page) {
    const content = document.getElementById('pageContent');
    if (!content) return;
    const pageMap = {
      dashboard: Pages.dashboard,
      invoices: Pages.invoices,
      gst: Pages.gst,
      payments: Pages.payments,
      vendors: Pages.vendors,
      reports: Pages.reports,
      settings: Pages.settings
    };
    if (pageMap[page]) pageMap[page](content);
  },

  updateNav(page) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-page') === page);
    });
  },

  setPageTitle(page) {
    const titles = {
      dashboard: ['Dashboard', 'Overview of your freight operations'],
      invoices: ['Invoice Management', 'Manage & reconcile freight invoices'],
      gst: ['GST Compliance', 'GSTR-2B reconciliation & ITC tracking'],
      payments: ['Payments & Aging', 'Payment tracking & outstanding analysis'],
      vendors: ['Vendor Performance', 'Scorecard & performance analytics'],
      reports: ['Reports & Analytics', 'Business intelligence & insights'],
      settings: ['Settings', 'Company profile & system configuration']
    };
    const t = titles[page] || ['FreightFlow', ''];
    const el = document.getElementById('pageTitle');
    const bc = document.getElementById('pageBreadcrumb');
    if (el) el.textContent = t[0];
    if (bc) bc.textContent = `FreightFlow / ${t[0]}`;
  }
};

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

const AppAuth = {
  login(email, password) {
    if (!email || !password) { showToast('Enter email and password', 'error'); return; }
    localStorage.setItem('ff_user', JSON.stringify({ email, name: FF_DATA.user.name }));
    Router.isLoggedIn = true;
    showToast('Welcome back, ' + FF_DATA.user.name + '! 👋');
    Router.navigate('dashboard');
  },

  register(data) {
    localStorage.setItem('ff_user', JSON.stringify(data));
    Router.isLoggedIn = true;
    showToast('Account created! Welcome to FreightFlow 🚛');
    Router.navigate('dashboard');
  },

  logout() {
    localStorage.removeItem('ff_user');
    Router.isLoggedIn = false;
    Router.navigate('login');
  }
};

const Pages = {};
