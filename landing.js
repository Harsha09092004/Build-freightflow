// ============================================================
// FreightFlow — Landing Page
// ============================================================

Pages.landing = function(container) {
  container.innerHTML = `
  <div class="landing">
    <!-- NAV -->
    <nav class="landing-nav" id="landingNav">
      <a href="#landing" class="nav-logo" onclick="Router.navigate('landing');return false;">
        <div class="nav-logo-icon">🚛</div>
        <span class="nav-logo-text">FreightFlow</span>
      </a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#testimonials">Customers</a>
        <a href="#cta">Contact</a>
      </div>
      <div class="nav-actions">
        <button class="btn btn-outline" onclick="Router.navigate('login')">Log In</button>
        <button class="btn btn-accent" onclick="Router.navigate('register')">Start Free Trial →</button>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero-grid">
        <div class="hero-left">
          <div class="hero-eyebrow">
            <span>🏆</span> Trusted by 1,200+ Indian Logistics Companies
          </div>
          <h1>India's #1 <span>Freight Invoice</span> Automation Platform</h1>
          <p>Eliminate manual reconciliation errors, automate GST compliance, and get real-time visibility into your freight spend. Save ₹15–40L annually per company.</p>
          <div class="hero-actions">
            <button class="btn btn-accent btn-lg" onclick="Router.navigate('register')">
              🚀 Start Free 14-Day Trial
            </button>
            <button class="btn btn-lg" style="background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.25);" onclick="Router.navigate('dashboard')">
              View Live Demo →
            </button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="stat-value">₹2.3L Cr</div>
              <div class="stat-label">India Logistics Market</div>
            </div>
            <div class="hero-stat">
              <div class="stat-value">60%</div>
              <div class="stat-label">SMEs Still Manual</div>
            </div>
            <div class="hero-stat">
              <div class="stat-value">40%</div>
              <div class="stat-label">Invoice Error Rate</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div style="color:rgba(255,255,255,.5);font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px">Live Dashboard Preview</div>
          <div class="hero-card">
            <div class="hc-label">Monthly Freight Spend</div>
            <div class="hc-value">₹32.4 Lakhs</div>
            <div class="hc-change">↓ 8.3% vs last month — ₹2.9L saved</div>
          </div>
          <div style="margin:12px 0 8px;color:rgba(255,255,255,.5);font-size:11px">Recent Invoices</div>
          <div class="hero-invoice-row">
            <span>🔵</span>
            <span class="inv-vendor">Delhivery Ltd</span>
            <span class="inv-amount">₹3.36L</span>
            <span style="font-size:11px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:10px;font-weight:600">Matched</span>
          </div>
          <div class="hero-invoice-row">
            <span>🟠</span>
            <span class="inv-vendor">BlueDart Express</span>
            <span class="inv-amount">₹1.48L</span>
            <span style="font-size:11px;background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:10px;font-weight:600">Pending</span>
          </div>
          <div class="hero-invoice-row">
            <span>🔴</span>
            <span class="inv-vendor">DTDC Ltd</span>
            <span class="inv-amount">₹57,230</span>
            <span style="font-size:11px;background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:10px;font-weight:600">Mismatch</span>
          </div>
          <div style="margin-top:16px;padding:12px 16px;background:rgba(16,185,129,.15);border-radius:10px;border:1px solid rgba(16,185,129,.3)">
            <div style="font-size:12px;color:rgba(255,255,255,.6)">GST ITC Eligible (This Month)</div>
            <div style="font-size:20px;font-weight:800;color:#34d399;margin-top:4px">₹5.84 Lakhs →</div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <section class="stats-bar">
      <div class="stats-bar-grid">
        <div class="stat-item">
          <div class="val">1,247</div>
          <div class="lbl">Companies Using FreightFlow</div>
        </div>
        <div class="stat-item">
          <div class="val">₹847 Cr</div>
          <div class="lbl">Invoices Processed This Year</div>
        </div>
        <div class="stat-item">
          <div class="val">98.7%</div>
          <div class="lbl">Reconciliation Accuracy</div>
        </div>
        <div class="stat-item">
          <div class="val">40 hrs</div>
          <div class="lbl">Saved Per Month Per Team</div>
        </div>
      </div>
    </section>

    <!-- PROBLEM SECTION -->
    <section style="padding:80px 5%;background:#fff;max-width:1200px;margin:0 auto">
      <div style="text-align:center;margin-bottom:48px">
        <div class="section-tag">The Problem We Solve</div>
        <div class="section-title" style="text-align:center">Logistics Finance is Still Broken in India</div>
        <div class="section-subtitle" style="margin:14px auto 0;text-align:center">Most Indian logistics SMEs lose 3-8% of revenue to invoice errors, GST mismatches, and delayed reconciliation</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
        ${[
          { icon: '📋', title: 'Manual Invoice Processing', desc: '78% of logistics companies in India still use Excel or paper-based systems. Each invoice takes 45–90 minutes to verify manually.', impact: '₹12L lost/year per company' },
          { icon: '📊', title: 'GST Compliance Errors', desc: 'GSTR-2B mismatches lead to blocked ITC worth crores. Businesses miss input credit deadlines costing significant tax liability.', impact: '18-22% ITC leakage' },
          { icon: '⏰', title: 'Payment Delays', desc: 'Without proper aging analysis, 35% of invoices become overdue. Vendors charge interest on delayed payments (1.5-2% per month).', impact: '₹8L interest cost/year' }
        ].map(p => `
          <div style="padding:28px;border-radius:14px;background:#fef2f2;border:1px solid #fecaca;text-align:center">
            <div style="font-size:40px;margin-bottom:16px">${p.icon}</div>
            <h3 style="font-size:17px;font-weight:700;color:#991b1b;margin-bottom:10px">${p.title}</h3>
            <p style="font-size:14px;color:#7f1d1d;line-height:1.7;margin-bottom:16px">${p.desc}</p>
            <div style="background:#fca5a5;color:#7f1d1d;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block">${p.impact}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features-section" id="features">
      <div style="max-width:1200px;margin:0 auto">
        <div class="section-tag">Core Features</div>
        <div class="section-title">Everything You Need to Automate<br>Freight Finance Operations</div>
        <div class="section-subtitle">Built specifically for Indian logistics companies. GST-native, Tally-compatible, WhatsApp-ready.</div>
        <div class="features-grid">
          ${[
            { icon: '🧾', bg: '#dbeafe', title: 'Smart Invoice Automation', desc: 'AI-powered PDF & email invoice extraction. Auto-match with PO, LR numbers. Reduce manual entry by 95%.' },
            { icon: '📊', bg: '#dcfce7', title: 'GSTR-2B Reconciliation', desc: 'Auto-compare with GSTN portal data. Get matched/mismatched/missing ITC status instantly. Never miss a credit claim.' },
            { icon: '💰', bg: '#fef9c3', title: 'Payment Aging Analysis', desc: '30/60/90 day aging buckets. Automated overdue alerts via WhatsApp & email. One-click payment scheduling.' },
            { icon: '⭐', bg: '#ede9fe', title: 'Vendor Scorecard', desc: 'Rate vendors on on-time delivery, accuracy, dispute frequency. Negotiate better rates with data-backed insights.' },
            { icon: '📈', bg: '#fff7ed', title: 'Freight Analytics', desc: 'Route-wise cost analysis. Monthly spend trends. Predictive forecasting. Compare against industry benchmarks.' },
            { icon: '🔗', bg: '#f0fdf4', title: 'ERP Integrations', desc: 'Connect with Tally, SAP, Zoho Books, Busy, and QuickBooks. Bi-directional sync. Zero double entry.' }
          ].map(f => `
            <div class="feature-card">
              <div class="feature-icon" style="background:${f.bg}">${f.icon}</div>
              <div class="feature-title">${f.title}</div>
              <div class="feature-desc">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section style="padding:80px 5%;background:#f8fafc">
      <div style="max-width:1100px;margin:0 auto;text-align:center">
        <div class="section-tag">How It Works</div>
        <div class="section-title" style="text-align:center">Go Live in 48 Hours</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:48px">
          ${[
            { step: '01', icon: '🏢', title: 'Onboard Company', desc: 'Add your GSTIN, PAN, and company details. Import existing vendor list.' },
            { step: '02', icon: '📥', title: 'Connect Invoices', desc: 'Upload PDFs, connect email inbox, or integrate with your ERP via API.' },
            { step: '03', icon: '🤖', title: 'Auto-Reconcile', desc: 'AI matches invoices with POs, GRNs, and GSTR-2B data automatically.' },
            { step: '04', icon: '📊', title: 'Track & Report', desc: 'Get real-time dashboards, aging alerts, and GST compliance reports.' }
          ].map(s => `
            <div style="padding:28px 20px;border-radius:14px;background:#fff;border:1px solid var(--border);text-align:center;position:relative">
              <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:12px">STEP ${s.step}</div>
              <div style="font-size:40px;margin-bottom:16px">${s.icon}</div>
              <h3 style="font-size:16px;font-weight:700;color:var(--primary);margin-bottom:10px">${s.title}</h3>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.7">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="pricing-section" id="pricing">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center">
          <div class="section-tag">Transparent Pricing</div>
          <div class="section-title" style="text-align:center">Plans for Every Size of Business</div>
          <div class="section-subtitle" style="margin:14px auto 0;text-align:center">No hidden charges. Cancel anytime. All plans include free onboarding support.</div>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-plan">Starter</div>
            <div class="pricing-price">
              <span style="font-size:18px;color:var(--primary);margin-bottom:8px">₹</span>
              <span class="price">4,999</span>
              <span class="period">/month</span>
            </div>
            <div class="pricing-desc">Perfect for small logistics companies processing up to 200 invoices/month</div>
            <ul class="pricing-features">
              <li>Up to 200 invoices/month</li>
              <li>5 vendor profiles</li>
              <li>GSTR-2B reconciliation</li>
              <li>Basic aging reports</li>
              <li>Email support (48hr)</li>
              <li>WhatsApp alerts</li>
              <li>1 user account</li>
            </ul>
            <button class="btn btn-outline w-full" onclick="Router.navigate('register')" style="justify-content:center">Start Free Trial</button>
          </div>

          <div class="pricing-card popular">
            <div class="pricing-popular-badge">🔥 Most Popular</div>
            <div class="pricing-plan">Growth</div>
            <div class="pricing-price">
              <span style="font-size:18px;color:var(--primary);margin-bottom:8px">₹</span>
              <span class="price">12,999</span>
              <span class="period">/month</span>
            </div>
            <div class="pricing-desc">For growing logistics businesses with 500–2000 invoices and multiple vendors</div>
            <ul class="pricing-features">
              <li>Unlimited invoices</li>
              <li>Unlimited vendors</li>
              <li>Advanced GST + ITC tracking</li>
              <li>Full aging & payment analysis</li>
              <li>Vendor performance scoring</li>
              <li>CSV/PDF/Excel exports</li>
              <li>Tally & Zoho integration</li>
              <li>5 user accounts</li>
              <li>Priority support (4hr)</li>
            </ul>
            <button class="btn btn-accent w-full" onclick="Router.navigate('register')" style="justify-content:center">Start Free Trial →</button>
          </div>

          <div class="pricing-card">
            <div class="pricing-plan">Enterprise</div>
            <div class="pricing-price">
              <span class="price" style="font-size:32px">Custom</span>
            </div>
            <div class="pricing-desc">For large 3PL operators, freight aggregators, and enterprise logistics groups</div>
            <ul class="pricing-features">
              <li>Multi-entity support</li>
              <li>Custom integrations (SAP, Oracle)</li>
              <li>Dedicated account manager</li>
              <li>Custom reports & dashboards</li>
              <li>API access (unlimited calls)</li>
              <li>On-premise deployment option</li>
              <li>SLA-backed 99.9% uptime</li>
              <li>Unlimited users</li>
              <li>24/7 phone support</li>
            </ul>
            <button class="btn btn-primary w-full" onclick="showToast('Sales team will contact you shortly!','info')" style="justify-content:center">Contact Sales</button>
          </div>
        </div>
        <div style="text-align:center;margin-top:28px;font-size:14px;color:var(--text-muted)">
          ✅ 14-day free trial &nbsp;•&nbsp; ✅ No credit card required &nbsp;•&nbsp; ✅ Cancel anytime &nbsp;•&nbsp; ✅ Free data migration
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section" id="testimonials">
      <div style="max-width:1200px;margin:0 auto">
        <div style="text-align:center">
          <div class="section-tag">Customer Success Stories</div>
          <div class="section-title" style="text-align:center">Trusted by India's Best Logistics Teams</div>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <div class="testimonial-text">"FreightFlow reduced our invoice reconciliation time from 5 days to 4 hours per month. We recovered ₹18L in blocked GST credits in the first quarter itself."</div>
            <div class="testimonial-author">
              <div class="testimonial-avatar">SK</div>
              <div>
                <div class="testimonial-name">Suresh Kumar</div>
                <div class="testimonial-role">CFO, Bharat Cargo Solutions, Chennai</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <div class="testimonial-text">"The vendor scorecard feature helped us identify that DTDC was causing 60% of our delivery complaints. We renegotiated terms and saved ₹24L in a year."</div>
            <div class="testimonial-author">
              <div class="testimonial-avatar">PA</div>
              <div>
                <div class="testimonial-name">Priya Anand</div>
                <div class="testimonial-role">Operations Head, Shree Ram Logistics, Mumbai</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="stars">★★★★☆</div>
            <div class="testimonial-text">"We were manually reconciling 800+ invoices per month in Excel. FreightFlow automated 95% of it. Our finance team now focuses on analysis, not data entry."</div>
            <div class="testimonial-author">
              <div class="testimonial-avatar">VM</div>
              <div>
                <div class="testimonial-name">Vijay Mehta</div>
                <div class="testimonial-role">Founder, FastTrack Freight, Ahmedabad</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:center;gap:48px;margin-top:48px;padding:28px;background:var(--bg);border-radius:16px;flex-wrap:wrap">
          ${['Mahindra Logistics', 'Safexpress', 'Rivigo', 'Spoton Logistics', 'Porter', 'IntrCity SmartBus'].map(c => `
            <div style="font-size:16px;font-weight:700;color:var(--text-muted)">${c}</div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" id="cta">
      <h2>Stop Losing Money on Freight Invoices</h2>
      <p>Join 1,200+ Indian logistics companies who have automated their freight finance with FreightFlow</p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-accent btn-lg" onclick="Router.navigate('register')">
          🚀 Start Free 14-Day Trial
        </button>
        <button class="btn btn-lg" style="background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.3);" onclick="showToast('Demo scheduled! Our team will contact you.','success')">
          📅 Schedule a Demo
        </button>
      </div>
      <div style="margin-top:24px;font-size:13px;color:rgba(255,255,255,.5)">
        ✅ No credit card required &nbsp;•&nbsp; ✅ Free onboarding &nbsp;•&nbsp; ✅ Cancel anytime
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-grid" style="max-width:1200px;margin:0 auto">
        <div class="footer-logo">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="width:36px;height:36px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px">🚛</div>
            <h3>FreightFlow</h3>
          </div>
          <p>India's leading freight invoice automation and reconciliation platform. Purpose-built for Indian logistics SMEs.</p>
          <div style="margin-top:16px;font-size:13px;color:rgba(255,255,255,.4)">
            CIN: U72900MH2022PTC123456<br>
            GSTIN: 27AABCF1234G1ZX
          </div>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Invoice Automation</a></li>
            <li><a href="#">GST Reconciliation</a></li>
            <li><a href="#">Payment Tracking</a></li>
            <li><a href="#">Vendor Analytics</a></li>
            <li><a href="#">API Access</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Status Page</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom" style="max-width:1200px;margin:0 auto">
        <p>© 2024 FreightFlow Technologies Pvt Ltd. All rights reserved. Made with ❤️ in India 🇮🇳</p>
        <p>Mumbai • Chennai • Bangalore • Delhi • Hyderabad</p>
      </div>
    </footer>
  </div>
  <div class="toast-container" id="toastContainer"></div>
  `;
};
