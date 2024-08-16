import alasql from 'alasql';
import { saveDatabaseToPreferences, getLastId } from './databaseService';

// Función para agregar un nuevo turno
export const addShift = async (startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) => {
  try {
    alasql('BEGIN TRANSACTION');
    
    const newId = getLastId('shifts') + 1;

    alasql('INSERT INTO shifts (id, startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
           [newId, startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift]);
    
    alasql('COMMIT TRANSACTION');
    await saveDatabaseToPreferences();
    return newId;
  } catch (error) {
    alasql('ROLLBACK TRANSACTION');
    console.error('Error adding shift:', error);
    throw error;
  }
};

// Función para obtener todos los turnos
export const getAllShifts = async () => {
  try {
    const result = alasql('SELECT * FROM shifts ORDER BY startDate');
    return result;
  } catch (error) {
    console.error('Error getting all shifts:', error);
    throw error;
  }
};

// Función para obtener todos los turnos entre dos fechas
export const getShifts = async (initialDate, endDate) => {
  try {
    const result = alasql('SELECT * FROM shifts WHERE startDate >= ? AND startDate <= ?', [initialDate, endDate]);
    return result;
  } catch (error) {
    console.error('Error getting shifts:', error);
    throw error;
  }
};

// Función para seleccionar un turno por ID
export const selectShiftByID = async (id) => {
  try {
    const result = alasql('SELECT * FROM shifts WHERE id = ?', [id]);
    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error selecting shift by ID:', error);
    throw error;
  }
};

// Función para actualizar un turno
export const updateShift = async (id, startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift) => {
  try {
    const result = alasql('UPDATE shifts SET startDate = ?, endDate = ?, initialKm = ?, finalKm = ?, totalKm = ?, modeKM = ?, gasoline = ?, totalShift = ?, modeTotalShift = ? WHERE id = ?', 
                          [startDate, endDate, initialKm, finalKm, totalKm, modeKM, gasoline, totalShift, modeTotalShift, id]);
    if (result === 0) {
      throw new Error('No shift found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};

// Función para eliminar un turno
export const deleteShift = async (id) => {
  try {
    const result = alasql('DELETE FROM shifts WHERE id = ?', [id]);
    if (result === 0) {
      throw new Error('No shift found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw error;
  }
};

// Función para eliminar la tabla
export const deleteShiftTable = async () => {
  try {
    alasql('DROP TABLE IF EXISTS shifts');
    await saveDatabaseToPreferences();
    console.log('La tabla shifts ha sido eliminada');
  } catch (error) {
    console.error('Error deleting shift table:', error);
    throw error;
  }
};