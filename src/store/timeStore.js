import { defineStore } from 'pinia';
import { ref } from 'vue';
import moment from 'moment';

export const useTimeStore = defineStore('time',() => {
  const currentDate = ref(moment().format('YYYY-MM-DD'));
  const currentNavigator = ref('month');
  
  const updateDate = (newDate) => {
    currentDate.value = newDate;
  };
  
  const updateNavigator = (type) => {
    currentNavigator.value = type;
  };

  const updateTimeNavigation = ({newDate, type} ) => {
    currentDate.value = newDate;
    currentNavigator.value = type;
  };

  return {
    currentDate,
    currentNavigator,
    updateDate,
    updateNavigator,
    updateTimeNavigation
  };
});