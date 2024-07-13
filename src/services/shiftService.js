import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Función para guardar la base de datos en Preferences
const saveDatabaseToPreferences = async () => {
  const db = alasql.databases.alasql;
  await Preferences.set({ key: 'database', value: JSON.stringify(db) });
};

// Función para agregar un nuevo turno
export const addShift = async (startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) => {
  alasql('INSERT INTO shifts (startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift]);
  await saveDatabaseToPreferences();
};

// Función para obtener todos los turnos entre dos fechas
export const getShifts = async (initialDate, endDate) => {
  const result = alasql('SELECT * FROM shifts WHERE startDate >= ? AND startDate <= ?', [initialDate, endDate]);
  return result;
};

// Función para seleccionar un turno por ID
export const selectShiftByID = async (id) => {
  const result = alasql('SELECT * FROM shifts WHERE id = ?', [id]);
  return result.length ? result[0] : null;
};

// Función para actualizar un turno
export const updateShift = async (id, startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) => {
  alasql('UPDATE shifts SET startDate = ?, endDate = ?, initialKm = ?, finalKm = ?, totalKm = ?, modeKM = ?, gasoline = ?, totalShift = ?, modeTotalShift = ? WHERE id = ?', [startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift, id]);
  await saveDatabaseToPreferences();
};

// Función para eliminar un turno
export const deleteShift = async (id) => {
  alasql('DELETE FROM shifts WHERE id = ?', [id]);
  await saveDatabaseToPreferences();
};

// Función para eliminar la tabla
export const deleteShiftTable = async () => {
  alasql('DROP TABLE IF EXISTS shifts');
  await saveDatabaseToPreferences();
  console.log('La tabla shifts ha sido eliminada');
};
