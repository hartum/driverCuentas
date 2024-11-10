import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router';

import moment from 'moment';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Import App from Capacitor */
import { App as CapacitorApp } from '@capacitor/app';
import { Filesystem } from '@capacitor/filesystem';
import { saveTemporalDatabase } from './services/databaseService';
import { useDatabaseStore } from './store/databaseStore';

const app = createApp(App)
  .use(IonicVue)
  .use(createPinia())
  .use(router);

app.component('VueDatePicker', VueDatePicker);

router.isReady().then(() => {
  app.mount('#app');

  // Add listener for app URL open (handles incoming Intents)
  CapacitorApp.addListener('appUrlOpen', async (event) => {
    if (event.url) {
      try {
        // Extract the file path from the received URL
        const fileUrl = event.url;
        
        // Read the file content using Filesystem API
        const file = await Filesystem.readFile({
          path: fileUrl,
        });

        // Decode base64 content to text
        const base64Data = atob(file.data);

        // Parse the JSON data
        const jsonString = JSON.parse(base64Data);
        
        // Save the data in mobile
        await saveTemporalDatabase(jsonString);

        // Update store to indicate temporal data is available
        const databaseStore = useDatabaseStore();
        databaseStore.setTemporalDatabase(true);

        console.log('Datos guardados en Preferences:', jsonString);

        // Navigate to Import/Export screen
        const now = moment().format('YYYY-MM-DDTHH:mm:ss');
        router.push({ path: '/tabs/tab4' + now });


        
      } catch (error) {
        console.error('Error al manejar archivo recibido:', error);
      }
    }
  });

});
