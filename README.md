# ShopEasy — Full-Stack E-Commerce Web Application

A complete online store built with the **MERN** stack (MongoDB, Express, React, Node.js):

- Product catalog with search, category filter, and pagination
- Cart and checkout flow with server-side price/stock validation
- JWT authentication with role-based access (Admin / User)
- Admin dashboard: create/edit/delete products, manage order status
- Order tracking / order history for users

```
ecommerce-app/
├── backend/     Node + Express REST API, MongoDB (Mongoose)
└── frontend/    React (Vite) single-page app
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — pick ONE of these (fastest first):
  1. **MongoDB Atlas (free, no install)** → https://www.mongodb.com/cloud/atlas/register
     Create a free cluster, then copy the connection string (looks like
     `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ecommerce`)
  2. **Local MongoDB** → https://www.mongodb.com/try/download/community
     Once installed it runs at `mongodb://127.0.0.1:27017`

You do **not** need MySQL/PostgreSQL setup — this project uses MongoDB as specified
as one of the allowed databases in the brief. (If your assignment specifically
requires MySQL/PostgreSQL with an ORM like Sequelize/Prisma instead, let me know
and I'll swap the data layer — the REST API and React frontend stay the same.)

---

## 2. Backend setup (do this first)

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `MONGO_URI` to your connection string from step 1, and set a
random `JWT_SECRET` (any long random string).

Seed the database with demo data (an admin account, a regular user, and 6 sample
products):

```bash
npm run seed
```

This prints demo login credentials, also shown here:

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@example.com  | admin123  |
| User  | user@example.com   | user1234  |

Start the API server:

```bash
npm run dev      # auto-restarts on changes (nodemon)
# or: npm start
```

The API runs at **http://localhost:5000**. Check it's alive:
`curl http://localhost:5000/api/health` → `{"status":"ok"}`

---

## 3. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. The Vite dev server proxies
`/api/*` requests to the backend on port 5000 automatically (see
`frontend/vite.config.js`), so no extra config is needed.

---

## 4. Using the app

- Browse the catalog on the home page, search, and filter by category.
- Log in with the demo user (or register a new account) to add items to cart
  and check out.
- Log in as the demo admin to see the **Admin** link in the navbar → manage
  products (create/edit/delete) and manage orders (change order status).

---

## 5. API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                    | Auth        | Description                       |
|--------|------------------------------|-------------|------------------------------------|
| POST   | /auth/register               | Public      | Create account                     |
| POST   | /auth/login                  | Public      | Log in, returns JWT                |
| GET    | /auth/me                     | User        | Current user profile               |
| GET    | /products                    | Public      | List products (search/filter/paginate) |
| GET    | /products/:id                | Public      | Product detail                     |
| GET    | /products/meta/categories    | Public      | Distinct category list             |
| POST   | /products                    | Admin       | Create product                     |
| PUT    | /products/:id                | Admin       | Update product                     |
| DELETE | /products/:id                | Admin       | Delete product                     |
| POST   | /orders                      | User        | Place an order (checkout)          |
| GET    | /orders/myorders             | User        | Current user's order history       |
| GET    | /orders/:id                  | User/Admin  | Order detail (owner or admin only) |
| GET    | /orders                      | Admin       | All orders (filter by status)      |
| PUT    | /orders/:id/status           | Admin       | Update order status                |

Auth: send `Authorization: Bearer <token>` header (the frontend does this
automatically once you're logged in).

---

## 6. Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (Nginx, Vercel, Netlify) and point
it at your deployed backend, or add `express.static` to `backend/server.js`
to serve both from one process.

---

## 7. Troubleshooting

- **"MongoDB connection error"** — check `MONGO_URI` in `backend/.env`, and
  if using Atlas, make sure your current IP is allow-listed (Network Access
  tab → Add current IP, or `0.0.0.0/0` for quick testing).
- **Frontend shows "Could not load products"** — the backend isn't running,
  or is running on a different port than 5000. Confirm with the health check.
- **401 errors after login** — your `JWT_SECRET` may have changed between
  registering and logging in; log out and back in.
