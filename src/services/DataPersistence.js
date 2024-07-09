import { Preferences } from '@capacitor/preferences';

class DataPersistence {
  constructor(){}
  async readData(dataKey) {
    const { value } = await Preferences.get({ key: dataKey });
    return value;
  }

  async saveData(dataKey, data) {
    await Preferences.set({ key: dataKey, value: data });
  }

  async deleteData(dataKey) {
    await Preferences.remove({ key: dataKey });
  }
}
export default DataPersistence;