<template>
	<div class="chart-container">
		<Pie :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
	import { computed } from 'vue';
	import { Pie } from 'vue-chartjs';
	import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
	import { useSettingsStore } from '../../store/settingsStore';

	ChartJS.register(ArcElement, Tooltip, Legend);

	const props = defineProps({
		travels: {
			type: Array,
			required: true,
		},
	});

	const generateColor = (index) => {
		const hue = index * 137.508; // use golden angle approximation
		return `hsl(${hue},50%,50%)`;
	};

	const chartData = computed(() => {
		const paymentData = props.travels.reduce((acc, travel) => {
			if (!acc[travel.payMethod]) {
				acc[travel.payMethod] = 0;
			}
			acc[travel.payMethod] += travel.amount;
			return acc;
		}, {});

		const labels = Object.keys(paymentData).map(
			(method) => `${payType[method]} ${paymentData[method]}${currency.value}`
		);
		const data = Object.values(paymentData);
		const backgroundColor = labels.map((_, index) => generateColor(index));
		const borderColor = backgroundColor.map((color) =>
			color.replace('50%', '40%')
		);

		return {
			labels,
			datasets: [
				{
					data,
					backgroundColor,
					borderColor,
					borderWidth: 1,
				},
			],
		};
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					color: 'white',
					font: {
						size: 15,
					},
				},
			},
		},
	};

	const settingsStore = useSettingsStore();
	const currency = computed(() => {
		const currencyMap = { EUR: '€', USD: '$' };
		return (
			currencyMap[settingsStore.selectedCurrency] ||
			settingsStore.selectedCurrency
		);
	});
	const payType = {
		cash: 'Efectivo',
		app: 'App',
		card: 'Tarjeta',
	};
</script>

<style scoped>
	.chart-container {
		position: relative;
		height: 300px;
		width: 100%;
	}
</style>
