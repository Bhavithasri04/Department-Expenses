# CSE Budget Proposal Portal

A full-stack MERN application designed to streamline the process of submitting, tracking, and managing budget proposals for a university's CSE department. This portal provides two distinct roles, **Faculty** and **Admin**, each with a dedicated dashboard and set of features.



---

## ✨ Features

### 👨‍🏫 Faculty Portal

* **Secure Login:** Faculty members log in with their unique Employee ID.
* **Forced Password Change:** On first login, users are required to change their default password for security.
* **Dashboard:** A comprehensive overview of the faculty member's **personal allocated budget**, total spent, and remaining balance. Includes a chart visualizing the status of their submitted proposals (Pending, Approved, Rejected).
* **Submit Proposal:** An intuitive form to create and submit new budget proposals, complete with an itemized list of expenses, costs, and justifications.
* **My Proposals:** A sortable and searchable list of all past and present proposals, allowing faculty to track the status of their submissions.
* **View Details:** Click on any proposal to view a detailed modal with all information, including the itemized breakdown and justification.
* **Profile Management:** Faculty can view and update their personal profile information, such as name, email, and office location.

### 🔐 Admin Portal

* **Admin Dashboard:** A high-level dashboard showing the **total department budget**, total amount spent, remaining funds, and the number of pending proposals that require action.
* **Proposal Approval:** A dedicated "Approvals" page to review all pending proposals from faculty. Admins can approve or reject submissions with a single click.
* **Budget Management:** A powerful interface to:
    * Set the **Total Fiscal Year Budget** for the entire department.
    * Create and allocate funds to different **Budget Categories** (e.g., "Lab Equipment", "Workshops").
    * Assign individual **Personal Budgets** to each faculty member.
* **User Management:** A complete CRUD interface for managing faculty accounts. Admins can:
    * Add new faculty users (a default password `password123` is set, and the user is forced to change it on login).
    * Enable or Disable user accounts.
    * Delete users.

---

## 🛠️ Tech Stack

This project is a monorepo built with the MERN stack and configured for serverless deployment.

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, React Router, Axios, Recharts, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### Prerequisites

* **Node.js** (v18 or later)
* **MongoDB:** A local instance or a cloud-hosted cluster (e.g., MongoDB Atlas).

### 1. Backend Setup (`Wad_BackEnd`)

1.  **Navigate to the backend folder:**
    ```sh
    cd Wad_BackEnd
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### 2. Environment File

1.  Create a file named `.env` in the **root** of the project (not inside `Wad_BackEnd`).
2.  Add your MongoDB connection string and a JWT secret:
    ```.env
    MONGO_URI=mongodb+srv://<user>:<password>@your-cluster.mongodb.net/your-db
    JWT_SECRET=your-super-strong-secret-key-goes-here
    PORT=5000
    ```

### 3. Frontend Setup (`Wad_FrontEnd`)

1.  **Navigate to the frontend folder:**
    ```sh
    cd Wad_FrontEnd
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### 4. Database Setup

Before you can log in, you must create the initial Admin user.

1.  **Run the Admin Script:** From the **root** of the project, run the `createFirstAdmin.js` script:
    ```sh
    node createFirstAdmin.js
    ```
2.  This will log the default admin credentials to your console.

### 5. Run the Application

1.  **Start the Backend Server:**
    In your `Wad_BackEnd` terminal:
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5000`.

2.  **Start the Frontend App:**
    In your `Wad_FrontEnd` terminal:
    ```sh
    npm run dev
    ```
    The React app will open on `http://localhost:5173` (or a similar port). [cite_start]The `apiClient.js` is configured to automatically proxy requests to your local backend[cite: 1].

---

## 🔑 Default Logins

* **Admin:**
    * **Employee ID:** `ADMIN001`
    * **Password:** `admin123`

* **Faculty:**
    * Use the Employee ID you set when creating a user in the Admin "User Management" panel.
    * **Default Password:** `password123` (the user will be required to change this on first login).
