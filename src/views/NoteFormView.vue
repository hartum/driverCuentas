<template>
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>{{
					modeForm === 'edit' ? 'Editar Nota' : 'Nueva Nota'
				}}</IonTitle>
			</IonToolbar>
		</IonHeader>
		<IonContent class="ion-padding form-container">
			<IonSegment v-model="form.noteType">
				<IonSegmentButton value="income">
					<IonLabel>Ingreso</IonLabel>
					<IonIcon :icon="thumbsUp"></IonIcon>
				</IonSegmentButton>
				<IonSegmentButton value="expense">
					<IonLabel>Gasto</IonLabel>
					<IonIcon :icon="thumbsDown"></IonIcon>
				</IonSegmentButton>
				<IonSegmentButton value="other">
					<IonLabel>Otro</IonLabel>
					<IonIcon :icon="reader"></IonIcon>
				</IonSegmentButton>
			</IonSegment>
			<IonList lines="none" :inset="true">
				<IonItem>
					<IonLabel>Fecha:</IonLabel>
					<IonDatetimeButton
						datetime="datetime_start"
						mode="ios"
					></IonDatetimeButton>
					<IonModal :keep-contents-mounted="true">
						<IonDatetime
							locale="es-ES"
							:first-day-of-week="firstDayOfWeek"
							:show-default-buttons="true"
							id="datetime_start"
							v-model="form.noteDate"
							mode="ios"
						></IonDatetime>
					</IonModal>
				</IonItem>

				<IonItem>
					<IonTextarea
						label="Concepto:"
						label-placement="fixed"
						rows="5"
						placeholder="Descripción de la nota, Ejem: ITV"
						v-model="form.description"
					></IonTextarea>
				</IonItem>
				<IonItem v-show="form.noteType != 'other'">
					<IonInput
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
					</IonInput>
				</IonItem>
			</IonList>
			<ion-toast
				:is-open="showToast"
				:message="toastMessage"
				:duration="1500"
				:icon="warningOutline"
				@didDismiss="() => (showToast = false)"
				position="bottom"
				swipe-gesture="vertical"
			></ion-toast>
		</IonContent>
		<IonFooter id="form-footer">
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonButton
							fill="outline"
							expand="block"
							shape="round"
							mode="ios"
							@click="handleCancel"
						>
							Cancelar
						</IonButton>
					</IonCol>
					<IonCol>
						<IonButton
							expand="block"
							shape="round"
							mode="ios"
							@click="handleSave"
						>
							Guardar
						</IonButton>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonFooter>
	</IonPage>
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
		IonModal,
		IonDatetimeButton,
		IonDatetime,
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
	import { ref, onMounted, watch } from 'vue';
	import { addNote, getNoteById, updateNote } from '@/services/noteService';

	const settingsStore = useSettingsStore();
	const firstDayOfWeek = ref(1);
	const router = useRouter();
	const route = useRoute();
	const noteId = ref(route.params.noteId);

	const modeForm = ref(noteId.value ? 'edit' : 'create');
	const form = ref({
		noteType: 'income',
		noteDate: moment().format('YYYY-MM-DDTHH:mm'),
		description: '',
		amount: '',
	});

	const showToast = ref(false);
	const toastMessage = ref('');

	const resetForm = () => {
		form.value = {
			noteType: 'income',
			noteDate: moment().format('YYYY-MM-DDTHH:mm'),
			description: '',
			amount: '',
		};
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

	// Observar cambios en la ruta
	watch(route, async (newRoute) => {
		noteId.value = newRoute.params.noteId;
		modeForm.value = noteId.value ? 'edit' : 'create';
		resetForm();
		await loadNote();
	});

	const handleSave = async () => {
		if (
			(form.value.noteType === 'income' || form.value.noteType === 'expense') &&
			(parseFloat(form.value.amount) <= 0 ||
				isNaN(parseFloat(form.value.amount)))
		) {
			toastMessage.value =
				'El importe debe ser mayor que 0 para ingresos o gastos';
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
</style>
