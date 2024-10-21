<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Importar/Exportar Datos</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-grid>
				<ion-row>
					<ion-col>
						<ion-button
							expand="block"
							shape="round"
							mode="ios"
							@click="exportData"
						>
							<ion-icon
								slot="start"
								:icon="cloudDownload"
								size="large"
							></ion-icon>
							Exportar Datos
						</ion-button>
					</ion-col>
					<ion-col>
						<ion-button
							fill="outline"
							expand="block"
							shape="round"
							mode="ios"
							@click="importData"
						>
							<ion-icon
								slot="start"
								:icon="cloudUploadOutline"
								size="large"
							></ion-icon>
							Importar Datos
						</ion-button>
					</ion-col>
				</ion-row>
			</ion-grid>
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
		IonGrid,
		IonRow,
		IonCol,
		IonIcon,
	} from '@ionic/vue';
	import { cloudUploadOutline, cloudDownload } from 'ionicons/icons';
	import {
		initializeDatabase,
		saveDatabaseToPreferences,
		loadDatabase,
		resetDatabase,
	} from '../services/databaseService';
	import alasql from 'alasql';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { Share } from '@capacitor/share';
	import { FilePicker } from '@capawesome/capacitor-file-picker';
	import { Capacitor } from '@capacitor/core';

	const message = ref('');

	// Función para verificar y solicitar permisos de almacenamiento
	const checkPermissions = async () => {
		if (Capacitor.isNativePlatform()) {
			// Solicitar permisos explícitos de almacenamiento externo
			const permission = await Filesystem.requestPermissions();
			if (permission.publicStorage !== 'granted') {
				throw new Error('Permisos de almacenamiento no concedidos');
			}
		}
	};
	// sudo npm install @capacitor/permissions
	const exportData = async () => {
		try {
			// Verificar y solicitar permisos
			await checkPermissions();

			const db = await loadDatabase();
			if (!db) {
				throw new Error('No se pudo cargar la base de datos');
			}

			const jsonData = JSON.stringify(db);
			const fileName = `export_${new Date().toISOString()}.json`;

			// Guardar el archivo en el directorio externo (External)
			await Filesystem.writeFile({
				path: fileName,
				data: jsonData,
				directory: Directory.External, // Cambiado a External
				encoding: Encoding.UTF8,
			});

			// Obtener la URI del archivo
			const fileUri = await Filesystem.getUri({
				path: fileName,
				directory: Directory.External, // Cambiado a External
			});

			// Compartir el archivo
			await Share.share({
				title: 'Exportar Datos',
				text: 'Aquí están los datos exportados',
				url: fileUri.uri,
				dialogTitle: 'Compartir Datos',
			});

			message.value = `Datos exportados exitosamente como ${fileName}`;
		} catch (error) {
			console.error('Error al exportar datos:', error);
			message.value = `Error al exportar datos: ${error.message || error}`;
		}
	};

	const importData = async () => {
		try {
			// Seleccionar un archivo
			const result = await FilePicker.pickFiles({
				types: ['application/json'],
				multiple: false,
				readData: true,
			});

			if (result.files.length === 0) {
				return;
			}

			const file = result.files[0];

			// Los datos del archivo están codificados en base64
			const base64Data = file.data;

			// Decodificar base64 a cadena JSON
			const jsonString = atob(base64Data);

			const importedData = JSON.parse(jsonString);

			await confirmImport(importedData);
		} catch (error) {
			console.error('Error al importar datos:', error);
			message.value = 'Error al importar datos';
		}
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
					handler: () => handleImport(importedData),
				},
			],
		});

		await alert.present();
	};

	const handleImport = async (importedData) => {
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
<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_cloud.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
</style>
