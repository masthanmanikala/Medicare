# Medicare | Full-Stack Doctor Appointment Booking System

Medicare is a premium, web-based healthcare platform designed to connect patients with certified medical professionals. The application supports secure appointment booking, role-based dashboards, and interactive availability schedules.

---

## 🌟 Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (with custom color palettes, glassmorphism design elements)
- **Animations**: Framer Motion (smooth page transitions, micro-interactions)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Client**: Axios (with interceptors to inject JWT headers automatically)

### Backend
- **Server**: Node.js & Express.js (Modular structure, ES modules)
- **Database**: MongoDB (via Mongoose schemas)
- **Security**: JWT (JSON Web Tokens), bcryptjs password hashing, CORS, Helmet
- **File Uploads**: Multer (stores avatars locally in `uploads/` directory)

---

## 🚀 Key Features by User Role

### 1. Patient Dashboard
- **Find Doctors**: Interactive lookup, filtering by specialization (Cardiologist, Pediatrician, Dermatologist, Orthopedist) and years of experience.
- **Appointment Booking**: Real-time slot selectors preventing double bookings, symptom checklists, and confirmation prompts.
- **Appointment Management**: View lists of upcoming or completed consults, and cancel bookings.

### 2. Doctor Dashboard
- **Clinical Analytics**: Review total appointments, upcoming patient list, and completed records.
- **Workflow Control**: Confirm, reject, or complete patient bookings in real-time.
- **Practice Configuration**: Update consult fees, clinic hospital names, qualifications, bio descriptions, and select working days.

### 3. Admin Control Panel
- **System Metrics**: Track total patients, doctors, appointments, and active pending consults.
- **Practice Rosters**: Monitor active doctor registries.
- **User Moderation**: Delete or block accounts (patients/doctors), automatically clearing out related bookings.

---

## 🔑 Demo Login Credentials (For Testing)

Seed data has been automatically loaded. You can use the credentials helper panels on the Login page or manually type the following:

| User Role | Email Address | Password | Name / Details |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medicare.com` | `password123` | John Doe |
| **Doctor** | `sarah@medicare.com` | `password123` | Dr. Sarah Connor (Cardiologist) |
| **Admin** | `admin@medicare.com` | `password123` | System Admin |

---

## ⚙️ Installation & Running the Application

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+)
- [MongoDB](https://www.mongodb.com/) running locally on default port `27017`

### Step 1: Run the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Seed the database with demo users:
   ```bash
   npm run seed
   ```
4. Start the Express dev server:
   ```bash
   npm run dev
   ```
   *The backend will run on [http://localhost:5000](http://localhost:5000).*

### Step 2: Run the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Vite assets:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend will compile and open on [http://localhost:5173](http://localhost:5173).*
