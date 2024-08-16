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
			Total: <span class="total">{{ totalAmount }}{{ currency }}</span>
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
	} from '@ionic/vue';
	import { ref, computed } from 'vue';
	import { useSettingsStore } from '../store/settingsStore';
	import TimeNavigator from '@/components/TimeNavigator.vue';
	import ItemList from '@/components/ItemList.vue';
	import { getTimeRange } from '@/services/getTimeRangeService';

	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const firstDayOfWeek = ref(1);
	const currency = computed(() => {
		const currencyMap = { EUR: '€', USD: '$' };
		return (
			currencyMap[settingsStore.selectedCurrency] ||
			settingsStore.selectedCurrency
		);
	});
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const settingsStore = useSettingsStore();
	const totalAmount = ref('0.00');

	// Establecer el valor del primer día de la semana por defecto
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const handleDateChanged = ({ newDate, type }) => {
		const { initialDate: start, endDate: end } = getTimeRange(
			newDate,
			type,
			firstDayOfWeek.value
		);
		initialDate.value = start;
		endDate.value = end;
	};

	const updateTotalAmount = (newTotal) => {
		totalAmount.value = newTotal;
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}

	.travels-view-container {
		.container-items {
			height: calc(100vh - 310px);
			overflow-y: auto;
		}
	}
	.total-container {
		position: absolute;
		bottom: 0;
		height: 50px;
		color: #535353;
		font-size: 2em;
		padding: 2px 60px 8px 20px;
		border-top: 1px dashed #ccc;
		background-color: #f7f7f7;
		position: relative;
		.total {
			float: right;
			color: #000;
		}
	}
	ion-item::part(native) {
		background: transparent;
	}

	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
