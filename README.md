## Installation Guide

## Prerequisites

- Ensure you have the following installed:
  - Node.js (version 20.18.0 or later)
  - Prisma CLI (install globally using `npm install -g prisma`)
  - Git (for cloning the repository)

## Cloning the Repository

- Open your terminal and run the following command to clone the repository:
  ```bash
  git clone https://github.com/imtiaz-risat/ibnsina-med-app.git
  cd ibnsina-med-app
  ```

## Installing Dependencies

- After navigating to the project directory, install the necessary dependencies:
  ```bash
  npm install
  ```

## Environment Variables

- Create a file named `.env` in the root of your project directory.
- Add the following environment variables to the `.env` file:
  ```plaintext
  DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
  NEXTAUTH_SECRET="your_jwt_secret"
  NEXT_PUBLIC_API_URL= (e.g. http://localhost:3000)
  ```
- Replace `username`, `password`, and `your_database_name` with your actual PostgreSQL credentials and database name.
- You can generate a random JWT secret using the following command:

  ```bash
  openssl rand -base64 32
  ```

- Or you can generate a 32-digit random string from here: https://jwtsecret.com/generate

## Prisma and PostgreSQL Setup

- Download pgAdmin 4 for Database Setup https://www.pgadmin.org/download/
- Create a PostgreSQL database:
  ```sql
  CREATE DATABASE your_database_name;
  ```
- Configure the database connection in the `prisma/schema.prisma` file:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- Run the following command to generate Prisma Client:
  ```bash
  npx prisma generate
  ```
- Apply migrations to set up the database schema:
  ```bash
  npx prisma migrate dev --name init
  ```
- **Data Validation for Authentication**:
  - Ensure there are entries in the Doctor and Admin tables for login:
    ```sql
    INSERT INTO public."Doctor"(
    id, firstname, lastname, username, password, gender, phone, address)
    VALUES ('1', 'your_firstname', 'your_lastname', 'your_username', 'secure_password', 'Male', '01987654321', 'your_address');
    INSERT INTO public."Admin" (id, username, password) VALUES ('1', 'admin', 'admin123');
    ```

## Running the Application on Multiple Devices

### Using the Application Over a Local Network (Without Internet)

1. On the **server-side device** (the device running the application):
   - Open the terminal and run:
     ```bash
     ipconfig  # For Windows
     ifconfig  # For macOS/Linux (if installed)
     ```
   - Look for the **IPv4 Address** under the active network connection (e.g., `192.168.x.x`).

2. Start the application on the server device:
   ```bash
   npm run dev
   ```

3. On the **client device** (another device on the same network):
   - Open a web browser and navigate to:
     ```
     http://192.168.x.x:3000
     ```
   - Replace `192.168.x.x` with the actual IP address from Step 1.
   - Now you can access the application from another device connected to the same network.


## Routes

- Here is a list of all the pages in the app with their routing URLs:
  - `/login` - Doctor login
  - `/login/admin` - Admin login
  - `/doctor` - Doctor dashboard
  - `/doctor/new-registration` - New patient registration
  - `/doctor/patients` - List of all patients
  - `/doctor/patients/:id` - Patient Profile
  - `/doctor/prescribe` - List of all prescriptions
  - `/doctor/prescribe/:patientId` - New prescription for a patient
  - `/doctor/prescribe/edit/:prescriptionId` - Edit a prescription
  - `/doctor/profile` - Doctor profile
  - `/doctor/settings` - Doctor settings
  - `/admin` - Admin panel
  - `/admin/add-doctor` - Add new doctor
  - `/admin/doctor-list` - List of all doctors

