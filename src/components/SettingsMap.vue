<template>
	<IonPage>
		<IonHeader>
			<ion-toolbar>
				<ion-buttons slot="secondary">
					<ion-button fill="outline" @click="handleCancel">
						<ion-icon slot="start" :icon="closeCircleOutline"></ion-icon>
						Cancelar
					</ion-button>
				</ion-buttons>
				<ion-buttons slot="primary">
					<ion-button fill="solid" @click="handleConfirm">
						Aceptar
						<ion-icon slot="end" :icon="checkmarkCircle"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title>Dirección Inicio</ion-title>
			</ion-toolbar>
			<ion-nav-link router-direction="forward" id="modal-nav"></ion-nav-link>
		</IonHeader>
		<IonContent class="travel-container" color="light">
			<MapViewer @mapUpdated="handleMapUpdated" />
		</IonContent>
	</IonPage>
</template>

<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonButtons,
		IonButton,
		IonIcon,
		IonNavLink,
	} from '@ionic/vue';
	import { closeCircleOutline, checkmarkCircle } from 'ionicons/icons';
	import MapViewer from '../components/MapViewer.vue';
	import { ref } from 'vue';

	const latitude = ref(null);
	const longitude = ref(null);
	const address = ref(null);
	const zoom = ref(null);

	// Function to pop to root
	const navLink = document.getElementById('modal-nav');
	const handleCancel = async () => {
		navLink.popToRoot();
	};
	const handleConfirm = async () => {
		console.log('Save info and back');
		navLink.popToRoot();
	};
	// Handler for the mapUpdated event
	const handleMapUpdated = (details) => {
		const { latitude: lat, longitude: lon, address: addr, zoom: zm } = details;
		latitude.value = lat;
		longitude.value = lon;
		address.value = addr;
		zoom.value = zm;
		console.log('Map updated:', details);
	};
</script>

<style scoped></style>
