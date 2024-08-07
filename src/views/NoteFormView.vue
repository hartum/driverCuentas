<template>
	<ion-page>
		<ion-header mode="ios">
			<ion-toolbar>
				<ion-title>{{
					modeForm === 'edit' ? 'Editar Nota' : 'Nueva Nota'
				}}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding form-container">
			<ion-segment v-model="form.noteType" mode="ios">
				<ion-segment-button value="income" mode="ios">
					<ion-label>Ingreso</ion-label>
					<ion-icon :icon="thumbsUp" class="icons"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="expense" mode="ios">
					<ion-label>Gasto</ion-label>
					<ion-icon :icon="thumbsDown" class="icons"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="other" mode="ios">
					<ion-label>Otro</ion-label>
					<ion-icon :icon="reader" class="icons"></ion-icon>
				</ion-segment-button>
			</ion-segment>
			<ion-list lines="none" :inset="true" mode="ios">
				<ion-item mode="ios">
					<ion-label>Fecha:</ion-label>
					<DateTimePicker
						:value="form.noteDate"
						@dateTimeChange="handleNoteDateChange"
					/>
				</ion-item>
				<ion-item mode="ios">
					<ion-textarea
						label="Concepto:"
						label-placement="fixed"
						rows="5"
						placeholder="Descripción de la nota, Ejem: ITV"
						v-model="form.description"
					></ion-textarea>
				</ion-item>
				<ion-item v-show="form.noteType != 'other'" mode="ios">
					<ion-input
						label="Importe:"
						label-placement="fixed"
						type="number"
						inputmode="decimal"
						placeholder="000.00"
						max="999"
						maxlength="6"
						min="0"
						v-model="form.amount"
						:disabled="form.noteType == 'other'"
					>
						<span slot="end">€</span>
					</ion-input>
				</ion-item>
			</ion-list>
			<ion-toast
				:is-open="showToast"
				:message="toastMessage"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showToast = false)"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
		</ion-content>
		<ion-footer id="form-footer">
			<ion-grid>
				<ion-row>
					<ion-col>
						<ion-button
							fill="outline"
							expand="block"
							shape="round"
							mode="ios"
							@click="handleCancel"
						>
							Cancelar
						</ion-button>
					</ion-col>
					<ion-col>
						<ion-button
							expand="block"
							shape="round"
							mode="ios"
							@click="handleSave"
						>
							Guardar
						</ion-button>
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-footer>
	</ion-page>
</template>

<script setup>
	import moment from 'moment';
	moment.locale('es');
	import {
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonInput,
		IonTextarea,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonFooter,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonToast,
	} from '@ionic/vue';
	import { thumbsUp, thumbsDown, reader, warningOutline } from 'ionicons/icons';
	import { useRouter, useRoute } from 'vue-router';
	import { useSettingsStore } from '../store/settingsStore';
	import { ref, onMounted } from 'vue';
	import { addNote, getNoteById, updateNote } from '@/services/noteService';
	import DateTimePicker from '@/components/DateTimePicker.vue';

	const settingsStore = useSettingsStore();
	const firstDayOfWeek = ref(1);
	const router = useRouter();
	const route = useRoute();
	const noteId = ref(route.params.noteId);
	const modeForm = ref(null);
	if (moment(noteId.value, moment.ISO_8601, true).isValid()) {
		console.log('create');
		modeForm.value = 'create';
	} else {
		console.log('edit');
		modeForm.value = 'edit';
	}

	const form = ref({
		noteType: 'income',
		noteDate: moment().format('YYYY-MM-DDTHH:mm'),
		description: '',
		amount: '',
	});

	const showToast = ref(false);
	const toastMessage = ref('');

	const handleNoteDateChange = (event) => {
		form.value.noteDate = event;
	};

	const loadNote = async () => {
		// Establecer el valor del primer día de la semana por defecto
		firstDayOfWeek.value = settingsStore.startDayOfWeek === 'lunes' ? 1 : 0;

		// Si estamos en modo de edición, cargar los datos de la nota
		if (modeForm.value === 'edit') {
			const note = await getNoteById(parseInt(noteId.value));
			if (note) {
				form.value = {
					noteType: note.noteType,
					noteDate: note.noteDate,
					description: note.description,
					amount: note.amount,
				};
			}
		}
	};

	onMounted(loadNote);

	const handleSave = async () => {
		if (
			(form.value.noteType === 'income' || form.value.noteType === 'expense') &&
			(parseFloat(form.value.amount) <= 0 ||
				isNaN(parseFloat(form.value.amount)))
		) {
			toastMessage.value =
				'El importe debe ser mayor que 0 para ingresos ó gastos';
			showToast.value = true;
			return;
		}

		if (form.value.noteType === 'other') {
			form.value.amount = '0';
		}

		try {
			if (modeForm.value === 'edit') {
				await updateNote(
					parseInt(noteId.value),
					form.value.noteType,
					parseFloat(form.value.amount),
					form.value.noteDate,
					form.value.description
				);
			} else {
				await addNote(
					form.value.noteType,
					parseFloat(form.value.amount),
					form.value.noteDate,
					form.value.description
				);
			}
			const now = moment().format('YYYY-MM-DDTHH:mm:ss');
			router.push('/tabs/tab1/' + now);
		} catch (error) {
			console.error('Error guardando la nota:', error);
		}
	};

	const handleCancel = () => {
		const now = moment().format('YYYY-MM-DDTHH:mm:ss');
		router.push('/tabs/tab1/' + now);
	};
</script>

<style lang="scss" scoped>
	ion-content::part(background) {
		background: url('/bg_notes_form.jpg') center center / cover no-repeat;
		box-shadow: inset 0px -200px 240px -123px rgba(0, 0, 0, 0.75);
	}
	ion-segment {
		--background: rgba(255, 255, 255, 0.5);
	}
	ion-toast {
		--background: #ffdd00;
	}
	.form-container {
		.icons {
			margin-top: 0.5em;
		}
	}
</style>
