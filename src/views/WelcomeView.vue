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
	import { appVersion } from '../services/version';
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

	const checkAppVersion = async () => {
		return;
		try {
			const response = await fetch(
				'https://hartum.net/version-driver-cuentas.php'
			);
			const data = await response.json();
			const serverVersion = data.ver;

			const compareVersions = (v1, v2) => {
				const parts1 = v1.split('.').map(Number);
				const parts2 = v2.split('.').map(Number);
				for (let i = 0; i < 3; i++) {
					if (parts1[i] > parts2[i]) return 1;
					if (parts1[i] < parts2[i]) return -1;
				}
				return 0;
			};

			if (compareVersions(appVersion, serverVersion) < 0) {
				console.log('Es necesario actualizar la App');
			}
		} catch (error) {
			console.error('Error al verificar la versión:', error);
			// En caso de error, continuamos con la ejecución normal
		}
	};

	onMounted(async () => {
		console.log('Version', appVersion);
		await checkAppVersion();
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
