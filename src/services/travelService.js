import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Inicializar la base de datos y la tabla travels
export const initializeDatabase = async () => {
  const { value } = await Preferences.get({ key: 'database' });

  if (value) {
    const db = JSON.parse(value);
    alasql.databases.alasql = db;
    alasql.use('alasql');
  } else {
    alasql('CREATE TABLE IF NOT EXISTS travels (id INT PRIMARY KEY AUTO_INCREMENT, amount FLOAT, origin STRING, destination STRING, service STRING, payMethod STRING, startDate DATE, endDate DATE)');
    await saveDatabaseToPreferences();
  }
};

// Función para guardar la base de datos en Preferences
const saveDatabaseToPreferences = async () => {
  const db = alasql.databases.alasql;
  await Preferences.set({ key: 'database', value: JSON.stringify(db) });
};

// Función para cargar la base de datos desde Preferences
export const loadDatabase = async () => {
  const { value } = await Preferences.get({ key: 'database' });
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

// Función para agregar un viaje
export const addTravel = async (amount, origin, destination, service, payMethod, startDate, endDate) => {
  alasql('INSERT INTO travels (amount, origin, destination, service, payMethod, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)', [amount, origin, destination, service, payMethod, startDate, endDate]);
  await saveDatabaseToPreferences();
};

// Función para obtener todos los viajes
export const getTravels = async () => {
  const result = alasql('SELECT * FROM travels');
  return result;
};

// Función para seleccionar un viaje por ID
export const selectByID = async (id) => {
  const result = alasql('SELECT * FROM travels WHERE id = ?', [id]);
  return result.length ? result[0] : null;
};

// Función para actualizar un viaje
export const updateTravel = async (id, amount, origin, destination, service, payMethod, startDate, endDate) => {
  alasql('UPDATE travels SET amount = ?, origin = ?, destination = ?, service = ?, payMethod = ?, startDate = ?, endDate = ? WHERE id = ?', [amount, origin, destination, service, payMethod, startDate, endDate, id]);
  await saveDatabaseToPreferences();
};

// Función para eliminar un viaje
export const deleteTravel = async (id) => {
  alasql('DELETE FROM travels WHERE id = ?', [id]);
  await saveDatabaseToPreferences();
};

// Función para eliminar la tabla
export const deleteTable = async () => {
  alasql('DROP TABLE IF EXISTS travels');
  await saveDatabaseToPreferences();
  console.log('La tabla travels ha sido eliminada');
};
