## Installation Guide

## Prerequisites

- Ensure you have the following installed:
  - Node.js (version X.X.X or later)
  - PostgreSQL (version X.X.X or later)
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

## Prisma and PostgreSQL Setup

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
