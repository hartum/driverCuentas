<template>
	<ion-page>
		<IonHeader mode="ios">
			<ion-toolbar>
				<ion-title>Tab 3</ion-title>
			</ion-toolbar>
		</IonHeader>
		<ion-content :fullscreen="true">
			<IonHeader collapse="condense" mode="ios">
				<ion-toolbar>
					<ion-title size="large">Tab 3</ion-title>
				</ion-toolbar>
			</IonHeader>
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
