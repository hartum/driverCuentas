<template>
	<div class="travel-list">
		<div
			v-if="
				travelList.length == 0 &&
				shiftsList.length == 0 &&
				notesList.length == 0
			"
		>
			<IonCard>
				<IonCardHeader>
					<IonCardTitle>Crea un viaje o turno</IonCardTitle>
					<IonCardSubtitle>Sin viajes para esta fecha</IonCardSubtitle>
				</IonCardHeader>
				<IonCardContent>
					<p>Puedes empezar creando un viaje o un turno desde aquí.</p>
					<IonButton @click="navigateTo('/travelform')">
						<IonIcon slot="start" :icon="carSport"></IonIcon>
						Nuevo viaje
					</IonButton>
					<IonButton @click="navigateTo('/shift')">
						<IonIcon slot="start" :icon="time"></IonIcon>
						Nuevo turno
					</IonButton>
				</IonCardContent>
			</IonCard>
		</div>
		<div v-else>
			<!-- TRAVELS LIST -->
			<div class="ion-padding">
				<IonList lines="none" mode="ios">
					<TravelItem
						v-for="travelItem in travelList"
						:key="travelItem.id"
						:travel="travelItem"
						:currency="currency"
						@edit-travel="editTravel"
						@delete-travel="confirmRemoveItem"
					/>
				</IonList>
			</div>
			<!-- NOTES LIST -->
			<div class="ion-padding">
				<IonList lines="none" mode="ios">
					<NoteItem
						v-for="noteItem in notesList"
						:key="noteItem.id"
						:note="noteItem"
						:currency="currency"
						@edit-note="editNote"
						@delete-note="confirmRemoveItem"
					/>
				</IonList>
			</div>
			<!-- SHIFT LIST -->
			<ShiftItem
				v-for="shiftItem in shiftsList"
				:key="shiftItem.id"
				:shift="shiftItem"
				:currency="currency"
				@edit-shift="editShift"
				@delete-shift="confirmRemoveItem"
			/>

			<IonButton @click="borraDB">Borra la BBDD</IonButton>
		</div>
	</div>
	<IonActionSheet
		:header="actionSheetHeader"
		:buttons="actionSheetButtons"
		:is-open="actionSheetOpen"
		@didDismiss="handleActionSheetDismiss"
	></IonActionSheet>
</template>

<script setup>
	import { ref, onMounted, defineProps, watch } from 'vue';
	import moment from 'moment';
	import {
		IonList,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonButton,
		IonIcon,
		IonActionSheet,
	} from '@ionic/vue';
	import { time, carSport } from 'ionicons/icons';
	import { useRouter } from 'vue-router';
	import { getTravels, deleteTravel } from '@/services/travelService';
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { getNotes, deleteNote } from '@/services/noteService';
	import { useSettingsStore } from '../store/settingsStore';
	import { Preferences } from '@capacitor/preferences';
	import TravelItem from './TravelItem.vue';
	import NoteItem from './NoteItem.vue';
	import ShiftItem from './ShiftItem.vue';

	const props = defineProps({
		initialDate: {
			type: String,
			required: false,
			default: () => moment().startOf('month').format('YYYY-MM-DD HH:mm'),
		},
		endDate: {
			type: String,
			required: false,
			default: () => moment().endOf('month').format('YYYY-MM-DD HH:mm'),
		},
	});

	const router = useRouter();
	const settingsStore = useSettingsStore();
	const currency = ref(
		settingsStore.selectedCurrency === 'EUR'
			? '€'
			: settingsStore.selectedCurrency === 'USD'
			? '$'
			: settingsStore.selectedCurrency
	);

	let travelList = ref([]);
	let shiftsList = ref([]);
	let notesList = ref([]);
	let allItems = ref([]);

	const loadItems = async () => {
		const initialDate = moment(props.initialDate, 'YYYY-MM-DD HH:mm').format(
			'YYYY-MM-DDTHH:mm'
		);
		const endDate = moment(props.endDate, 'YYYY-MM-DD HH:mm').format(
			'YYYY-MM-DDTHH:mm'
		);

		travelList.value = await getTravels(initialDate, endDate);
		shiftsList.value = await getShifts(initialDate, endDate);
		notesList.value = await getNotes(initialDate, endDate);

		// Crear lista modificada de turnos
		let modifiedShifts = shiftsList.value.flatMap((shift) => [
			{ type: 'shift-start', date: shift.startDate, shift, isStart: true },
			{ type: 'shift-end', date: shift.endDate, shift, isStart: false },
		]);

		// Combinar y ordenar los elementos por fecha
		allItems.value = [
			...travelList.value.map((item) => ({
				...item,
				type: 'travel',
				date: item.startDate,
			})),
			...notesList.value.map((item) => ({
				...item,
				type: 'note',
				date: item.noteDate,
			})),
			...modifiedShifts,
		].sort((a, b) => new Date(a.date) - new Date(b.date));

		console.log('viajes', travelList.value);
		console.log('turnos', shiftsList.value);
		console.log('notas', notesList.value);
		console.log('Elementos combinados y ordenados', allItems.value);
	};

	const navigateTo = (path) => {
		router.push(path);
	};

	const editTravel = (id) => {
		router.push(`/travelform/${id}`);
	};

	const editShift = (id) => {
		router.push(`/shift/${id}`);
	};

	const editNote = (id) => {
		router.push(`/noteform/${id}`);
	};

	let slidingItem = ref(null);
	const actionSheetHeader = ref('');
	const actionSheetOpen = ref(false);
	const itemToRemove = ref(null);
	const itemTypeToRemove = ref(null);
	const actionSheetButtons = ref([
		{
			text: 'Borrar',
			role: 'destructive',
			data: {
				action: 'delete',
			},
		},
		{
			text: 'Cancelar',
			role: 'cancel',
			data: {
				action: 'cancel',
			},
		},
	]);

	const confirmRemoveItem = ({ id, event, itemType }) => {
		itemToRemove.value = id;
		itemTypeToRemove.value = itemType;
		slidingItem.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = `¿Deseas eliminar ${itemType}?`;
		actionSheetOpen.value = true;
	};

	const handleActionSheetDismiss = async (event) => {
		const role = event.detail.role;
		if (role === 'destructive' && itemToRemove.value !== null) {
			try {
				if (itemTypeToRemove.value === 'viaje') {
					await deleteTravel(itemToRemove.value);
					travelList.value = travelList.value.filter(
						(travel) => travel.id !== itemToRemove.value
					);
				} else if (itemTypeToRemove.value === 'turno') {
					await deleteShift(itemToRemove.value);
					shiftsList.value = shiftsList.value.filter(
						(shift) => shift.id !== itemToRemove.value
					);
				} else if (itemTypeToRemove.value === 'nota') {
					await deleteNote(itemToRemove.value);
					notesList.value = notesList.value.filter(
						(note) => note.id !== itemToRemove.value
					);
				}
				itemToRemove.value = null;
				itemTypeToRemove.value = null;
			} catch (error) {
				console.error('Error eliminando:', error);
			}
		}
		closeSlidingItem();
		actionSheetOpen.value = false;
	};

	const closeSlidingItem = () => {
		if (slidingItem.value) {
			slidingItem.value.close();
			slidingItem.value = null;
		}
	};

	const borraDB = async () => {
		console.log('borra BBDD');
		await Preferences.remove({ key: 'database' });
	};

	watch(
		() => [props.initialDate, props.endDate],
		() => {
			loadItems();
		}
	);

	onMounted(async () => {
		loadItems();
	});
</script>

<style scoped>
	/*
	ion-card {
		--background: rgba(255, 255, 255, 0.8);
	}
		
	.travel-list {
		.item-travel,
		.item-note {
			color: #535353;
			line-height: 1.2em;
			border-bottom: 1px dashed #ccc;
			.date {
				min-width: 85px;
				text-align: left;
			}
			.week-day {
				min-width: 35px;
				text-align: center;
			}
			.time {
				min-width: 45px;
			}
			.money {
				font-size: 1.4em;
				vertical-align: text-bottom;
				float: right;
				color: #666;
			}
			span {
				vertical-align: middle;
				display: inline-block;
				text-align: right;
			}
			.icon-travel,
			.icon-note {
				vertical-align: middle;
				color: #4b4a4a;
				width: 1.5em;
				height: 1.5em;
			}
			.income {
				color: #087702;
			}
			.expense {
				color: #bc0404;
			}
		}
	}
	/*
	.shift-card {
		border: 1px solid #ccc;
		.shift-header {
			border-bottom: 1px #ccc solid;
			background-color: #f8f8ff;
			text-align: center;
			.shift-title {
				.shift-tittle-info {
					font-size: 28px;
					font-weight: 300 !important;
					color: var(--ion-color-primary);
				}
				.shift-header-icon {
					vertical-align: bottom;
					margin: 0 9px;
				}
			}
		}
		.shift-footer {
			border-top: 1px #ccc solid;
			display: flex;
			text-align: right;
			.shift-footer-right {
				.shift-total {
					font-size: 1.7em;
				}
				&:first-child {
					flex-grow: 4;
				}
				&:last-child {
					flex-grow: 1;
					padding-right: 20px;
				}
			}
		}
	}
	ion-item::part(native) {
		background: transparent;
	}*/
	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
