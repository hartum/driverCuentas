<template>
	<IonItemSliding>
		<IonItem class="item-note" button="true" @click="editNote">
			<IonLabel>
				<IonIcon :icon="reader" size="small" class="icon-note"></IonIcon>
				<span>{{ formatDate(note.noteDate) }}</span>
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
			<IonItemOption color="danger" @click="confirmRemoveNote($event)">
				<IonIcon slot="icon-only" :icon="trash"></IonIcon>
			</IonItemOption>
		</IonItemOptions>
	</IonItemSliding>
</template>

<script setup>
	import { defineProps, defineEmits } from 'vue';
	import moment from 'moment';
	import {
		IonItemSliding,
		IonItem,
		IonLabel,
		IonItemOptions,
		IonItemOption,
		IonIcon,
	} from '@ionic/vue';
	import { trash, reader } from 'ionicons/icons';

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
</script>

<style scoped>
	ion-item::part(native) {
		background: rgba(255, 255, 255, 0.8);
	}
	.item-note {
		color: #535353;
		line-height: 1.2em;
		border-bottom: 1px dashed #ccc;
	}

	.money {
		font-size: 1.4em;
		vertical-align: text-bottom;
		float: right;
		color: #666;
	}

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
</style>
