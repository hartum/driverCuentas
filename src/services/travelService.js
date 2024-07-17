import alasql from 'alasql';
import { saveDatabaseToPreferences, getLastId } from './databaseService';

// Función para agregar un viaje
export const addTravel = async (amount, origin, destination, service, payMethod, startDate, endDate) => {
  try {
    alasql('BEGIN TRANSACTION');
    
    const newId = getLastId('travels') + 1;

    alasql('INSERT INTO travels (id, amount, origin, destination, service, payMethod, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
           [newId, amount, origin, destination, service, payMethod, startDate, endDate]);
    
    alasql('COMMIT TRANSACTION');
    await saveDatabaseToPreferences();
    return newId;
  } catch (error) {
    alasql('ROLLBACK TRANSACTION');
    console.error('Error adding travel:', error);
    throw error;
  }
};

// Función para obtener todos los viajes entre dos fechas
export const getTravels = async (initialDate, endDate) => {
  try {
    const result = alasql('SELECT * FROM travels WHERE startDate >= ? AND startDate <= ?', [initialDate, endDate]);
    return result;
  } catch (error) {
    console.error('Error getting travels:', error);
    throw error;
  }
};

// Función para seleccionar un viaje por ID
export const selectTravelByID = async (id) => {
  try {
    const result = alasql('SELECT * FROM travels WHERE id = ?', [id]);
    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error selecting travel by ID:', error);
    throw error;
  }
};

// Función para actualizar un viaje
export const updateTravel = async (id, amount, origin, destination, service, payMethod, startDate, endDate) => {
  try {
    const result = alasql('UPDATE travels SET amount = ?, origin = ?, destination = ?, service = ?, payMethod = ?, startDate = ?, endDate = ? WHERE id = ?', 
                          [amount, origin, destination, service, payMethod, startDate, endDate, id]);
    if (result === 0) {
      throw new Error('No travel found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error updating travel:', error);
    throw error;
  }
};

// Función para eliminar un viaje
export const deleteTravel = async (id) => {
  try {
    const result = alasql('DELETE FROM travels WHERE id = ?', [id]);
    if (result === 0) {
      throw new Error('No travel found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error deleting travel:', error);
    throw error;
  }
};

// Función para eliminar la tabla
export const deleteTravelTable = async () => {
  try {
    alasql('DROP TABLE IF EXISTS travels');
    await saveDatabaseToPreferences();
    console.log('La tabla travels ha sido eliminada');
  } catch (error) {
    console.error('Error deleting travel table:', error);
    throw error;
  }
};