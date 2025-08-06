-- Script para crear el usuario administrador inicial
-- Password: admin123

INSERT INTO "Usuario" (email, password, nombre, role)
VALUES (
  'admin@atlixco.gob.mx',
  '$2a$10$rBYQlHvASJYwXUSPWt6TgeVQGGbVNuBLmZxa.s9DqRNhpOj8MJZ9.',
  'Administrador',
  'admin'
);