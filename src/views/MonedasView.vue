<template>
	<IonPage class="container">
		<IonHeader mode="ios">
			<IonToolbar>
				<IonTitle>Moneda</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent>
			<!-- CARD -->
			<IonCard class="shift-card">
				<!-- // CARD HEADER -->
				<ion-card-header class="shift-header">
					<ion-card-title class="shift-title">
						<ion-icon
							:icon="cashOutline"
							class="shift-header-icon"
							size="large"
						/>
						¿Cuál es tu moneda?
					</ion-card-title>
				</ion-card-header>
				<div class="shift-footer ion-padding">
					<ion-select
						label="Moneda"
						v-model="selectedCurrency"
						ok-text="OK"
						cancel-text="Cancelar"
					>
						<ion-select-option
							v-for="currency in currencies"
							:key="currency.code"
							:value="currency.code"
						>
							{{ currency.name }}
						</ion-select-option>
					</ion-select>
					<small>* Podrás cambiarlo mas adelante en configuración</small>
				</div>
			</IonCard>
		</IonContent>
		<IonFooter class="ion-padding">
			<IonNavLink router-direction="forward" :component="component">
				<IonButton
					expand="block"
					fill="outline"
					mode="ios"
					color="light"
					@click="saveCurrency"
				>
					Siguiente
				</IonButton>
			</IonNavLink>
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
		IonSelect,
		IonSelectOption,
		IonIcon,
		IonFooter,
		IonButton,
		IonNavLink,
		IonCard,
		IonCardHeader,
		IonCardTitle,
	} from '@ionic/vue';
	import { ref, markRaw } from 'vue';
	import { cashOutline } from 'ionicons/icons';
	import MapaView from './MapaView.vue';
	import { useSettingsStore } from '../store/settingsStore'; // Importa la store

	const settingsStore = useSettingsStore(); // Usa la store

	// Crear una referencia para navegar
	const component = ref(markRaw(MapaView));
	let selectedCurrency = ref('EUR'); // Moneda por defecto es Euro
	const currencies = ref([
		{ name: 'Euro (€)', code: 'EUR' },
		{ name: 'Dólar USA ($)', code: 'USD' },
		{ name: 'Balboa panameño (PAB)', code: 'PAB' },
		{ name: 'Boliviano (BOB)', code: 'BOB' },
		{ name: 'Bolívar soberano (VES)', code: 'VES' },
		{ name: 'Colón costarricense (CRC)', code: 'CRC' },
		{ name: 'Córdoba nicaragüense (NIO)', code: 'NIO' },
		{ name: 'Dólar beliceño (BZD)', code: 'BZD' },
		{ name: 'Dólar canadiense (CAD)', code: 'CAD' },
		{ name: 'Dólar guyanés (GYD)', code: 'GYD' },
		{ name: 'Dólar surinamés (SRD)', code: 'SRD' },
		{ name: 'Guaraní paraguayo (PYG)', code: 'PYG' },
		{ name: 'Lempira hondureño (HNL)', code: 'HNL' },
		{ name: 'Peso argentino (ARS)', code: 'ARS' },
		{ name: 'Peso chileno (CLP)', code: 'CLP' },
		{ name: 'Peso colombiano (COP)', code: 'COP' },
		{ name: 'Peso mexicano (MXN)', code: 'MXN' },
		{ name: 'Peso uruguayo (UYU)', code: 'UYU' },
		{ name: 'Quetzal guatemalteco (GTQ)', code: 'GTQ' },
		{ name: 'Real brasileño (BRL)', code: 'BRL' },
		{ name: 'Sol peruano (PEN)', code: 'PEN' },
	]);

	function saveCurrency() {
		settingsStore.setSelectedCurrency(selectedCurrency.value); // Actualiza la moneda en el store
	}
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
		background-image: url('/bg_money.jpg');
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
