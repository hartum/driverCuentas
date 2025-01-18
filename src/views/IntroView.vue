<template>
	<ion-page class="container ion-padding">
		<ion-header mode="ios">
			<h1>DriverCuentas</h1>
			<h2>Controla tu dinero</h2>
			<p>
				<div>Porque si no lo puedes medir</div>
				<div>No lo puedes mejorar</div>
			</p>
		</ion-header>

		<ion-nav-link router-direction="forward" :component="component">
			<ion-button expand="block" mode="ios"> Empezar </ion-button>
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
	ion-button {
		--ion-color-primary: #e93500;
		--background-activated: rgba(233, 53, 0, 0.8);
		--background-focused: rgba(233, 53, 0, 0.8);
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
		background-image: url('/bg_bmw.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px 200px 240px -123px rgba(0, 0, 0, 0.75),
			inset 0px -200px 240px -123px rgba(0, 0, 0, 0.95);
		display: flex;
		p {
			font-family: Arial, Helvetica, sans-serif;
			font-size: 3.5em;
			line-height: 0.6em;
			font-weight: bolder;
			color: rgba(233, 53, 0, 0.8);
			text-shadow: -1px -1px 20px #000;
			text-wrap: balance;
			letter-spacing: -0.05em;
			/*text-align: justify;*/
			:nth-child(1) {
				color: #fff;
			}
		}
		ion-button {
			position: absolute;
			bottom: 20px;
			width: 90%;
			--ion-color-base: #f4f5f8 !important;
		}
	}
</style>
