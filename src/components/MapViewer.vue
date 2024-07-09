<template>
	<div ref="mapContainer" class="map">
		<div :class="{ marker: !isMoving, 'marker-active': isMoving }">
			<div class="tooltip" v-if="tooltipText" v-html="tooltipText"></div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref, defineProps, defineEmits } from 'vue';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ';
	import { fromLonLat, toLonLat } from 'ol/proj';
	import 'ol/ol.css';

	const props = defineProps({
		initialData: {
			type: Object,
			default: () => ({
				latitude: 40.41831,
				longitude: -3.70275,
				address: '1, Calle de San Alberto, Madrid, 28013, Spain',
				zoom: 4,
			}),
		},
	});

	const emit = defineEmits(['mapUpdated']);
	const mapContainer = ref(null);
	const isMoving = ref(false);
	const tooltipText = ref('');
	let timeoutId = null;
	let abortController = null;

	const getReverseGeocodingData = async (latitude, longitude, signal) => {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
			{ signal }
		);
		if (!response.ok) throw new Error('Failed getting address data');
		const data = await response.json();
		return data;
	};

	const formatAddress = (address) => {
		const components = [
			address.house_number && address.house_number,
			address.road && address.road,
			address.city && address.city,
			address.postcode && address.postcode,
			address.country && address.country,
		];
		return components.filter(Boolean).join(', ');
	};

	onMounted(async () => {
		const map = new Map({
			target: mapContainer.value,
			layers: [
				new TileLayer({
					source: new XYZ({
						url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=18EZCT9X9ke9TxPIzB2W',
					}),
				}),
			],
			view: new View({
				center: fromLonLat([
					props.initialData.longitude,
					props.initialData.latitude,
				]),
				zoom: props.initialData.zoom,
			}),
		});

		const initialCenter = toLonLat(map.getView().getCenter());
		const initialZoom = map.getView().getZoom();

		try {
			const addressData = await getReverseGeocodingData(
				initialCenter[1],
				initialCenter[0]
			);
			const formattedAddress = formatAddress(addressData.address);
			tooltipText.value = '<p class="tooltipMsg">' + formattedAddress + '</p>';
			emit('mapUpdated', {
				latitude: initialCenter[1],
				longitude: initialCenter[0],
				address: formattedAddress,
				zoom: initialZoom,
			});
		} catch (error) {
			if (error.name !== 'AbortError') {
				tooltipText.value =
					'<b>Lat:</b> ' +
					initialCenter[1] +
					' <br><b>Lon:</b> ' +
					initialCenter[0];
				emit('mapUpdated', {
					latitude: initialCenter[1],
					longitude: initialCenter[0],
					address: '',
					zoom: initialZoom,
				});
			}
		}

		const handleMoveEnd = async () => {
			isMoving.value = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(async () => {
				const center = toLonLat(map.getView().getCenter());
				const zoom = map.getView().getZoom();
				console.log(`El centro del mapa está en: [${center[1]}, ${center[0]}]`);
				abortController = new AbortController();

				try {
					const addressData = await getReverseGeocodingData(
						center[1],
						center[0],
						abortController.signal
					);
					const formattedAddress = formatAddress(addressData.address);
					tooltipText.value =
						'<p class="tooltipMsg">' + formattedAddress + '</p>';
					console.log('Dirección:', formattedAddress);
					emit('mapUpdated', {
						latitude: center[1],
						longitude: center[0],
						address: formattedAddress,
						zoom: zoom,
					});
				} catch (error) {
					if (error.name !== 'AbortError') {
						tooltipText.value =
							'<b>Lat:</b> ' + center[1] + ' <br><b>Lon:</b> ' + center[0];
						console.error('Error fetching address:', error);
						emit('mapUpdated', {
							latitude: center[1],
							longitude: center[0],
							address: '',
							zoom: zoom,
						});
					}
				}
			}, 1500);
		};

		map.on('movestart', () => {
			tooltipText.value = '';
			isMoving.value = true;
			if (abortController) {
				abortController.abort();
			}
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		});

		map.on('moveend', handleMoveEnd);
	});
</script>

<style>
	.map {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.marker,
	.marker-active {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) translateY(-50%);
		z-index: 1000;
		pointer-events: none;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center bottom;
	}

	.marker {
		width: 30px;
		height: 45px;
		background-image: url('/marker_map_icon.svg');
	}

	.marker-active {
		width: 30px;
		height: 66px;
		background-image: url('/marker_map_icon_active.svg');
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: #3d3d3de1;
		padding: 10px 15px;
		border-radius: 5px;
		color: #fff;
		white-space: nowrap;
		z-index: 1001;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-width: 10px;
		border-style: solid;
		border-color: #3d3d3de1 transparent transparent transparent;
	}
	.tooltip .tooltipMsg {
		max-width: 80vw;
	}
</style>
