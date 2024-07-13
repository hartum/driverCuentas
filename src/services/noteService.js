import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Función para guardar la base de datos en Preferences
const saveDatabaseToPreferences = async () => {
  const db = alasql.databases.alasql;
  await Preferences.set({ key: 'database', value: JSON.stringify(db) });
};

// Añadir una nueva nota
export const addNote = async (noteType, amount, noteDate, description) => {
  alasql('INSERT INTO notes (noteType, amount, noteDate, description) VALUES (?, ?, ?, ?)', [noteType, amount, noteDate, description]);
  await saveDatabaseToPreferences();
};

// Obtener todas las notas entre dos fechas
export const getNotes = async (initialDate, endDate) => {
  const result = alasql('SELECT * FROM notes WHERE noteDate >= ? AND noteDate <= ?', [initialDate, endDate]);
  return result;
}

// Obtener una nota por ID
export const getNoteById = async (id) => {
  const result = alasql('SELECT * FROM notes WHERE id = ?', [id]);
  return result.length > 0 ? result[0] : null;
};

// Actualizar una nota por ID
export const updateNote = async (id, noteType, amount, noteDate, description) => {
  alasql('UPDATE notes SET noteType = ?, amount = ?, noteDate = ?, description = ? WHERE id = ?', [noteType, amount, noteDate, description, id]);
  await saveDatabaseToPreferences();
};

// Eliminar una nota por ID
export const deleteNote = async (id) => {
  alasql('DELETE FROM notes WHERE id = ?', [id]);
  await saveDatabaseToPreferences();
};
