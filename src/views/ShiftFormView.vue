<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>{{
					modeForm === 'edit' ? 'Editar Turno' : 'Nuevo Turno'
				}}</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent class="form-container">
			<IonCard class="shift-card">
				<IonCardHeader class="shift-header">
					<IonCardTitle class="shift-title">
						<IonIcon
							:icon="timeOutline"
							class="shift-header-icon"
							size="large"
						/>
						{{ formatTime(form.startDate) }} - {{ formatTime(form.endDate) }}
					</IonCardTitle>
				</IonCardHeader>
				<div class="shift-footer ion-padding">
					<div>
						<div
							v-show="
								(form.totalKm > 0 && form.modeKM == 'fix') ||
								(form.finalKm - form.initialKm > 0 &&
									form.modeKM == 'calculatedKm')
							"
						>
							<IonIcon :icon="timerOutline"></IonIcon>

							<b v-if="form.modeKM == 'fix'">{{ form.totalKm }}</b>
							<b v-else>{{ form.finalKm - form.initialKm }}</b>
							Km
						</div>
						<div v-show="form.gasoline > 0">
							<IonIcon :icon="waterOutline"></IonIcon>
							<b>{{ form.gasoline }}</b> {{ currency }}
						</div>
					</div>
					<div class="shift-footer-right">
						<div>SubTotal</div>
						<div v-if="form.modeTotalShift == 'fixTotal'" class="shift-total">
							{{ form.totalShift + ' ' + currency }}
						</div>
						<div v-else><i>*calculado</i> {{ currency }}</div>
					</div>
				</div>
			</IonCard>
			<IonAccordionGroup
				value="shiftTime"
				expand="inset"
				class="accordion-group"
			>
				<IonAccordion value="shiftTime">
					<IonItem slot="header" color="light">
						<IonLabel>Horario</IonLabel>
					</IonItem>
					<div slot="content" class="ion-padding">
						<IonList lines="none">
							<IonItem>
								<IonLabel>Inicio turno</IonLabel>
								<IonDatetimeButton
									datetime="startPicker"
									mode="ios"
								></IonDatetimeButton>
								<IonModal :keep-contents-mounted="true">
									<IonDatetime
										locale="es-ES"
										:first-day-of-week="firstDayOfWeek"
										:show-default-buttons="true"
										id="startPicker"
										v-model="form.startDate"
										mode="ios"
										display-format="YYYY-MM-DD HH:mm:ss"
										picker-format="YYYY-MM-DD HH:mm:ss"
										:hour-cycles="['h23']"
										@ionChange="checkDateValidity"
									></IonDatetime>
								</IonModal>
							</IonItem>
							<IonItem>
								<IonLabel>Fin turno</IonLabel>
								<IonDatetimeButton
									datetime="endPicker"
									mode="ios"
								></IonDatetimeButton>
								<IonModal :keep-contents-mounted="true">
									<IonDatetime
										locale="es-ES"
										:first-day-of-week="firstDayOfWeek"
										:show-default-buttons="true"
										id="endPicker"
										v-model="form.endDate"
										mode="ios"
										display-format="YYYY-MM-DD HH:mm:ss"
										picker-format="YYYY-MM-DD HH:mm:ss"
										:hour-cycles="['h23']"
										@ionChange="checkDateValidity"
									></IonDatetime>
								</IonModal>
							</IonItem>
						</IonList>
					</div>
				</IonAccordion>
				<IonAccordion value="gas">
					<IonItem slot="header" color="light">
						<IonLabel>Gasolina</IonLabel>
					</IonItem>
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonInput
								label="Cantidad"
								label-placement="fixed"
								type="number"
								placeholder="000.00"
								v-model.number="form.gasoline"
								inputmode="decimal"
								max="999"
								maxlength="6"
								min="0"
							>
								<span slot="end">{{ currency }}</span>
							</IonInput>
						</IonItem>
					</div>
				</IonAccordion>
				<IonAccordion value="km">
					<IonItem slot="header" color="light">
						<IonLabel>Kilometraje</IonLabel>
					</IonItem>
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonSegment v-model="form.modeKM">
								<IonSegmentButton value="calculatedKm">
									<IonLabel>Calculado</IonLabel>
								</IonSegmentButton>
								<IonSegmentButton value="fix">
									<IonLabel>Fijo</IonLabel>
								</IonSegmentButton>
							</IonSegment>
						</IonItem>
						<IonItem v-show="form.modeKM == 'calculatedKm'" lines="none">
							<IonInput
								class="money-input"
								label="Inicio turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model.number="form.initialKm"
								inputmode="decimal"
								max="999"
								maxlength="6"
								min="0"
							>
								<span slot="end">Km</span>
							</IonInput>
						</IonItem>
						<IonItem v-show="form.modeKM == 'calculatedKm'">
							<IonInput
								class="money-input"
								label="Fin turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model.number="form.finalKm"
								inputmode="decimal"
								max="999999"
								maxlength="8"
								min="0"
							>
								<span slot="end">Km</span>
							</IonInput>
						</IonItem>
						<IonItem v-show="form.modeKM == 'calculatedKm'" lines="none">
							<div>En este turno</div>
							<span slot="end">
								<span class="km-diff">
									{{ form.finalKm - form.initialKm }}
								</span>
								Km
							</span>
						</IonItem>
						<IonItem v-show="form.modeKM == 'fix'" lines="none">
							<IonInput
								label="En este turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model.number="form.totalKm"
								inputmode="decimal"
								max="999999"
								maxlength="8"
							>
								<span slot="end">Km</span>
							</IonInput>
						</IonItem>
					</div>
				</IonAccordion>
				<IonAccordion value="total">
					<IonItem slot="header" color="light">
						<IonLabel>Total</IonLabel>
					</IonItem>
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonSegment v-model="form.modeTotalShift">
								<IonSegmentButton value="calculatedTotal">
									<IonLabel>Calculado</IonLabel>
								</IonSegmentButton>
								<IonSegmentButton value="fixTotal">
									<IonLabel>Fijo</IonLabel>
								</IonSegmentButton>
							</IonSegment>
						</IonItem>
						<IonItem
							v-show="form.modeTotalShift == 'calculatedTotal'"
							lines="none"
						>
							<p>
								El <b>Total</b> se calcula automáticamente sumando los viajes
								dentro del turno y restando los gastos.
								<br />
								<br />
								<i
									><b>*La gasolina</b> se toma como un gasto y se resta al
									total.</i
								>
							</p>
						</IonItem>
						<IonItem v-show="form.modeTotalShift == 'fixTotal'" lines="none">
							<IonInput
								label="Total"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model.number="form.totalShift"
								inputmode="decimal"
								max="999999"
								maxlength="8"
							>
								<span slot="end">{{ currency }}</span>
							</IonInput>
						</IonItem>
					</div>
				</IonAccordion>
			</IonAccordionGroup>
			<IonToast
				:is-open="showToast"
				message="La fecha y hora de fin de turno debe ser mayor que la fecha y hora de inicio"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showToast = false)"
				position="bottom"
			></IonToast>
			<IonToast
				:is-open="showKmToast"
				message="El kilometraje final no puede ser menor que el inicial"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showKmToast = false)"
				position-anchor="form-footer"
				position="bottom"
				swipe-gesture="vertical"
			></IonToast>
		</IonContent>
		<IonFooter id="form-footer">
			<IonToolbar>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonButton
								fill="outline"
								expand="block"
								shape="round"
								mode="ios"
								@click="handleCancel"
							>
								Cancelar
							</IonButton>
						</IonCol>
						<IonCol>
							<IonButton
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSave"
							>
								{{ modeForm === 'edit' ? 'Guardar Cambios' : 'Nuevo Turno' }}
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonToolbar>
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
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonIcon,
		IonDatetimeButton,
		IonDatetime,
		IonModal,
		IonAccordionGroup,
		IonAccordion,
		IonItem,
		IonLabel,
		IonList,
		IonInput,
		IonSegment,
		IonSegmentButton,
		IonFooter,
		IonGrid,
		IonRow,
		IonCol,
		IonButton,
		IonToast,
	} from '@ionic/vue';
	import {
		timeOutline,
		timerOutline,
		waterOutline,
		warningOutline,
	} from 'ionicons/icons';
	import { ref, onMounted, watch } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import moment from 'moment';
	import {
		addShift,
		updateShift,
		selectShiftByID,
	} from '../services/shiftService';

	const settingsStore = useSettingsStore();
	const currency = ref('€');
	const router = useRouter();
	const route = useRoute();
	const shiftId = ref(route.params.shiftId);
	const modeForm = ref(shiftId.value ? 'edit' : 'create');
	const form = ref({
		startDate: moment().format('YYYY-MM-DDTHH:mm'),
		endDate: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
		initialKm: 0,
		finalKm: 0,
		totalKm: 0,
		modeKM: 'calculatedKm',
		gasoline: 0,
		totalShift: 0,
		modeTotalShift: 'calculatedTotal',
	});

	const firstDayOfWeek = ref(1);
	const showToast = ref(false);
	const showKmToast = ref(false);

	const resetForm = () => {
		form.value = {
			startDate: moment().format('YYYY-MM-DDTHH:mm'),
			endDate: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
			initialKm: 0,
			finalKm: 0,
			totalKm: 0,
			modeKM: 'calculatedKm',
			gasoline: 0,
			totalShift: 0,
			modeTotalShift: 'calculatedTotal',
		};
	};

	const loadShift = async () => {
		// Establecer el valor del primer día de la semana por defecto
		firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

		// Si estamos en modo de edición, cargar los datos del turno
		if (modeForm.value === 'edit') {
			const shift = await selectShiftByID(parseInt(shiftId.value));
			if (shift) {
				form.value = { ...shift };
			}
		} else {
			resetForm();
		}
	};

	onMounted(loadShift);

	// Observar cambios en la ruta
	watch(route, async (newRoute) => {
		shiftId.value = newRoute.params.shiftId;
		modeForm.value = shiftId.value ? 'edit' : 'create';
		resetForm();
		await loadShift();
	});

	const formatTime = (date) => {
		return moment(date).format('HH:mm');
	};

	const handleSave = async () => {
		// Validar que los km finales no sean menores que los km iniciales si el modo es calculado
		const initialKm = Number(form.value.initialKm);
		const finalKm = Number(form.value.finalKm);

		if (form.value.modeKM === 'calculatedKm' && finalKm < initialKm) {
			showKmToast.value = true;
			return;
		}

		if (modeForm.value === 'edit') {
			await updateShift(
				parseInt(shiftId.value),
				form.value.startDate,
				form.value.endDate,
				initialKm,
				finalKm,
				form.value.totalKm,
				form.value.modeKM,
				form.value.gasoline,
				form.value.totalShift,
				form.value.modeTotalShift
			);
		} else {
			await addShift(
				form.value.startDate,
				form.value.endDate,
				initialKm,
				finalKm,
				form.value.totalKm,
				form.value.modeKM,
				form.value.gasoline,
				form.value.totalShift,
				form.value.modeTotalShift
			);
		}
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab1/' + now);
	};

	const handleCancel = () => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab1/' + now);
	};

	const checkDateValidity = () => {
		const start = moment(form.value.startDate);
		const end = moment(form.value.endDate);

		if (end.isSameOrBefore(start)) {
			showToast.value = true;
			form.value.endDate = moment(start)
				.add(1, 'hour')
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
			background-color: #f8f8ff;
			text-align: center;
			.shift-title {
				font-weight: 300 !important ;
				.shift-header-icon {
					vertical-align: bottom;
					margin: 0 9px 0 -15px;
				}
			}
		}
		.shift-footer {
			display: flex;
			text-align: left;
			font-size: 1.5em;
			.shift-footer-right {
				text-align: right;
				.shift-total {
					font-size: 1.2em;
				}
				:first-child {
					flex-grow: 4;
				}
				&:last-child {
					flex-grow: 1;
					padding-right: 20px;
				}
			}
		}
	}
	.accordion-group {
		border: 1px solid var(--ion-color-light-shade);
		border-radius: 8px;
		overflow: hidden;
		margin-top: 20px;
		.header-no-margin {
			margin-top: 0;
		}
		.native-input {
			text-align: right;
		}
		.km-diff {
			font-weight: bold;
			margin-right: 10px;
		}
	}
	ion-toast {
		--background: #ffdd00;
	}
</style>
