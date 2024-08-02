<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Tab 1</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-header mode="ios">
				<ion-toolbar>
					<ion-title size="large">Tab 1</ion-title>
				</ion-toolbar>
			</ion-header>
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
