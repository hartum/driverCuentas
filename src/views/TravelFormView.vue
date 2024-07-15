<template>
	<ion-page>
		<IonHeader v-show="!isMapVisible">
			<IonToolbar>
				<IonTitle>
					{{ modeForm === 'edit' ? 'Editar viaje' : 'Nuevo viaje' }}
				</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent
			class="form-container"
			:class="{ 'ion-padding': !isMapVisible }"
		>
			<div v-show="!isMapVisible">
				<IonItem lines="none" class="travel-item">
					<span slot="start">
						<ion-icon class="title-icon" :icon="payIcons[pay]" />
					</span>
					<IonInput
						class="money-input"
						type="number"
						placeholder="000.00"
						v-model="amountForm"
						inputmode="decimal"
						max="999"
						maxlength="6"
						min="0"
					>
						<span slot="end">{{ currency }}</span>
					</IonInput>
				</IonItem>

				<ion-accordion-group value="travel" class="accordion-group">
					<ion-accordion value="travel">
						<ion-item slot="header" color="light">
							<ion-label><b>Detalles del Viaje</b></ion-label>
						</ion-item>
						<div slot="content" class="ion-padding">
							<IonList lines="none">
								<IonItem>
									<ion-label>Fecha</ion-label>
									<IonDatetimeButton
										datetime="datetime_start"
										mode="ios"
									></IonDatetimeButton>
									<IonModal :keep-contents-mounted="true">
										<IonDatetime
											locale="es-ES"
											:first-day-of-week="firstDayOfWeek"
											:show-default-buttons="true"
											id="datetime_start"
											v-model="datetimeStart"
											mode="ios"
										></IonDatetime>
									</IonModal>
								</IonItem>
								<IonItem>
									<ion-label>Origen</ion-label>
									<p class="selected-address">
										{{ locationStart.address || 'Elige dirección' }}
									</p>
									<ion-button
										slot="end"
										size="default"
										color="secondary"
										@click="openMap('origin')"
									>
										<img src="/marker_map_basic.svg" width="16px" />
									</ion-button>
								</IonItem>
								<IonItem>
									<ion-label>Destino</ion-label>
									<p class="selected-address">
										{{ locationEnd.address || 'Elige dirección' }}
									</p>
									<ion-button
										slot="end"
										size="default"
										color="tertiary"
										@click="openMap('destination')"
									>
										<img src="/marker_map_basic.svg" width="16px" />
									</ion-button>
								</IonItem>
							</IonList>
						</div>
					</ion-accordion>

					<ion-accordion value="payType">
						<ion-item slot="header" color="light">
							<ion-label><b>Pago con</b></ion-label>
						</ion-item>
						<div class="ion-padding" slot="content">
							<ion-segment v-model="pay">
								<ion-segment-button value="app">
									<ion-label>App</ion-label>
								</ion-segment-button>
								<ion-segment-button value="cash">
									<ion-label>Efectivo</ion-label>
								</ion-segment-button>
								<ion-segment-button value="card">
									<ion-label>Tarjeta</ion-label>
								</ion-segment-button>
							</ion-segment>
						</div>
					</ion-accordion>

					<ion-accordion value="serviceFor">
						<ion-item slot="header" color="light">
							<ion-label><b>Servicio para</b></ion-label>
						</ion-item>
						<div class="ion-padding" slot="content">
							<IonItem lines="none">
								<IonRadioGroup class="tipo-servicio" v-model="service">
									<IonRadio
										v-for="(serviceOption, index) in servicesList"
										:key="index"
										:value="serviceOption"
										justify="start"
										label-placement="end"
									>
										{{ serviceOption }}
									</IonRadio>
								</IonRadioGroup>
							</IonItem>
						</div>
					</ion-accordion>
				</ion-accordion-group>
			</div>
			<div v-show="isMapVisible" class="map-container">
				<MapViewer
					class="map-container"
					:initialData="mapDetails"
					@mapUpdated="handleMapUpdated"
				/>
			</div>
			<ion-toast
				:is-open="showToast"
				message="Por favor, ingresa una cantidad mayor a 0"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="showToast = false"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
		</IonContent>
		<IonFooter v-if="!isMapVisible" id="form-footer">
			<IonToolbar>
				<ion-grid>
					<ion-row>
						<ion-col>
							<ionButton
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancel"
							>
								Cancelar
							</ionButton>
						</ion-col>
						<ion-col>
							<ionButton
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSave"
							>
								{{ modeForm === 'edit' ? 'Guardar Cambios' : 'Nuevo viaje' }}
							</ionButton>
						</ion-col>
					</ion-row>
				</ion-grid>
			</IonToolbar>
		</IonFooter>
		<IonFooter v-else>
			<IonToolbar>
				<ion-grid>
					<ion-row>
						<ion-col>
							<ionButton
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancelMap"
							>
								Cancelar
							</ionButton>
						</ion-col>
						<ion-col>
							<ionButton
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSaveMap"
							>
								{{
									mapMode === 'origin' ? 'Asignar origen' : 'Asignar destino'
								}}
							</ionButton>
						</ion-col>
					</ion-row>
				</ion-grid>
			</IonToolbar>
		</IonFooter>
	</ion-page>
</template>

<script setup>
	import moment from 'moment';
	moment.locale('es');
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonInput,
		IonRadioGroup,
		IonRadio,
		IonDatetimeButton,
		IonDatetime,
		IonModal,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonAccordion,
		IonAccordionGroup,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonFooter,
		IonToast,
	} from '@ionic/vue';
	import {
		cardOutline,
		cashOutline,
		phonePortraitOutline,
		warningOutline,
	} from 'ionicons/icons';
	import { ref, onMounted, watch } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import MapViewer from '../components/MapViewer.vue';
	import {
		addTravel,
		selectTravelByID,
		updateTravel,
	} from '@/services/travelService'; // Importar el servicio

	const settingsStore = useSettingsStore();
	const amountForm = ref(0);
	const currency = ref('€');
	const datetimeStart = ref(moment().format('YYYY-MM-DDTHH:mm'));
	const firstDayOfWeek = ref(1);
	const locationStart = ref({});
	const locationEnd = ref({});
	const service = ref('');
	const isMapVisible = ref(false);
	const mapMode = ref('origin');
	const mapDetails = ref(settingsStore.mapDetails);
	const showToast = ref(false);

	const pay = ref('app');
	const router = useRouter();
	const route = useRoute();
	const travelId = ref(route.params.travelId);

	//const modeForm = ref(travelId.value ? 'edit' : 'create');
	const modeForm = ref(null);
	const servicesList = settingsStore.servicesList;

	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	if (moment(travelId.value, moment.ISO_8601, true).isValid()) {
		console.log('create');
		modeForm.value = 'create';
	} else {
		console.log('edit');
		modeForm.value = 'edit';
	}

	const loadTravel = async () => {
		// Establecer el valor del primer día de la semana por defecto
		firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

		// Si estamos en modo de edición, cargar los datos del viaje
		if (modeForm.value === 'edit') {
			const travel = await selectTravelByID(parseInt(travelId.value));
			if (travel) {
				amountForm.value = travel.amount;
				locationStart.value = travel.origin;
				locationEnd.value = travel.destination;
				service.value = travel.service;
				pay.value = travel.payMethod;
				datetimeStart.value = travel.startDate;
			}
		}
	};

	onMounted(loadTravel);

	// Guardar el viaje
	const handleSave = async () => {
		// Validar que la cantidad sea mayor que cero
		if (parseFloat(amountForm.value) <= 0) {
			showToast.value = true;
			return;
		}

		try {
			if (modeForm.value === 'edit') {
				await updateTravel(
					parseInt(travelId.value),
					parseFloat(amountForm.value),
					locationStart.value,
					locationEnd.value,
					service.value,
					pay.value,
					datetimeStart.value,
					'' // endDate no está especificado en los datos proporcionados
				);
			} else {
				await addTravel(
					parseFloat(amountForm.value),
					locationStart.value,
					locationEnd.value,
					service.value,
					pay.value,
					datetimeStart.value,
					'' // endDate no está especificado en los datos proporcionados
				);
			}

			const now = moment().format('YYYY-MM-DDTHH:mm:ss');
			router.push('/tabs/tab1/' + now);
		} catch (error) {
			console.error('Error guardando el viaje:', error);
		}
	};

	// Cancelar el viaje
	const handleCancel = () => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab1/' + now);
	};

	const openMap = (mode) => {
		mapMode.value = mode;
		isMapVisible.value = true;
	};

	const handleMapUpdated = (mapEventDetails) => {
		mapDetails.value = mapEventDetails;
		settingsStore.setMapDetails(mapEventDetails);
	};

	const handleCancelMap = () => {
		isMapVisible.value = false;
	};

	const handleSaveMap = () => {
		isMapVisible.value = false;
		if (mapMode.value === 'origin') {
			locationStart.value = { ...mapDetails.value };
		} else {
			locationEnd.value = { ...mapDetails.value };
		}
	};

	watch(mapDetails, (newDetails) => {
		if (mapMode.value === 'origin') {
			locationStart.value = { ...newDetails };
		} else {
			locationEnd.value = { ...newDetails };
		}
	});
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_travel_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.travel-item {
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
	}
	.form-container {
		color: #535353;
		.title-icon {
			vertical-align: middle;
			font-size: 3em;
			color: #535353;
		}
		.accordion-group {
			border: 1px solid var(--ion-color-light-shade);
			border-radius: 8px;
			overflow: hidden;
			margin-top: 20px;

			.header-no-margin {
				margin-top: 0;
			}
		}
		.money-input {
			font-size: 2em;
			.label-text-wrapper {
				font-size: 1em;
			}
		}
		.tipo-servicio {
			text-align: left;
		}
		.selected-address {
			color: #666;
			margin-right: 5px;
		}
	}
	.map-container {
		background-color: aqua;
		width: 100%;
		height: 100%;
	}
	ion-toast {
		--background: #ffdd00;
	}
</style>
