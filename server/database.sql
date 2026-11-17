-- PetCare · esquema y datos iniciales (PostgreSQL)

-- ---------- Tablas ----------
CREATE TABLE IF NOT EXISTS servicios (
  id            SERIAL        PRIMARY KEY,
  nombre        VARCHAR(80)   NOT NULL UNIQUE,
  categoria     VARCHAR(30)   NOT NULL,
  precio        NUMERIC(8,2)  NOT NULL CHECK (precio >= 0),
  duracion_min  INT           NOT NULL CHECK (duracion_min > 0),
  descripcion   TEXT
);

CREATE TABLE IF NOT EXISTS citas (
  id           SERIAL       PRIMARY KEY,
  dueno        VARCHAR(80)  NOT NULL,
  email        VARCHAR(120) NOT NULL,
  telefono     CHAR(9)      NOT NULL,
  mascota      VARCHAR(50)  NOT NULL,
  especie      VARCHAR(10)  NOT NULL CHECK (especie IN ('Perro', 'Gato', 'Otro')),
  servicio_id  INT          NOT NULL REFERENCES servicios(id),
  fecha        DATE         NOT NULL,
  hora         VARCHAR(5)   NOT NULL,
  estado       VARCHAR(12)  NOT NULL DEFAULT 'Pendiente'
               CHECK (estado IN ('Pendiente', 'Confirmada', 'Atendida', 'Cancelada')),
  notas        TEXT         NOT NULL DEFAULT '',
  creado_en    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS citas_horario_unico
  ON citas (fecha, hora) WHERE estado <> 'Cancelada';

CREATE INDEX IF NOT EXISTS citas_email_idx ON citas (email);

-- ---------- Datos iniciales: servicios ----------
INSERT INTO servicios (id, nombre, categoria, precio, duracion_min, descripcion) VALUES
  (1, 'Consulta general',        'Consulta',   50.00, 30, 'Evaluación clínica completa, control de peso y recomendaciones.'),
  (2, 'Vacunación',              'Prevención', 45.00, 20, 'Aplicación de vacunas según el calendario de la mascota.'),
  (3, 'Desparasitación',         'Prevención', 35.00, 15, 'Desparasitación interna y externa con producto incluido.'),
  (4, 'Baño y corte',            'Estética',   60.00, 60, 'Baño medicado, corte de pelo, limpieza de oídos y uñas.'),
  (5, 'Limpieza dental',         'Estética',  120.00, 45, 'Retiro de sarro y pulido dental con evaluación previa.'),
  (6, 'Control post operatorio', 'Consulta',   40.00, 20, 'Revisión de heridas, puntos y evolución después de una cirugía.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('servicios_id_seq', (SELECT MAX(id) FROM servicios));

-- ---------- Datos iniciales: citas (solo si la tabla está vacía) ----------
INSERT INTO citas (id, dueno, email, telefono, mascota, especie, servicio_id, fecha, hora, estado, notas)
SELECT * FROM (VALUES
  (101, 'Lucía Ramos',  'lucia@correo.com',  '987654321', 'Toby',  'Perro', 2, CURRENT_DATE,     '09:30', 'Confirmada', 'Segunda dosis'),
  (102, 'Carlos Pérez', 'carlos@correo.com', '912345678', 'Misha', 'Gato',  1, CURRENT_DATE,     '11:00', 'Pendiente',  'No quiere comer desde ayer'),
  (103, 'Lucía Ramos',  'lucia@correo.com',  '987654321', 'Luna',  'Gato',  4, CURRENT_DATE + 1, '15:00', 'Pendiente',  ''),
  (104, 'Ana Torres',   'ana@correo.com',    '934567812', 'Rocky', 'Perro', 5, CURRENT_DATE - 2, '10:00', 'Atendida',   ''),
  (105, 'Jorge Díaz',   'jorge@correo.com',  '956781234', 'Kiwi',  'Otro',  1, CURRENT_DATE - 1, '16:30', 'Cancelada',  'Loro con plumas caídas'),
  (106, 'Ana Torres',   'ana@correo.com',    '934567812', 'Nala',  'Perro', 3, CURRENT_DATE + 3, '12:00', 'Confirmada', '')
) AS v(id, dueno, email, telefono, mascota, especie, servicio_id, fecha, hora, estado, notas)
WHERE NOT EXISTS (SELECT 1 FROM citas);

SELECT setval('citas_id_seq', GREATEST((SELECT COALESCE(MAX(id), 0) FROM citas), 106));
