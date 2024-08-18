<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>{{
					modeForm === 'edit' ? 'Editar Turno' : 'Nuevo Turno'
				}}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<!-- CARD -->
			<ion-card class="shift-card" mode="ios">
				<ion-card-header class="shift-header">
					<ion-card-title class="shift-title">
						<div class="shift-tittle-info">
							{{ formatTime(form.startDate) }}
							<div class="day-tittle-start">
								{{ formatDay(form.startDate) }}
							</div>
							<ion-icon
								:icon="timeOutline"
								class="shift-header-icon"
								size="large"
							/>
							{{ formatTime(form.endDate) }}
							<div class="day-tittle-end">
								{{ formatDay(form.endDate) }}
							</div>
						</div>
					</ion-card-title>
				</ion-card-header>
				<div v-if="shouldShowKmInfo" class="ion-padding km-container">
					Kilometros
					<div class="right">{{ kmValue }} km</div>
					<ion-icon :icon="timerOutline"></ion-icon>
				</div>

				<div class="shift-footer">
					<div class="subtotal-container">
						<p class="fake-item">
							Hay {{ travels.length + notes.length }} viajes y notas en este
							turno.
						</p>
						<div class="shift-total">
							<div class="right">{{ calculatedSubtotal }} {{ currency }}</div>
						</div>
					</div>
				</div>
			</ion-card>
			<!-- CARD -->
			<ion-card class="form-card" mode="ios">
				<ion-card-content class="card-content">
					<!-- SHIFT START -->
					<ion-label mode="ios">Inicio turno</ion-label>
					<DateTimePicker
						:value="form.startDate"
						@dateTimeChange="handleStartDateChange"
					/>
					<!-- SHIFT END	 -->
					<ion-label mode="ios" class="label">Fin turno</ion-label>
					<DateTimePicker
						:value="form.endDate"
						@dateTimeChange="handleEndDateChange"
					/>
					<!-- KM START -->
					<ion-label mode="ios" class="label">Km en el turno</ion-label>
					<ion-item lines="none" class="travel-item" mode="ios">
						<ion-input
							label="Al empezar"
							label-placement="fixed"
							type="number"
							placeholder="000000"
							v-model.number="form.initialKm"
							inputmode="numeric"
							max="9999999"
							maxlength="7"
							min="0"
						>
							<span slot="end">Km</span>
						</ion-input>
					</ion-item>
					<!-- KM END -->
					<ion-item
						lines="none"
						class="travel-item input-separation"
						mode="ios"
					>
						<ion-input
							label="Al acabar"
							label-placement="fixed"
							type="number"
							placeholder="000000.00"
							v-model.number="form.finalKm"
							inputmode="numeric"
							max="9999999"
							maxlength="7"
							min="0"
						>
							<span slot="end">Km</span>
						</ion-input>
					</ion-item>

					<ion-item lines="none" mode="ios">
						<div>Total Km:</div>
						<span slot="end">
							<span class="km-diff">{{ kmValue }}</span>
							Km
						</span>
					</ion-item>
				</ion-card-content>
			</ion-card>

			<!-- TOAST DE COMPROBACIÓN -->
			<ion-toast
				:is-open="showToast"
				message="La fecha y hora de fin de turno debe ser mayor que la fecha y hora de inicio"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showToast = false)"
				position="bottom"
			></ion-toast>
			<ion-toast
				:is-open="showKmToast"
				message="El kilometraje final no puede ser menor que el inicial"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showKmToast = false)"
				position-anchor="form-footer"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
			<ion-toast
				:is-open="showOverlapToast"
				message="El turno se solapa con otro existente. Por favor, ajusta las fechas."
				:duration="3000"
				:icon="warningOutline"
				@didDismiss="() => (showOverlapToast = false)"
				position="bottom"
			></ion-toast>
			<!-- FINAL TOAST DE COMPROBACIÓN -->
		</ion-content>
		<ion-footer id="form-footer">
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
								{{ modeForm === 'edit' ? 'Guardar Cambios' : 'Nuevo Turno' }}
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
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonIcon,
		IonItem,
		IonLabel,
		IonInput,
		IonFooter,
		IonGrid,
		IonRow,
		IonCol,
		IonButton,
		IonToast,
	} from '@ionic/vue';
	import { timeOutline, timerOutline, warningOutline } from 'ionicons/icons';
	import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
	import { useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import {
		addShift,
		updateShift,
		selectShiftByID,
		getAllShifts,
	} from '../services/shiftService';
	import { getNotes } from '../services/noteService';
	import { getTravels } from '../services/travelService';
	import DateTimePicker from '@/components/DateTimePicker.vue';
	import { Capacitor } from '@capacitor/core';
	import { Keyboard } from '@capacitor/keyboard';

	const settingsStore = useSettingsStore();
	const currency = ref('€');
	const route = useRoute();
	const travels = ref([]);
	const notes = ref([]);

	const form = ref({
		startDate: moment().format('YYYY-MM-DDTHH:mm'),
		endDate: moment().add(4, 'hour').format('YYYY-MM-DDTHH:mm'),
		initialKm: 0,
		finalKm: 0,
	});

	const firstDayOfWeek = ref(1);
	const showToast = ref(false);
	const showOverlapToast = ref(false);
	const showKmToast = ref(false);
	const shiftId = ref(route.params.shiftId);
	const modeForm = ref(shiftId.value ? 'edit' : 'create');

	const calculatedSubtotal = computed(() => {
		let subtotal = 0;
		travels.value.forEach((travel) => {
			subtotal += travel.amount;
		});
		notes.value.forEach((note) => {
			if (note.noteType === 'income') {
				subtotal += note.amount;
			} else if (note.noteType === 'expense') {
				subtotal -= note.amount;
			}
		});
		return subtotal.toFixed(2);
	});

	const shouldShowKmInfo = computed(() => {
		return form.value.finalKm > form.value.initialKm;
	});

	const kmValue = computed(() => {
		return form.value.finalKm - form.value.initialKm;
	});

	// Cargar el turno
	const loadShift = async () => {
		// Establecer el valor del primer día de la semana por defecto
		firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

		if (modeForm.value === 'edit') {
			const shift = await selectShiftByID(parseInt(shiftId.value));
			if (shift) {
				form.value = { ...shift };
				loadTravelsAndNotes();
			}
		} else {
			// Inicializar con valores por defecto para un nuevo turno
			form.value = {
				startDate: moment().format('YYYY-MM-DDTHH:mm'),
				endDate: moment().add(4, 'hour').format('YYYY-MM-DDTHH:mm'),
				initialKm: 0,
				finalKm: 0,
			};
		}
	};

	// Cargar los viajes y notas relacionados con el turno actual
	const loadTravelsAndNotes = async () => {
		const [loadedTravels, loadedNotes] = await Promise.all([
			getTravels(form.value.startDate, form.value.endDate),
			getNotes(form.value.startDate, form.value.endDate),
		]);
		travels.value = [...loadedTravels];
		notes.value = [...loadedNotes];
	};

	onMounted(() => {
		if (Capacitor.isNativePlatform()) {
			Keyboard.addListener('keyboardDidShow', () => {
				document.getElementById('form-footer').style.display = 'none';
			});

			Keyboard.addListener('keyboardDidHide', () => {
				document.getElementById('form-footer').style.display = 'block';
			});
		}
		// Determinar el modo basado en la presencia de shiftId en la ruta
		modeForm.value = route.params.shiftId ? 'edit' : 'create';
		loadShift();
	});

	onBeforeUnmount(() => {
		if (Capacitor.isNativePlatform()) {
			Keyboard.removeAllListeners();
		}
	});

	watch(
		() => route.params.shiftId,
		async (newShiftId) => {
			if (newShiftId) {
				await loadShift();
			}
		}
	);

	const formatTime = (date) => moment(date).format('HH:mm');
	const formatDay = (date) => moment(date).format('DD MMM');

	// Función para verificar solapamiento de turnos
	const checkShiftOverlap = async (startDate, endDate) => {
		const allShifts = await getAllShifts();
		return allShifts.some((shift) => {
			// Excluimos el turno actual si estamos en modo edición
			if (modeForm.value === 'edit' && shift.id === parseInt(shiftId.value)) {
				return false;
			}
			return (
				moment(startDate).isBetween(
					shift.startDate,
					shift.endDate,
					null,
					'[]'
				) ||
				moment(endDate).isBetween(shift.startDate, shift.endDate, null, '[]') ||
				(moment(startDate).isSameOrBefore(shift.startDate) &&
					moment(endDate).isSameOrAfter(shift.endDate))
			);
		});
	};

	const handleSave = async () => {
		const initialKm = Number(form.value.initialKm);
		const finalKm = Number(form.value.finalKm);

		// Validar KM
		if (finalKm < initialKm) {
			showKmToast.value = true;
			return;
		}

		// Verificar solapamiento antes de guardar
		const isOverlapping = await checkShiftOverlap(
			form.value.startDate,
			form.value.endDate
		);
		if (isOverlapping) {
			showOverlapToast.value = true;
			return;
		}

		try {
			if (modeForm.value === 'edit') {
				await updateShift(
					parseInt(shiftId.value),
					form.value.startDate,
					form.value.endDate,
					initialKm,
					finalKm
				);
			} else {
				await addShift(
					form.value.startDate,
					form.value.endDate,
					initialKm,
					finalKm
				);
			}
			history.back();
		} catch (error) {
			console.error('Error al guardar el turno:', error);
			// Aquí podrías mostrar un mensaje de error al usuario
		}
	};

	const handleCancel = () => {
		history.back();
	};

	const handleStartDateChange = (event) => {
		form.value.startDate = event;
		checkDateValidity();
	};

	const handleEndDateChange = (event) => {
		form.value.endDate = event;
		checkDateValidity();
	};

	const checkDateValidity = () => {
		const start = moment(form.value.startDate);
		const end = moment(form.value.endDate);

		if (end.isSameOrBefore(start)) {
			showToast.value = true;
			form.value.endDate = moment(start)
				.add(4, 'hour')
				.format('YYYY-MM-DDTHH:mm');
		}
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_shift_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.shift-card {
		border: 1px solid #ccc;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: rgba(255, 255, 255, 0.8);
			text-align: center;
			padding-left: 0;
			padding-right: 0;
			.shift-title {
				.shift-tittle-info {
					position: relative;
					font-size: 1.3em;
					font-weight: 300 !important;
					text-align: center;
					width: 100%;
					color: #666;
					.day-tittle-start,
					.day-tittle-end {
						font-size: 0.4em;
						position: absolute;
						left: 50%;
						margin-left: -80px;
						bottom: -10px;
					}
					.day-tittle-end {
						margin-left: 32px;
					}
				}
				.shift-header-icon {
					vertical-align: middle;
					width: 1.5em;
					height: 1.5em;
					margin: -5px 0 0 0;
				}
			}
		}

		.km-container {
			background: #eaeaea;
			font-size: 1.3em;
			border-bottom: 1px #d8d8d8 solid;
			color: #8f8f8f;
			.icon {
				vertical-align: bottom;
			}
			.right {
				float: right;
				text-align: right;
				padding-right: 1.7em;
			}
		}
		.shift-footer {
			background-color: rgba(255, 255, 255, 0.8);

			.subtotal-container {
				padding-top: 0.2em;
				padding-bottom: 0.2em;
				/*border-top: 1px #666 dashed;*/
				font-size: 2.4em;
				color: #8f8f8f;
				background: #eaeaea;
				margin-bottom: -7px;

				.fake-item {
					font-size: 0.5em;
					background: transparent;
					border-bottom: 1px #666 dashed;
					text-align: center;
					padding-bottom: 1.3em;
					margin-block-end: 0;
				}

				.right {
					float: right;
					text-align: right;
					padding-right: 1em;
				}
				.shift-total {
					border-top: 1px solid #ccc;
					padding-top: 0.3em;
					padding-bottom: 1.5em;
					padding-right: 0.4em;
					color: #333;
					background-color: #fff;
				}
			}
		}
	}
	.form-card {
		border: 1px solid #ccc;
		position: relative;
		.travel-item {
			border: 1px solid #ccc;
			border-radius: 8px;
			box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
		}
	}
	.label {
		display: block;
		margin-top: 20px;
	}
	.input-separation {
		margin-top: 10px;
	}
	ion-toast {
		--background: #ffdd00;
	}
</style>
