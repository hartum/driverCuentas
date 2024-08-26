<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Importar/Exportar Datos</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-button expand="block" @click="exportData">Exportar Datos</ion-button>
			<ion-button expand="block" @click="triggerFileInput"
				>Importar Datos</ion-button
			>
			<input
				type="file"
				ref="fileInput"
				style="display: none"
				@change="handleFileUpload"
				accept=".json"
			/>
			<ion-text v-if="message">
				<p>{{ message }}</p>
			</ion-text>
		</ion-content>
	</ion-page>
</template>

<script setup>
	import { ref } from 'vue';
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonButton,
		IonText,
		alertController,
	} from '@ionic/vue';
	import { Preferences } from '@capacitor/preferences';
	import {
		initializeDatabase,
		saveDatabaseToPreferences,
		loadDatabase,
		resetDatabase,
	} from '../services/databaseService';
	import alasql from 'alasql';

	const fileInput = ref(null);
	const message = ref('');

	const exportData = async () => {
		try {
			const db = await loadDatabase();
			if (!db) {
				throw new Error('No se pudo cargar la base de datos');
			}

			const jsonData = JSON.stringify(db);
			const fileName = `export_${new Date().toISOString()}.json`;

			// Guardar en Preferences
			await Preferences.set({
				key: 'exportedData',
				value: jsonData,
			});

			// Crear un Blob y un enlace de descarga
			const blob = new Blob([jsonData], { type: 'application/json' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			link.click();

			message.value = `Datos exportados exitosamente como ${fileName}`;
		} catch (error) {
			console.error('Error al exportar datos:', error);
			message.value = 'Error al exportar datos';
		}
	};

	const triggerFileInput = () => {
		fileInput.value.click();
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const importedData = JSON.parse(e.target.result);
				await confirmImport(importedData);
			} catch (error) {
				console.error('Error al leer el archivo:', error);
				message.value = 'Error al leer el archivo';
			}
		};
		reader.readAsText(file);
	};

	const confirmImport = async (importedData) => {
		const alert = await alertController.create({
			header: 'Confirmar importación',
			message:
				'¿Estás seguro de que quieres importar estos datos? Esto sobrescribirá los datos existentes.',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
				},
				{
					text: 'Importar',
					handler: () => importData(importedData),
				},
			],
		});

		await alert.present();
	};

	const importData = async (importedData) => {
		try {
			await resetDatabase();
			alasql.databases.alasql = importedData;
			await saveDatabaseToPreferences();
			await initializeDatabase();
			message.value = 'Datos importados exitosamente';
		} catch (error) {
			console.error('Error al importar datos:', error);
			message.value = 'Error al importar datos';
		}
	};
</script>
