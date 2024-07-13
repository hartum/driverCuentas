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
					<IonItemSliding v-for="travel in travelList" :key="travel.id">
						<IonItem
							class="item-travel"
							button="true"
							@click="editTravel(travel.id)"
						>
							<IonLabel>
								<IonIcon
									:icon="payIcons[travel.payMethod]"
									size="small"
									class="icon-travel"
								></IonIcon>
								<span>{{
									moment(travel.startDate).format('DD MMM - HH:mm')
								}}</span>
								<span class="money income">
									<b>{{ travel.amount }}{{ currency }} </b>
								</span>
							</IonLabel>
						</IonItem>
						<IonItemOptions side="end">
							<IonItemOption
								color="danger"
								@click="confirmRemoveItem(travel.id, 'viaje', $event)"
							>
								<IonIcon slot="icon-only" :icon="trash"></IonIcon>
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				</IonList>
			</div>
			<!-- NOTES LIST -->
			<div class="ion-padding">
				<IonList lines="none" mode="ios">
					<IonItemSliding v-for="note in notesList" :key="note.id">
						<IonItem class="item-note" button="true" @click="editNote(note.id)">
							<IonLabel>
								<IonIcon
									:icon="reader"
									size="small"
									class="icon-note"
								></IonIcon>
								<span>{{
									moment(note.noteDate).format('DD MMM - HH:mm')
								}}</span>
								<span
									class="money"
									:class="{
										income: note.noteType == 'income',
										expense: note.noteType == 'expense',
									}"
									v-if="note.amount > 0"
								>
									<b>{{ note.amount }}{{ currency }} </b>
								</span>
							</IonLabel>
						</IonItem>
						<IonItemOptions side="end">
							<IonItemOption
								color="danger"
								@click="confirmRemoveItem(note.id, 'nota', $event)"
							>
								<IonIcon slot="icon-only" :icon="trash"></IonIcon>
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				</IonList>
			</div>
			<!-- SHIFT LIST -->
			<IonCard
				class="shift-card"
				mode="ios"
				v-for="shift in shiftsList"
				:key="shift.id"
			>
				<IonCardHeader class="shift-header">
					<IonCardTitle class="shift-title">
						<IonItemSliding>
							<IonItem button="true" lines="none" @click="editShift(shift.id)">
								<IonIcon
									:icon="timeOutline"
									color="primary"
									class="shift-header-icon"
									size="large"
								/>
								<span class="shift-tittle-info"
									>{{ moment(shift.startDate).format('HH:mm') }}h -
									{{ moment(shift.endDate).format('HH:mm') }}h</span
								>
							</IonItem>
							<IonItemOptions side="end">
								<IonItemOption
									color="danger"
									@click="confirmRemoveItem(shift.id, 'turno', $event)"
								>
									<IonIcon slot="icon-only" :icon="trash"></IonIcon>
								</IonItemOption>
							</IonItemOptions>
						</IonItemSliding>
					</IonCardTitle>
				</IonCardHeader>
				<IonCardContent></IonCardContent>
				<div class="shift-footer ion-padding">
					<div>
						<div v-if="shift.modeKM == 'fix'">
							<b>{{ shift.totalKm }}</b> km
							<IonIcon :icon="timerOutline"></IonIcon>
						</div>
						<div v-else>
							<b>{{ shift.finalKm - shift.initialKm }}</b> km
							<IonIcon :icon="timerOutline"></IonIcon>
						</div>
						<div>
							<b>{{ shift.gasoline }}</b> {{ currency }}
							<IonIcon :icon="waterOutline"></IonIcon>
						</div>
					</div>
					<div class="shift-footer-right">
						<div>SubTotal</div>
						<div v-if="shift.modeTotalShift == 'fixTotal'" class="shift-total">
							{{ shift.totalShift }} {{ currency }}
						</div>
						<div v-else><b>*Esperando viajes</b></div>
					</div>
				</div>
			</IonCard>
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
	import { ref, onMounted, defineProps } from 'vue';
	import moment from 'moment';
	import {
		IonList,
		IonItem,
		IonItemOptions,
		IonItemOption,
		IonItemSliding,
		IonLabel,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonButton,
		IonIcon,
		IonActionSheet,
	} from '@ionic/vue';
	import {
		trash,
		time,
		timeOutline,
		timerOutline,
		waterOutline,
		reader,
		phonePortraitOutline,
		carSport,
		cashOutline,
		cardOutline,
	} from 'ionicons/icons';
	import { useRouter } from 'vue-router';
	import { getTravels, deleteTravel } from '@/services/travelService';
	import { getShifts, deleteShift } from '@/services/shiftService';
	import { getNotes, deleteNote } from '@/services/noteService';
	import { useSettingsStore } from '../store/settingsStore';
	import { Preferences } from '@capacitor/preferences';
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

	const payIcons = {
		app: phonePortraitOutline,
		cash: cashOutline,
		card: cardOutline,
	};

	const loadItems = async () => {
		travelList.value = await getTravels();
		shiftsList.value = await getShifts();
		notesList.value = await getNotes();
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

	const confirmRemoveItem = (id, type, event) => {
		itemToRemove.value = id;
		itemTypeToRemove.value = type;
		slidingItem.value = event.target.closest('ion-item-sliding');
		actionSheetHeader.value = `¿Deseas eliminar el ${type}?`;
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

	onMounted(async () => {
		loadItems();
	});
</script>

<style scoped>
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
	}
	.list-ios {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
	}
</style>
