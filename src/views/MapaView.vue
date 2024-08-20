<template>
	<ion-page class="container">
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Tu Inicio</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<!-- CARD -->
			<ion-card class="shift-card">
				<ion-card-header class="shift-header">
					<ion-card-title class="shift-title">
						<ion-icon
							:icon="navigateCircleOutline"
							class="shift-header-icon"
							size="large"
						/>
						Indica tu ubicación
					</ion-card-title>
				</ion-card-header>
				<div class="shift-footer ion-padding">
					El mapa iniciará donde tú le marques,
					<b>nunca accederemos a tu GPS</b>
				</div>
			</ion-card>

			<MapViewer @mapUpdated="handleMapUpdated" />
		</ion-content>
		<ion-footer class="ion-padding">
			<ion-button expand="block" mode="ios" @click="navigateToTabs">
				Siguiente
			</ion-button>
		</ion-footer>
	</ion-page>
</template>

<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonFooter,
		IonButton,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonIcon,
	} from '@ionic/vue';
	import { navigateCircleOutline } from 'ionicons/icons';
	import { useRouter } from 'vue-router';
	import MapViewer from '../components/MapViewer.vue';
	import { useSettingsStore } from '../store/settingsStore'; // Importa la store
	import { Preferences } from '@capacitor/preferences';

	const router = useRouter();
	const settingsStore = useSettingsStore(); // Usa la store

	const navigateToTabs = async () => {
		/*console.log('guardar los datos y navegar al tabs');
		console.log('Datos del store:', {
			startDayOfWeek: settingsStore.startDayOfWeek,
			selectedCurrency: settingsStore.selectedCurrency,
			mapDetails: settingsStore.mapDetails,
			servicesList: settingsStore.servicesList,
		});*/

		const appSettings = {
			startDayOfWeek: settingsStore.startDayOfWeek,
			selectedCurrency: settingsStore.selectedCurrency,
			mapDetails: settingsStore.mapDetails,
			servicesList: settingsStore.servicesList,
		};
		router.push('/tabs/');
		try {
			await Preferences.set({
				key: 'appSettings',
				value: JSON.stringify(appSettings),
			});
			console.log('Datos del store guardados:', appSettings);
			//router.push('/tabs/');
		} catch (error) {
			console.error('Error guardando los datos del store:', error);
		}
	};

	const handleMapUpdated = (mapDetails) => {
		console.log('Map updated:', mapDetails);
		settingsStore.setMapDetails(mapDetails); // Guarda los detalles del mapa en el store
	};
</script>

<style scoped lang="scss">
	ion-content::part(background) {
		background: transparent;
	}
	.shift-card {
		border: 1px solid #ccc;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: #f8f8ff;
			.shift-title {
				font-weight: 300 !important;
				.shift-header-icon {
					vertical-align: bottom;
					margin: 0;
				}
			}
		}
	}
	.container {
		background-color: #8ec5fc;
		background-image: url('/bg_map.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.icon {
		font-size: 100px;
		color: #ccc;
		display: block;
		margin: auto;
	}
	small {
		color: #666;
	}
</style>
