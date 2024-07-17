import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

// Inicializar la base de datos y las tablas
export const initializeDatabase = async () => {
  try {
    const { value } = await Preferences.get({ key: 'database' });

    if (value) {
      const db = JSON.parse(value);
      alasql.databases.alasql = db;
      alasql.use('alasql');
    } else {
      // Si no existe la base de datos, crear las tablas
      const createTablesSQL = `
        CREATE TABLE IF NOT EXISTS travels (
          id INT PRIMARY KEY AUTO_INCREMENT, 
          amount FLOAT, 
          origin STRING, 
          destination STRING, 
          service STRING, 
          payMethod STRING, 
          startDate DATE, 
          endDate DATE
        );
        CREATE TABLE IF NOT EXISTS shifts (
          id INT PRIMARY KEY AUTO_INCREMENT, 
          startDate DATETIME, 
          endDate DATETIME, 
          initialKm FLOAT, 
          finalKm FLOAT, 
          totalKm FLOAT, 
          modeKM STRING, 
          gasoline FLOAT, 
          totalShift FLOAT, 
          modeTotalShift STRING
        );
        CREATE TABLE IF NOT EXISTS notes (
          id INT PRIMARY KEY AUTO_INCREMENT, 
          noteType STRING, 
          amount FLOAT, 
          noteDate DATE, 
          description STRING
        );
      `;

      alasql(createTablesSQL);
      await saveDatabaseToPreferences();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Función para guardar la base de datos en Preferences
export const saveDatabaseToPreferences = async () => {
  try {
    const db = alasql.databases.alasql;
    await Preferences.set({ key: 'database', value: JSON.stringify(db) });
  } catch (error) {
    console.error('Error saving database to preferences:', error);
    throw error;
  }
};

// Función para cargar la base de datos desde Preferences
export const loadDatabase = async () => {
  try {
    const { value } = await Preferences.get({ key: 'database' });
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Error loading database from preferences:', error);
    throw error;
  }
};

// Función para resetear la base de datos (útil para testing o depuración)
export const resetDatabase = async () => {
  try {
    alasql('DROP TABLE IF EXISTS travels');
    alasql('DROP TABLE IF EXISTS shifts');
    alasql('DROP TABLE IF EXISTS notes');
    await initializeDatabase();
    console.log('Database has been reset and reinitialized');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

// Función para obtener el último ID de una tabla
export const getLastId = (tableName) => {
  try {
    const result = alasql(`SELECT MAX(id) as maxId FROM ${tableName}`);
    return result[0].maxId || 0;
  } catch (error) {
    console.error(`Error getting last ID from ${tableName}:`, error);
    throw error;
  }
};