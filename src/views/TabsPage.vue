<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet animated></ion-router-outlet>
			<ion-tab-bar slot="bottom">
				<ion-tab-button tab="tab1" href="/tabs/tab1">
					<ion-icon aria-hidden="true" :icon="carSport" />
					<ion-label>Viajes</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="tab2" href="/tabs/tab2">
					<ion-icon aria-hidden="true" :icon="statsChart" />
					<ion-label>Datos</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="tab3" href="/tabs/tab3">
					<ion-icon aria-hidden="true" :icon="settings" />
					<ion-label>Controles</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script setup>
	import {
		IonTabBar,
		IonTabButton,
		IonTabs,
		IonLabel,
		IonIcon,
		IonPage,
		IonRouterOutlet,
	} from '@ionic/vue';
	import { settings, statsChart, carSport } from 'ionicons/icons';
</script>
<style lang="scss">
	@font-face {
		font-family: 'Helvetica';
		src: url('/Helvetica.ttf');
	}
	body,
	ion-content,
	ion-label,
	ion-input,
	ion-button {
		font-family: Helvetica, 'Arial';
		--ion-font-family: Helvetica, 'Arial';
		--ion-color-primary: #e93500;
		--background-activated: rgba(233, 53, 0, 0.8);
		--background-focused: rgba(233, 53, 0, 0.8);
	}
</style>
