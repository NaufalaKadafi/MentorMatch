# MentorMatch

Platform booking mentor online yang menghubungkan student dengan mentor berpengalaman di berbagai bidang teknologi.

## Tech Stack

**Frontend:** React, React Router, Vite  
**Backend:** Node.js, Express  
**Database:** MySQL  

## Fitur

- 📋 Daftar 12 mentor dengan berbagai keahlian
- 📅 Sistem booking mentor
- 👨‍💼 Dashboard admin — manage mentor, CS, dan booking
- 👨‍🏫 Dashboard mentor — lihat booking masuk, confirm/cancel
- 🔐 Sistem login untuk admin dan mentor
- 📞 Halaman contact person dengan integrasi WhatsApp

## Cara Menjalankan

### 1. Clone repo

```bash
git clone https://github.com/username/MentorMatch.git
cd MentorMatch
```

### 2. Setup Database

- Buka HeidiSQL
- Buat database `mentormatch_db`
- Import tabel dari file SQL yang tersedia

### 3. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mentormatch_db
PORT=5000
JWT_SECRET=mentormatch_secret_key
ADMIN_WA=628xxxxxxxxxx
ADMIN_PASS=admin123
```

Jalankan backend:

```bash
npm run dev
```

### 4. Setup Frontend

```bash
cd mentormatch
npm install
npm run dev
```

### 5. Akses

| Halaman | URL |
|---------|-----|
| Website | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Admin Dashboard | http://localhost:5173/admin |
| Mentor Dashboard | http://localhost:5173/mentor-dashboard |
| API | http://localhost:5000/api |

## Struktur Folder

```
MentorMatch/
├── mentormatch/        # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   └── components/
│   └── public/         # Foto mentor
└── backend/            # Backend Express
    ├── routes/
    ├── db.js
    └── server.js
```

## Default Login

| Role | WhatsApp | Password |
|------|----------|----------|
| Admin | sesuai .env | sesuai .env |
| Mentor | nomor WA mentor | mentor123 |
