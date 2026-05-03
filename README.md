# FlowLedger 💰

> A lightweight financial management dashboard for micro and small businesses.

---

## 🎨 Links & Resources

### Design & Prototype
- **Design File:** [Figma Design](https://www.figma.com/design/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-2&t=vEP967IerTZBUgjO-1)
- **Interactive Prototype (Light Mode):** [Figma Prototype Light](https://www.figma.com/proto/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-1139&p=f&viewport=343%2C255%2C0.06&t=tZCmTT4ynHq1XqVq-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1003%3A1139&show-proto-sidebar=1)
- **Interactive Prototype (Dark Mode):** [Figma Prototype Dark](https://www.figma.com/proto/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-2&p=f&viewport=269%2C261%2C0.06&t=tZCmTT4ynHq1XqVq-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1017%3A2&show-proto-sidebar=1)

### Live Links & API Documentation
- **Live Application:** [https://flow-ledger-alpha.vercel.app/](https://flow-ledger-alpha.vercel.app/)
- **Backend Server:** [https://flowledger-backend-2yxh.onrender.com/](https://flowledger-backend-2yxh.onrender.com/)
- **Postman API Docs:** [View API Documentation](https://documenter.getpostman.com/view/50840833/2sBXqKofgz)
- **YouTube Demo:** [Watch Demo](https://youtu.be/DN1nKqy5VRI?si=cAcajfkswwy3c-eZ)

---

## 📌 Description

FlowLedger is a web-based SaaS application that helps small business owners and freelancers manage their finances without the complexity of a full ERP system. It provides a clean, intuitive interface for creating invoices, tracking payment statuses, monitoring cash flow, and managing recurring transactions — all in one place.

---

## 🧩 Problem Statement

Micro and small businesses often rely on spreadsheets or paper records to manage invoices and cash flow. This approach is error-prone, hard to scale, and offers no real-time visibility into financial health.

**FlowLedger solves this by offering:**
- A fast, no-fuss invoicing system with PDF export
- Real-time payment status tracking
- Cash flow monitoring with threshold-based visual alerts
- Automated recurring transaction handling
- Client management and insights

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 Invoice Management | Create, edit, send, and delete invoices with line items |
| 🖨️ PDF Export | Export professional invoices as PDF for printing or sharing |
| 💳 Payment Tracking | Track invoices as Paid, Pending, or Overdue |
| 📈 Financial Insights | Get detailed breakdowns of revenue and expenses |
| 📊 Cash Flow Dashboard | Visual balance overview with threshold-based alerts |
| 🔁 Recurring Transactions | Auto-generate fixed expenses/subscriptions on a schedule |
| 📱 WhatsApp Share | Directly share invoice details via WhatsApp |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios, Recharts, React Helmet (SEO) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| Styling | Vanilla CSS, Tailwind CSS |
| PDF Gen | html2pdf.js |

---

## 🗂 Folder Structure

```
flowledger/
├── frontend/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Layout/                # Layout components (Sidebar, TopNav)
│   │   │   └── (other UI components)
│   │   ├── pages/                    # Route-level pages (Dashboard, Invoices, CashFlow, etc.)
│   │   ├── services/                 # API call wrappers (api.js, invoiceService.js, etc.)
│   │   ├── context/                  # Global state management (AuthContext, ThemeContext)
│   │   ├── utils/                    # Frontend utilities (format.js, whatsapp.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js

├── backend/                         # Express Backend
│   ├── config/                       # Database configuration (db.js)
│   ├── controllers/                  # Business logic for routes (authController, invoiceController, ...)
│   ├── models/                       # Mongoose schemas (User, Invoice, Transaction, etc.)
│   ├── routes/                       # API endpoint definitions (authRoutes, invoiceRoutes, ...)
│   ├── middleware/                   # Auth and error handling (authMiddleware)
│   ├── utils/                        # Backend helpers (dateHelpers.js)
│   ├── index.js                      # Entry point
│   └── package.json
|
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Jivan-Patel/flowLedger.git
cd flowLedger/flowLedger
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowledger
JWT_SECRET=your_secret_key
```

Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application

```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm run dev
```

### 5. Access the App
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 📁 Deployment

- **Frontend:** Deployed on Vercel at [flow-ledger-alpha.vercel.app](https://flow-ledger-alpha.vercel.app)
- **Backend:** Deployed on Render

The frontend is configured to automatically point to the production backend when deployed.

---

## 👤 Author

**Jivan Patel**
- GitHub: [@Jivan-Patel](https://github.com/Jivan-Patel)

---

## 📜 License

MIT License — free to use and modify.
