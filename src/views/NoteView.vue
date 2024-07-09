<template>
	<IonPage>
		<IonHeader>
			<IonTabBar>
				<IonTitle> Nueva Nota </IonTitle>
			</IonTabBar>
		</IonHeader>
		<IonContent class="ion-padding form-container" color="light">
			<ion-segment v-model="noteType">
				<ion-segment-button value="income">
					<ion-label>Ingreso</ion-label>
					<ion-icon :icon="thumbsUp"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="expense">
					<ion-label>Gasto</ion-label>
					<ion-icon :icon="thumbsDown"></ion-icon>
				</ion-segment-button>
				<ion-segment-button value="other">
					<ion-label>Otro</ion-label>
					<ion-icon :icon="reader"></ion-icon>
				</ion-segment-button>
			</ion-segment>
			<IonList lines="full" :inset="true">
				<ion-item v-show="noteType != 'other'">
					<ion-input
						label="Importe:"
						label-placement="fixed"
						type="number"
						inputmode="decimal"
						placeholder="000.00"
						max="999"
						maxlength="6"
						min="0"
						v-model="amount"
					>
						<span slot="end">€</span>
					</ion-input>
				</ion-item>
				<ion-item>
					<ion-textarea
						label="Concepto:"
						label-placement="fixed"
						rows="5"
					></ion-textarea>
				</ion-item>
			</IonList>
		</IonContent>
		<!-- FOOTER  -->
		<IonFooter class="ion-padding">
			<ion-grid>
				<ion-row>
					<ion-col>
						<ionButton
							fill="outline"
							expand="block"
							shape="round"
							mode="ios"
							@click="handleCancel"
						>
							Cancelar
						</ionButton></ion-col
					>
					<ion-col>
						<ionButton
							expand="block"
							shape="round"
							mode="ios"
							@click="handleSave"
						>
							Guardar
						</ionButton>
					</ion-col>
				</ion-row>
			</ion-grid>
		</IonFooter>
	</IonPage>
</template>
<script setup>
	import {
		IonHeader,
		IonTabBar,
		IonTitle,
		IonPage,
		IonContent,
		IonButton,
		IonGrid,
		IonRow,
		IonCol,
		IonSegment,
		IonSegmentButton,
		IonLabel,
		IonList,
		IonItem,
		IonInput,
		IonTextarea,
		IonIcon,
	} from '@ionic/vue';
	import { thumbsUp, thumbsDown, reader } from 'ionicons/icons';
	import { useRouter } from 'vue-router';
	import { ref } from 'vue';

	let noteType = ref('income');
	let amount = ref('');

	const router = useRouter(); // Initialize the router
	const handleSave = () => {
		// Navigate to the desired route
		router.push('/tabs/tab1/');
	};

	const handleCancel = () => {
		// Navigate to the desired route
		router.push('/tabs/tab1/');
	};
</script>

<style></style>
