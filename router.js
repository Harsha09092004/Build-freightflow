// ============================================================
// FreightFlow — Router & App Shell
// ============================================================

const Router = {
  currentPage: null,
  isLoggedIn: false,

  init() {
    console.log("Router initialized");

    // Check login state
    this.isLoggedIn = localStorage.getItem("ff_user") !== null;

    const hash = window.location.hash.replace("#", "") || "landing";
    this.navigate(hash);

    window.addEventListener("hashchange", () => {
      const page = window.location.hash.replace("#", "") || "landing";
      this.navigate(page);
    });
  },

  navigate(page) {
    const publicPages = ["landing", "login", "register", "forgot"];

    if (!this.isLoggedIn && !publicPages.includes(page)) {
      page = "login";
    }

    if (this.isLoggedIn && publicPages.includes(page) && page !== "landing") {
      page = "dashboard";
    }

    this.currentPage = page;

    window.location.hash = page;

    this.render(page);

    window.scrollTo(0, 0);
  },

  render(page) {
    const app = document.getElementById("app");
    if (!app) return;

    const publicPages = ["landing", "login", "register", "forgot"];

    if (publicPages.includes(page)) {
      app.innerHTML = "";

      if (page === "landing") return Pages.landing(app);
      if (page === "login") return Pages.login(app);
      if (page === "register") return Pages.register(app);
      if (page === "forgot") return Pages.forgot(app);
    }

    // App layout
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

            <a class="nav-item" onclick="Router.navigate('dashboard');return false;">
              Dashboard
            </a>

            <a class="nav-item" onclick="Router.navigate('invoices');return false;">
              Invoices
            </a>

            <a class="nav-item" onclick="Router.navigate('gst');return false;">
              GST Compliance
            </a>

            <a class="nav-item" onclick="Router.navigate('payments');return false;">
              Payments
            </a>

            <a class="nav-item" onclick="Router.navigate('vendors');return false;">
              Vendors
            </a>

            <a class="nav-item" onclick="Router.navigate('reports');return false;">
              Reports
            </a>

            <a class="nav-item" onclick="Router.navigate('settings');return false;">
              Settings
            </a>

          </nav>
        </aside>

        <div class="main-content">

          <header class="topbar">
            <div class="page-title" id="pageTitle">Dashboard</div>

            <button onclick="AppAuth.logout()" class="btn btn-outline btn-sm">
              Logout
            </button>
          </header>

          <main class="page-content" id="pageContent"></main>

        </div>
      </div>
    `;

    this.renderPage(page);
  },

  renderPage(page) {
    const content = document.getElementById("pageContent");
    if (!content) return;

    const pages = {
      dashboard: Pages.dashboard,
      invoices: Pages.invoices,
      gst: Pages.gst,
      payments: Pages.payments,
      vendors: Pages.vendors,
      reports: Pages.reports,
      settings: Pages.settings,
    };

    if (pages[page]) {
      pages[page](content);
    }
  },
};

const AppAuth = {
  login(email, password) {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    localStorage.setItem(
      "ff_user",
      JSON.stringify({
        email,
      })
    );

    Router.isLoggedIn = true;

    Router.navigate("dashboard");
  },

  logout() {
    localStorage.removeItem("ff_user");

    Router.isLoggedIn = false;

    Router.navigate("login");
  },
};

const Pages = {};
