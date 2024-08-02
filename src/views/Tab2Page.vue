<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Estadisticas</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<h1>En construcción</h1>
			<ion-icon size="large" :icon="barChartSharp" class="icon"></ion-icon>
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
		IonIcon,
	} from '@ionic/vue';
	import { barChartSharp } from 'ionicons/icons';
</script>

<style>
	.icon {
		width: 350px;
		height: 350px;
	}
</style>
