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
		notes: {
			type: Array,
			required: true,
		},
	});

	const generateColor = (index) => {
		const hue = index * 137.508; // use golden angle approximation
		return `hsl(${hue},50%,50%)`;
	};

	const chartData = computed(() => {
		const expenseData = props.notes
			.filter((note) => note.noteType === 'expense')
			.reduce((acc, note) => {
				let category;
				if (note.fuel) {
					category = 'Combustible';
				} else if (note.description && note.description.trim() !== '') {
					category = note.description.trim();
				} else {
					category = 'Otros';
				}

				if (!acc[category]) {
					acc[category] = 0;
				}
				acc[category] += note.amount;
				return acc;
			}, {});

		const sortedCategories = Object.entries(expenseData)
			.sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor gasto
			.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

		const labels = Object.keys(sortedCategories).map(
			(category) =>
				`${category} ${sortedCategories[category].toFixed(2)}${currency.value}`
		);
		const data = Object.values(sortedCategories);
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
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.label || '';
						if (label) {
							label = label.split(' ')[0] + ': '; // Extraer solo el nombre de la categoría
						}
						if (context.parsed !== null) {
							label += `${context.parsed.toFixed(2)}${currency.value} (${(
								(context.parsed /
									context.dataset.data.reduce((a, b) => a + b, 0)) *
								100
							).toFixed(2)}%)`;
						}
						return label;
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
