<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>Estadísticas</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<TimeNavigator
				:initial-date="fechaUnica"
				:initial-navigator="'month'"
				@date-changed="handleDateChanged"
			/>
			<ion-grid class="grid-container">
				<ion-row>
					<ion-col class="stat-container">
						<div>Ingresos</div>
						<div class="amount">{{ totalIncome }}{{ currency }}</div>
						<!-- <IncomeChart :chartData="incomeData" :chartOptions="chartOptions" /> -->
					</ion-col>
					<ion-col class="stat-container">
						<div>Gastos</div>
						<div class="amount">{{ totalExpense }}{{ currency }}</div>
						<!--
						<ExpenseChart
							:chartData="expenseData"
							:chartOptions="chartOptions"
						/>
						-->
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col class="stat-container">
						<div>Total</div>
						<div class="amount">
							{{ totalIncome - totalExpense }}{{ currency }}
						</div>
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-content>
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
		IonGrid,
		IonRow,
		IonCol,
	} from '@ionic/vue';
	import { ref, onMounted, computed } from 'vue';
	import { useSettingsStore } from '../store/settingsStore';
	import TimeNavigator from '@/components/TimeNavigator.vue';
	import { getTimeRange } from '@/services/getTimeRangeService';
	import { getTravels } from '@/services/travelService';
	import { getNotes } from '@/services/noteService';

	const settingsStore = useSettingsStore();

	// -- VARIABLES DE TIEMPO --
	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const firstDayOfWeek = ref(1);

	const totalIncome = ref(0);
	const totalExpense = ref(0);

	const currency = computed(() => {
		const currencyMap = { EUR: '€', USD: '$' };
		return (
			currencyMap[settingsStore.selectedCurrency] ||
			settingsStore.selectedCurrency
		);
	});

	// -- Establecer el valor del primer día de la semana por defecto --
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const handleDateChanged = async ({ newDate, type }) => {
		console.log({ newDate, type });
		const { initialDate: start, endDate: end } = getTimeRange(
			newDate,
			type,
			firstDayOfWeek.value
		);
		initialDate.value = start;
		endDate.value = end;

		await calculateStats();
	};

	const calculateStats = async () => {
		try {
			// Obtener todos los viajes y notas entre las fechas seleccionadas
			const travels = await getTravels(initialDate.value, endDate.value);
			const notes = await getNotes(initialDate.value, endDate.value);

			// Resetear los valores
			totalIncome.value = 0;
			totalExpense.value = 0;

			// Calcular ingresos y gastos
			travels.forEach((travel) => {
				totalIncome.value += travel.amount;
			});

			notes.forEach((note) => {
				if (note.noteType === 'income') {
					totalIncome.value += note.amount;
				} else if (note.noteType === 'expense') {
					totalExpense.value += note.amount;
				}
			});
		} catch (error) {
			console.error('Error calculating stats:', error);
		}
	};

	// Llamar a la función calculateStats en la carga inicial
	onMounted(calculateStats);
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_stats.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.grid-container {
		color: #fff;
		.stat-container {
			background-color: rgba(255, 255, 255, 0.3);
			border-radius: 5px;
			padding: 10px;
			margin: 2px;
			.amount {
				font-size: 2em;
			}
		}
	}
</style>
