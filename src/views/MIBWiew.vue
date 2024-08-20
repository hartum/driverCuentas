<template>
	<ion-page :class="['container', flashClass]" class="container ion-padding">
		<ion-header mode="ios">
			<h1>Mira aquí</h1>
			<h2>y pulsa el botón...</h2>
		</ion-header>

		<p v-show="datosBorrados">Pide la nueva versión a Ivan</p>
		<ion-button
			expand="block"
			mode="ios"
			@click="borrartodo"
			v-show="!datosBorrados"
		>
			Borrar Datos
		</ion-button>
	</ion-page>
</template>
<script setup>
	import { IonPage, IonHeader, IonButton } from '@ionic/vue';
	import { Preferences } from '@capacitor/preferences';
	import { ref } from 'vue';

	const flashClass = ref('');
	const datosBorrados = ref(false);

	const removeSettings = async () => {
		await Preferences.remove({ key: 'appSettings' });
	};
	const borraDB = async () => {
		await Preferences.remove({ key: 'database' });
	};
	const borrartodo = async () => {
		flashClass.value = 'flash';

		// Espera a que termine la animación para quitar la clase
		setTimeout(() => {
			flashClass.value = '';
		}, 500);

		// Realizar el borrado de los datos
		await removeSettings();
		await borraDB();
		datosBorrados.value = true;
	};
</script>
<style scoped lang="scss">
	@keyframes flash {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.flash {
		animation: flash 0.5s ease-in-out;
	}

	h1 {
		color: #fff;
		font-size: 3em;
		font-weight: lighter;
		margin-bottom: 0;
	}
	h2 {
		margin: 0 0 1em 0;
		color: #fff;
		font-weight: 200;
	}
	.container {
		background-color: #8ec5fc;
		background-image: url('/bg_MIB.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px 200px 240px -123px rgba(0, 0, 0, 0.75),
			inset 0px -400px 240px -123px rgba(0, 0, 0, 0.75);
		display: flex;
		p {
			text-align: center;
			font-family: Arial, Helvetica, sans-serif;
			font-size: 1.3em;
			font-weight: regular;
			color: #ffffff;
		}
	}
</style>
