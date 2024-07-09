<template>
	<IonPage>
		<!-- Solo renderiza IonNav si compSettings tiene un valor -->
		<IonNav v-if="compSettings" :root="compSettings" id="modal-nav" />
	</IonPage>
</template>

<script setup>
	import { ref, markRaw, onMounted } from 'vue';
	import { IonNav, IonPage } from '@ionic/vue';
	import { Preferences } from '@capacitor/preferences';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore'; // Importa la store
	import IntroView from './IntroView.vue';

	// Crear una referencia para el componente raíz
	const compSettings = ref(null);
	const router = useRouter(); // Inicializa el router
	const settingsStore = useSettingsStore(); // Usa la store

	const loadSettings = async () => {
		try {
			const { value } = await Preferences.get({ key: 'appSettings' });
			if (value) {
				const appSettings = JSON.parse(value);
				// Carga los valores en la store
				settingsStore.setStartDayOfWeek(appSettings.startDayOfWeek);
				settingsStore.setSelectedCurrency(appSettings.selectedCurrency);
				settingsStore.setMapDetails(appSettings.mapDetails);
				settingsStore.setServicesList(appSettings.servicesList);
				console.log('map details:', appSettings.mapDetails);
				//console.log('se almacena finalmente', settingsStore.mapDetails);
				// Si appSettings existe, navega a la URL tabs/tab1
				router.push('/tabs/tab1');
			} else {
				// Si no existe, carga el componente IntroView
				compSettings.value = markRaw(IntroView);
			}
		} catch (error) {
			console.error('Error loading appSettings:', error);
			// En caso de error, carga el componente IntroView
			compSettings.value = markRaw(IntroView);
		}
	};
	/*const removeSettings = async () => {
		await Preferences.remove({ key: 'appSettings' });
		console.log('initial settings removed');
	};*/

	onMounted(() => {
		loadSettings();
		//removeSettings();
	});
</script>
