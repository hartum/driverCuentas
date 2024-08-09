<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title> Lista de viajes </ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="travels-view-container">
			<!--TIME RANGE NAVIGATOR -->
			<div class="travel-filters ion-padding">
				<TimeNavigator
					:initial-date="fechaUnica"
					:initial-navigator="'month'"
					@date-changed="handleDateChanged"
				/>
			</div>
			<ion-content class="container-items">
				<!--TRAVEL/NOTES/SHIFTS LIST -->
				<ItemList
					:initialDate="initialDate"
					:endDate="endDate"
					@update:totalAmount="updateTotalAmount"
				/>
			</ion-content>
		</ion-content>
		<div class="total-container">
			Total: <span class="total">{{ totalAmount }} {{ currency }}</span>
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
					<ion-fab-button
						color="primary"
						size="large"
						mode="ios"
						@click="navigateTo('/noteform/')"
					>
						<ion-icon :icon="reader" />
					</ion-fab-button>
					<ion-fab-button
						color="primary"
						mode="ios"
						@click="navigateTo('/shift/')"
					>
						<ion-icon :icon="time" />
					</ion-fab-button>
					<ion-fab-button
						color="primary"
						mode="ios"
						@click="navigateTo('/travelform/')"
					>
						<ion-icon :icon="carSport" />
					</ion-fab-button>
				</ion-fab-list>
			</ion-fab>
		</div>
	</ion-page>
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
	} from '@ionic/vue';
	import { add, time, carSport, reader } from 'ionicons/icons';
	import { ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import TimeNavigator from '@/components/TimeNavigator.vue';
	import ItemList from '@/components/ItemList.vue';

	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const firstDayOfWeek = ref(1);
	const currency = ref('€');
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const router = useRouter();
	const settingsStore = useSettingsStore();
	const totalAmount = ref('0.00');

	// Establecer el valor del primer día de la semana por defecto
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const navigateTo = (path) => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push(path + now);
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

	const updateTotalAmount = (newTotal) => {
		totalAmount.value = newTotal;
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
	});
</script>

<style lang="scss" scoped>
	/* ... (styles remain the same) ... */
</style>
