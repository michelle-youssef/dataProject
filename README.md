# Crave 'N Save ⋆.˚
A web application by Michelle Youssef, Yara Hassan and Marwa Altwalbah

> Reducing food waste, one bundle at a time.

Crave 'N Save is a full-stack web application that connects restaurants with customers by turning surplus food into discounted bundles. Restaurants list their leftover food at the end of the day, and customers claim bundles at a fraction of the original price before the pickup window expires.

> **Note:** This is a student prototype. Restaurants shown are placeholder data for demonstration purposes only.

---

## The Problem

Every day, restaurants discard perfectly good food at end of day while customers pay full price or go without affordable options. There is a clear gap between wasted food and people looking for affordable meals.

---

## How It Works

1. **Restaurants** log in and add their surplus food as discounted bundles.
2. **Customers** browse available bundles near them and claim one.
3. Customer picks up the order during the pickup window.

Food that would have been wasted gets a second chance — and customers save big.

---

## Features

- Browse food bundles from restaurants and cafés
- Filter by location and restaurant type
- Secure login for both customers and restaurants
- Claim orders and view order history
- Restaurant dashboard to add, edit, and remove bundles

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | bcrypt |
| Version Control | Git & GitHub |

---

## System Overview

The frontend communicates with the backend through REST APIs. The backend handles authentication, business logic, and data processing. MySQL stores users, bundles, and orders. Everything is connected through a full-stack architecture.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/michelle-youssef/dataProject.git
cd dataProject
```

### 2. Set up the database

- Open MySQL Workbench
- Go to **File → Open SQL Script**
- Select the file inside the `database/` folder
- Click the ⚡ lightning bolt to run it

### 3. Configure environment variables

Create a `.env` file inside the `BackEnd/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=urfood
PORT=3000
JWT_SECRET=your_secret_key
```

### 4. Install backend dependencies

```bash
cd BackEnd
npm install
```

### 5. Start the backend server

```bash
node server.js
```

You should see: `Crave 'N Save server running on port 3000`

### 6. Open the frontend

Open `frontend/index.html` in your browser. That's it!

---

