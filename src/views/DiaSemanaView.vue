<template>
	<IonPage class="container">
		<IonHeader>
			<IonToolbar>
				<IonTitle>Día de la semana</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<!-- CARD -->
			<ion-card class="shift-card">
				<!--  CARD HEADER -->
				<ion-card-header class="shift-header">
					<ion-card-title class="shift-title">
						<ion-icon
							:icon="calendarOutline"
							class="shift-header-icon"
							size="large"
						/>
						La semana empieza en:
					</ion-card-title>
				</ion-card-header>
				<!-- FOOTER	 -->
				<div class="shift-footer ion-padding">
					<ion-radio-group v-model="selectedDay">
						<ion-item lines="none">
							<IonRadio
								justify="start"
								value="lunes"
								label-placement="end"
								mode="ios"
							>
								Lunes
							</IonRadio>
						</ion-item>
						<ion-item lines="none">
							<IonRadio
								justify="start"
								value="domingo"
								label-placement="end"
								mode="ios"
							>
								Domingo
							</IonRadio>
						</ion-item>
					</ion-radio-group>

					<small>* Podrás cambiarlo mas adelante en configuración</small>
				</div>
			</ion-card>
		</IonContent>
		<IonFooter class="ion-padding">
			<ion-nav-link router-direction="forward" :component="component">
				<IonButton
					expand="block"
					fill="outline"
					mode="ios"
					color="light"
					@click="saveStartDayOfWeek"
				>
					Siguiente
				</IonButton>
			</ion-nav-link>
		</IonFooter>
	</IonPage>
</template>
<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonRadioGroup,
		IonRadio,
		IonFooter,
		IonNavLink,
		IonButton,
		IonItem,
		IonIcon,
		IonCard,
		IonCardHeader,
		IonCardTitle,
	} from '@ionic/vue';
	import { ref, markRaw } from 'vue';
	import { calendarOutline } from 'ionicons/icons';
	import { useSettingsStore } from '../store/settingsStore'; // Importa la store
	import Moneda from './MonedasView.vue';
	// Crear una referencia para navegar
	const component = ref(markRaw(Moneda));
	// Día por defecto es lunes
	let selectedDay = ref('lunes');
	// Instancia de la store
	const settingsStore = useSettingsStore();
	const saveStartDayOfWeek = () => {
		settingsStore.setStartDayOfWeek(selectedDay.value);
	};
</script>
<style scoped lang="scss">
	ion-content::part(background) {
		background: transparent;
	}
	.shift-card {
		border: 1px solid #ccc;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: #f8f8ff;
			/*text-align: center;*/
			.shift-title {
				font-weight: 300 !important ;
				.shift-header-icon {
					vertical-align: bottom;
					margin: 0;
				}
			}
		}
	}
	.container {
		background-color: #8ec5fc;
		background-image: url('/bg_time.jpg');
		background-size: cover;
		background-position: center center;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.icon {
		font-size: 100px;
		color: #ccc;
		display: block;
		margin: auto;
	}
	small {
		color: #666;
	}
</style>
