<template>
	<ion-page>
		<ion-nav :root="compSettings" id="modal-nav" />
	</ion-page>
</template>

<script setup>
	import { ref, markRaw } from 'vue';
	import { IonNav, IonPage } from '@ionic/vue';
	import SettingsForm from '../components/SettingsForm.vue';

	// Crear una referencia para el componente raíz
	const compSettings = ref(markRaw(SettingsForm));
</script>

<style scoped lang="scss"></style>
