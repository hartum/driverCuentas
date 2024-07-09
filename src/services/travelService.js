import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Inicializar la base de datos y la tabla travels
const initializeDatabase = async () => {
  console.log('initializeDatabase');
  // Verificar si la base de datos ya está almacenada en Preferences
  const { value } = await Preferences.get({ key: 'database' });

  if (value) {
    console.log('BBDD existe: ', value);
    // Si la base de datos existe, cargarla
    const db = JSON.parse(value);
    alasql.databases.alasql = db;
    alasql.use('alasql');
  } else {
    console.log('BBDD no existe');
    // Si la base de datos no existe, crearla
    alasql('CREATE TABLE IF NOT EXISTS travels (id INT PRIMARY KEY AUTO_INCREMENT, amount FLOAT, origin STRING, destination STRING, service STRING, payMethod STRING, startDate DATE, endDate DATE)');
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

// Función para agregar un nuevo viaje
export const addTravel = async (amount, origin, destination, service, payMethod, startDate, endDate) => {
  alasql('INSERT INTO travels (amount, origin, destination, service, payMethod, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)', [amount, origin, destination, service, payMethod, startDate, endDate]);
  await saveDatabaseToPreferences();
};

// Función para obtener todos los viajes
export const getTravels = async () => {
  const result = alasql('SELECT * FROM travels');
  return result;
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

// Función para borrar la tabla travels
export const deleteTable = async () => {
  alasql('DROP TABLE IF EXISTS travels');
  await saveDatabaseToPreferences();
  console.log('La tabla travels ha sido eliminada');
};