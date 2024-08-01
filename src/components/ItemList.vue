<template>
	<div class="travel-list">
		<div v-if="organizedItems.length === 0">
			<IonCard>
				<IonCardHeader>
					<IonCardTitle>Crea un viaje o turno</IonCardTitle>
					<IonCardSubtitle>Nada que mostrar en esta fecha</IonCardSubtitle>
				</IonCardHeader>
				<IonCardContent>
					<p>Puedes empezar creando un viaje o un turno desde aquí.</p>
					<IonButton @click="navigateTo('/travelform/')">
						<IonIcon slot="start" :icon="carSport"></IonIcon>
						Nuevo viaje
					</IonButton>
					<IonButton @click="navigateTo('/shift/')">
						<IonIcon slot="start" :icon="time"></IonIcon>
						Nuevo turno
					</IonButton>
				</IonCardContent>
			</IonCard>
		</div>
		<div v-else class="ion-padding">
			<template v-for="item in organizedItems" :key="item.id">
				<component
					:is="componentMap[item.type]"
					v-bind="getComponentProps(item)"
					v-on="getComponentEvents(item)"
				>
					<template v-if="item.type === 'shift' && item.children">
						<component
							v-for="childItem in item.children"
							:key="childItem.id"
							:is="componentMap[childItem.type]"
							v-bind="getComponentProps(childItem)"
							v-on="getComponentEvents(childItem)"
						/>
					</template>
				</component>
			</template>
		</div>
		<!--<IonButton @click="borraDB">Borra la BBDD</IonButton>-->
	</div>
	<IonActionSheet
		:header="actionSheetHeader"
		:buttons="actionSheetButtons"
		:is-open="actionSheetOpen"
		@didDismiss="handleActionSheetDismiss"
	></IonActionSheet>
</template>

<script setup>
	import {
		ref,
		onMounted,
		defineProps,
		watch,
		computed,
		defineEmits,
	} from 'vue';
	import moment from 'moment';
	import {
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
			default: () => moment().startOf('month').format('YYYY-MM-DD HH:mm'),
		},
		endDate: {
			type: String,
			default: () => moment().endOf('month').format('YYYY-MM-DD HH:mm'),
		},
	});

	const emit = defineEmits(['update:totalAmount']);

	const router = useRouter();
	const settingsStore = useSettingsStore();
	const currency = computed(() => {
		const currencyMap = { EUR: '€', USD: '$' };
		return (
			currencyMap[settingsStore.selectedCurrency] ||
			settingsStore.selectedCurrency
		);
	});

	const allItems = ref([]);

	const componentMap = {
		travel: TravelItem,
		note: NoteItem,
		shift: ShiftItem,
	};

	const loadItems = async () => {
		const initialDate = moment(props.initialDate).format('YYYY-MM-DDTHH:mm');
		const endDate = moment(props.endDate).format('YYYY-MM-DDTHH:mm');

		const [travels, shifts, notes] = await Promise.all([
			getTravels(initialDate, endDate),
			getShifts(initialDate, endDate),
			getNotes(initialDate, endDate),
		]);

		allItems.value = [
			...travels.map((travel) => ({
				...travel,
				type: 'travel',
				date: travel.startDate,
			})),
			...shifts.map((shift) => ({
				...shift,
				type: 'shift',
				startDate: shift.startDate,
				endDate: shift.endDate,
			})),
			...notes.map((note) => ({ ...note, type: 'note', date: note.noteDate })),
		];

		console.log('Elementos cargados:', allItems.value);
	};

	const organizedItems = computed(() => {
		const sortedItems = [...allItems.value].sort((a, b) =>
			moment(a.date || a.startDate).diff(moment(b.date || b.startDate))
		);

		const result = [];
		let currentShift = null;

		sortedItems.forEach((item) => {
			if (item.type === 'shift') {
				if (currentShift) {
					result.push(currentShift);
				}
				currentShift = { ...item, children: [] };
			} else if (
				currentShift &&
				moment(item.date).isBetween(
					currentShift.startDate,
					currentShift.endDate,
					null,
					'[]'
				)
			) {
				currentShift.children.push(item);
			} else {
				if (currentShift) {
					result.push(currentShift);
					currentShift = null;
				}
				result.push(item);
			}
		});

		if (currentShift) {
			result.push(currentShift);
		}

		return result;
	});

	const totalAmount = computed(() => {
		let total = 0;
		organizedItems.value.forEach((item) => {
			if (item.type === 'travel') {
				total += item.amount;
			} else if (item.type === 'shift') {
				if (item.modeTotalShift === 'fixTotal') {
					total += parseFloat(item.totalShift);
				} else {
					let shiftTotal = 0;
					item.children.forEach((child) => {
						if (child.type === 'travel') {
							shiftTotal += child.amount;
						} else if (child.type === 'note') {
							if (child.noteType === 'income') {
								shiftTotal += child.amount;
							} else if (child.noteType === 'expense') {
								shiftTotal -= child.amount;
							}
						}
					});
					total += shiftTotal - parseFloat(item.gasoline);
				}
			} else if (item.type === 'note') {
				if (item.noteType === 'income') {
					total += item.amount;
				} else if (item.noteType === 'expense') {
					total -= item.amount;
				}
			}
		});
		return total.toFixed(2);
	});

	const navigateTo = (path) => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push(path + now);
	};

	const editItem = (id, type) => {
		const paths = {
			travel: '/travelform/',
			shift: '/shift/',
			note: '/noteform/',
		};
		router.push(`${paths[type]}${id}`);
	};

	const actionSheetOpen = ref(false);
	const actionSheetHeader = ref('');
	const itemToRemove = ref(null);
	const actionSheetButtons = [
		{
			text: 'Borrar',
			role: 'destructive',
			data: { action: 'delete' },
		},
		{
			text: 'Cancelar',
			role: 'cancel',
			data: { action: 'cancel' },
		},
	];

	const confirmRemoveItem = (item) => {
		itemToRemove.value = item;
		actionSheetHeader.value = `¿Deseas eliminar este ${item.type}?`;
		actionSheetOpen.value = true;
	};

	const handleActionSheetDismiss = async (event) => {
		if (event.detail.role === 'destructive' && itemToRemove.value) {
			try {
				const deleteActions = {
					travel: deleteTravel,
					shift: deleteShift,
					note: deleteNote,
				};
				await deleteActions[itemToRemove.value.type](itemToRemove.value.id);
				await loadItems();
			} catch (error) {
				console.error('Error eliminando:', error);
			}
		}
		actionSheetOpen.value = false;
		itemToRemove.value = null;
	};

	const borraDB = async () => {
		await Preferences.remove({ key: 'database' });
		await loadItems();
	};

	const getComponentProps = (item) => ({
		[item.type]: item,
		currency: currency.value,
	});

	const getComponentEvents = (item) => ({
		[`edit-${item.type}`]: () => editItem(item.id, item.type),
		[`delete-${item.type}`]: () => confirmRemoveItem(item),
	});

	watch(() => [props.initialDate, props.endDate], loadItems);

	watch(totalAmount, (newTotal) => {
		emit('update:totalAmount', newTotal);
	});

	onMounted(() => {
		loadItems();
	});
</script>
