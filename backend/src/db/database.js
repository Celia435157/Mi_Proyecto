// 1. IMPORTACIÓN Y CONFIGURACIÓN
const sqlite3 = require('sqlite3').verbose(); // Importar driver con modo debug

// 2. INSTANCIA Y CONEXIÓN A LA BASE DE DATOS
const db = new sqlite3.Database('./src/db/database.db', (err) => {
    if (err) {
        console.error('Error de conexión:', err.message);
    }
    console.log('Conectado a SQLite: database.db');
});

// 3. DEFINICIÓN DEL ESQUEMA (DDL)
db.serialize(() => {
    // Ejecución secuencial de comandos
    
    // Tabla: Instituciones (Catálogo)
    db.run(`CREATE TABLE IF NOT EXISTS institutions (
        institution_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    // Tabla: Usuarios (Entidad principal con Relaciones y Restricciones)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        address TEXT,
        password TEXT NOT NULL,
        user_type TEXT NOT NULL CHECK(user_type IN ('citizen', 'authority')), // Constraint de tipo
        verified BOOLEAN DEFAULT 0,
        institution_id INTEGER,
        role TEXT CHECK(role IN ('operator', 'supervisor', 'administrator')), // Constraint de rol
        FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) // Relación 1:N
    )`);
});

// 4. EXPORTACIÓN DEL MÓDULO (Singleton pattern)
module.exports = db;
