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
					<ion-col>
						<!-- <IncomeChart :chartData="incomeData" :chartOptions="chartOptions" /> -->
					</ion-col>
					<ion-col>
						<!--
						<ExpenseChart
							:chartData="expenseData"
							:chartOptions="chartOptions"
						/>
						-->
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
	import { ref } from 'vue';
	import { useSettingsStore } from '../store/settingsStore';
	import TimeNavigator from '@/components/TimeNavigator.vue';
	import { getTimeRange } from '@/services/getTimeRangeService';
	import IncomeChart from '@/components/charts/IncomeChart.vue';
	import ExpenseChart from '@/components/charts/ExpenseChart.vue';

	const settingsStore = useSettingsStore();

	// -- VARIABLES DE TIEMPO --
	const fechaUnica = ref(moment().format('YYYY-MM-DD'));
	const initialDate = ref(moment().startOf('month').format('YYYY-MM-DD HH:mm'));
	const endDate = ref(moment().endOf('month').format('YYYY-MM-DD HH:mm'));
	const firstDayOfWeek = ref(1);

	// -- Establecer el valor del primer día de la semana por defecto --
	firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

	const handleDateChanged = ({ newDate, type }) => {
		console.log({ newDate, type });
		const { initialDate: start, endDate: end } = getTimeRange(
			newDate,
			type,
			firstDayOfWeek.value
		);
		initialDate.value = start;
		endDate.value = end;
	};
	/*
	// Datos de ejemplo para los gráficos
	const incomeData = ref({
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Ingresos',
				backgroundColor: '#4caf50',
				data: [40, 20, 30, 50, 20, 60, 70],
			},
		],
	});

	const expenseData = ref({
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Gastos',
				backgroundColor: '#f44336',
				data: [20, 30, 15, 25, 10, 35, 45],
			},
		],
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};*/
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_stats.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	.grid-container {
		color: #fff;
	}
</style>
