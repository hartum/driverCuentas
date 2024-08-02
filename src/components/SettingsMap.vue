<template>
	<ion-page>
		<ion-content class="travel-container" color="light">
			<MapViewer @mapUpdated="handleMapUpdated" :initialData="mapDetails" />
		</ion-content>
		<ion-footer>
			<ion-toolbar>
				<ion-grid>
					<ion-row>
						<ion-col>
							<ion-button
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancelMap"
							>
								Cancelar
							</ion-button>
						</ion-col>
						<ion-col>
							<ion-button
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSaveMap"
							>
								Elige Ubicación
							</ion-button>
						</ion-col>
					</ion-row>
				</ion-grid>
			</ion-toolbar>
		</ion-footer>
	</ion-page>
</template>

<script setup>
	import moment from 'moment';
	import {
		IonPage,
		IonToolbar,
		IonContent,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonFooter,
	} from '@ionic/vue';
	import MapViewer from '../components/MapViewer.vue';
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';

	const settingsStore = useSettingsStore();
	const mapDetails = ref(settingsStore.mapDetails);
	const router = useRouter();

	const handleCancelMap = async () => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab3/' + now);
	};
	const handleSaveMap = async () => {
		settingsStore.setMapDetails(mapDetails.value);
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab3/' + now);
	};
	// Handler for the mapUpdated event
	const handleMapUpdated = (mapEventDetails) => {
		mapDetails.value = mapEventDetails;
	};
</script>

<style scoped></style>
