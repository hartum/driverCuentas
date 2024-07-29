// store/settingsStore.js
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    startDayOfWeek: 'lunes',
    selectedCurrency: 'EUR',
    mapDetails: {
      latitude: 40.41831,
      longitude: -3.70275,
      address: '1, Calle de San Alberto, Madrid, 28013, Spain',
      zoom: 4,
    },
    servicesList: ['Privado', 'Uber', 'Bolt', 'Taxi'],
  }),
  actions: {
    setStartDayOfWeek(day) {
      this.startDayOfWeek = day;
      this.saveSettings();
    },
    setSelectedCurrency(currency) {
      this.selectedCurrency = currency;
      this.saveSettings();
    },
    setMapDetails(details) {
      this.mapDetails = details;
      this.saveSettings();
    },
    setServicesList(services) {
      this.servicesList = services;
      this.saveSettings();
    },
    async saveSettings() {
      const settings = {
        startDayOfWeek: this.startDayOfWeek,
        selectedCurrency: this.selectedCurrency,
        mapDetails: this.mapDetails,
        servicesList: this.servicesList,
      };
      try {
        await Preferences.set({
          key: 'appSettings',
          value: JSON.stringify(settings),
        });
        console.log('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    async loadSettings() {
      try {
        const { value } = await Preferences.get({ key: 'appSettings' });
        if (value) {
          const settings = JSON.parse(value);
          this.startDayOfWeek = settings.startDayOfWeek;
          this.selectedCurrency = settings.selectedCurrency;
          this.mapDetails = settings.mapDetails;
          this.servicesList = settings.servicesList;
          console.log('Settings loaded successfully');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },
  },
});