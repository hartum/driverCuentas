<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle> Lista de viajes </IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent class="travels-view-container">
			<!--TIME RANGE NAVIGATOR -->
			<div class="travel-filters ion-padding">
				<IonSegment v-model="timeNavigator" @ionChange="updateFechaVista()">
					<IonSegmentButton value="day">
						<IonLabel>Día</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="week">
						<IonLabel>Semana</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="month">
						<IonLabel>Mes</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="year">
						<IonLabel>Año</IonLabel>
					</IonSegmentButton>
				</IonSegment>
			</div>

			<!--DATE NAVIGATOR -->
			<div class="time-navigator">
				<IonIcon
					size="large"
					color="primary"
					:icon="arrowBackCircle"
					@click="navigateDate('prev')"
				></IonIcon>
				{{ fechaVista }}
				<IonIcon
					size="large"
					color="primary"
					:icon="arrowForwardCircle"
					@click="navigateDate('next')"
				></IonIcon>
				<!--BUTTON ADD  -->
			</div>
			<!--TRAVEL LIST -->
			<IonContent class="container-items">
				<div class="travel-list">
					<div
						v-if="
							travelList.length == 0 &&
							shiftsList.length == 0 &&
							notesList.length == 0
						"
					>
						<IonCard>
							<IonCardHeader>
								<IonCardTitle>Crea un viaje o turno</IonCardTitle>
								<IonCardSubtitle>Sin viajes para esta fecha</IonCardSubtitle>
							</IonCardHeader>
							<IonCardContent>
								<p>Puedes empezar creando un viaje o un turno desde aquí.</p>
								<IonButton @click="navigateTo('/travelform')">
									<IonIcon slot="start" :icon="carSport"></IonIcon>
									Nuevo viaje
								</IonButton>
								<IonButton @click="navigateTo('/shift')">
									<IonIcon slot="start" :icon="time"></IonIcon>
									Nuevo turno
								</IonButton>
							</IonCardContent>
						</IonCard>
					</div>
					<div v-else>
						<!-- TRAVELS, SHIFTS AND NOTES LIST  -->
						<div class="ion-padding">
							<!-- TRAVEL LIST -->
							<IonList lines="none" mode="ios">
								<IonItemSliding v-for="travel in travelList" :key="travel.id">
									<IonItem
										class="item-travel"
										button="true"
										@click="editTravel(travel.id)"
									>
										<IonLabel>
											<IonIcon
												:icon="payIcons[travel.payMethod]"
												size="small"
												class="icon-travel"
											></IonIcon>
											<span>{{
												moment(travel.startDate).format('DD MMM - HH:mm')
											}}</span>
											<span class="money income">
												<b>{{ travel.amount }}{{ currency }} </b>
											</span>
										</IonLabel>
									</IonItem>
									<IonItemOptions side="end">
										<IonItemOption
											color="danger"
											@click="confirmRemoveItem(travel.id, 'viaje', $event)"
										>
											<IonIcon slot="icon-only" :icon="trash"></IonIcon>
										</IonItemOption>
									</IonItemOptions>
								</IonItemSliding>
							</IonList>
						</div>
						<!-- NOTES LIST -->
						<div class="ion-padding">
							<IonList lines="none" mode="ios">
								<IonItemSliding v-for="note in notesList" :key="note.id">
									<IonItem
										class="item-note"
										button="true"
										@click="editNote(note.id)"
									>
										<IonLabel>
											<IonIcon
												:icon="reader"
												size="small"
												class="icon-note"
											></IonIcon>
											<span>{{
												moment(note.noteDate).format('DD MMM - HH:mm')
											}}</span>
											<span
												class="money"
												:class="{
													income: note.noteType == 'income',
													expense: note.noteType == 'expense',
												}"
												v-if="note.amount > 0"
											>
												<b>{{ note.amount }}{{ currency }} </b>
											</span>
										</IonLabel>
									</IonItem>
									<IonItemOptions side="end">
										<IonItemOption
											color="danger"
											@click="confirmRemoveItem(note.id, 'nota', $event)"
										>
											<IonIcon slot="icon-only" :icon="trash"></IonIcon>
										</IonItemOption>
									</IonItemOptions>
								</IonItemSliding>
							</IonList>
						</div>
						<!-- SHIFT LIST -->
						<IonCard
							class="shift-card"
							mode="ios"
							v-for="shift in shiftsList"
							:key="shift.id"
						>
							<!-- CARD HEADER -->
							<IonCardHeader class="shift-header">
								<IonCardTitle class="shift-title">
									<!-- ITEM SLIDING -->
									<IonItemSliding>
										<IonItem
											button="true"
											lines="none"
											@click="editShift(shift.id)"
										>
											<IonIcon
												:icon="timeOutline"
												color="primary"
												class="shift-header-icon"
												size="large"
											/>
											<span class="shift-tittle-info"
												>{{ moment(shift.startDate).format('HH:mm') }}h -
												{{ moment(shift.endDate).format('HH:mm') }}h</span
											>
										</IonItem>
										<IonItemOptions side="end">
											<IonItemOption
												color="danger"
												@click="confirmRemoveItem(shift.id, 'turno', $event)"
											>
												<IonIcon slot="icon-only" :icon="trash"></IonIcon>
											</IonItemOption>
										</IonItemOptions>
									</IonItemSliding>
								</IonCardTitle>
							</IonCardHeader>
							<IonCardContent></IonCardContent>
							<!-- // CARD FOOTER	 -->
							<div class="shift-footer ion-padding">
								<div>
									<div v-if="shift.modeKM == 'fix'">
										<b>{{ shift.totalKm }}</b>
										km
										<IonIcon :icon="timerOutline"></IonIcon>
									</div>
									<div v-else>
										<b>{{ shift.finalKm - shift.initialKm }}</b>
										km
										<IonIcon :icon="timerOutline"></IonIcon>
									</div>
									<div>
										<b>{{ shift.gasoline }}</b>
										{{ currency }}
										<IonIcon :icon="waterOutline"></IonIcon>
									</div>
								</div>
								<div class="shift-footer-right">
									<div>SubTotal</div>
									<div
										v-if="shift.modeTotalShift == 'fixTotal'"
										class="shift-total"
									>
										{{ shift.totalShift }} {{ currency }}
									</div>
									<div v-else><b>*Esperando viajes</b></div>
								</div>
							</div>
						</IonCard>
					</div>
				</div>
				<IonButton @click="borraDB">Borra la BBDD</IonButton>
			</IonContent>
			<div class="total-container">
				Total: <span class="total">300.00 €</span>
				<IonFab
					slot="fixed"
					horizontal="right"
					vertical="top"
					class="add-travel"
				>
					<IonFabButton mode="ios">
						<IonIcon :icon="add"></IonIcon>
					</IonFabButton>
					<IonFabList side="top">
						<IonFabButton color="primary" @click="navigateTo('/noteform')">
							<IonIcon :icon="reader" />
						</IonFabButton>
						<IonFabButton color="primary" @click="navigateTo('/shift')">
							<IonIcon :icon="time" />
						</IonFabButton>
						<IonFabButton color="primary" @click="navigateTo('/travelform')">
							<IonIcon :icon="carSport" />
						</IonFabButton>
					</IonFabList>
				</IonFab>
			</div>
		</IonContent>
		<IonActionSheet
			:header="actionSheetHeader"
			:buttons="actionSheetButtons"
			:is-open="actionSheetOpen"
			@didDismiss="handleActionSheetDismiss"
		></IonActionSheet>
	</IonPage>
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
		IonCardSubtitle,
		IonCardContent,
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
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import { getTravels, deleteTravel } from '@/services/travelService';
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { getNotes, deleteNote } from '@/services/noteService';
	import { Preferences } from '@capacitor/preferences';

	const currency = ref('€');
	const router = useRouter();
	const settingsStore = useSettingsStore();
	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	const timeNavigator = ref('month');
	const fechaVista = ref(moment().format('YYYY-MM-DD'));
	const fechaUnica = ref(moment().format('YYYY-MM-DD'));

	let travelList = ref([]);
	let shiftsList = ref([]);
	let notesList = ref([]);

	const navigateTo = (path) => {
		router.push(path);
	};

	const updateFechaVista = () => {
		let currentWeek, month, year;
		switch (timeNavigator.value) {
			case 'day':
				fechaVista.value = moment(fechaUnica.value).format('DD MMM YYYY');
				break;
			case 'week':
				currentWeek = Math.ceil(moment(fechaUnica.value).date() / 7);
				month = moment(fechaUnica.value).format('MMM');
				year = moment(fechaUnica.value).format('YYYY');
				fechaVista.value = `${currentWeek}ª semana - ${month} ${year}`;
				break;
			case 'month':
				fechaVista.value = moment(fechaUnica.value).format('MMM YYYY');
				break;
			case 'year':
				fechaVista.value = moment(fechaUnica.value).format('YYYY');
				break;
		}
	};

	const navigateDate = (direction) => {
		const amount = direction === 'next' ? 1 : -1;
		let duration;
		switch (timeNavigator.value) {
			case 'day':
				duration = moment.duration(amount, 'days');
				break;
			case 'week':
				duration = moment.duration(amount, 'weeks');
				break;
			case 'month':
				duration = moment.duration(amount, 'months');
				break;
			case 'year':
				duration = moment.duration(amount, 'years');
				break;
		}
		const newDate = moment(fechaUnica.value).add(duration);
		fechaUnica.value = newDate.format('YYYY-MM-DD');
		updateFechaVista();
	};

	onMounted(async () => {
		// Establecer el valor de la moneda por defecto
		switch (settingsStore.selectedCurrency) {
			case 'EUR':
				currency.value = '€';
				break;
			case 'USD':
				currency.value = '$';
				break;
			default:
				currency.value = settingsStore.selectedCurrency;
		}

		updateFechaVista();

		const travels = await getTravels();
		travelList.value = travels;
		console.log('Tabla viajes', travelList.value);

		const shifts = await getShifts();
		shiftsList.value = shifts;
		console.log('Tabla turnos', shiftsList.value);

		const notes = await getNotes();
		notesList.value = notes;
		console.log('Tabla notas', notesList.value);
	});

	const editTravel = (id) => {
		router.push(`/travelform/${id}`);
	};

	let slidingItem = ref(null);
	const actionSheetHeader = ref('');
	const actionSheetOpen = ref(false);
	const itemToRemove = ref(null);
	const itemTypeToRemove = ref(null);
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
		if (role === 'destructive' && itemToRemove.value !== null) {
			try {
				if (itemTypeToRemove.value === 'viaje') {
					console.log('Eliminando el viaje', itemToRemove.value);
					await deleteTravel(itemToRemove.value);
					travelList.value = travelList.value.filter(
						(travel) => travel.id !== itemToRemove.value
					);
				} else if (itemTypeToRemove.value === 'turno') {
					console.log('Eliminando el turno', itemToRemove.value);
					await deleteShift(itemToRemove.value);
					shiftsList.value = shiftsList.value.filter(
						(shift) => shift.id !== itemToRemove.value
					);
				} else if (itemTypeToRemove.value === 'nota') {
					console.log('Eliminando la nota', itemToRemove.value);
					await deleteNote(itemToRemove.value);
					notesList.value = notesList.value.filter(
						(note) => note.id !== itemToRemove.value
					);
				}
				itemToRemove.value = null;
				itemTypeToRemove.value = null;
			} catch (error) {
				console.error('Error eliminando:', error);
			}
		}
		closeSlidingItem();
		actionSheetOpen.value = false;
	};

	const closeSlidingItem = () => {
		if (slidingItem.value) {
			slidingItem.value.close();
			slidingItem.value = null;
		}
	};

	const confirmRemoveItem = (id, type, event) => {
		itemToRemove.value = id;
		itemTypeToRemove.value = type;
		slidingItem.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = `¿Deseas eliminar el ${type}?`;
		actionSheetOpen.value = true;
	};

	const editShift = (id) => {
		console.log(`El ID del turno es : ${id}`);
		router.push(`/shift/${id}`);
	};

	const editNote = (id) => {
		console.log(`El ID de la nota es : ${id}`);
		router.push(`/noteform/${id}`);
	};

	const borraDB = async () => {
		console.log('borra BBDD');
		await Preferences.remove({ key: 'database' });
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
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
		.container-items {
			height: calc(99vh - 250px);
			overflow-y: auto;
			margin-top: 20px;
			.item-travel,
			.item-note {
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
				.icon-travel,
				.icon-note {
					vertical-align: middle;
					color: #4b4a4a;
					width: 1.5em;
					height: 1.5em;
				}
				.income {
					color: #087702;
				}
				.expense {
					color: #bc0404;
				}
			}
		}
		.total-container {
			color: #535353;
			font-size: 1.7em;
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
