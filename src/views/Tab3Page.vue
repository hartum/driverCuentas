<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Tab 3</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense" mode="ios">
				<ion-toolbar>
					<ion-title size="large">Tab 3</ion-title>
				</ion-toolbar>
			</ion-header>
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
</script>
