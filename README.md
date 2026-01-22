# 💰 Finance Tracker

A full-stack personal finance management application built with Django REST Framework and Next.js.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 📊 **Dashboard** - Real-time overview of income, expenses, and balance
- 💳 **Transaction Management** - Track all your financial transactions
- 🏷️ **Category Organization** - Organize transactions by custom categories
- 💰 **Budget Tracking** - Set monthly budgets and monitor spending
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Clean and intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - RESTful API development
- **MariaDB** - Database
- **JWT Authentication** - Secure token-based auth

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- MariaDB/MySQL

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow django-filter mysqlclient
```

4. Configure database in `finance_backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'finance_tracker_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3307',  # Or 3306 if default
    }
}
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Start development server:
```bash
python manage.py runserver
```

Backend will run at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

## 🚀 Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account or login
3. Create income and expense categories
4. Add transactions to track your finances
5. Set monthly budgets to control spending
6. Monitor your financial health on the dashboard

## 📁 Project Structure
```
finance-tracker/
├── backend/                 # Django backend
│   ├── accounts/           # User authentication
│   ├── categories/         # Category management
│   ├── transactions/       # Transaction tracking
│   ├── budgets/           # Budget management
│   └── finance_backend/   # Project settings
│
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # App routes
│   │   ├── components/   # Reusable components
│   │   ├── lib/         # API client
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/profile/` - Get user profile

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category
- `DELETE /api/categories/{id}/` - Delete category

### Transactions
- `GET /api/transactions/` - List all transactions
- `POST /api/transactions/` - Create transaction
- `PUT /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction

### Budgets
- `GET /api/budgets/` - List all budgets
- `POST /api/budgets/` - Create budget
- `DELETE /api/budgets/{id}/` - Delete budget

## 📸 Screenshots

(Add screenshots of your app here)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Zeeshan**
- GitHub: [@zara-shahid](https://github.com/zara-shahid)

## 🙏 Acknowledgments

- Built with guidance from Claude AI
- Inspired by modern finance tracking applications