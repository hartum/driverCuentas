<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Configuración</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>El mapa comienza aquí</ion-label>
					</ion-list-header>
					<ion-item button="true" @click="navigateTo('/map/')">
						<ion-label>{{ mapInitialLocation }}</ion-label>
					</ion-item>
				</ion-list>
			</div>
			<div>
				<ion-list>
					<ion-list-header>
						<ion-label>Primer día de la semana</ion-label>
					</ion-list-header>
					<ion-radio-group v-model="selectedDay" @ionChange="updateStartDay">
						<ion-item>
							<ion-radio
								justify="start"
								value="lunes"
								label-placement="end"
								mode="ios"
							>
								Lunes
							</ion-radio>
						</ion-item>
						<ion-item>
							<ion-radio
								justify="start"
								value="domingo"
								label-placement="end"
								mode="ios"
							>
								Domingo
							</ion-radio>
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
							@ionChange="updateCurrency"
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
						<ion-item-sliding
							v-for="(service, index) in services"
							:key="index"
							ref="slidingItems"
						>
							<ion-item>
								<ion-label>{{ service }}</ion-label>
								<ion-reorder slot="end"></ion-reorder>
							</ion-item>
							<ion-item-options side="end">
								<ion-item-option
									color="danger"
									@click="confirmRemoveService(index, $event)"
								>
									<ion-icon slot="icon-only" :icon="trash"></ion-icon>
								</ion-item-option>
							</ion-item-options>
						</ion-item-sliding>
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
		</ion-content>
		<ion-action-sheet
			:header="actionSheetHeader"
			:buttons="actionSheetButtons"
			:is-open="actionSheetOpen"
			@didDismiss="handleActionSheetDismiss"
		></ion-action-sheet>
		<ion-toast
			:is-open="showToast"
			message="Por favor, escribe un nombre para el nuevo servicio"
			:duration="1500"
			:icon="warningOutline"
			@didDismiss="showToast = false"
			position="bottom"
			swipe-gesture="vertical"
		></ion-toast>
	</ion-page>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '@/store/settingsStore';
	import { storeToRefs } from 'pinia';
	import moment from 'moment';
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
		IonToast,
	} from '@ionic/vue';
	import { trash, addCircle, warningOutline } from 'ionicons/icons';

	const router = useRouter();
	const settingsStore = useSettingsStore();
	const { startDayOfWeek, selectedCurrency, servicesList, mapDetails } =
		storeToRefs(settingsStore);

	const selectedDay = ref(startDayOfWeek.value);
	const services = ref(servicesList.value);
	const newService = ref('');
	const actionSheetOpen = ref(false);
	const actionSheetHeader = ref('');
	const serviceToRemove = ref(null);
	let slidingItem = ref(null);
	const showToast = ref(false);

	const mapInitialLocation = computed(() => {
		return mapDetails.value.address;
	});

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

	onMounted(() => {
		settingsStore.loadSettings();
	});

	const updateStartDay = () => {
		settingsStore.setStartDayOfWeek(selectedDay.value);
	};

	const updateCurrency = () => {
		settingsStore.setSelectedCurrency(selectedCurrency.value);
	};

	const addService = () => {
		if (newService.value.trim()) {
			services.value.push(newService.value.trim());
			settingsStore.setServicesList(services.value);
			newService.value = '';
		} else {
			showToast.value = true;
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
			settingsStore.setServicesList(services.value);
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
		settingsStore.setServicesList(services.value);
	};

	const navigateTo = (path) => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push(path + now);
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

<style scoped lang="scss">
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.list-ios {
		background: rgba(255, 255, 255, 0.9);
	}
	ion-toast {
		--background: #ffdd00;
		--color: #000000;
	}
</style>
