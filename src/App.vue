<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup>
	import { IonApp, IonRouterOutlet } from '@ionic/vue';
	import { AdMob } from '@capacitor-community/admob';
	import { onMounted } from 'vue';

	onMounted(async () => {
		try {
			await AdMob.initialize({
				requestTrackingAuthorization: true,
				testingDevices: [],
				initializeForTesting: true,
			});
			console.log('AdMob inicializado correctamente');

			await AdMob.showBanner({
				adId: 'ca-app-pub-3940256099942544/6300978111',
				position: 'TOP_CENTER',
				margin: 0,
			});
			console.log('Banner mostrado correctamente');
		} catch (error) {
			console.error('Error al inicializar AdMob:', error);
		}
	});
</script>
