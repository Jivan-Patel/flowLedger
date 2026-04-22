# FlowLedger 💰

> A lightweight financial management dashboard for micro and small businesses.

---

## 🎨 Design & Prototype

### 🖌️ Figma Design
- **Main Design File:**  
  https://www.figma.com/design/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-2&t=vEP967IerTZBUgjO-1

### 🌞 Light Theme Prototype
- **Interactive Prototype (Light Mode):**  
  https://www.figma.com/proto/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-1139&p=f&viewport=343%2C255%2C0.06&t=tZCmTT4ynHq1XqVq-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1003%3A1139&show-proto-sidebar=1

### 🌙 Dark Theme Prototype
- **Interactive Prototype (Dark Mode):**  
  https://www.figma.com/proto/Ho30ZcdHoE8SvLJacxifQa/Untitled?node-id=1003-2&p=f&viewport=269%2C261%2C0.06&t=tZCmTT4ynHq1XqVq-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1017%3A2&show-proto-sidebar=1

---

## 📌 Description

FlowLedger is a web-based SaaS application that helps small business owners and freelancers manage their finances without the complexity of a full ERP system. It provides a clean, intuitive interface for creating invoices, tracking payment statuses, monitoring cash flow, and managing recurring transactions — all in one place.

---

## 🧩 Problem Statement

Micro and small businesses often rely on spreadsheets or paper records to manage invoices and cash flow. This approach is error-prone, hard to scale, and offers no real-time visibility into financial health. Existing tools like QuickBooks or Zoho are either too expensive or too complex for businesses with simple needs.

**FlowLedger solves this by offering:**
- A fast, no-fuss invoicing system
- Real-time payment status tracking
- Cash flow monitoring with smart alerts
- Automated recurring transaction handling

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 Invoice Management | Create, edit, send, and delete invoices with line items |
| 💳 Payment Tracking | Track invoices as Paid, Pending, or Overdue |
| 📊 Cash Flow Dashboard | Visual balance overview with threshold-based alerts |
| 🔁 Recurring Transactions | Auto-generate fixed expenses/subscriptions on a schedule |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios, Chart.js / Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| Styling | Tailwind CSS |
| Dev Tools | Nodemon, dotenv, ESLint |

---

## 🗂 Folder Structure

```
flowledger/
├── frontend/                         # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/                 # Icons, images
│       ├── components/             # Reusable UI components
│       │   ├── InvoiceCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── AlertBanner.jsx
│       │   └── RecurringItem.jsx
│       ├── pages/                  # Route-level pages
│       │   ├── Dashboard.jsx
│       │   ├── Invoices.jsx
│       │   ├── InvoiceForm.jsx
│       │   ├── PaymentTracking.jsx
│       │   ├── CashFlow.jsx
│       │   └── Recurring.jsx
│       ├── services/               # Axios API call wrappers
│       │   ├── invoiceService.js
│       │   ├── paymentService.js
│       │   └── recurringService.js
│       ├── context/                # React Context for global state
│       │   └── AuthContext.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                         # Express Backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── invoiceController.js
│   │   ├── paymentController.js
│   │   └── recurringController.js
│   ├── models/
│   │   ├── Invoice.js
│   │   ├── Transaction.js
│   │   └── RecurringTransaction.js
│   ├── routes/
│   │   ├── invoiceRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── recurringRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── dateHelpers.js
│   └── index.js                    # Entry point
│
├── .env.example
├── .gitignore
├── package.json                    # Root (optional monorepo scripts)
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas URI)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/flowledger.git
cd flowledger
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowledger
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Application

```bash
# From the root or server directory — run backend
cd server
npm run dev

# In a separate terminal — run frontend
cd client
npm run dev
```

### 5. Access the App
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 📁 API Base URL

```
http://localhost:5000/api
```

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 👤 Author

**Your Name**
- GitHub: [@Jivan-Patel](https://github.com/Jivan-Patel)

---

## 📜 License

MIT License — free to use and modify.
