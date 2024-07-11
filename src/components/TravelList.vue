<template>
	<ion-page>
		<IonHeader>
			<IonToolbar>
				<IonTitle> Lista de viajes </IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent class="travels-view-container">
			<!--TIME RANGE NAVIGATOR -->
			<div class="travel-filters ion-padding">
				<ion-segment v-model="timeNavigator">
					<ion-segment-button value="day">
						<ion-label>Día</ion-label>
					</ion-segment-button>
					<ion-segment-button value="week">
						<ion-label>Semana</ion-label>
					</ion-segment-button>
					<ion-segment-button value="month">
						<ion-label>Mes</ion-label>
					</ion-segment-button>
					<ion-segment-button value="year">
						<ion-label>Año</ion-label>
					</ion-segment-button>
				</ion-segment>
			</div>

			<!--DATE NAVIGATOR -->
			<div class="time-navigator">
				<ion-icon
					size="large"
					color="primary"
					:icon="arrowBackCircle"
				></ion-icon>
				{{ fechaVista }}
				<ion-icon
					size="large"
					color="primary"
					:icon="arrowForwardCircle"
				></ion-icon>
				<!--BUTTON ADD  -->
			</div>
			<!--TRAVEL LIST -->
			<ion-content class="container-travels">
				<div class="travel-list">
					<div
						v-if="travelList.length == 0 && shiftsList.length == 0"
						style="background-color: #fff"
					>
						Aún no hay viajes
					</div>
					<div v-else>
						<!-- TRAVEL LIST (travelList) -->
						<div class="ion-padding">
							<IonList lines="none" mode="ios">
								<IonItemSliding v-for="travel in travelList" :key="travel.id">
									<IonItem
										class="item-travel"
										button="true"
										@click="editTravel(travel.id)"
									>
										<IonLabel>
											<ion-icon
												:icon="payIcons[travel.payMethod]"
												size="small"
												class="icon-travel"
											></ion-icon>
											<span>{{
												moment(travel.startDate).format('DD MMM - HH:mm')
											}}</span>
											<span class="money">
												<b>{{ travel.amount }}</b> €
											</span>
										</IonLabel>
									</IonItem>

									<IonItemOptions side="end">
										<ion-item-option
											color="danger"
											@click="confirmRemoveTravel(travel.id, $event)"
										>
											<ion-icon slot="icon-only" :icon="trash"></ion-icon>
										</ion-item-option>
									</IonItemOptions>
								</IonItemSliding>
							</IonList>
						</div>
						<!-- SHIFT CARD -->
						<ion-card
							class="shift-card"
							mode="ios"
							v-for="shift in shiftsList"
							:key="shift.id"
						>
							<!-- CARD HEADER -->
							<ion-card-header class="shift-header">
								<ion-card-title class="shift-title">
									<!-- ITEM SLIDING -->
									<IonItemSliding>
										<IonItem
											button="true"
											lines="none"
											@click="editShift(shift.id)"
										>
											<ion-icon
												:icon="timeOutline"
												color="primary"
												class="shift-header-icon"
												size="large"
											/>
											<span class="shift-tittle-info">
												{{ moment(shift.startDate).format('HH:mm') }}h -
												{{ moment(shift.endDate).format('HH:mm') }}h
											</span>
										</IonItem>
										<IonItemOptions side="end">
											<ion-item-option
												color="danger"
												@click="confirmRemoveShift(shift.id, $event)"
											>
												<ion-icon slot="icon-only" :icon="trash"></ion-icon>
											</ion-item-option>
										</IonItemOptions>
									</IonItemSliding>
								</ion-card-title>
							</ion-card-header>
							<ion-card-content></ion-card-content>
							<!-- // CARD FOOTER	 -->
							<div class="shift-footer ion-padding">
								<div>
									<div v-if="shift.modeKM == 'fix'">
										<b>{{ shift.totalKm }}</b>
										km
										<ion-icon :icon="timerOutline"></ion-icon>
									</div>
									<div v-else>
										<b>{{ shift.finalKm - shift.initialKm }}</b>
										km
										<ion-icon :icon="timerOutline"></ion-icon>
									</div>

									<div>
										<b>{{ shift.gasoline }}</b>
										€
										<ion-icon :icon="waterOutline"></ion-icon>
									</div>
								</div>

								<div class="shift-footer-right">
									<div>SubTotal</div>
									<div
										v-if="shift.modeTotalShift == 'fixTotal'"
										class="shift-total"
									>
										{{ shift.totalShift }} €
									</div>
									<div v-else class="shift-total">*Calculado €</div>
								</div>
							</div>
						</ion-card>
					</div>
				</div>

				<ion-button @click="borraDB">Borra la BBDD</ion-button>
			</ion-content>
			<div class="total-container">
				Total: <span class="total">300.00 €</span>
				<ion-fab
					slot="fixed"
					horizontal="right"
					vertical="top"
					class="add-travel"
				>
					<ion-fab-button mode="ios">
						<ion-icon :icon="add"></ion-icon>
					</ion-fab-button>
					<ion-fab-list side="top">
						<ion-fab-button color="primary" @click="navigateTo('/noteform')">
							<ion-icon :icon="reader" />
						</ion-fab-button>
						<ion-fab-button color="primary" @click="navigateTo('/shift')">
							<ion-icon :icon="time" />
						</ion-fab-button>

						<ion-fab-button color="primary" @click="navigateTo('/travelform')">
							<ion-icon :icon="carSport" />
						</ion-fab-button>
					</ion-fab-list>
				</ion-fab>
			</div>
		</IonContent>
		<ion-action-sheet
			:header="actionSheetHeader"
			:buttons="actionSheetButtons"
			:is-open="actionSheetOpen"
			@didDismiss="handleActionSheetDismiss"
		></ion-action-sheet>
	</ion-page>
</template>

<script setup>
	import moment from 'moment';
	moment.locale('es', {
		months:
			'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
				'_'
			),
		monthsShort: 'Ene_Feb_Mar_Abr._May_Jun_Jul_Ago_Sept_Oct_Nov_Dec'.split('_'),
		weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
		weekdaysShort: 'Dom_Lun_Mar_Mier_Jue_Vier_Sab'.split('_'),
		weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
	});
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonItemOptions,
		IonItemOption,
		IonItemSliding,
		IonLabel,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonFab,
		IonFabButton,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonListHeader,
		IonFabList,
		IonButton,
		IonActionSheet,
	} from '@ionic/vue';
	import {
		trash,
		arrowBackCircle,
		arrowForwardCircle,
		add,
		time,
		timeOutline,
		timerOutline,
		cardOutline,
		cashOutline,
		phonePortraitOutline,
		carSport,
		waterOutline,
		reader,
	} from 'ionicons/icons';
	import { ref, onMounted } from 'vue';
	//import { useSettingsStore } from '../store/settingsStore'; // Importa la store
	import { useRouter } from 'vue-router'; // Importa el router
	import { getTravels, deleteTravel } from '@/services/travelService'; // Importar el servicio
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { Preferences } from '@capacitor/preferences';

	const router = useRouter(); // Inicializa el router

	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	const timeNavigator = ref('month');

	let travelList = ref([]);
	let shiftsList = ref([]);

	const fechaVista = ref();

	const navigateTo = (path) => {
		router.push(path);
	};

	onMounted(async () => {
		let fechaInicial = moment();
		let semanaMes = Math.ceil(fechaInicial.date() / 7) + 'ª Semana';
		fechaVista.value = semanaMes;

		const travels = await getTravels();
		travelList.value = travels;
		console.log('Tabla viajes', travelList.value);

		const shifts = await getShifts();
		shiftsList.value = shifts;
		console.log('Tabla turnos', shiftsList.value);
	});

	// EDITAR VIAJE
	const editTravel = (id) => {
		router.push(`/travelform/${id}`);
	};

	// CONFIRMACIÓN BORRAR VIAJE
	let slidingTravel = ref(null);
	const actionSheetHeader = ref('');
	const actionSheetOpen = ref(false);
	const travelToRemove = ref(null);
	const actionSheetButtons = ref([
		{
			text: 'Borrar',
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
	]);

	const handleActionSheetDismiss = async (event) => {
		const role = event.detail.role;
		if (role === 'destructive' && travelToRemove.value !== null) {
			try {
				if (actionSheetHeader.value.includes('viaje')) {
					console.log('Eliminando el viaje', travelToRemove.value);
					await deleteTravel(travelToRemove.value);
					travelList.value = travelList.value.filter(
						(travel) => travel.id !== travelToRemove.value
					);
					travelToRemove.value = null;
				} else if (actionSheetHeader.value.includes('turno')) {
					console.log('Eliminando el turno', travelToRemove.value);
					await deleteShift(travelToRemove.value);
					shiftsList.value = shiftsList.value.filter(
						(shift) => shift.id !== travelToRemove.value
					);
					travelToRemove.value = null;
				}
			} catch (error) {
				console.error('Error eliminando:', error);
			}
		}
		closeSlidingItem();
		actionSheetOpen.value = false;
	};

	const closeSlidingItem = () => {
		if (slidingTravel.value) {
			slidingTravel.value.close();
			slidingTravel.value = null;
		}
	};

	const confirmRemoveTravel = (id, event) => {
		travelToRemove.value = id;
		slidingTravel.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = '¿Deseas eliminar el servicio el viaje?';
		actionSheetOpen.value = true;
	};

	// EDITAR TURNO
	const editShift = (id) => {
		console.log(`El ID del turno es : ${id}`);
		router.push(`/shift/${id}`);
	};

	// CONFIRMACIÓN BORRAR TURNO
	const confirmRemoveShift = (id, event) => {
		travelToRemove.value = id;
		slidingTravel.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = '¿Deseas eliminar el turno?';
		actionSheetOpen.value = true;
	};

	// BORRAR DATABASE
	const borraDB = async () => {
		console.log('borra BBDD');
		await Preferences.remove({ key: 'database' });
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_travel_list.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	ion-card {
		--background: rgba(255, 255, 255, 0.8);
	}
	.shift-card {
		border: 1px solid #ccc;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: #f8f8ff;
			text-align: center;

			.shift-title {
				.shift-tittle-info {
					font-size: 28px;
					font-weight: 300 !important ;
					color: var(--ion-color-primary);
				}

				.shift-header-icon {
					vertical-align: bottom;
					margin: 0 9px;
				}
			}
		}
		.list-ios {
			background: transparent;
		}
		.shift-footer {
			border-top: 1px #ccc solid;
			display: flex;
			text-align: right;
			.shift-footer-right {
				.shift-total {
					font-size: 1.7em;
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
	.travels-view-container {
		.time-navigator {
			color: #fff;
			position: relative;
			padding: 10px 0;
			text-align: center;
			* {
				vertical-align: middle;
			}
		}
		.container-travels {
			height: calc(99vh - 250px);
			overflow-y: auto;
			margin-top: 20px;
			.item-travel {
				color: #535353;
				line-height: 1.2em;
				border-bottom: 1px dashed #ccc;
				.date {
					min-width: 85px;
					text-align: left;
				}
				.week-day {
					min-width: 35px;
					text-align: center;
				}
				.time {
					min-width: 45px;
				}
				.money {
					font-size: 1.4em;
					vertical-align: text-bottom;
					float: right;
					color: #666;
				}
				span {
					vertical-align: middle;
					display: inline-block;
					text-align: right;
				}
				.icon-travel {
					vertical-align: middle;
					color: #4b4a4a;
					width: 1.5em;
					height: 1.5em;
				}
			}
		}
		.total-container {
			color: #535353;
			font-size: 1.7em;
			/*font-weight: bold;*/
			padding: 8px 60px 8px 20px;
			border-top: 1px dashed #ccc;
			background-color: #f7f7f7;
			position: relative;
			.total {
				float: right;
				color: #000;
			}
		}
		.add-travel {
			position: absolute;
			font-size: 48px;
			top: -30px;
			right: 5px;
		}
	}
	.shift-info {
		background-color: #ccc;
		padding: 5px;

		font-weight: bold;
		font-size: 1em;
		/*border-radius: 0px 5px 5px 0px;*/
		border-radius: 5px;
		margin-right: 1px;
	}
	ion-item::part(native) {
		background: transparent;
	}
	ion-segment {
		--background: rgba(255, 255, 255, 0.5);
	}
	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
