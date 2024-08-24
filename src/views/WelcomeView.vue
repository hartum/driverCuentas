<template>
	<ion-page>
		<!-- Solo renderiza IonNav si compSettings tiene un valor -->
		<ion-nav v-if="compSettings" :root="compSettings" id="modal-nav" />
	</ion-page>
</template>

<script setup>
	import { ref, markRaw, onMounted } from 'vue';
	import { IonNav, IonPage } from '@ionic/vue';
	import { Preferences } from '@capacitor/preferences';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import { initializeDatabase } from '../services/databaseService';
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

				// Cambia router.push por router.replace aquí
				router.replace('/tabs/tab1');
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
<style lang="scss">
	ion-button {
		//--background: #e35b00;
		/*
		--background-hover: #e35b00;
		--background-activated: #e35b00;
		--background-focused: #e35b00;
		*/
		//--color: #fff;

		//--border-radius: 0;
		//--border-color: #e35b00;
		//--border-style: solid;
		//--border-width: 1px;

		/*--box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);*/

		//--ripple-color: deeppink;
		/*
		--padding-top: 10px;
		--padding-bottom: 10px;
		*/
		--ion-color-primary: #e93500;
		--background-activated: rgba(233, 53, 0, 0.8);
		--background-focused: rgba(233, 53, 0, 0.8);
	}
</style>
