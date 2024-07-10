<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Configuración</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent class="ion-padding">
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>El mapa comienza aquí</ion-label>
					</ion-list-header>
					<ion-nav-link router-direction="forward" :component="component">
						<ion-item href="#" @click.prevent>
							<ion-label>{{ mapInitialLocation }}</ion-label>
						</ion-item>
					</ion-nav-link>
				</ion-list>
			</div>
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>Primer día de la semana</ion-label>
					</ion-list-header>
					<ion-radio-group v-model="selectedDay">
						<ion-item>
							<IonRadio
								justify="start"
								value="lunes"
								label-placement="end"
								mode="ios"
							>
								Lunes
							</IonRadio>
						</ion-item>
						<ion-item>
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
				</ion-list>
			</div>
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>Monedas</ion-label>
					</ion-list-header>
					<ion-item>
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
					</ion-item>
				</ion-list>
			</div>
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>Servicios</ion-label>
					</ion-list-header>
					<ion-reorder-group :disabled="false" @ionItemReorder="handleReorder">
						<IonItemSliding
							v-for="(service, index) in services"
							:key="index"
							ref="slidingItems"
						>
							<ion-item>
								<ion-label>{{ service }}</ion-label>
								<ion-reorder slot="end"></ion-reorder>
							</ion-item>
							<IonItemOptions side="end">
								<ion-item-option
									color="danger"
									@click="confirmRemoveService(index, $event)"
								>
									<ion-icon slot="icon-only" :icon="trash"></ion-icon>
								</ion-item-option>
							</IonItemOptions>
						</IonItemSliding>
					</ion-reorder-group>
					<ion-item>
						<ion-input
							label="Nuevo Servicio"
							label-placement="stacked"
							placeholder="Nombre del Servicio"
							v-model="newService"
						></ion-input>
						<ion-button mode="ios" @click="addService">
							<ion-icon slot="end" :icon="addCircle"></ion-icon>
							Añadir
						</ion-button>
					</ion-item>
				</ion-list>
			</div>
		</IonContent>
		<ion-action-sheet
			:header="actionSheetHeader"
			:buttons="actionSheetButtons"
			:is-open="actionSheetOpen"
			@didDismiss="handleActionSheetDismiss"
		></ion-action-sheet>
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
		IonSelect,
		IonSelectOption,
		IonList,
		IonListHeader,
		IonReorderGroup,
		IonReorder,
		IonItem,
		IonLabel,
		IonIcon,
		IonItemOption,
		IonItemOptions,
		IonItemSliding,
		IonActionSheet,
		IonInput,
		IonButton,
		IonNavLink,
	} from '@ionic/vue';
	import { trash, addCircle } from 'ionicons/icons';
	import { ref, markRaw } from 'vue';
	import SettingsMap from './SettingsMap.vue';

	// Crear una referencia para el componente raíz
	const component = ref(markRaw(SettingsMap));

	let selectedCurrency = ref('EUR'); // Moneda por defecto es Euro
	let selectedDay = ref('lunes'); // Día por defecto es lunes
	let mapInitialLocation = ref(
		'Avenida ramon y cajal 13, Fuengirola, Málaga. Algo un poco mas largo'
	); // Ubicación inicial del mapa

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

	const services = ref(['Privado', 'Uber', 'Bolt', 'Lyft', 'Taxi']);
	const newService = ref('');
	const actionSheetOpen = ref(false);
	const actionSheetHeader = ref('');
	const serviceToRemove = ref(null);
	let slidingItem = ref(null);

	const addService = () => {
		if (newService.value.trim()) {
			services.value.push(newService.value.trim());
			newService.value = '';
		}
	};

	const confirmRemoveService = (index, event) => {
		serviceToRemove.value = index;
		slidingItem.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = `¿Deseas eliminar el servicio "${services.value[index]}"?`;
		actionSheetOpen.value = true;
	};

	const removeService = () => {
		if (serviceToRemove.value !== null && services.value.length > 1) {
			services.value.splice(serviceToRemove.value, 1);
			serviceToRemove.value = null;
		}
		closeSlidingItem();
	};

	const closeSlidingItem = () => {
		if (slidingItem.value) {
			slidingItem.value.close();
			slidingItem.value = null;
		}
	};

	const handleActionSheetDismiss = (event) => {
		const role = event.detail.role;
		if (role === 'destructive') {
			removeService();
		} else {
			closeSlidingItem();
		}
		actionSheetOpen.value = false;
	};

	const handleReorder = (event) => {
		services.value = event.detail.complete(services.value);
	};

	const actionSheetButtons = [
		{
			text: 'Borrar servicio',
			role: 'destructive',
			data: {
				action: 'delete',
			},
		},
		{
			text: 'Cancelar',
			role: 'cancel',
			data: {
				action: 'cancel',
			},
		},
	];
</script>

<style scoped lang="scss"></style>
