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
									<DateTimePicker
										:value="datetimeStart"
										@dateTimeChange="handleDateChange"
									/>
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
						<div class="ion-padding payMode-container" slot="content">
							<ion-segment v-model="pay">
								<ion-segment-button value="app">
									<ion-label>App</ion-label>
									<ion-icon
										:icon="payIcons['app']"
										class="icons"
										size="large"
									></ion-icon>
								</ion-segment-button>
								<ion-segment-button value="cash">
									<ion-label>Efectivo</ion-label>
									<ion-icon
										:icon="payIcons['cash']"
										class="icons"
										size="large"
									></ion-icon>
								</ion-segment-button>
								<ion-segment-button value="card">
									<ion-label>Tarjeta</ion-label>
									<ion-icon
										:icon="payIcons['card']"
										class="icons"
										size="large"
									></ion-icon>
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
	import DateTimePicker from '../components/DateTimePicker.vue';
	import {
		addTravel,
		selectTravelByID,
		updateTravel,
	} from '@/services/travelService'; // Importar el servicio

	const settingsStore = useSettingsStore();
	const amountForm = ref('');
	const currency = ref('€');
	const pay = ref('app');
	const datetimeStart = ref(moment().format('YYYY-MM-DDTHH:mm'));
	const timeStart = ref(moment().format('HH:mm'));
	const dateStart = ref(moment().format('YYYY-MM-DD'));
	const firstDayOfWeek = ref(1);
	const locationStart = ref({});
	const locationEnd = ref({});
	const service = ref('');
	const isMapVisible = ref(false);
	const mapMode = ref('origin');
	const mapDetails = ref(settingsStore.mapDetails);
	const showToast = ref(false);
	const router = useRouter();
	const route = useRoute();
	const travelId = ref(route.params.travelId);
	const modeForm = ref(null);
	const servicesList = settingsStore.servicesList;
	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	if (moment(travelId.value, moment.ISO_8601, true).isValid()) {
		modeForm.value = 'create';
	} else {
		modeForm.value = 'edit';
	}

	const handleDateChange = (event) => {
		datetimeStart.value = event;
	};

	// Cargar el viaje
	const loadTravel = async () => {
		// Establecer el valor del primer día de la semana por defecto
		// ======= MOVER ESTO A DATEPICKER =======
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
				dateStart.value = moment(travel.startDate).format('YYYY-MM-DD');
				timeStart.value = moment(travel.startDate).format('HH:mm');
				console.log('Fecha cargada:', datetimeStart.value); // Para depuración
			}
		}
	};

	onMounted(loadTravel);

	// Guardar el viaje
	const handleSave = async () => {
		// Validar que la cantidad sea mayor que cero
		if (
			parseFloat(amountForm.value) <= 0 ||
			isNaN(parseFloat(amountForm.value))
		) {
			showToast.value = true;
			return;
		}
		console.log('fecha para guardar', datetimeStart.value);

		try {
			if (modeForm.value === 'edit') {
				console.log('Edito');
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
				console.log('Creo');
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
	.payMode-container {
		.icons {
			margin-top: 0.5em;
		}
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
			background-color: transparent;
			text-align: left;
			width: 100%;
		}
	}
	.input-wrapper {
		display: -ms-flexbox;
		display: flex;
		-ms-flex: 1;
		flex: 1;
		-ms-flex-direction: inherit;
		flex-direction: inherit;
		-ms-flex-align: inherit;
		align-items: baseline;
		-ms-flex-item-align: stretch;
		align-self: stretch;
		text-overflow: ellipsis;
		overflow: inherit;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
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
