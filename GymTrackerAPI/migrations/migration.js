import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "GymTrackerDB",
  multipleStatements: true,
};

const migration = `
-- =================================================================================
-- GymTracker Database
-- Version: 1.0
-- =================================================================================

-- --------------------------------------------------------------------------------
-- STEP 1: DATABASE CREATION
-- --------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS GymTrackerDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE GymTrackerDB;

-- --------------------------------------------------------------------------------
-- STEP 2: CATALOG AND ENUM-LIKE TABLES
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS PaymentMethod (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    transaction_fee DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE
);

-- --------------------------------------------------------------------------------
-- STEP 3: USER & PROFILE HIERARCHY (Normalized)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_status ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE IF NOT EXISTS Profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    document_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    birth_date DATE,
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    weight_kg DECIMAL(5, 2),
    height_cm DECIMAL(5, 2),
    goals ENUM('PERDER_PESO', 'ENTRENAMIENTO_PERSONALIZADO', 'GANAR_MASA_MUSCULAR', 'AUMENTAR_RESISTENCIA', 'BIENESTAR_GENERAL'),
    photo_url VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Professional (
    professional_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL UNIQUE,
    specialty VARCHAR(255), 
    certifications TEXT,
    years_of_experience INT,
    hourly_rate DECIMAL(8, 2),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL UNIQUE,
    goals TEXT,
    experience_level VARCHAR(100),
    assigned_professional_id INT,
    emergency_contact VARCHAR(255),
    medical_conditions TEXT,
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_professional_id) REFERENCES Professional(professional_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Administrator (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL UNIQUE,
    last_login TIMESTAMP,
    permissions_level INT DEFAULT 1,
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------------------
-- STEP 4: EXERCISE & TRAINING PLAN SYSTEM
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    type ENUM('TRAINING', 'PHYSIOTHERAPY'),
    main_muscle VARCHAR(100),
    secondary_muscles VARCHAR(255),
    demo_video_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ExercisePlan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    professional_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    plan_type ENUM('TRAINING', 'PHYSIOTHERAPY'),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES Professional(professional_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS PlannedExercise (
    planned_exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    exercise_id INT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
    sets VARCHAR(50),
    repetitions VARCHAR(50),
    rest_seconds INT,
    notes TEXT,
    FOREIGN KEY (plan_id) REFERENCES ExercisePlan(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------------------
-- STEP 5: NUTRITION SYSTEM
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Meal (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    calories INT,
    protein_g DECIMAL(6, 2),
    carbs_g DECIMAL(6, 2),
    fat_g DECIMAL(6, 2)
);

CREATE TABLE IF NOT EXISTS MealPlan (
    meal_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    professional_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    target_daily_calories INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES Professional(professional_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS MealPlan_Meal (
    meal_plan_meal_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_plan_id INT NOT NULL,
    meal_id INT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
    meal_type ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
    FOREIGN KEY (meal_plan_id) REFERENCES MealPlan(meal_plan_id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES Meal(meal_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------------------
-- STEP 6: E-COMMERCE SYSTEM (Full Flow)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    service_type ENUM('ACCESS', 'TRAINING', 'NUTRITION', 'PHYSIOTHERAPY'),
    duration_days INT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CartProduct (
    cart_product_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CartService (
    cart_service_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ClientOrder (
    client_order_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status ENUM('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OrderItem(
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    client_order_id INT NOT NULL,
    item_type ENUM('PRODUCT','SERVICE') NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (client_order_id) REFERENCES ClientOrder(client_order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    client_order_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(255),
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
    FOREIGN KEY (client_order_id) REFERENCES ClientOrder(client_order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethod(payment_method_id)
);

CREATE TABLE IF NOT EXISTS ClientService (
    client_service_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    client_order_id INT,
    activation_date DATE NOT NULL,
    expiration_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Service(service_id) ON DELETE CASCADE,
    FOREIGN KEY (client_order_id) REFERENCES ClientOrder(client_order_id) ON DELETE SET NULL
);

-- --------------------------------------------------------------------------------
-- STEP 7: SUPPORTING TABLES
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Measure (
    measure_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    measure_date DATE NOT NULL,
    weight_kg DECIMAL(5, 2),
    height_cm DECIMAL(5, 2),
    body_fat_percentage DECIMAL(4, 2),
    muscle_mass_kg DECIMAL(5, 2),
    notes TEXT,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------------------
-- STEP 8: APPOINTMENT & SCHEDULING SYSTEM (Updated)
-- --------------------------------------------------------------------------------

-- Eliminamos la tabla antigua de disponibilidades
DROP TABLE IF EXISTS ProfessionalAvailability;

-- Nueva tabla: plantilla semanal del profesional
CREATE TABLE IF NOT EXISTS professional_working_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    day_of_week TINYINT NOT NULL,           -- 0=Domingo, 1=Lunes...6=Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Bogota',
    CONSTRAINT chk_hours_range CHECK (start_time < end_time),
    UNIQUE KEY unique_day (professional_id, day_of_week),
    FOREIGN KEY (professional_id) REFERENCES Professional(professional_id) ON DELETE CASCADE
);

-- Nueva tabla: bloqueos / vacaciones / excepciones
CREATE TABLE IF NOT EXISTS professional_time_off (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    type ENUM('CLOSE','OPEN') NOT NULL DEFAULT 'CLOSE', -- CLOSE = bloquea, OPEN = apertura extra
    reason VARCHAR(255),
    CONSTRAINT chk_timeoff_range CHECK (start_time < end_time),
    FOREIGN KEY (professional_id) REFERENCES Professional(professional_id) ON DELETE CASCADE
);

-- Tabla de citas actualizada (sin availability_id)
DROP TABLE IF EXISTS Appointment;
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    professional_id INT NOT NULL,
    service_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM(
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW'
    ) NOT NULL DEFAULT 'SCHEDULED',
       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cancelled_at DATETIME NULL,
    cancelled_by ENUM('admin', 'client', 'professional') NULL,
    cancel_reason VARCHAR(255) NULL,
    notes TEXT NULL,
    booked_by ENUM('admin', 'client', 'professional', 'system') DEFAULT 'client',
    FOREIGN KEY (client_id) REFERENCES Client(client_id),
    FOREIGN KEY (professional_id) REFERENCES Professional(professional_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id),
    CONSTRAINT chk_appointment_time CHECK (start_time < end_time)
);

-- --------------------------------------------------------------------------------
-- STEP 9: INDEXES FOR OPTIMIZATION
-- --------------------------------------------------------------------------------
CREATE INDEX idx_user_username ON User(username);
CREATE INDEX idx_profile_email ON Profile(email);
CREATE INDEX idx_profile_document ON Profile(document_number);
CREATE INDEX idx_client_profile ON Client(profile_id);
CREATE INDEX idx_professional_profile ON Professional(profile_id);
CREATE INDEX idx_order_client ON ClientOrder(client_id);
CREATE INDEX idx_payment_order ON Payment(client_order_id);
CREATE INDEX idx_order_itemorderid ON OrderItem(client_order_id);
CREATE INDEX idx_order_itemid ON OrderItem(item_id);
CREATE INDEX idx_order_itemtype ON OrderItem(item_type);

-- --------------------------------------------------------------------------------
-- STEP 10: INITIAL DATA (SEEDING)
-- --------------------------------------------------------------------------------
INSERT INTO Role (name, description) VALUES
('CLIENT', 'Regular client user with access to plans and services.'),
('PROFESSIONAL', 'Trainer or professional who manages clients.'),
('ADMINISTRATOR', 'System administrator with full access.');

INSERT INTO PaymentMethod (name, is_active) VALUES
('Credit Card', TRUE),
('Debit Card', TRUE),
('PayPal', TRUE),
('Bank Transfer', FALSE);

-- =================================================================================
-- END OF SQL SCRIPT
-- =================================================================================
`;

export async function runMigration() {
  let conn;
  try {
    console.log("🚀 Executing Migration");

    // Connect without a database initially
    const { database, ...configWithoutDb } = dbConfig;
    conn = await mysql.createConnection(configWithoutDb);

    // Execute the entire SQL script, which includes creating and using the database
    await conn.query(migration);
    console.log("✅ Migration script executed successfully.");

    // Now, reconnect with the database specified to check tables
    if (conn) await conn.end();
    conn = await mysql.createConnection(dbConfig);

    const [tables] = await conn.query("SHOW TABLES");
    console.log(
      `✅ Migration completed. Total tables created: ${tables.length}`
    );

    return { success: true, tableCount: tables.length };
  } catch (err) {
    console.error("❌ Error during migration:", err.message);
    return { success: false, error: err.message };
  } finally {
    if (conn) await conn.end();
  }
}

export async function rollbackMigration() {
  let conn;
  try {
    console.log("⏪ Rolling back Migration...");
    const connectionConfig = { ...dbConfig };
    delete connectionConfig.database;

    conn = await mysql.createConnection(connectionConfig);

    const dbName = process.env.DB_NAME || "GymTrackerDB";
    await conn.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' dropped successfully.`);

    console.log("✅ Rollback completed.");
    return { success: true };
  } catch (err) {
    console.error("❌ Error during rollback:", err.message);
    return { success: false, error: err.message };
  } finally {
    if (conn) await conn.end();
  }
}
