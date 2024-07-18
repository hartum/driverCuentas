// store/databaseStore.js
import { defineStore } from 'pinia';
import alasql from 'alasql';
import { Preferences } from '@capacitor/preferences';

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    travels: [],
    shifts: [],
    notes: []
  }),
  actions: {
    async initializeDatabase() {
      const { value } = await Preferences.get({ key: 'database' });

      if (value) {
        const db = JSON.parse(value);
        alasql.databases.alasql = db;
        alasql.use('alasql');
        this.travels = alasql('SELECT * FROM travels');
        this.shifts = alasql('SELECT * FROM shifts');
        this.notes = alasql('SELECT * FROM notes');
      } else {
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
        await this.saveDatabase();
      }
    },
    async saveDatabase() {
      const db = alasql.databases.alasql;
      await Preferences.set({ key: 'database', value: JSON.stringify(db) });
    },
    async addTravel(travel) {
      try {
        alasql('BEGIN TRANSACTION');
        const newId = this.travels.length ? Math.max(this.travels.map(t => t.id)) + 1 : 1;
        travel.id = newId;
        this.travels.push(travel);
        alasql('INSERT INTO travels VALUES ?', [travel]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error adding travel:', error);
      }
    },
    async updateTravel(id, updatedTravel) {
      try {
        alasql('BEGIN TRANSACTION');
        const index = this.travels.findIndex(t => t.id === id);
        if (index !== -1) {
          this.travels[index] = { id, ...updatedTravel };
          alasql('UPDATE travels SET ? WHERE id = ?', [updatedTravel, id]);
          alasql('COMMIT');
          await this.saveDatabase();
        }
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error updating travel:', error);
      }
    },
    async deleteTravel(id) {
      try {
        alasql('BEGIN TRANSACTION');
        this.travels = this.travels.filter(t => t.id !== id);
        alasql('DELETE FROM travels WHERE id = ?', [id]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error deleting travel:', error);
      }
    },
    async addShift(shift) {
      try {
        alasql('BEGIN TRANSACTION');
        const newId = this.shifts.length ? Math.max(this.shifts.map(s => s.id)) + 1 : 1;
        shift.id = newId;
        this.shifts.push(shift);
        alasql('INSERT INTO shifts VALUES ?', [shift]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error adding shift:', error);
      }
    },
    async updateShift(id, updatedShift) {
      try {
        alasql('BEGIN TRANSACTION');
        const index = this.shifts.findIndex(s => s.id === id);
        if (index !== -1) {
          this.shifts[index] = { id, ...updatedShift };
          alasql('UPDATE shifts SET ? WHERE id = ?', [updatedShift, id]);
          alasql('COMMIT');
          await this.saveDatabase();
        }
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error updating shift:', error);
      }
    },
    async deleteShift(id) {
      try {
        alasql('BEGIN TRANSACTION');
        this.shifts = this.shifts.filter(s => s.id !== id);
        alasql('DELETE FROM shifts WHERE id = ?', [id]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error deleting shift:', error);
      }
    },
    async addNote(note) {
      try {
        alasql('BEGIN TRANSACTION');
        const newId = this.notes.length ? Math.max(this.notes.map(n => n.id)) + 1 : 1;
        note.id = newId;
        this.notes.push(note);
        alasql('INSERT INTO notes VALUES ?', [note]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error adding note:', error);
      }
    },
    async updateNote(id, updatedNote) {
      try {
        alasql('BEGIN TRANSACTION');
        const index = this.notes.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notes[index] = { id, ...updatedNote };
          alasql('UPDATE notes SET ? WHERE id = ?', [updatedNote, id]);
          alasql('COMMIT');
          await this.saveDatabase();
        }
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error updating note:', error);
      }
    },
    async deleteNote(id) {
      try {
        alasql('BEGIN TRANSACTION');
        this.notes = this.notes.filter(n => n.id !== id);
        alasql('DELETE FROM notes WHERE id = ?', [id]);
        alasql('COMMIT');
        await this.saveDatabase();
      } catch (error) {
        alasql('ROLLBACK');
        console.error('Error deleting note:', error);
      }
    }
  }
});
