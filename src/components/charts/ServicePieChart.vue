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
		const serviceData = props.travels.reduce((acc, travel) => {
			if (!acc[travel.service]) {
				acc[travel.service] = 0;
			}
			acc[travel.service] += travel.amount;
			return acc;
		}, {});

		const labels = Object.keys(serviceData).map(
			(service) => `${service} ${serviceData[service]}${currency.value}`
		);
		const data = Object.values(serviceData);
		const backgroundColor = labels.map((_, index) => generateColor(index));
		const borderColor = backgroundColor.map((color) =>
			color.replace('60%', '50%')
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
</script>

<style scoped>
	.chart-container {
		position: relative;
		height: 300px;
		width: 100%;
	}
</style>
