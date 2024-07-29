<template>
	<IonItemSliding>
		<IonItem class="item-note" button="true" lines="none" @click="editNote">
			<IonLabel>
				<span class="hour-date-container">
					{{ hour(note.noteDate) }}
					<div class="date-container">
						{{ day(note.noteDate) }} {{ month(note.noteDate) }}
					</div>
				</span>
				<span class="money" v-if="note.amount > 0">
					<span v-if="note.noteType == 'expense'">-</span>
					{{ formattedAmount }}{{ currency }}
					<div class="type-note-container">
						<span v-if="note.noteType == 'income'"> Ingreso </span>
						<span v-else-if="note.noteType == 'expense'"> Gasto </span>
						<span v-else-if="note.noteType == 'other'"> Nota </span>
						<IonIcon
							:icon="readerOutline"
							size="small"
							class="icon-note"
						></IonIcon>
					</div>
				</span>
			</IonLabel>
		</IonItem>
		<IonItemOptions side="end">
			<IonItemOption color="danger" @click="confirmRemoveNote($event)">
				<IonIcon slot="icon-only" :icon="trash"></IonIcon>
			</IonItemOption>
		</IonItemOptions>
	</IonItemSliding>
</template>

<script setup>
	import { defineProps, defineEmits, computed } from 'vue';
	import moment from 'moment';
	import {
		IonItemSliding,
		IonItem,
		IonLabel,
		IonItemOptions,
		IonItemOption,
		IonIcon,
	} from '@ionic/vue';
	import { trash, readerOutline } from 'ionicons/icons';

	const props = defineProps({
		note: {
			type: Object,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
	});

	const emit = defineEmits(['edit-note', 'delete-note']);

	const editNote = () => {
		emit('edit-note', props.note.id);
	};

	const confirmRemoveNote = (event) => {
		emit('delete-note', { id: props.note.id, event, itemType: 'nota' });
	};

	const formatDate = (date) => {
		return moment(date).format('DD MMM - HH:mm');
	};

	const day = (date) => {
		return moment(date).format('DD');
	};
	const hour = (date) => {
		return moment(date).format('HH:mm');
	};
	const month = (date) => {
		return moment(date).format('MMM');
	};

	const formattedAmount = computed(() => {
		return props.note.amount.toFixed(2);
	});
</script>

<style scoped lang="scss">
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.9);
	}
	.item-note {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
	}

	.shift-card {
		ion-item::part(native) {
			background: transparent;
		}
		.item-note {
			border-bottom: none;
		}
	}
	.hour-date-container {
		font-size: 2em;
		float: left;
		color: #8f8f8f;
		.date-container {
			font-size: 0.5em;
		}
	}
	.money {
		font-size: 2em;
		vertical-align: text-bottom;
		text-align: right;
		float: right;
		.type-note-container {
			font-size: 0.5em;
			color: #8f8f8f;
			.icon-note {
				width: 1em;
				height: 1em;
				vertical-align: middle;
			}
		}
	}

	.income {
		color: #087702;
	}

	.expense {
		color: #bc0404;
	}
</style>
