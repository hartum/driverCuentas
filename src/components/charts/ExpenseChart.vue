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

	// Function to decode UTF-8 text
	const decodeUTF8 = (text) => {
		try {
			return decodeURIComponent(escape(text));
		} catch (e) {
			return text; // Si falla la decodificación, devuelve el texto original
		}
	};

	const chartData = computed(() => {
		const expenseData = props.notes
			.filter((note) => note.noteType === 'expense')
			.reduce((acc, note) => {
				let category;
				if (note.fuel) {
					category = 'Combustible';
				} else if (note.description && note.description.trim() !== '') {
					category = decodeUTF8(note.description.trim());
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
			.sort((a, b) => b[1] - a[1])
			.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

		const formatter = new Intl.NumberFormat('es-ES', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

		const labels = Object.keys(sortedCategories).map(
			(category) =>
				`${category} ${formatter.format(sortedCategories[category])}${
					currency.value
				}`
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
				align: 'start',
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
						const formatter = new Intl.NumberFormat('es-ES', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						});

						let label = context.label || '';
						if (label) {
							label = label.split(' ')[0] + ': '; // Extraer solo el nombre de la categoría
						}
						if (context.parsed !== null) {
							const amount = formatter.format(context.parsed);
							const total = context.dataset.data.reduce((a, b) => a + b, 0);
							const percentage = formatter.format(
								(context.parsed / total) * 100
							);
							label += `${amount}${currency.value} (${percentage}%)`;
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
