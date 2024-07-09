<template>
	<ionPage class="container ion-padding">
		<IonHeader>
			<h1>DriverCuentas</h1>
			<h2>La app para controlar tus viajes</h2>
		</IonHeader>

		<ion-nav-link router-direction="forward" :component="component">
			<p>"Porque si no lo puedes medir, no lo puedes mejorar"</p>
			<IonButton expand="block" fill="outline" mode="ios" color="light">
				Empezar
			</IonButton>
		</ion-nav-link>
	</ionPage>
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
		background-image: url('/bg_bmw.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px 200px 240px -123px rgba(0, 0, 0, 0.75);
		display: flex;
		p {
			font-family: Arial, Helvetica, sans-serif;
			font-size: 1.3em;
			font-weight: regular;
			color: #f44213;
			text-shadow: 3px 3px 0 #000, -3px 3px 0 #000, -3px -3px 0 #000,
				3px -3px 0 #000;
		}
	}
</style>
