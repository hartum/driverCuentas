<template>
	<div class="travel-list">
		<div class="ion-padding">
			<ion-button @click="borraDB" expand="block" mode="ios" color="danger"
				>Borra la BBDD</ion-button
			>
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
							v-on="getComponentEvents(childItem, item.id)"
						/>

						<!-- Button New Travel -->
						<div class="ion-padding" v-if="item.children.length === 0">
							<ion-button
								@click="navigateTo('/travelform/', item.id)"
								expand="block"
								mode="ios"
							>
								<ion-icon slot="start" :icon="carSport"></ion-icon>
								Nuevo viaje
							</ion-button>
						</div>
					</template>
				</component>
			</template>
		</div>
		<div class="ion-padding no-padding-top">
			<ion-button @click="navigateTo('/shift/')" expand="block" mode="ios">
				<ion-icon slot="start" :icon="time"></ion-icon>
				Nuevo turno
			</ion-button>
		</div>

		<!-- Toast de error -->
		<ion-toast
			:is-open="showEditErrorToast"
			:icon="closeCircle"
			message="Solo puedes editarlo si está dentro de un turno"
			:duration="1500"
			@didDismiss="showEditErrorToast = false"
			position="bottom"
			swipe-gesture="vertical"
		></ion-toast>
	</div>
	<ion-action-sheet
		:header="actionSheetHeader"
		:buttons="actionSheetButtons"
		:is-open="actionSheetOpen"
		@didDismiss="handleActionSheetDismiss"
	></ion-action-sheet>
</template>

<script setup>
	import {
		watch,
		computed,
		defineEmits,
		defineProps,
		onMounted,
		ref,
	} from 'vue';
	import moment from 'moment';
	import { IonButton, IonIcon, IonActionSheet, IonToast } from '@ionic/vue';
	import { time, carSport, closeCircle } from 'ionicons/icons';
	import { useRouter, useRoute } from 'vue-router';
	import { getTravels, deleteTravel } from '@/services/travelService';
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { getNotes, deleteNote } from '@/services/noteService';
	import { useSettingsStore } from '../store/settingsStore';
	import { Preferences } from '@capacitor/preferences';
	import TravelItem from './TravelItem.vue';
	import NoteItem from './NoteItem.vue';
	import ShiftItem from './ShiftItem.vue';

	const route = useRoute();
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

	const showEditErrorToast = ref(false);

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
		let total = 0.0; // Inicializa el total como un número flotante
		organizedItems.value.forEach((item) => {
			if (item.type === 'travel') {
				total += parseFloat(item.amount) || 0; // Asegura que amount es un número
			} else if (item.type === 'shift') {
				if (item.modeTotalShift === 'fixTotal') {
					total += parseFloat(item.totalShift) || 0;
				} else {
					let shiftTotal = 0.0;
					item.children.forEach((child) => {
						if (child.type === 'travel') {
							shiftTotal += parseFloat(child.amount) || 0;
						} else if (child.type === 'note') {
							if (child.noteType === 'income') {
								shiftTotal += parseFloat(child.amount) || 0;
							} else if (child.noteType === 'expense') {
								shiftTotal -= parseFloat(child.amount) || 0;
							}
						}
					});
					total += shiftTotal - (parseFloat(item.gasoline) || 0);
				}
			} else if (item.type === 'note') {
				if (item.noteType === 'income') {
					total += parseFloat(item.amount) || 0;
				} else if (item.noteType === 'expense') {
					total -= parseFloat(item.amount) || 0;
				}
			}
		});
		return total.toFixed(2); // Devuelve el total formateado con 2 decimales
	});

	const navigateTo = (path, id = null) => {
		if (path === '/shift/') {
			router.push(`${path}${id || ''}`);
		} else if (path === '/travelform/') {
			router.push(`${path}${id}`);
		} else {
			router.push(path);
		}
	};

	const editItem = (id, type, shiftId = null) => {
		if (!shiftId && type != 'shift') {
			showEditErrorToast.value = true;
			return;
		}

		const paths = {
			travel: '/travelform/',
			shift: '/shift/',
			note: '/noteform/',
		};

		if (type === 'shift') {
			router.push(`${paths[type]}${id}`);
		} else {
			router.push(`${paths[type]}${shiftId}/${id}`);
		}
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
		removeSettings();
		await Preferences.remove({ key: 'database' });
		await loadItems();
	};

	const getComponentProps = (item) => {
		if (item.type === 'shift') {
			return {
				shift: item,
				currency: currency.value,
				showNewTravelButton: item.children && item.children.length === 0,
			};
		}
		return {
			[item.type]: item,
			currency: currency.value,
		};
	};

	const getComponentEvents = (item, parentShiftId) => {
		if (item.type === 'shift') {
			return {
				'edit-shift': () => editItem(item.id, 'shift'),
				'delete-shift': () => confirmRemoveItem(item),
			};
		} else {
			return {
				[`edit-${item.type}`]: () =>
					editItem(item.id, item.type, parentShiftId),
				[`delete-${item.type}`]: () => confirmRemoveItem(item),
			};
		}
	};

	const removeSettings = async () => {
		await Preferences.remove({ key: 'appSettings' });
		console.log('initial settings removed');
	};

	watch(() => [route.fullPath, props.initialDate, props.endDate], loadItems);

	watch(totalAmount, (newTotal) => {
		emit('update:totalAmount', newTotal);
	});

	onMounted(() => {
		loadItems();
	});
</script>
<style lang="scss" scoped>
	.no-padding-top {
		padding-top: 0 !important;
	}
	ion-toast {
		--background: #ff6200;
		--color: #ffffff;
	}
</style>
