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
				<TimeNavigator
					:initial-date="fechaUnica"
					:initial-navigator="'month'"
					@date-changed="handleDateChanged"
				/>
			</div>
			<IonContent class="container-items">
				<!--TRAVEL/NOTES/SHIFTS LIST -->
				<ItemList :initialDate="initialDate" :endDate="endDate" />
			</IonContent>
		</IonContent>
		<div class="total-container">
			Total: <span class="total">300.00 €</span>
			<IonFab slot="fixed" horizontal="right" vertical="top" class="add-travel">
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
		monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sept_Oct_Nov_Dec'.split('_'),
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
		IonIcon,
		IonFab,
		IonFabButton,
		IonFabList,
		IonActionSheet,
	} from '@ionic/vue';
	import { add, time, carSport, reader } from 'ionicons/icons';
	import { ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import { getTravels, deleteTravel } from '@/services/travelService';
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { getNotes, deleteNote } from '@/services/noteService';
	import TimeNavigator from '@/components/TimeNavigator.vue'; // Import the new component
	import ItemList from '@/components/ItemList.vue';

	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const firstDayOfWeek = ref(1);
	const currency = ref('€');
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const router = useRouter();
	const settingsStore = useSettingsStore();

	let travelList = ref([]);
	let shiftsList = ref([]);
	let notesList = ref([]);

	// Establecer el valor del primer día de la semana por defecto
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const navigateTo = (path) => {
		router.push(path);
	};

	const handleDateChanged = ({ newDate, type }) => {
		console.log({ newDate, type });
		switch (type) {
			case 'day':
				initialDate.value = moment(newDate)
					.startOf('day')
					.format('YYYY-MM-DD HH:mm');
				endDate.value = moment(newDate).endOf('day').format('YYYY-MM-DD HH:mm');
				break;
			case 'week':
				initialDate.value = moment(newDate)
					.isoWeekday(firstDayOfWeek.value)
					.startOf('day')
					.format('YYYY-MM-DD HH:mm');
				endDate.value = moment(newDate)
					.isoWeekday(firstDayOfWeek.value + 6)
					.endOf('day')
					.format('YYYY-MM-DD HH:mm');
				break;
			case 'month':
				initialDate.value = moment(newDate)
					.startOf('month')
					.format('YYYY-MM-DD HH:mm');
				endDate.value = moment(newDate)
					.endOf('month')
					.format('YYYY-MM-DD HH:mm');
				break;
			case 'year':
				initialDate.value = moment(newDate)
					.startOf('year')
					.format('YYYY-MM-DD HH:mm');
				endDate.value = moment(newDate)
					.endOf('year')
					.format('YYYY-MM-DD HH:mm');
				break;
		}
		console.log(`Updated date range: ${initialDate.value} to ${endDate.value}`);
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
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}

	.travels-view-container {
		.container-items {
			height: calc(100vh - 275px);
			overflow-y: auto;
		}
	}
	.total-container {
		position: absolute;
		bottom: 0;
		height: 50px;
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
	ion-item::part(native) {
		background: transparent;
	}

	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
