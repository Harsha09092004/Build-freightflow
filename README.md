# 🚛 FreightFlow — Enterprise Freight Invoice Automation Platform

## Overview
FreightFlow is India's #1 freight invoice automation and reconciliation SaaS platform for Indian logistics SMEs. Built for the ₹2.3 Lakh Crore Indian logistics market, it solves the #1 pain point: **lack of visibility + operational inefficiency** in freight finance.

## 🚀 Live Application

### Entry Points
| URL | Description |
|-----|-------------|
| `index.html` | Landing page (default) |
| `index.html#landing` | Marketing landing page |
| `index.html#login` | Login page (demo: demo@freightflow.in / demo1234) |
| `index.html#register` | New company registration |
| `index.html#dashboard` | Main dashboard (requires login) |
| `index.html#invoices` | Invoice management |
| `index.html#gst` | GST compliance & GSTR-2B reconciliation |
| `index.html#payments` | Payments & aging analysis |
| `index.html#vendors` | Vendor performance scoring |
| `index.html#reports` | Reports & analytics |
| `index.html#settings` | Company settings |

## ✅ Completed Features

### 1. Landing Page
- Hero section with value proposition
- Problem statement with Indian logistics context
- 6 feature cards with enterprise features
- 4-step "How it Works" section
- 3-tier pricing (₹4,999 / ₹12,999 / Custom)
- Customer testimonials (Indian companies)
- Logo cloud of major Indian logistics companies
- CTA section with trial signup
- Complete footer with company details

### 2. Dashboard
- 4 primary KPI cards (Total Invoices, Pending, Overdue, GST ITC)
- 4 secondary metric cards
- Revenue vs Freight Cost combo chart (line + bar)
- Invoice Status donut chart
- Recent activity feed (8 events)
- Quick action buttons (6 actions)
- Top vendors by spend widget
- 4-item action required alerts panel

### 3. Invoice Management
- 20 realistic Indian logistics invoices
- Columns: Invoice #, Vendor, Date, Amount, GST, Total, HSN, Route, Reconcile Status, Payment Status
- Sort by any column (asc/desc)
- Filter by status, vendor, and search text
- Status summary cards (Total/Paid/Pending/Overdue/Disputed)
- Bulk select with checkboxes
- Bulk Approve / Bulk Pay / Bulk Export actions
- Upload Invoice modal (PDF/CSV/Email)
- Invoice Detail modal with line items and ITC info
- CSV export (downloads real file)

### 4. GST Compliance Module
- GST Health Score gauge meter (87/100)
- 3-card ITC summary (Eligible ₹58.4L / Blocked ₹7.2L / Pending ₹11.2L)
- GSTR-2B reconciliation table (matched/mismatched/missing/pending)
- HSN code summary (9965/9967/9968)
- ITC Ledger with 6-month history
- GST Filing Calendar with status tracking
- Compliance alerts panel
- Download GSTR-2B report (CSV)

### 5. Payments & Aging Analysis
- 5 aging bucket cards (Current/1-30/31-60/61-90/90+ days)
- Aging distribution bar chart
- Progress bars with % breakdown
- Vendor-wise outstanding table
- Payment Schedule with NEFT/RTGS status
- Payment calendar view (March 2024)
- Payment history table with UTR numbers
- Bulk payment reminders
- Payment optimization tip panel

### 6. Vendor Performance Scoring
- 8 vendor profiles (Delhivery, BlueDart, DTDC, Gati, VRL, TCI, XpressBees, Ecom Express)
- Color-coded scores: Green (90+) / Yellow (70-89) / Red (<70)
- Sortable scorecard table
- On-time %, Accuracy %, Dispute count with progress bars
- 8-week trend sparklines
- Bar chart (top 5 by score)
- Donut chart (spend distribution)
- Vendor detail modal with full history
- At-risk vendor panel with action plans
- Export scorecard CSV

### 7. Reports & Analytics
- AI Predictive Insights banner
- 4 KPI summary cards
- Monthly Freight vs Revenue combo chart
- Vendor spend distribution donut chart
- Route delay horizontal bar chart
- Route performance analysis table
- Trend charts (freight ratio + processing efficiency)
- Industry benchmark comparison table
- Export CSV/PDF functionality

### 8. Settings
- Company profile form (GSTIN, PAN, address)
- User management (4 users, invite modal)
- Notification preferences (Email/WhatsApp/SMS per alert type)
- 8 integration cards (Tally, Zoho, SAP, WhatsApp, Gmail, GSTN, banks)
- API key management with copy/rotate
- Billing & plan information
- Security settings with 2FA, audit log

### 9. Auth Pages
- Login with email/password (demo credentials shown)
- Register with company name, GSTIN, phone
- Forgot password flow
- Split-screen design (marketing left, form right)

## 📊 Mock Data
- **Vendors**: Delhivery, BlueDart, DTDC, Gati Logistics, VRL Logistics, TCI Express, XpressBees, Ecom Express
- **Invoice Range**: ₹28,000 to ₹5,31,000
- **Routes**: Mumbai, Chennai, Delhi, Bangalore, Hyderabad, Kolkata, Pune, Ahmedabad
- **HSN Codes**: 9965, 9967, 9968
- **GST Rate**: 18% (standard freight)

## 🏗️ Technical Stack
| Layer | Technology |
|-------|-----------|
| HTML | HTML5 with semantic elements |
| CSS | Custom CSS (36KB) with CSS variables, responsive grid |
| Charts | Custom Canvas-based chart library (combo, donut, bar, hbar, line, sparkline, gauge) |
| Data | In-memory mock data (js/data.js) |
| Routing | Hash-based SPA router |
| State | localStorage for auth persistence |
| Fonts | Inter (Google Fonts) |
| Icons | SVG inline icons |

## 💰 Business Model
| Plan | Price | Target |
|------|-------|--------|
| Starter | ₹4,999/mo | <200 invoices/month |
| Growth | ₹12,999/mo | 500-2000 invoices |
| Enterprise | Custom | Large 3PL operators |

**Target Market**: 12,000+ Indian logistics SMEs processing >200 invoices/month
**TAM**: ₹600 Crore (SaaS opportunity in Indian freight finance)
**Revenue Target Year 1**: ₹3.5 Crore ARR (225 Growth customers)

## 🔮 Roadmap (Not Yet Built)
- [ ] Backend API (Node.js + PostgreSQL)
- [ ] Real PDF invoice OCR extraction
- [ ] Live GSTN API integration
- [ ] WhatsApp Business API alerts
- [ ] Mobile app (React Native)
- [ ] Tally plugin (official SDK)
- [ ] Multi-entity support
- [ ] Bank statement auto-reconciliation
- [ ] AI-powered anomaly detection

## 📁 File Structure
```
index.html          — App entry point
css/
  main.css          — All styles (3600+ lines)
js/
  data.js           — Mock data + helper functions
  charts.js         — Canvas chart library
  router.js         — SPA router + auth
  components.js     — Shared UI components
  app.js            — App bootstrap
  pages/
    landing.js      — Marketing landing page
    auth.js         — Login/Register/Forgot
    dashboard.js    — Main dashboard
    invoices.js     — Invoice management
    gst.js          — GST compliance
    payments.js     — Payments & aging
    vendors.js      — Vendor scoring
    reports.js      — Analytics
    settings.js     — Settings
README.md           — This file
```
