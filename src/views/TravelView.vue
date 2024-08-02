<template>
	<ion-page>
		<ion-nav :root="compSettings" id="modal-nav" />
	</ion-page>
</template>

<script setup>
	import { ref, markRaw } from 'vue';
	import { IonNav, IonPage } from '@ionic/vue';
	import TravelList from '../components/TravelList.vue';

	// Crear una referencia para el componente raíz
	const compSettings = ref(markRaw(TravelList));
</script>

<style scoped lang="scss"></style>
