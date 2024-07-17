import alasql from 'alasql';
import { saveDatabaseToPreferences, getLastId } from './databaseService';

// Añadir una nueva nota
export const addNote = async (noteType, amount, noteDate, description) => {
  try {
    alasql('BEGIN TRANSACTION');
    
    const newId = getLastId('notes') + 1;

    alasql('INSERT INTO notes (id, noteType, amount, noteDate, description) VALUES (?, ?, ?, ?, ?)', 
           [newId, noteType, amount, noteDate, description]);
    
    alasql('COMMIT TRANSACTION');
    await saveDatabaseToPreferences();
    return newId;
  } catch (error) {
    alasql('ROLLBACK TRANSACTION');
    console.error('Error adding note:', error);
    throw error;
  }
};

// Obtener todas las notas entre dos fechas
export const getNotes = async (initialDate, endDate) => {
  try {
    const result = alasql('SELECT * FROM notes WHERE noteDate >= ? AND noteDate <= ?', [initialDate, endDate]);
    return result;
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

// Obtener una nota por ID
export const getNoteById = async (id) => {
  try {
    const result = alasql('SELECT * FROM notes WHERE id = ?', [id]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting note by ID:', error);
    throw error;
  }
};

// Actualizar una nota por ID
export const updateNote = async (id, noteType, amount, noteDate, description) => {
  try {
    const result = alasql('UPDATE notes SET noteType = ?, amount = ?, noteDate = ?, description = ? WHERE id = ?', 
                          [noteType, amount, noteDate, description, id]);
    if (result === 0) {
      throw new Error('No note found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Eliminar una nota por ID
export const deleteNote = async (id) => {
  try {
    const result = alasql('DELETE FROM notes WHERE id = ?', [id]);
    if (result === 0) {
      throw new Error('No note found with the given ID');
    }
    await saveDatabaseToPreferences();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Función para eliminar la tabla de notas
export const deleteNoteTable = async () => {
  try {
    alasql('DROP TABLE IF EXISTS notes');
    await saveDatabaseToPreferences();
    console.log('La tabla notes ha sido eliminada');
  } catch (error) {
    console.error('Error deleting note table:', error);
    throw error;
  }
};