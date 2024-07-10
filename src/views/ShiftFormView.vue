<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle> Nuevo turno </IonTitle>
			</IonToolbar>
		</IonHeader>
		<!-- CONTENT  -->
		<IonContent class="form-container">
			<!-- CARD -->
			<ion-card class="shift-card">
				<!--  CARD HEADER -->
				<ion-card-header class="shift-header">
					<ion-card-title class="shift-title">
						<ion-icon
							:icon="timeOutline"
							class="shift-header-icon"
							size="large"
						/>
						17:00h - 20:00h
					</ion-card-title>
				</ion-card-header>
				<!-- FOOTER	 -->
				<div class="shift-footer ion-padding">
					<div>
						<div>
							<ion-icon :icon="timerOutline"></ion-icon>
							<b> 134</b>Km
						</div>

						<div>
							<ion-icon :icon="waterOutline"></ion-icon>
							<b> 38</b>€
						</div>
					</div>

					<div class="shift-footer-right">
						<div>SubTotal</div>
						<div class="shift-total">300.00 €</div>
					</div>
				</div>
			</ion-card>
			<ion-accordion-group
				value="shiftTime"
				expand="inset"
				class="accordion-group"
			>
				<!-- ITEM ACORDEON HORARIO-->
				<IonAccordion value="shiftTime">
					<ion-item slot="header" color="light">
						<ion-label>Horario Turno</ion-label>
					</ion-item>
					<!-- contenido acordeon 1 -->
					<div slot="content" class="ion-padding">
						<IonList lines="none">
							<IonItem>
								<ion-label>Inicio</ion-label>
								<IonDatetimeButton
									datetime="timePicker"
									mode="ios"
								></IonDatetimeButton>
								<IonModal :keep-contents-mounted="true">
									<IonDatetime
										locale="es-ES"
										:first-day-of-week="1"
										:show-default-buttons="true"
										id="timePicker"
										v-model="selectedTime"
										mode="ios"
										display-format="HH:mm"
										picker-format="HH:mm"
										:hour-cycles="['h23']"
									></IonDatetime>
								</IonModal>
							</IonItem>
							<IonItem>
								<ion-label>Fin</ion-label>
								<IonDatetimeButton
									datetime="timePicker"
									mode="ios"
								></IonDatetimeButton>
								<IonModal :keep-contents-mounted="true">
									<IonDatetime
										locale="es-ES"
										:first-day-of-week="1"
										:show-default-buttons="true"
										id="timePicker"
										v-model="selectedTime"
										mode="ios"
										display-format="HH:mm"
										picker-format="HH:mm"
										:hour-cycles="['h23']"
									></IonDatetime>
								</IonModal>
							</IonItem>
						</IonList>
					</div>
				</IonAccordion>
				<IonAccordion value="gas">
					<!-- CABECERA -->
					<ion-item slot="header" color="light">
						<ion-label>Gasolina</ion-label>
					</ion-item>
					<!-- CONTENIDO -->
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonInput
								label="Cantidad"
								label-placement="fixed"
								type="number"
								placeholder="000.00"
								v-model="kmStart"
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
					<!-- CABECERA -->
					<ion-item slot="header" color="light">
						<ion-label>Kilometraje</ion-label>
					</ion-item>
					<!-- CONTENIDO -->
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonSegment v-model="kmMode">
								<ion-segment-button value="calculatedKm">
									<ion-label>Calculado</ion-label>
								</ion-segment-button>
								<ion-segment-button value="fix">
									<ion-label>Fijo</ion-label>
								</ion-segment-button>
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
					<!-- CABECERA -->
					<ion-item slot="header" color="light">
						<ion-label>Total</ion-label>
					</ion-item>
					<!-- CONTENIDO -->
					<div slot="content" class="ion-padding">
						<IonItem lines="none">
							<IonSegment v-model="totalMode">
								<ion-segment-button value="calculatedTotal">
									<ion-label>Calculado</ion-label>
								</ion-segment-button>
								<ion-segment-button value="fixTotal">
									<ion-label>Fijo</ion-label>
								</ion-segment-button>
							</IonSegment>
						</IonItem>
						<IonItem v-show="totalMode == 'calculatedTotal'" lines="none">
							<p>
								El <b>Total</b> se calcula automáticamente sumando los viajes
								dentro del turno y restando los gastos. <br /><br /><b
									>La gasolina</b
								>
								se toma como un gasto y se resta al total.
							</p>
						</IonItem>
						<IonItem v-show="totalMode == 'fixTotal'" lines="none">
							<IonInput
								label="Total turno"
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
			</ion-accordion-group>
		</IonContent>
		<!-- FOOTER  -->
		<IonFooter>
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
							</ionButton></ion-col
						>
						<ion-col>
							<ionButton
								expand="block"
								shape="round"
								mode="ios"
								@click="handleSave"
							>
								Guardar
							</ionButton>
						</ion-col>
					</ion-row>
				</ion-grid>
			</IonToolbar>
		</IonFooter>
	</IonPage>
</template>
<script setup>
	import {
		IonHeader,
		IonToolbar,
		IonTitle,
		IonPage,
		IonContent,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonLabel,
		IonDatetimeButton,
		IonDatetime,
		IonModal,
		IonFooter,
		IonList,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonInput,
		IonCard,
		IonCardTitle,
		IonCardHeader,
		IonAccordion,
		IonAccordionGroup,
	} from '@ionic/vue';
	import { timeOutline, timerOutline, waterOutline } from 'ionicons/icons';
	import { useRouter } from 'vue-router';
	import { ref } from 'vue';
	const selectedTime = ref(new Date().toISOString());
	const kmMode = ref('calculatedKm');
	const totalMode = ref('calculatedTotal');
	const kmStart = ref(null);
	const kmEnd = ref(null);
	const router = useRouter(); // Initialize the router
	const totalShift = ref(0);
	const handleSave = () => {
		// Navigate to the desired route
		router.push('/tabs/tab1/');
	};

	const handleCancel = () => {
		// Navigate to the desired route
		router.push('/tabs/tab1/');
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
