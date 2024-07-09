import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Inicializar la base de datos y la tabla shifts
const initializeDatabase = async () => {
  // Verificar si la base de datos ya está almacenada en Preferences
  const { value } = await Preferences.get({ key: 'database' });

  if (value) {
    // Si la base de datos existe, cargarla
    const db = JSON.parse(value);
    alasql.databases.alasql = db;
    alasql.use('alasql');
  } else {
    // Si la base de datos no existe, crearla
    alasql('CREATE TABLE IF NOT EXISTS shifts (id INT PRIMARY KEY AUTOINCREMENT, startDateTime DATETIME, endDateTime DATETIME, initialKm FLOAT, finalKm FLOAT, totalKm FLOAT, gasoline FLOAT, total FLOAT)');
    // Guardar la base de datos en Preferences
    await saveDatabaseToPreferences();
  }
};

initializeDatabase();

// Función para guardar la base de datos en Preferences
const saveDatabaseToPreferences = async () => {
  const db = alasql.databases.alasql;
  await Preferences.set({ key: 'database', value: JSON.stringify(db) });
};

// Función para agregar un nuevo turno
export const addShift = async (startDateTime, endDateTime, initialKm, finalKm, totalKm, gasoline, total) => {
  alasql('INSERT INTO shifts (startDateTime, endDateTime, initialKm, finalKm, totalKm, gasoline, total) VALUES (?, ?, ?, ?, ?, ?, ?)', [startDateTime, endDateTime, initialKm, finalKm, totalKm, gasoline, total]);
  await saveDatabaseToPreferences();
};

// Función para obtener todos los turnos
export const getShifts = async () => {
  const result = alasql('SELECT * FROM shifts');
  return result;
};

// Función para actualizar un turno
export const updateShift = async (id, startDateTime, endDateTime, initialKm, finalKm, totalKm, gasoline, total) => {
  alasql('UPDATE shifts SET startDateTime = ?, endDateTime = ?, initialKm = ?, finalKm = ?, totalKm = ?, gasoline = ?, total = ? WHERE id = ?', [startDateTime, endDateTime, initialKm, finalKm, totalKm, gasoline, total, id]);
  await saveDatabaseToPreferences();
};

// Función para eliminar un turno
export const deleteShift = async (id) => {
  alasql('DELETE FROM shifts WHERE id = ?', [id]);
  await saveDatabaseToPreferences();
};
