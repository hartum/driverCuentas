<template>
	<ion-page>
		<IonHeader mode="ios">
			<ion-toolbar>
				<ion-title>Tab 1</ion-title>
			</ion-toolbar>
		</IonHeader>
		<ion-content>
			<IonHeader mode="ios">
				<ion-toolbar>
					<ion-title size="large">Tab 1</ion-title>
				</ion-toolbar>
			</IonHeader>
			<MapViewer />
		</ion-content>
	</ion-page>
</template>

<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
	} from '@ionic/vue';
	import MapViewer from '../components/MapViewer.vue';
</script>

<style></style>
