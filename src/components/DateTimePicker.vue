<template>
	<div class="datetime-picker">
		<DatePicker :value="date" @date-selected="updateDate" class="date-picker" />
		<TimePicker :value="time" @time-selected="updateTime" class="time-picker" />
	</div>
</template>

<script setup>
	import { ref, defineEmits, defineProps, watch } from 'vue';
	import DatePicker from './DatePicker.vue';
	import TimePicker from './TimePicker.vue';
	import moment from 'moment';

	const props = defineProps({
		value: {
			type: String,
			required: true,
		},
	});

	watch(
		() => props.value,
		() => {
			date.value = moment(props.value).format('YYYY-MM-DD');
			time.value = moment(props.value).format('HH:mm');
		}
	);

	const emit = defineEmits(['dateTimeChange']);

	const date = ref(moment(props.value).format('YYYY-MM-DD'));
	const time = ref(moment(props.value).format('HH:mm'));

	const updateDate = (newDate) => {
		console.log('1.cambia la fecha ', newDate);
		date.value = newDate;
		emitDateTimeChange();
	};

	const updateTime = (newTime) => {
		console.log('2.cambia la hora ', newTime);
		time.value = newTime;
		emitDateTimeChange();
	};

	const emitDateTimeChange = () => {
		const newDateTime = moment(`${date.value} ${time.value}`).format(
			'YYYY-MM-DDTHH:mm'
		);
		emit('dateTimeChange', newDateTime);
	};
</script>
<style scoped lang="scss">
	.datetime-picker {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		.date-picker,
		.time-picker {
			margin-right: 5px;
		}
	}
</style>
