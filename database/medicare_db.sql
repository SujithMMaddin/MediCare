-- MediCare database setup (MySQL 8+)
--
-- You do NOT have to run this file: the Spring Boot app creates the database
-- (createDatabaseIfNotExist=true), generates the tables through Hibernate
-- (ddl-auto=update) and seeds the admin + sample doctors on first start.
--
-- It is provided for people who prefer to create everything manually.

CREATE DATABASE IF NOT EXISTS medicare_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE medicare_db;

CREATE TABLE IF NOT EXISTS users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL,
    created_at DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS doctors (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    name           VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    availability   VARCHAR(255) NOT NULL,
    created_at     DATETIME(6)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    appointment_date DATETIME(6) NOT NULL,
    status           VARCHAR(20) NOT NULL,
    user_id          BIGINT      NOT NULL,
    doctor_id        BIGINT      NOT NULL,
    created_at       DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_appointments_user   FOREIGN KEY (user_id)   REFERENCES users (id),
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------------
-- Sample data
-- Default admin: admin@medicare.com / Admin@123
-- The application seeds this admin itself (password stored as a BCrypt hash),
-- so you can ignore this block. To insert the admin by hand instead, generate a
-- BCrypt hash of your password (cost 10), uncomment the INSERT and paste the
-- hash in place of <BCRYPT_HASH>.
-- ---------------------------------------------------------------------------
-- INSERT INTO users (name, email, password, role, created_at)
-- VALUES ('System Admin', 'admin@medicare.com', '<BCRYPT_HASH>', 'ADMIN', NOW(6));

INSERT INTO doctors (name, specialization, availability, created_at)
SELECT * FROM (
    SELECT 'Dr. Anita Sharma' AS name, 'Cardiology' AS specialization, 'Mon-Fri, 09:00 - 13:00' AS availability, NOW(6) AS created_at UNION ALL
    SELECT 'Dr. Rajesh Kumar',  'Neurology',        'Mon-Wed, 10:00 - 16:00', NOW(6) UNION ALL
    SELECT 'Dr. Priya Nair',    'Pediatrics',       'Mon-Sat, 09:00 - 14:00', NOW(6) UNION ALL
    SELECT 'Dr. Arjun Mehta',   'Orthopedics',      'Tue-Sat, 11:00 - 17:00', NOW(6) UNION ALL
    SELECT 'Dr. Sneha Reddy',   'Dermatology',      'Mon-Fri, 14:00 - 18:00', NOW(6) UNION ALL
    SELECT 'Dr. Vikram Singh',  'General Medicine', 'Mon-Sun, 08:00 - 20:00', NOW(6)
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM doctors);
