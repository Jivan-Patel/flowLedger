# Pull Request Templates

Below are the titles and descriptive, point-wise messages for the 5 pull requests. **Please make sure to merge them in this exact sequence** to avoid merge conflicts on the `App.jsx` router.

---

## PR 1: Payment Tracking
**Merge Order:** 1
**Branch:** `feature/payment-tracking`

**Title:**
`feat(payments): Implement Payment Tracking Dashboard`

**Description:**
```markdown
## Overview
This PR implements the Payment Tracking module, providing a centralized dashboard for managing receivables.

## Changes Made
- Added `PaymentTracking` React component.
- Integrated top-level summary cards (Overdue Amount, Pending Amount, Collected This Month).
- Implemented client and invoice number search with status filtering (All, Pending, Paid, Overdue).
- Added quick "Mark Paid" actions to directly update invoice statuses without a page reload.
- Cleaned up unused placeholder backend files (`paymentController.js` and `paymentRoutes.js`) since the logic relies on the existing Invoice API.
- Registered the `/payments` route in `App.jsx`.
```

---

## PR 2: Cash Flow Backend
**Merge Order:** 2
**Branch:** `feature/cash-flow-backend`

**Title:**
`feat(cashflow): Add Manual Transactions and Threshold Settings API`

**Description:**
```markdown
## Overview
This PR extends the existing Cash Flow backend API to support manual transaction tracking and user-defined low-balance alerts.

## Changes Made
- Added `getTransactions`, `createTransaction`, and `deleteTransaction` logic to `cashflowController.js`.
- Added `updateThreshold` endpoint to manage user cash flow alerts via the `Settings` model.
- Registered new transaction and threshold endpoints in `cashflowRoutes.js`.
- Created `cashflowService.js` in the frontend to hook into these new endpoints.
```

---

## PR 3: Cash Flow Frontend
**Merge Order:** 3
**Branch:** `feature/cash-flow-frontend`

**Title:**
`feat(cashflow): Implement Financial Health Dashboard`

**Description:**
```markdown
## Overview
This PR introduces the Cash Flow UI, allowing users to visualize their financial health and track manual income/expenses.

## Changes Made
- Added `CashFlow` React component featuring a 6-month visual trend chart using `recharts`.
- Implemented dynamic Alert Banners that trigger when the current balance drops below the user's defined threshold or goes negative.
- Created a Manual Transactions table with modal functionality to add or delete arbitrary income and expense records.
- Added a "Set Threshold" modal for customizing balance alerts.
- Registered the `/cash-flow` route in `App.jsx`.
```

---

## PR 4: Recurring Transactions Backend
**Merge Order:** 4
**Branch:** `feature/recurring-backend`

**Title:**
`feat(recurring): Implement Automated Transaction Engine API`

**Description:**
```markdown
## Overview
This PR builds the backend infrastructure necessary for automating repeating expenses and income.

## Changes Made
- Created `recurringController.js` with full CRUD support for `RecurringTransaction` templates.
- Built `processRecurring` core logic to automatically calculate missing cycles and retroactively generate real `Transaction` records based on frequency (daily, weekly, monthly, yearly).
- Mapped endpoints in `recurringRoutes.js` and injected the routes into the Express server (`index.js`).
- Created `recurringService.js` in the frontend for API communication.
```

---

## PR 5: Recurring Transactions Frontend
**Merge Order:** 5
**Branch:** `feature/recurring-frontend`

**Title:**
`feat(recurring): Implement Automation Management Dashboard`

**Description:**
```markdown
## Overview
This PR introduces the Recurring Transactions UI, allowing users to set up, pause, and edit automated financial entries.

## Changes Made
- Added `Recurring` React component for managing repeating transactions.
- Implemented a silent, on-load trigger of the `/process` API endpoint to auto-generate any due transactions transparently when the user visits the page.
- Added an Add/Edit modal for configuring templates (Name, Amount, Frequency, Start Date, Category).
- Added Play/Pause toggle functionality for active templates to temporarily halt generation.
- Registered the `/recurring` route in `App.jsx`.
```
