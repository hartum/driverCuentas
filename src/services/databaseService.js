import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Inicializar la base de datos y las tablas
export const initializeDatabase = async () => {
  const { value } = await Preferences.get({ key: 'database' });

  if (value) {
    const db = JSON.parse(value);
    alasql.databases.alasql = db;
    alasql.use('alasql');
  } else {
    // Si la tabla travels no existe, crearla
    alasql('CREATE TABLE IF NOT EXISTS travels (id INT PRIMARY KEY AUTO_INCREMENT, amount FLOAT, origin STRING, destination STRING, service STRING, payMethod STRING, startDate DATE, endDate DATE)');
    alasql('CREATE TABLE IF NOT EXISTS shifts (id INT PRIMARY KEY AUTO_INCREMENT, startDate DATETIME, endDate DATETIME, initialKm FLOAT, finalKm FLOAT, totalKm FLOAT, modeKM STRING, gasoline FLOAT, totalShift FLOAT, modeTotalShift STRING)');
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