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
						<div class="amount">{{ totalIncomeFormated }}</div>
					</ion-col>
					<ion-col class="stat-container">
						<div>Gastos</div>
						<div class="amount">{{ totalExpenseFormated }}</div>
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col class="stat-container">
						<div>Total</div>
						<div class="amount">{{ total }}</div>
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col class="stat-container">
						<div>Tipos de Viajes</div>
						<ServicePieChart :travels="travels" />
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col class="stat-container">
						<div>Gastos</div>
						<ExpenseChart :notes="notes" />
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col class="stat-container">
						<div>Tipos de Pagos</div>
						<PaymentMethodPieChart :travels="travels" />
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
	import { useRoute } from 'vue-router';
	import { ref, onMounted, computed, watch } from 'vue';
	import { useSettingsStore } from '../store/settingsStore';
	import TimeNavigator from '@/components/TimeNavigator.vue';
	import { getTimeRange } from '@/services/getTimeRangeService';
	import { getTravels } from '@/services/travelService';
	import { getNotes } from '@/services/noteService';
	import ServicePieChart from '@/components/charts/ServicePieChart.vue';
	import PaymentMethodPieChart from '@/components/charts/PaymentMethodPieChart.vue';
	import ExpenseChart from '@/components/charts/ExpenseChart.vue';

	const settingsStore = useSettingsStore();
	const route = useRoute();

	// -- VARIABLES DE TIEMPO --
	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const firstDayOfWeek = ref(1);

	const totalIncome = ref(0);
	const totalIncomeFormated = ref('0.00');
	const totalExpense = ref(0);
	const totalExpenseFormated = ref('0.00');
	const total = computed(() => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: settingsStore.selectedCurrency,
		}).format(totalIncome.value - totalExpense.value);
	});

	const travels = ref([]);
	const notes = ref([]);

	// -- Establecer el valor del primer día de la semana por defecto --
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const handleDateChanged = async ({ newDate, type }) => {
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
			initialDate.value = moment(initialDate.value).format('YYYY-MM-DDTHH:mm');
			endDate.value = moment(endDate.value).format('YYYY-MM-DDTHH:mm');
			// Obtener todos los viajes y notas entre las fechas seleccionadas
			travels.value = await getTravels(initialDate.value, endDate.value);
			notes.value = await getNotes(initialDate.value, endDate.value);

			// Resetear los valores
			totalIncome.value = 0;
			totalExpense.value = 0;

			// Calcular ingresos y gastos
			travels.value.forEach((travel) => {
				totalIncome.value += travel.amount;
			});

			notes.value.forEach((note) => {
				if (note.noteType === 'income') {
					totalIncome.value += note.amount;
				} else if (note.noteType === 'expense') {
					totalExpense.value += note.amount;
				}
			});

			totalIncomeFormated.value = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: settingsStore.selectedCurrency,
			}).format(totalIncome.value);

			totalExpenseFormated.value = new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: settingsStore.selectedCurrency,
			}).format(totalExpense.value);
		} catch (error) {
			console.error('Error calculating stats:', error);
		}
	};

	// Watch para la ruta
	watch(
		() => route.params,
		() => {
			calculateStats();
		}
	);
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
			background-color: rgba(59, 59, 59, 0.8);
			border-radius: 5px;
			padding: 10px;
			margin: 2px;
			.amount {
				font-size: 1.5em;
			}
		}
	}
</style>
