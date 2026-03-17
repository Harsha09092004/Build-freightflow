// ============================================================
// FreightFlow — Auth Pages (Login, Register, Forgot Password)
// ============================================================

Pages.login = function(container) {
  container.innerHTML = `
  <div class="auth-layout">
    <div class="auth-left">
      <div class="auth-left-content">
        <div style="font-size:56px">🚛</div>
        <h2>Welcome Back to FreightFlow</h2>
        <p>India's most trusted freight invoice automation platform. Reconcile invoices 10x faster.</p>
        <div class="auth-feature-list">
          ${[
            { icon: '🧾', text: 'Auto-reconcile 500+ invoices in minutes' },
            { icon: '📊', text: 'Real-time GSTR-2B matching & ITC tracking' },
            { icon: '💰', text: 'Never miss a payment — aging alerts built in' },
            { icon: '⭐', text: 'Vendor performance scores at a glance' }
          ].map(f => `
            <div class="auth-feature-item">
              <div class="auth-feature-icon" style="background:rgba(249,115,22,.15)">${f.icon}</div>
              <span class="auth-feature-text">${f.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-form-container">
        <div style="margin-bottom:32px">
          <div style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-bottom:24px;cursor:pointer" onclick="Router.navigate('landing')">
            <div style="width:32px;height:32px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🚛</div>
            <span style="font-weight:800;color:var(--primary);font-size:18px">FreightFlow</span>
          </div>
        </div>
        <div class="auth-form-header">
          <h1>Sign in to your account</h1>
          <p>Enter your company email and password to continue</p>
        </div>

        <div class="form-group">
          <label class="form-label">Company Email</label>
          <input class="form-input" type="email" id="loginEmail" placeholder="finance@yourcompany.in" value="demo@freightflow.in">
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;justify-content:space-between">
            Password
            <a href="#forgot" onclick="Router.navigate('forgot');return false;" style="font-weight:600;color:var(--primary);font-size:13px;text-decoration:none">Forgot password?</a>
          </label>
          <div style="position:relative">
            <input class="form-input" type="password" id="loginPassword" placeholder="Enter your password" value="demo1234" style="padding-right:44px">
            <button onclick="togglePass('loginPassword',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:16px">👁</button>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
          <input type="checkbox" id="rememberMe" style="width:16px;height:16px;cursor:pointer">
          <label for="rememberMe" style="font-size:13px;color:var(--text-muted);cursor:pointer">Remember me for 30 days</label>
        </div>

        <button class="btn btn-primary w-full btn-lg" style="justify-content:center" onclick="handleLogin()">
          Sign In to FreightFlow
        </button>

        <div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #86efac;font-size:13px;color:#166534">
          🔑 Demo credentials: demo@freightflow.in / demo1234
        </div>

        <div class="auth-footer">
          Don't have an account? <a href="#register" onclick="Router.navigate('register');return false;">Create free account →</a>
        </div>
      </div>
    </div>
  </div>
  <div class="toast-container" id="toastContainer"></div>
  `;
};

Pages.register = function(container) {
  container.innerHTML = `
  <div class="auth-layout">
    <div class="auth-left">
      <div class="auth-left-content">
        <div style="font-size:56px">🚀</div>
        <h2>Start Your Free 14-Day Trial</h2>
        <p>No credit card required. Full access to all Growth plan features. Cancel anytime.</p>
        <div class="auth-feature-list">
          ${[
            { icon: '🆓', text: '14 days free — no credit card needed' },
            { icon: '🚀', text: 'Go live in 48 hours with free onboarding' },
            { icon: '📞', text: 'Dedicated support during trial period' },
            { icon: '💯', text: '98.7% reconciliation accuracy guaranteed' }
          ].map(f => `
            <div class="auth-feature-item">
              <div class="auth-feature-icon" style="background:rgba(249,115,22,.15)">${f.icon}</div>
              <span class="auth-feature-text">${f.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-form-container">
        <div style="margin-bottom:24px;cursor:pointer" onclick="Router.navigate('landing')">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:32px;height:32px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🚛</div>
            <span style="font-weight:800;color:var(--primary);font-size:18px">FreightFlow</span>
          </div>
        </div>
        <div class="auth-form-header">
          <h1>Create your account</h1>
          <p>Set up FreightFlow for your logistics company</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" type="text" id="regName" placeholder="Rajesh Kumar">
          </div>
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input class="form-input" type="text" id="regCompany" placeholder="Your Logistics Pvt Ltd">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Company Email</label>
          <input class="form-input" type="email" id="regEmail" placeholder="finance@yourcompany.in">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">GSTIN</label>
            <input class="form-input" type="text" id="regGstin" placeholder="27AABCM1234F1ZX" maxlength="15">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input class="form-input" type="tel" id="regPhone" placeholder="+91 98765 43210">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" id="regPassword" placeholder="Min 8 characters">
          <div class="form-hint">Use a mix of letters, numbers, and symbols</div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:20px">
          <input type="checkbox" id="regTerms" style="width:16px;height:16px;cursor:pointer;margin-top:2px">
          <label for="regTerms" style="font-size:13px;color:var(--text-muted);cursor:pointer;line-height:1.5">
            I agree to FreightFlow's <a href="#" style="color:var(--primary)">Terms of Service</a> and <a href="#" style="color:var(--primary)">Privacy Policy</a>
          </label>
        </div>

        <button class="btn btn-accent w-full btn-lg" style="justify-content:center" onclick="handleRegister()">
          🚀 Create Free Account
        </button>

        <div class="auth-footer">
          Already have an account? <a href="#login" onclick="Router.navigate('login');return false;">Sign in →</a>
        </div>
      </div>
    </div>
  </div>
  <div class="toast-container" id="toastContainer"></div>
  `;
};

Pages.forgot = function(container) {
  container.innerHTML = `
  <div class="auth-layout">
    <div class="auth-left" style="background:linear-gradient(135deg,#0f1f33,#1e3a5f)">
      <div class="auth-left-content">
        <div style="font-size:56px">🔐</div>
        <h2>Reset Your Password</h2>
        <p>We'll send a secure reset link to your registered company email address.</p>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-form-container">
        <div style="margin-bottom:24px;cursor:pointer" onclick="Router.navigate('landing')">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:32px;height:32px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🚛</div>
            <span style="font-weight:800;color:var(--primary);font-size:18px">FreightFlow</span>
          </div>
        </div>
        <div class="auth-form-header">
          <h1>Forgot your password?</h1>
          <p>Enter your email and we'll send a reset link</p>
        </div>

        <div class="form-group">
          <label class="form-label">Company Email</label>
          <input class="form-input" type="email" id="forgotEmail" placeholder="finance@yourcompany.in">
        </div>

        <button class="btn btn-primary w-full btn-lg" style="justify-content:center" onclick="handleForgot()">
          Send Reset Link
        </button>

        <div class="auth-footer">
          Remember your password? <a href="#login" onclick="Router.navigate('login');return false;">Back to sign in</a>
        </div>
      </div>
    </div>
  </div>
  <div class="toast-container" id="toastContainer"></div>
  `;
};

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function handleLogin() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;
  AppAuth.login(email, password);
}

function handleRegister() {
  const name = document.getElementById('regName')?.value;
  const company = document.getElementById('regCompany')?.value;
  const email = document.getElementById('regEmail')?.value;
  const terms = document.getElementById('regTerms')?.checked;
  if (!name || !company || !email) { showToast('Please fill in all required fields', 'error'); return; }
  if (!terms) { showToast('Please accept the terms of service', 'warning'); return; }
  AppAuth.register({ name, company, email });
}

function handleForgot() {
  const email = document.getElementById('forgotEmail')?.value;
  if (!email) { showToast('Enter your email address', 'error'); return; }
  showToast('Reset link sent to ' + email + ' ✉️');
  setTimeout(() => Router.navigate('login'), 2000);
}
