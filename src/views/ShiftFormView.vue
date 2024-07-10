<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Nuevo Turno</IonTitle>
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
						{{ formatTime(startDate) }} - {{ formatTime(endDate) }}
					</IonCardTitle>
				</IonCardHeader>
				<div class="shift-footer ion-padding">
					<div>
						<div>
							<IonIcon :icon="timerOutline"></IonIcon>
							<b>{{ totalKm }}</b> Km
						</div>
						<div>
							<IonIcon :icon="waterOutline"></IonIcon>
							<b>{{ gasoline }}</b> €
						</div>
					</div>
					<div class="shift-footer-right">
						<div>SubTotal</div>
						<div class="shift-total">{{ totalShift }} €</div>
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
										:first-day-of-week="1"
										:show-default-buttons="true"
										id="startPicker"
										v-model="startDate"
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
										:first-day-of-week="1"
										:show-default-buttons="true"
										id="endPicker"
										v-model="endDate"
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
								v-model="gasoline"
								inputmode="decimal"
								max="999"
								maxlength="6"
								min="0"
							>
								<span slot="end">€</span>
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
							<IonSegment v-model="kmMode">
								<IonSegmentButton value="calculatedKm">
									<IonLabel>Calculado</IonLabel>
								</IonSegmentButton>
								<IonSegmentButton value="fix">
									<IonLabel>Fijo</IonLabel>
								</IonSegmentButton>
							</IonSegment>
						</IonItem>
						<IonItem v-show="kmMode == 'calculatedKm'" lines="none">
							<IonInput
								class="money-input"
								label="Inicio turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model="kmStart"
								inputmode="decimal"
								max="999"
								maxlength="6"
								min="0"
							>
								<span slot="end">Km</span>
							</IonInput>
						</IonItem>
						<IonItem v-show="kmMode == 'calculatedKm'" lines="none">
							<IonInput
								class="money-input"
								label="Fin turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model="kmEnd"
								inputmode="decimal"
								max="999999"
								maxlength="8"
								min="0"
							>
								<span slot="end">Km</span>
							</IonInput>
						</IonItem>
						<IonItem v-show="kmMode == 'fix'" lines="none">
							<IonInput
								label="Este turno"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model="kmEnd"
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
							<IonSegment v-model="totalMode">
								<IonSegmentButton value="calculatedTotal">
									<IonLabel>Calculado</IonLabel>
								</IonSegmentButton>
								<IonSegmentButton value="fixTotal">
									<IonLabel>Fijo</IonLabel>
								</IonSegmentButton>
							</IonSegment>
						</IonItem>
						<IonItem v-show="totalMode == 'calculatedTotal'" lines="none">
							<p>
								El <b>Total</b> se calcula automáticamente sumando los viajes
								dentro del turno y restando los gastos.
								<br />
								<br />
								<b>La gasolina</b> se toma como un gasto y se resta al total.
							</p>
						</IonItem>
						<IonItem v-show="totalMode == 'fixTotal'" lines="none">
							<IonInput
								label="Total"
								label-placement="fixed"
								type="number"
								placeholder="000000.00"
								v-model="totalShift"
								inputmode="decimal"
								max="999999"
								maxlength="8"
							>
								<span slot="end">€</span>
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
				position-anchor="form-footer"
				position="bottom"
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
								Guardar
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
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import moment from 'moment';

	const router = useRouter();

	const startDate = ref(moment().format('YYYY-MM-DDTHH:mm'));
	const endDate = ref(moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'));
	const gasoline = ref(0);
	const totalKm = ref(0);
	const kmStart = ref(null);
	const kmEnd = ref(null);
	const totalShift = ref(0);
	const kmMode = ref('calculatedKm');
	const totalMode = ref('calculatedTotal');
	const showToast = ref(false);

	const formatTime = (date) => {
		return moment(date).format('HH:mm');
	};

	const handleSave = () => {
		// Lógica para guardar el turno
		console.log('Guardar turno');
		router.push('/tabs/tab1/');
	};

	const handleCancel = () => {
		router.push('/tabs/tab1/');
	};

	const checkDateValidity = () => {
		const start = moment(startDate.value);
		const end = moment(endDate.value);

		if (end.isSameOrBefore(start)) {
			showToast.value = true;
			endDate.value = moment(start).add(1, 'hour').format('YYYY-MM-DDTHH:mm');
		}
	};
</script>

<style lang="scss">
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
					margin: 0 9px;
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
	}
</style>
