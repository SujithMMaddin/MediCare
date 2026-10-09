# MediCare Ã¢â‚¬â€œ Doctor Appointment System

Full-stack app: **Angular 18 + Angular Material** Ã¢â€ â€™ **REST** Ã¢â€ â€™ **Spring Boot 3 (Spring Security + JWT)** Ã¢â€ â€™ **JPA/Hibernate** Ã¢â€ â€™ **MySQL**.

```
medicare/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ backend/                       Spring Boot (Maven, Java 17)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ pom.xml
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ src/main/
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ resources/application.properties
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ java/com/medicare/
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ MediCareApplication.java
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ config/            SecurityConfig, DataInitializer (admin + sample doctors)
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ controller/        AuthController, DoctorController, AppointmentController
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ service/           AuthService, DoctorService, AppointmentService
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ repository/        UserRepository, DoctorRepository, AppointmentRepository
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ entity/            User, Doctor, Appointment, Role, AppointmentStatus
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ dto/               Register/Login/Doctor/Appointment requests + responses, ErrorResponse
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ security/          JwtService, JwtAuthenticationFilter, CustomUserDetailsService,
Ã¢â€â€š           Ã¢â€â€š                      RestAuthenticationEntryPoint, RestAccessDeniedHandler
Ã¢â€â€š           Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ exception/         custom exceptions + GlobalExceptionHandler (@RestControllerAdvice)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ frontend/                      Angular 18 (standalone components, Angular Material)
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ src/app/
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ app.config.ts / app.routes.ts / app.component.ts
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ core/
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ models/            auth, doctor, appointment
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ services/          AuthService, DoctorService, AppointmentService, error-message
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ guards/            authGuard, guestGuard, roleGuard
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ interceptors/      authInterceptor (adds Bearer token)
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ components/            navbar, login, register, patient-dashboard, doctor-list,
Ã¢â€â€š                                  doctor-details, book-appointment, my-appointments,
Ã¢â€â€š                                  admin-dashboard, manage-doctors, manage-appointments
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ database/medicare_db.sql       optional manual schema + sample doctors
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ postman/MediCare.postman_collection.json
```

## Prerequisites

- JDK 17+
- Maven 3.9+
- Node.js 18.19+ / 20 / 22 and npm
- MySQL 8+ running on `localhost:3306`

## 1. Database

Nothing to do manually Ã¢â‚¬â€œ the backend creates `medicare_db`, the tables, the default admin and the sample doctors on first start.
If you prefer, you can run `database/medicare_db.sql` yourself.

Set your MySQL credentials (defaults are `root` / `root`):

```bash
# Linux / macOS
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password

# Windows PowerShell
$env:DB_USERNAME="root"; $env:DB_PASSWORD="your_mysql_password"
```

or edit `backend/src/main/resources/application.properties`.

## 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

API is served on **http://localhost:8080**. To build a jar instead: `mvn clean package` then `java -jar target/medicare-backend-1.0.0.jar`.

## 3. Run the frontend

```bash
cd frontend
npm install
npm start          # = ng serve
```

Open **http://localhost:4200**.

## Default accounts

| Role    | Email                | Password   |
|---------|----------------------|------------|
| ADMIN   | admin@medicare.com   | Admin@123  |
| PATIENT | register via the UI  |            |

Change the admin credentials in `application.properties` (`app.admin.*`) **before** the first start, and set a real `JWT_SECRET` (Base64, Ã¢â€°Â¥ 32 bytes) for anything beyond local development.

## REST API

| Method | Endpoint                          | Access          | Body |
|--------|-----------------------------------|-----------------|------|
| POST   | `/api/auth/register`              | public          | `{name, email, password}` |
| POST   | `/api/auth/login`                 | public          | `{email, password}` |
| GET    | `/api/doctors`                    | public          | Optional `specializationId` filter |
| GET    | `/api/doctors/{id}`               | public          | --- |
| GET    | `/api/doctors/{id}/available-slots?from=YYYY-MM-DD&to=YYYY-MM-DD` | public | Up to 90 days |
| POST   | `/api/doctors`                    | ADMIN           | `{name, specialization, availability}` |
| PUT    | `/api/doctors/{id}`               | ADMIN           | `{name, specialization, availability}` |
| DELETE | `/api/doctors/{id}`               | ADMIN           | -------- |
| GET    | `/api/patient-profiles`            | PATIENT         | Own profiles; creates SELF if needed |
| POST   | `/api/patient-profiles`            | PATIENT         | `{fullName,dateOfBirth,relationship}` |
| POST   | `/api/appointments`               | PATIENT         | `{doctorId,patientProfileId,appointmentDate,reason?}` |
| GET    | `/api/appointments/my`            | PATIENT         | -------- |
| GET    | `/api/appointments/all`           | ADMIN           | -------- |
| PUT    | `/api/appointments/{id}/cancel`   | PATIENT (owner) | -------- |
| PUT    | `/api/appointments/{id}/confirm`  | DOCTOR (owner)  | --- |
| PUT    | `/api/appointments/{id}/reject`   | DOCTOR (owner)  | --- |
| PUT    | `/api/appointments/{id}/complete` | DOCTOR (owner)  | --- |
| PUT    | `/api/appointments/{id}/no-show`  | DOCTOR (owner)  | --- |

Authenticated calls need `Authorization: Bearer <JWT>`.

`LoginResponse` (login and register): `{ token, type, id, name, email, role }`.

Errors always look like:

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "Validation failed",
  "fieldErrors": { "email": "Email must be valid" } }
```

| Situation                         | Status |
|-----------------------------------|--------|
| Validation error / invalid date range | 400 |
| Bad credentials / missing or expired token | 401 |
| Wrong role / cancelling someone else's appointment | 403 |
| User, doctor or appointment not found | 404 |
| Email already registered          | 409 |
| Booking conflict / active appointment limit | 409 |
| Booking cooldown exceeded | 429 |

Business rules: a patient account can have at most three active upcoming appointments by default; only PENDING and CONFIRMED count. Each account has a 10-second booking cooldown. Beneficiary profiles belong to one booking account. A patient profile cannot have overlapping active appointments, and a doctor slot can only be booked once. CANCELLED and REJECTED slots are released.

## Testing with Postman

1. Import `postman/MediCare.postman_collection.json`.
2. Run **Auth Ã¢â€ â€™ Login admin** and **Auth Ã¢â€ â€™ Register patient** (they save the tokens into collection variables).
3. Run the other requests in any order Ã¢â‚¬â€œ each one already sends the right `Authorization` header.

Equivalent curl examples:

```bash
# Login as admin
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medicare.com","password":"Admin@123"}'

# Register a patient
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Patient","email":"john@example.com","password":"secret123"}'

# List doctors
curl -s http://localhost:8080/api/doctors -H "Authorization: Bearer <JWT>"

# Book an appointment (patient token)
curl -s -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" \
  -d '{"doctorId":1,"patientProfileId":1,"appointmentDate":"2027-01-15T10:30:00","reason":"Checkup"}'

# Admin: mark an appointment completed
curl -s -X PUT http://localhost:8080/api/appointments/1/status \
  -H "Authorization: Bearer <ADMIN_JWT>" -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'
```

## Configuration notes

- CORS allows `http://localhost:4200` (`app.cors.allowed-origins`, comma separated).
- The frontend API base URL lives in `frontend/src/environments/environment.ts`.
- JWT lifetime is 24h (`app.jwt.expiration-ms`). The Angular interceptor logs the user out automatically when the server answers 401 on an authenticated call.

## Booking and patient profiles

Booking limits are configurable with `MEDICARE_MAX_ACTIVE_APPOINTMENTS` (default `3`) and `MEDICARE_BOOKING_COOLDOWN_SECONDS` (default `10`). The cooldown is in-memory for a single backend instance.

Hibernate `ddl-auto=update` adds the patient profile table and nullable appointment profile column without deleting existing rows. The first patient-profile request creates the account SELF profile and backfills its legacy appointments. For externally managed schemas, run `database/migrations/V2__patient_profiles.sql` once before deploying; see `database/migrations/README.md`.

The homepage and doctor/specialty browsing are public. Booking and patient profiles require a PATIENT JWT.
