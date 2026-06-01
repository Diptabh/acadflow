# AcadFlow

> Unified Assessment Automation Platform for Engineering Colleges

A comprehensive platform that handles CA1, CA2, and CA3 assessments for every teacher and student — generating topsheets, marksheets, and combined reports automatically.

## Features

- **CA3 Module**: Question-wise marks entry with CO + Bloom's Taxonomy mapping
- **CA2 Module**: Report/document evaluation with rubric scoring
- **CA1 Module**: PPT presentation evaluation with criteria-based scoring
- **Combined Marksheet**: Auto-calculated CA totals with grade generation
- **PDF Generation**: Pixel-perfect topsheets with teacher signatures
- **Role-based Dashboards**: Faculty, HOD, Admin, Student views

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Python + FastAPI |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| PDF Generation | ReportLab |
| Email | Resend API |
| Deployment | Railway + Vercel + Supabase |

## User Roles

- **Faculty**: Enter marks, evaluate students, generate topsheets
- **HOD**: Monitor department-wide performance
- **Admin**: Manage students, faculty, subjects
- **Student**: View marks, submit assignments

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase account
- Railway account (for backend)
- Vercel account (for frontend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_ORG/acadflow.git
cd acadflow
```

2. Setup Backend:
```bash
cd backend
cp .env.example .env
# Configure .env with your Supabase credentials
uv sync
uv run uvicorn app.main:app --reload
```

3. Setup Frontend:
```bash
cd frontend
cp .env.example .env
# Configure .env with API URL
npm install
npm run dev
```

## Project Structure

```
acadflow/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core config
│   │   ├── db/           # Database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/     # API services
│   │   └── types/       # TypeScript types
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── supabase/
│   └── migrations/       # Database migrations
└── README.md
```

## Database Schema

See [SCHEMA.md](./backend/db/SCHEMA.md) for complete database documentation.

## API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

### Backend (Railway)

1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy

### Frontend (Vercel)

1. Import project to Vercel
2. Set API URL environment variable
3. Deploy

### Database (Supabase)

1. Create new project at supabase.com
2. Run migrations from `/supabase/migrations/`
3. Configure storage buckets

## License

MIT License
