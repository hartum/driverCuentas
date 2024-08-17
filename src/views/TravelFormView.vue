<template>
	<ion-page>
		<ion-header v-show="!isMapVisible" mode="ios">
			<ion-toolbar>
				<ion-title>
					{{ modeForm === 'edit' ? 'Editar viaje' : 'Nuevo viaje' }}
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content
			class="form-container"
			:class="{ 'ion-padding': !isMapVisible }"
		>
			<div v-show="!isMapVisible">
				<!-- PREVIEW -->
				<div class="preview-container">
					<ion-item lines="none" class="preview-item" mode="ios">
						<span slot="start">
							<ion-icon class="title-icon" :icon="payIcons[pay]" />
						</span>
						<ion-label mode="ios">
							<span class="hour-date-container">
								{{ hour(datetimeStart) }}
								<div class="date-container">
									{{ day(datetimeStart) }} {{ month(datetimeStart) }}
								</div>
							</span>
							<span class="money"> {{ formattedAmount }}{{ currency }} </span>
						</ion-label>
					</ion-item>
				</div>
				<!-- CARD -->
				<ion-card class="form-card" mode="ios">
					<ion-card-content class="card-content">
						<!-- PAYMENT METHOD -->
						<ion-label mode="ios">Pago con</ion-label>
						<ion-segment v-model="pay" mode="ios">
							<ion-segment-button value="app" mode="ios">
								<ion-label mode="ios">App</ion-label>
								<ion-icon
									:icon="payIcons['app']"
									class="icons"
									size="large"
								></ion-icon>
							</ion-segment-button>
							<ion-segment-button value="cash" mode="ios">
								<ion-label mode="ios">Efectivo</ion-label>
								<ion-icon
									:icon="payIcons['cash']"
									class="icons"
									size="large"
								></ion-icon>
							</ion-segment-button>
							<ion-segment-button value="card" mode="ios">
								<ion-label mode="ios">Tarjeta</ion-label>
								<ion-icon
									:icon="payIcons['card']"
									class="icons"
									size="large"
								></ion-icon>
							</ion-segment-button>
						</ion-segment>
						<!-- TRAVEL DATE -->
						<ion-label class="label" mode="ios"></ion-label>
						<ion-range
							:min="0"
							:max="100"
							:value="rangeValue"
							:pin="true"
							:pin-formatter="formatRangePin"
							@ionChange="handleRangeChange"
							mode="ios"
							class="time-range"
						>
							<div slot="start">
								<div class="upper-text">Inicio turno</div>
								<span class="hour-date-container">
									{{ hour(shiftStartDate) }}
									<div class="date-container">
										{{ day(shiftStartDate) }} {{ month(shiftStartDate) }}
									</div>
								</span>
							</div>
							<div slot="end">
								<div class="upper-text">Fin turno</div>
								<span class="hour-date-container">
									{{ hour(shiftEndDate) }}
									<div class="date-container">
										{{ day(shiftEndDate) }} {{ month(shiftEndDate) }}
									</div>
								</span>
							</div>
						</ion-range>
						<!-- AMOUNT -->
						<ion-label class="label" mode="ios">Importe</ion-label>
						<ion-item lines="none" class="travel-item" mode="ios">
							<ion-input
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
							</ion-input>
						</ion-item>

						<!-- TRAVEL LOCATION -->
						<ion-label class="label" mode="ios">Trayecto</ion-label>
						<div @click="openMap('origin')" class="origin-input">
							<ion-icon
								:icon="pinOutline"
								size="large"
								class="place-icons"
							></ion-icon>
							{{ locationStart.address || 'Elige dirección' }}
						</div>
						<div @click="openMap('destination')" class="destination-input">
							<ion-icon
								:icon="flagOutline"
								size="large"
								class="place-icons"
							></ion-icon>
							{{ locationEnd.address || 'Elige dirección' }}
						</div>
						<ion-item
							v-if="distance !== null && distance > 0"
							lines="none"
							mode="ios"
						>
							<ion-label
								>*Distancia en línea recta:
								{{ distance.toFixed(2) }} km</ion-label
							>
						</ion-item>
						<ion-label class="label" mode="ios"> Servicio para </ion-label>
						<ion-item lines="none" mode="ios">
							<ion-radio-group class="tipo-servicio" v-model="service">
								<ion-radio
									v-for="(serviceOption, index) in servicesList"
									:key="index"
									:value="serviceOption"
									justify="start"
									label-placement="end"
									mode="ios"
								>
									{{ serviceOption }}
								</ion-radio>
							</ion-radio-group>
						</ion-item>
					</ion-card-content>
				</ion-card>
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
				message="Por favor, ingresa un importe mayor a 0.00€"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="showToast = false"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
		</ion-content>
		<ion-footer v-if="!isMapVisible" id="form-footer">
			<ion-toolbar>
				<ion-grid>
					<ion-row>
						<ion-col>
							<ion-button
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancel"
							>
								Cancelar
							</ion-button>
						</ion-col>
						<ion-col>
							<ion-button
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSave"
							>
								{{ modeForm === 'edit' ? 'Guardar Cambios' : 'Nuevo viaje' }}
							</ion-button>
						</ion-col>
					</ion-row>
				</ion-grid>
			</ion-toolbar>
		</ion-footer>
		<ion-footer v-else>
			<ion-toolbar>
				<ion-grid>
					<ion-row>
						<ion-col>
							<ion-button
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancelMap"
							>
								Cancelar
							</ion-button>
						</ion-col>
						<ion-col>
							<ion-button
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSaveMap"
							>
								{{
									mapMode === 'origin' ? 'Asignar origen' : 'Asignar destino'
								}}
							</ion-button>
						</ion-col>
					</ion-row>
				</ion-grid>
			</ion-toolbar>
		</ion-footer>
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
		IonItem,
		IonLabel,
		IonInput,
		IonRadioGroup,
		IonRadio,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonFooter,
		IonToast,
		IonRange,
		IonCard,
		IonCardContent,
	} from '@ionic/vue';
	import {
		cardOutline,
		cashOutline,
		phonePortraitOutline,
		warningOutline,
		pinOutline,
		flagOutline,
	} from 'ionicons/icons';
	import { ref, onMounted, watch, computed } from 'vue';
	import { useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import MapViewer from '../components/MapViewer.vue';
	import { selectShiftByID } from '@/services/shiftService';
	import {
		addTravel,
		selectTravelByID,
		updateTravel,
	} from '@/services/travelService'; // Importar el servicio

	const settingsStore = useSettingsStore();
	const openAccordion = ref('amount');
	const amountForm = ref('');
	const currency = ref('€');
	const pay = ref('app');
	const datetimeStart = ref(moment().format('YYYY-MM-DDTHH:mm'));
	const timeStart = ref(moment().format('HH:mm'));
	const dateStart = ref(moment().format('YYYY-MM-DD'));
	//const firstDayOfWeek = ref(1);
	const locationStart = ref({});
	const locationEnd = ref({});
	const isMapVisible = ref(false);
	const mapMode = ref('origin');
	const mapDetails = ref(settingsStore.mapDetails);
	const showToast = ref(false);
	const route = useRoute();
	const travelId = ref(route.params.travelId);
	const shiftId = ref(route.params.shiftId);
	const modeForm = ref(travelId.value ? 'edit' : 'create');
	const shiftStartDate = ref(null);
	const shiftEndDate = ref(null);
	const rangeValue = ref(0);
	const currentDateTime = ref(null);
	const servicesList = settingsStore.servicesList;
	const service = ref(servicesList[0] || '');
	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	// Cargar el turno y el viaje
	const loadShiftAndTravel = async () => {
		try {
			const shift = await selectShiftByID(parseInt(shiftId.value));
			if (shift) {
				shiftStartDate.value = moment(shift.startDate);
				shiftEndDate.value = moment(shift.endDate);
				const middleTime = shiftStartDate.value
					.clone()
					.add(
						shiftEndDate.value.diff(shiftStartDate.value) / 2,
						'milliseconds'
					);
				currentDateTime.value = middleTime;
				if (modeForm.value === 'create') {
					datetimeStart.value = middleTime.format('YYYY-MM-DDTHH:mm');
					dateStart.value = middleTime.format('YYYY-MM-DD');
					timeStart.value = middleTime.format('HH:mm');
					// Calcular el rangeValue basado en la hora intermedia
					const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
					const elapsedDuration = middleTime.diff(shiftStartDate.value);
					rangeValue.value = (elapsedDuration / totalDuration) * 100;
				}
			}
			if (modeForm.value === 'edit') {
				const travel = await selectTravelByID(parseInt(travelId.value));
				if (travel) {
					amountForm.value = travel.amount;
					service.value = travel.service;
					pay.value = travel.payMethod;
					datetimeStart.value = travel.startDate;
					dateStart.value = moment(travel.startDate).format('YYYY-MM-DD');
					timeStart.value = moment(travel.startDate).format('HH:mm');

					// Asignar las direcciones solo si existen en el viaje
					if (travel.origin && travel.origin.address) {
						locationStart.value = travel.origin;
					}
					if (travel.destination && travel.destination.address) {
						locationEnd.value = travel.destination;
					}
					// Ajustar el valor del range basado en la fecha de inicio del viaje
					setRangeValueFromDateTime(moment(travel.startDate));
				}
			}
		} catch (error) {
			console.error('Error loading shift and travel:', error);
		}
	};

	const setRangeValueFromDateTime = (dateTime) => {
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = dateTime.diff(shiftStartDate.value);
		rangeValue.value = (elapsedDuration / totalDuration) * 100;
	};

	const handleRangeChange = (event) => {
		const percentage = event.detail.value;
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = totalDuration * (percentage / 100);
		currentDateTime.value = shiftStartDate.value
			.clone()
			.add(elapsedDuration, 'milliseconds');
		datetimeStart.value = currentDateTime.value.format('YYYY-MM-DDTHH:mm');
	};

	// Watch para la ruta
	watch(
		() => route.params,
		(newParams) => {
			travelId.value = newParams.travelId;
			loadShiftAndTravel();
		}
	);

	onMounted(loadShiftAndTravel);

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

			history.back();
		} catch (error) {
			console.error('Error guardando el viaje:', error);
		}
	};

	// Cancelar el viaje
	const handleCancel = () => {
		history.back();
	};

	const openMap = (mode) => {
		mapMode.value = mode;
		isMapVisible.value = true;
		openAccordion.value = 'travel';
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
		settingsStore.setMapDetails(mapDetails.value);
		openAccordion.value = 'travel';
	};

	watch(mapDetails, (newDetails) => {
		if (mapMode.value === 'origin') {
			locationStart.value = { ...newDetails };
		} else {
			locationEnd.value = { ...newDetails };
		}
	});

	const day = (date) => {
		return moment(date).format('DD');
	};

	const hour = (date) => {
		return moment(date).format('HH:mm');
	};

	const month = (date) => {
		return moment(date).format('MMM');
	};

	const formattedAmount = computed(() => {
		const amount = parseFloat(amountForm.value);
		return isNaN(amount) ? '0.00' : amount.toFixed(2);
	});

	// Calcula distancia en kilómetros en linea recta
	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // Radio de la Tierra en kilómetros
		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRadians(lat1)) *
				Math.cos(toRadians(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distancia en kilómetros

		return distance;
	}

	function toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	const distance = computed(() => {
		if (
			locationStart.value.latitude &&
			locationStart.value.longitude &&
			locationEnd.value.latitude &&
			locationEnd.value.longitude
		) {
			return calculateDistance(
				locationStart.value.latitude,
				locationStart.value.longitude,
				locationEnd.value.latitude,
				locationEnd.value.longitude
			);
		}
		return null;
	});

	// Este método formatea el valor del pin para mostrar la hora correspondiente
	const formatRangePin = (value) => {
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = totalDuration * (value / 100);
		const pinDateTime = shiftStartDate.value
			.clone()
			.add(elapsedDuration, 'milliseconds');
		datetimeStart.value = pinDateTime.format('YYYY-MM-DDTHH:mm');
		return pinDateTime.format('HH:mm');
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_travel_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.preview-container {
		ion-item::part(native) {
			background: rgba(234, 234, 234, 0.9);
		}
	}

	.form-container {
		color: #535353;
		.title-icon {
			vertical-align: middle;
			font-size: 3em;
			color: #8f8f8f;
		}
		.form-card {
			border: 1px solid #ccc;
			margin: 20px 0;
			position: relative;
			.icons {
				margin-top: 0.5em;
			}
			.travel-item {
				border: 1px solid #ccc;
				border-radius: 8px;
				box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
			}
			.time-range {
				padding-top: 0;
			}
			.origin-input {
				border: 1px solid #ccc;
				border-radius: 8px 8px 0 0;
				background-color: #fff;
				box-shadow: rgba(0, 0, 0, 0.12) 0px -4px 16px 0px;
				display: flex;
				align-items: center;
			}
			.destination-input {
				border: 1px solid #ccc;
				border-radius: 0 0 8px 8px;
				background-color: #fff;
				box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
				margin-top: -1px;
				display: flex;
				align-items: center;
			}
			.place-icons {
				margin: 15px;
			}
			.label {
				display: block;
				margin-top: 20px;
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
	/*---------------------------*/
	.preview-item {
		margin-top: 20px;
		border: 1px solid #ccc;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
	}
	.upper-text {
		font-size: 0.8em;
		font-weight: 600;
		border-bottom: 1px solid #ccc;
	}
	.hour-date-container {
		font-size: 1.5em;
		float: left;
		color: #8f8f8f;
		.date-container {
			font-size: 0.5em;
			color: #616161;
		}
	}

	.money {
		font-size: 2em;
		vertical-align: text-bottom;
		text-align: right;
		float: right;
		color: #666;
	}
</style>
