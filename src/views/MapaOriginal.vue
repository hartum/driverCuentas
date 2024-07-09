<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Tab 1</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Tab 1</ion-title>
				</ion-toolbar>
			</ion-header>

			<div ref="mapContainer" class="map">
				<div :class="{ marker: !isMoving, 'marker-active': isMoving }">
					<div class="tooltip" v-if="tooltipText">{{ tooltipText }}</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
	} from '@ionic/vue';

	import { onMounted, ref } from 'vue';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import { fromLonLat, toLonLat } from 'ol/proj';
	import 'ol/ol.css';

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
		if (!response.ok) throw new Error('Failed to fetch');
		const data = await response.json();
		return data;
	};

	const formatAddress = (address) => {
		const road = address.road || '';
		const houseNumber = address.house_number || '';
		const city = address.city || '';
		const postcode = address.postcode || '';
		const country = address.country || '';

		return `${houseNumber} ${road}, ${city}, ${postcode}, ${country}`;
	};

	onMounted(() => {
		const map = new Map({
			target: mapContainer.value,
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			view: new View({
				center: fromLonLat([0, 0]),
				zoom: 2,
			}),
		});

		const handleMoveEnd = async () => {
			isMoving.value = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(async () => {
				const center = toLonLat(map.getView().getCenter());
				console.log(`El centro del mapa está en: [${center[1]}, ${center[0]}]`);
				abortController = new AbortController();

				try {
					const addressData = await getReverseGeocodingData(
						center[1],
						center[0],
						abortController.signal
					);
					const formattedAddress = formatAddress(addressData.address);
					tooltipText.value = formattedAddress;
					console.log('Dirección:', formattedAddress);
				} catch (error) {
					if (error.name !== 'AbortError') {
						tooltipText.value = 'No se pudo obtener la dirección';
						console.error('Error fetching address:', error);
					}
				}
			}, 2500);
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
		z-index: 1000; /* Asegura que el marcador esté sobre el mapa */
		pointer-events: none; /* Para que no interfiera con las interacciones del mapa */
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
		z-index: 1001; /* Un poco más alto que el marcador */
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

	.ol-control button {
		background: rgba(255, 255, 255, 0.7);
		border-radius: 5px;
		border: none;
		color: #000;
		font-size: 1.2em;
		font-weight: bold;
	}

	.ol-control button:hover {
		background: rgba(255, 255, 255, 0.9);
	}
</style>
