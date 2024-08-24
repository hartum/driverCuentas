<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>{{
					modeForm === 'edit' ? 'Editar Nota' : 'Nueva Nota'
				}}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding form-container">
			<!-- PREVIEW -->
			<div class="preview-container">
				<ion-item lines="none" class="preview-item" mode="ios">
					<span slot="start">
						<ion-icon class="title-icon" :icon="payIcons[form.noteType]" />
					</span>
					<ion-label mode="ios">
						<span class="hour-date-container">
							{{ formatDateTime(form.noteDate, 'HH:mm') }}
							<div class="date-container">
								{{ formatDateTime(form.noteDate, 'DD') }}
								{{ formatDateTime(form.noteDate, 'MMM') }}
							</div>
						</span>
						<span class="money"> {{ form.amount }}{{ currency }} </span>
					</ion-label>
				</ion-item>
			</div>

			<!-- CARD -->
			<ion-card class="form-card" mode="ios">
				<ion-card-content class="card-content">
					<!-- NOTE TYPE -->
					<ion-label mode="ios">Tipo nota</ion-label>
					<ion-segment
						v-model="form.noteType"
						mode="ios"
						class="segment-container"
					>
						<ion-segment-button value="income" mode="ios">
							<ion-label mode="ios">Ingreso</ion-label>
							<ion-icon
								:icon="thumbsUpOutline"
								class="icons"
								size="large"
							></ion-icon>
						</ion-segment-button>
						<ion-segment-button value="expense" mode="ios">
							<ion-label mode="ios">Gasto</ion-label>
							<ion-icon
								:icon="thumbsDownOutline"
								class="icons"
								size="large"
							></ion-icon>
						</ion-segment-button>
						<ion-segment-button value="other" mode="ios">
							<ion-label mode="ios">Nota</ion-label>
							<ion-icon
								:icon="readerOutline"
								class="icons"
								size="large"
							></ion-icon>
						</ion-segment-button>
					</ion-segment>
					<!-- NOTE DATE -->
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
								{{ formatDateTime(shiftStartDate, 'HH:mm') }}
								<div class="date-container">
									{{ formatDateTime(shiftStartDate, 'DD') }}
									{{ formatDateTime(shiftStartDate, 'MMM') }}
								</div>
							</span>
						</div>
						<div slot="end">
							<div class="upper-text">Fin turno</div>
							<span class="hour-date-container">
								{{ formatDateTime(shiftEndDate, 'HH:mm') }}
								<div class="date-container">
									{{ formatDateTime(shiftEndDate, 'DD') }}
									{{ formatDateTime(shiftEndDate, 'MMM') }}
								</div>
							</span>
						</div>
					</ion-range>
					<!-- AMOUNT -->

					<ion-label class="label" mode="ios" v-show="form.noteType != 'other'">
						Importe
					</ion-label>
					<ion-item
						lines="none"
						class="travel-item"
						v-show="form.noteType != 'other'"
						mode="ios"
					>
						<ion-input
							class="money-input"
							type="number"
							inputmode="decimal"
							placeholder="000.00"
							max="999"
							maxlength="6"
							min="0"
							v-model="form.amount"
							:disabled="form.noteType == 'other'"
							@keyup.enter="hideKeyboard"
						>
							<span slot="end">€</span>
						</ion-input>
					</ion-item>
					<!-- NOTE DESCRIPTION -->
					<ion-label class="label" mode="ios">Concepto</ion-label>
					<ion-textarea
						rows="5"
						placeholder="Descripción de la nota, Ejem: ITV"
						v-model="form.description"
						class="travel-item area-padding"
					></ion-textarea>
					<!-- FUEL CHECKBOX -->
					<ion-item lines="none" v-show="form.noteType === 'expense'">
						<ion-checkbox
							v-model="form.fuel"
							label-placement="end"
							justify="start"
							mode="ios"
						>
							Combustible
						</ion-checkbox>
						<ion-icon :icon="informationCircle" @click="presentFuelInfo" />
					</ion-item>
				</ion-card-content>
			</ion-card>

			<!-- ALERT -->
			<ion-alert
				:is-open="showAlert"
				header="Combustible"
				sub-header="¿para que sirve esto?"
				message="Si marcas el gasto como combustible, la App podrá ofrecerte estadísticas sobre el consumo de combustible."
				:buttons="['Entendido']"
				@didDismiss="showAlert = false"
				mode="ios"
			></ion-alert>

			<!-- TOAST -->
			<ion-toast
				:is-open="showToast"
				:message="toastMessage"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showToast = false)"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
		</ion-content>
		<ion-footer id="form-footer">
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
							Guardar
						</ion-button>
					</ion-col>
				</ion-row>
			</ion-grid>
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
		IonTextarea,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonFooter,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonToast,
		IonRange,
		IonCard,
		IonCardContent,
		IonCheckbox,
		IonAlert,
	} from '@ionic/vue';
	import {
		thumbsUpOutline,
		thumbsDownOutline,
		readerOutline,
		warningOutline,
		informationCircle,
	} from 'ionicons/icons';
	import { useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
	import { addNote, getNoteById, updateNote } from '@/services/noteService';
	import { selectShiftByID } from '@/services/shiftService';
	import { Capacitor } from '@capacitor/core';
	import { Keyboard } from '@capacitor/keyboard';

	const settingsStore = useSettingsStore();
	const route = useRoute();
	const noteId = ref(route.params.noteId);
	const shiftId = ref(route.params.shiftId);
	const modeForm = ref(noteId.value ? 'edit' : 'create');
	const showAlert = ref(false);
	const currency = computed(() => {
		const currencyMap = { EUR: '€', USD: '$' };
		return (
			currencyMap[settingsStore.selectedCurrency] ||
			settingsStore.selectedCurrency
		);
	});

	const form = ref({
		noteType: 'income',
		noteDate: moment().format('YYYY-MM-DDTHH:mm'),
		description: '',
		amount: '',
		fuel: false,
	});

	const shiftStartDate = ref(null);
	const shiftEndDate = ref(null);
	const rangeValue = ref(0);

	const showToast = ref(false);
	const toastMessage = ref('');
	const payIcons = {
		income: thumbsUpOutline,
		expense: thumbsDownOutline,
		other: readerOutline,
	};

	const handleRangeChange = (event) => {
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = totalDuration * (event.detail.value / 100);
		const newDateTime = shiftStartDate.value
			.clone()
			.add(elapsedDuration, 'milliseconds');
		form.value.noteDate = newDateTime.format('YYYY-MM-DDTHH:mm');
	};

	const loadNoteAndShift = async () => {
		try {
			const shift = await selectShiftByID(parseInt(shiftId.value));
			if (shift) {
				shiftStartDate.value = moment(shift.startDate);
				shiftEndDate.value = moment(shift.endDate);

				if (modeForm.value === 'create') {
					const middleTime = shiftStartDate.value
						.clone()
						.add(
							shiftEndDate.value.diff(shiftStartDate.value) / 2,
							'milliseconds'
						);
					form.value.noteDate = middleTime.format('YYYY-MM-DDTHH:mm');
					setRangeValueFromDateTime(middleTime);
				}
			}

			if (modeForm.value === 'edit') {
				const note = await getNoteById(parseInt(noteId.value));
				if (note) {
					form.value = {
						noteType: note.noteType,
						noteDate: note.noteDate,
						description: note.description,
						amount: note.amount,
						fuel: note.fuel,
					};
					setRangeValueFromDateTime(moment(note.noteDate));
				}
			}
		} catch (error) {
			console.error('Error loading note and shift:', error);
		}
	};

	const setRangeValueFromDateTime = (dateTime) => {
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = dateTime.diff(shiftStartDate.value);
		rangeValue.value = (elapsedDuration / totalDuration) * 100;
	};

	const formatRangePin = (value) => {
		const totalDuration = shiftEndDate.value.diff(shiftStartDate.value);
		const elapsedDuration = totalDuration * (value / 100);
		const pinDateTime = shiftStartDate.value
			.clone()
			.add(elapsedDuration, 'milliseconds');
		// Compara si la fecha y hora actual es igual al inicio del turno
		if (pinDateTime.isSame(shiftStartDate.value, 'minute')) {
			// Suma 1 minuto si son iguales
			pinDateTime.add(1, 'minute');
		}
		form.value.noteDate = pinDateTime.format('YYYY-MM-DDTHH:mm');
		return pinDateTime.format('HH:mm');
	};

	const formatDateTime = (date, format) => {
		return date ? moment(date).format(format) : '';
	};

	// Watch para la ruta
	watch(
		() => route.params,
		(newParams) => {
			noteId.value = newParams.travelId;
			shiftId.value = newParams.shiftId;
			loadNoteAndShift();
		}
	);

	onMounted(() => {
		if (Capacitor.isNativePlatform()) {
			Keyboard.addListener('keyboardDidShow', () => {
				document.getElementById('form-footer').style.display = 'none';
			});

			Keyboard.addListener('keyboardDidHide', () => {
				document.getElementById('form-footer').style.display = 'block';
			});
		}
		loadNoteAndShift();
	});

	onBeforeUnmount(() => {
		if (Capacitor.isNativePlatform()) {
			Keyboard.removeAllListeners();
		}
	});

	const handleSave = async () => {
		if (
			(form.value.noteType === 'income' || form.value.noteType === 'expense') &&
			(parseFloat(form.value.amount) <= 0 ||
				isNaN(parseFloat(form.value.amount)))
		) {
			toastMessage.value =
				'El importe debe ser mayor que 0 para ingresos ó gastos';
			showToast.value = true;
			return;
		}

		if (form.value.noteType === 'other') {
			form.value.amount = '0';
		}

		try {
			if (modeForm.value === 'edit') {
				await updateNote(
					parseInt(noteId.value),
					form.value.noteType,
					parseFloat(form.value.amount),
					form.value.noteDate,
					form.value.description,
					form.value.fuel
				);
			} else {
				console.log('voya guardar la nota', form.value);
				await addNote(
					form.value.noteType,
					parseFloat(form.value.amount),
					form.value.noteDate,
					form.value.description,
					form.value.fuel
				);
			}

			history.back();
		} catch (error) {
			console.error('Error guardando la nota:', error);
		}
	};

	const handleCancel = () => {
		history.back();
	};

	const presentFuelInfo = () => {
		showAlert.value = true;
	};

	const hideKeyboard = () => {
		if (Capacitor.isNativePlatform()) {
			Keyboard.hide();
		}
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.preview-container {
		ion-item::part(native) {
			background: rgba(234, 234, 234, 0.9);
		}
	}
	ion-segment {
		--background: rgba(255, 255, 255, 0.5);
	}
	ion-toast {
		--background: #ffdd00;
		color: #535353;
	}
	/*---------------------------*/
	.preview-item {
		margin-top: 20px;
		border: 1px solid #ccc;
		box-shadow: var(--ion-color-light-shade) 0px 4px 16px 0px;
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
				box-shadow: var(--ion-color-light-shade) 0px 4px 16px 0px;
			}
			.area-padding {
				padding: 0 1em;
			}
			.time-range {
				padding-top: 0;
			}
			.label {
				display: block;
				margin-top: 20px;
			}
		}
	}
	.time-range {
		padding-top: 0;
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

	.segment-container {
		background-color: #f0f0f0; /* Fondo gris claro */
		border-radius: 8px;
	}
</style>
