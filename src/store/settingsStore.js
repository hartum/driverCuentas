// store/settingsStore.js
import { defineStore } from 'pinia';

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
    },
    setSelectedCurrency(currency) {
      this.selectedCurrency = currency;
    },
    setMapDetails(details) {
      this.mapDetails = details;
    },
    setServicesList(services) {
      this.servicesList = services;
    },
  },
});
