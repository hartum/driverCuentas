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
			<div class="ion-padding">
				<!-- QUIERO QUE ESCRIBAS EL CÓDIGO AQUÍ  -->
				<IonList lines="none" mode="ios">
					<template v-for="(item, index) in filteredItems" :key="item.id">
						<template v-if="!processedIndexes.has(index)">
							<TravelItem
								v-if="item.type === 'travel'"
								:travel="item"
								:currency="currency"
								@edit-travel="editTravel"
								@delete-travel="confirmRemoveItem"
							/>
							<NoteItem
								v-if="item.type === 'note'"
								:note="item"
								:currency="currency"
								@edit-note="editNote"
								@delete-note="confirmRemoveItem"
							/>
							<ShiftItem
								v-if="item.type === 'shift-start'"
								:shift="item.shift"
								:currency="currency"
								@edit-shift="editShift"
								@delete-shift="confirmRemoveItem"
							>
								<template
									v-for="nestedItem in getNestedItems(index + 1)"
									:key="nestedItem.id"
								>
									<TravelItem
										v-if="nestedItem.type === 'travel'"
										:travel="nestedItem"
										:currency="currency"
										@edit-travel="editTravel"
										@delete-travel="confirmRemoveItem"
									/>
									<NoteItem
										v-if="nestedItem.type === 'note'"
										:note="nestedItem"
										:currency="currency"
										@edit-note="editNote"
										@delete-note="confirmRemoveItem"
									/>
								</template>
							</ShiftItem>
						</template>
					</template>
				</IonList>
			</div>
			<!-- TRAVELS LIST 
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
		-->
			<!-- NOTES LIST 
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
		-->
			<!-- SHIFT LIST
			<ShiftItem
				v-for="shiftItem in shiftsList"
				:key="shiftItem.id"
				:shift="shiftItem"
				:currency="currency"
				@edit-shift="editShift"
				@delete-shift="confirmRemoveItem"
				>Holaaaaa</ShiftItem
			>
		-->
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
	import { ref, onMounted, defineProps, watch, computed } from 'vue';
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
	const processedIndexes = ref(new Set());

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

		// Combinar y ordenar los elementos por fecha, priorizando los turnos
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
		].sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			if (dateA < dateB) return -1;
			if (dateA > dateB) return 1;
			if (a.type.startsWith('shift') && !b.type.startsWith('shift')) return -1;
			if (!a.type.startsWith('shift') && b.type.startsWith('shift')) return 1;
			return 0;
		});

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

	const getNestedItems = (startIndex) => {
		const nestedItems = [];
		for (let i = startIndex; i < allItems.value.length; i++) {
			const nestedItem = allItems.value[i];
			if (nestedItem.type === 'shift-end') {
				break;
			}
			nestedItems.push(nestedItem);
			processedIndexes.value.add(i); // Marcar este índice como procesado
		}
		return nestedItems;
	};

	const filteredItems = computed(() => {
		const items = [];
		for (let i = 0; i < allItems.value.length; i++) {
			if (!processedIndexes.value.has(i)) {
				items.push(allItems.value[i]);
			}
		}
		return items;
	});

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
	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
