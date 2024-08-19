<template>
	<ion-page class="container ion-padding">
		<ion-header mode="ios">
			<h1>DriverCuentas</h1>
			<h2>La app para controlar tus viajes</h2>
			<p>"Porque si no lo puedes medir, no lo puedes mejorar"</p>
		</ion-header>

		<ion-nav-link router-direction="forward" :component="component">
			<ion-button
				expand="block"
				fill="outline"
				color="light"
				class="btn-light"
				mode="ios"
			>
				Empezar
			</ion-button>
		</ion-nav-link>
	</ion-page>
</template>
<script setup>
	import { IonPage, IonHeader, IonButton, IonNavLink } from '@ionic/vue';
	import { ref, markRaw } from 'vue';
	import DiaSemanaView from './DiaSemanaView.vue';
	// Crear una referencia para navegar
	const component = ref(markRaw(DiaSemanaView));
</script>
<style scoped lang="scss">
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
		background-image: url('/bg_intro.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px 200px 240px -123px rgba(0, 0, 0, 0.75),
			inset 0px -200px 240px -123px rgba(0, 0, 0, 0.95);
		display: flex;
		p {
			font-style: italic;
			font-family: Arial, Helvetica, sans-serif;
			font-size: 1em;
			font-weight: regular;
			color: #f76009;
			text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000,
				1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000,
				-1px 0 0 #000;
		}
		ion-button {
			--ion-color-base: #f4f5f8 !important;
		}
	}
</style>
