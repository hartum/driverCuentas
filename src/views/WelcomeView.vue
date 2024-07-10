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
	import { useSettingsStore } from '../store/settingsStore';
	import { initializeDatabase, loadDatabase } from '../services/travelService';
	import IntroView from './IntroView.vue';

	const compSettings = ref(null);
	const router = useRouter();
	const settingsStore = useSettingsStore();

	const loadSettings = async () => {
		try {
			const { value } = await Preferences.get({ key: 'appSettings' });
			if (value) {
				const appSettings = JSON.parse(value);
				settingsStore.setStartDayOfWeek(appSettings.startDayOfWeek);
				settingsStore.setSelectedCurrency(appSettings.selectedCurrency);
				settingsStore.setMapDetails(appSettings.mapDetails);
				settingsStore.setServicesList(appSettings.servicesList);
				console.log('map details:', appSettings.mapDetails);

				// Cargar base de datos en la store
				const db = await loadDatabase();
				settingsStore.setDatabase(db);

				router.push('/tabs/tab1');
			} else {
				compSettings.value = markRaw(IntroView);
			}
		} catch (error) {
			console.error('Error loading appSettings:', error);
			compSettings.value = markRaw(IntroView);
		}
	};
	/*const removeSettings = async () => {
		await Preferences.remove({ key: 'appSettings' });
		console.log('initial settings removed');
	};*/
	onMounted(async () => {
		await initializeDatabase();
		loadSettings();
		//removeSettings();
	});
</script>
