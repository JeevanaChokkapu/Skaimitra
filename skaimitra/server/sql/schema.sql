CREATE DATABASE IF NOT EXISTS skaimitra;
USE skaimitra;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  role ENUM('admin', 'teacher', 'student', 'parent') NOT NULL DEFAULT 'student',
  class_grade VARCHAR(32) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calendar_events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NULL,
  event_type VARCHAR(64) NOT NULL DEFAULT 'Reminder',
  created_by INT NOT NULL,
  audience_roles JSON NOT NULL,
  class_sections JSON NOT NULL,
  visibility_type ENUM('teacher', 'student', 'school') NOT NULL DEFAULT 'school',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_calendar_events_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Optional: make your login account admin so admin page works immediately
-- UPDATE users SET role='admin' WHERE email='your-email@school.edu';
