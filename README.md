# OnlineDB - Your browser-based, multi-tenant PostgreSQL playground.

Instantly run SQL queries, create and manage tables, and visualize your data — all from a clean, browser-based interface.

---

## 🚀 Features

- **Instant Onboarding**: Sign up and start querying in seconds with your own isolated workspace.
- **Visual Table Builder**: Define tables via a simple UI—choose columns, data types, and optional constraints.
- **Monaco-Powered SQL Editor**: Enjoy VS Code–style editor with live results.
- **Secure Schema Isolation**: All table operations are safely confined to your private schema.
- **Dashboard & Explorer**:
  - create and delete tables using intuitive interface, no SQL needed.
  - View column structures and preview up to 100 rows
  - Run ad-hoc SQL (SELECT, INSERT, UPDATE, DELETE, ALTER, DROP, JOINS, AGGREGATE FUNCTIONS, etc.)

---

## 📦 Tech Stack

- **Backend**: Node.js · Express · `pg` (PostgreSQL)
- **Auth**: bcryptjs · JWT
- **Frontend**: React · Tailwind CSS · Monaco Editor
- **Database Hosting**: Supabase PostgreSQL

---

## ⚙️ Quick Start

1. **Clone & install**
   ```bash
   git clone https://github.com/your-org/onlinedb.git
   cd onlinedb/backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment**
   - **Backend** (`backend/.env`):
     ```env
     DATABASE_URL=postgresql://postgres:<password>@db.<supabase>.supabase.co:5432/postgres
     JWT_SECRET=your_jwt_secret
     PORT=4000
     ```
   - **Frontend** (`frontend/.env`):
     ```env
     REACT_APP_API_URL=http://localhost:4000
     ```

3. **Run**
   ```bash
   # In backend/
   npm start
   # In frontend/
   npm start
   ```

---

## 🗂️ API Endpoints

| Method | Path                        | Description                             |
|--------|-----------------------------|-----------------------------------------|
| POST   | `/auth/register`            | Create account & return JWT             |
| POST   | `/auth/login`               | Authenticate & return JWT               |
| POST   | `/db/create-table`          | Create a table                          |
| DELETE | `/db/delete-table`          | Drop a table                            |
| GET    | `/db/tables`                | List your tables                        |
| GET    | `/db/table/:name/schema`    | Get column metadata                     |
| GET    | `/db/table/:name/data`      | Fetch up to 100 rows                    |
| POST   | `/db/run-query`             | Execute arbitrary SQL                   |

---

