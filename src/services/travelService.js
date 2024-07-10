import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Función para guardar la base de datos en Preferences
const saveDatabaseToPreferences = async () => {
  const db = alasql.databases.alasql;
  await Preferences.set({ key: 'database', value: JSON.stringify(db) });
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
export const deleteTravelTable = async () => {
  alasql('DROP TABLE IF EXISTS travels');
  await saveDatabaseToPreferences();
  console.log('La tabla travels ha sido eliminada');
};
