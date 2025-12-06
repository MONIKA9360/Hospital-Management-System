# 🏥 Hospital Management System

A full-stack hospital management system for managing patient records, medicines, appointments, and generating medical bills.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Features

- ✅ Patient Management (Add, Edit, Delete, Search)
- ✅ Medicine Management with Pricing
- ✅ Appointment Scheduling with Calendar
- ✅ Professional Medical Bill Generation (PNG)
- ✅ CSV/PDF Export
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Real-time Data Persistence with MySQL

## 🚀 Tech Stack

### Frontend
- **React 19.2.0** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **jsPDF & html2canvas** - Document Generation

### Backend
- **Node.js** - Runtime
- **Express.js 4.18.2** - Web Framework
- **MySQL2 3.15.3** - Database Driver
- **CORS** - Cross-Origin Resource Sharing

### Database
- **MySQL 8.0+** - Relational Database

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/MONIKA9360/HEALTH_CARE.git
cd HEALTH_CARE
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Setup MySQL Database
1. Open MySQL Workbench
2. Create database:
```sql
CREATE DATABASE hospital_management;
```
3. Run the setup script:
```bash
mysql -u root -p hospital_management < backend/setup-database.sql
```

### 5. Configure Environment Variables
Create `backend/.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management
```

## 🎯 Usage

### Start Backend Server
```bash
cd backend
node server-mysql.js
```
Server runs on: `http://localhost:5000`

### Start Frontend Development Server
```bash
npx vite
```
Frontend runs on: `http://localhost:5173`

### Login Credentials
```
Username: admin1234
Password: 1234
```

## 📸 Screenshots

### Home Page
Landing page with hospital branding

### Patient List
View and search all patients with export options

### Patient Details
Manage patient information, medicines, and appointments

### Bill Generation
Professional medical bill with payment method selection

## 🗂️ Project Structure

```
hospital-management/
├── components/              # React components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── PatientListPage.tsx
│   ├── PatientDetailPage.tsx
│   └── SuccessPopup.tsx
├── services/
│   └── api.ts              # API service layer
├── backend/
│   ├── server-mysql.js     # Express server
│   ├── db.js               # MySQL connection
│   └── setup-database.sql  # Database schema
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Main app component
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:adminNo` | Get single patient |
| POST | `/api/patients` | Add new patient |
| PUT | `/api/patients/:adminNo` | Update patient |
| DELETE | `/api/patients/:adminNo` | Delete patient |
| POST | `/api/initialize` | Initialize sample data |

## 💾 Database Schema

### Patients Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- adminNo (VARCHAR, UNIQUE)
- name (VARCHAR)
- age (INT)
- gender (ENUM: Male, Female, Other)
- bloodGroup (VARCHAR)
- contactNo (VARCHAR)
- address (TEXT)
- healthIssue (TEXT)
- medicines (JSON)
- nextAppointment (DATE)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🎨 Key Features Explained

### Patient Management
- Auto-generated Admin Numbers (ADM001, ADM002...)
- Search by Admin No, Name, or Age
- Complete CRUD operations

### Medicine Management
- Add medicines with dosage, frequency, and price
- Edit and delete medicines
- Automatic price calculation in bills

### Bill Generation
- Professional medical shop format
- Payment method selection (Cash/GPay/Card)
- Itemized medicine list with prices
- Consultation fee (₹500)
- Download as PNG image

### Export Features
- CSV export for patient data
- PDF export for patient details
- Bill image export

## 🔒 Security

- Environment variables for sensitive data
- SQL injection prevention with parameterized queries
- CORS enabled for frontend-backend communication
- .gitignore configured to exclude sensitive files

## 🛠️ Development

### Run in Development Mode
```bash
# Frontend with hot reload
npx vite

# Backend with nodemon
cd backend
npm run dev
```

### Build for Production
```bash
# Frontend
npm run build

# Backend (no build needed, runs directly)
node backend/server-mysql.js
```

## 📝 Environment Variables

Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_management
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**MONIKA9360**
- GitHub: [@MONIKA9360](https://github.com/MONIKA9360)

## 🙏 Acknowledgments

- React Team for the amazing framework
- Express.js for the robust backend framework
- MySQL for reliable data storage
- Tailwind CSS for beautiful styling

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

⭐ Star this repository if you find it helpful!
