<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMainStore } from '../store/mainStore';
import 'vue3-colorpicker/style.css';
import { onMounted } from 'vue';

const mainStore = useMainStore();
const { colorSets } = storeToRefs(mainStore);

const handleChangeColor = () => {
	localStorage.setItem('colorSets', JSON.stringify({ colors: colorSets.value }));
};
const handleAddColor = () => {
	colorSets.value[''] = 'black';
	localStorage.setItem('colorSets', JSON.stringify({ colors: colorSets.value }));
};
const handleAddEntity = (e: Event) => {
  const name = (e.target as HTMLInputElement).value
  Object.keys(colorSets.value).forEach(item=>{
    if(item === '') {
      colorSets.value[name] = colorSets.value['']
    }
  })
  delete colorSets.value['']
}

onMounted(() => {
	let localColors = localStorage.getItem('colorSets');
	if (localColors) {
		colorSets.value = Object.assign(colorSets.value, JSON.parse(localColors!).colors);
	} else {
		localStorage.setItem('colorSets', JSON.stringify({ colors: colorSets.value }));
	}
});
</script>

<template>
	<div class="block">
		<div class="colorWrap" v-for="(item, index) in Object.keys(colorSets)">
			<input type="text" class="relationName" placeholder="待填" :value="item" :style="{ outlineColor: colorSets[item] }" @change="handleAddEntity"/>
			<color-picker v-model:pureColor="colorSets[item]" format="hex6" shape="circle" useType="pure" @pureColorChange="handleChangeColor" />
		</div>
		<div class="btn btn__secondary" @click="handleAddColor"><p>+</p></div>
	</div>
</template>

<style scoped lang="scss">
.block {
	width: 220px;
	margin-right: 14px;
	border-radius: 8px;
	border: 1px solid rgb(212, 212, 212);
	border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
	box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.35);
	padding: 14px 10px;
	.btn {
		width: 98%;
		height: 24px;
		border-radius: 6px 6px 14px 14px;
		box-shadow: 0 2px 4px #d2cfec;
		margin-top: 10px;
		justify-self: center;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: 0.3s ease;

		&__secondary {
			grid-column: 1 / 2;
			grid-row: 5 / 6;
			color: #9baacf;
			&:hover {
				color: #6d5dfc;
			}
			&:active {
				box-shadow: inset 4px 4px 8px #c8d0e7, inset -4px -4px 8px #fff;
			}
		}

		p {
			font-size: 20px;
			user-select: none;
		}
	}
	.colorWrap {
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 8px;
		input {
			height: 30px;
			padding-left: 8px;
			font-size: 16px;
			color: #616161;
			border-radius: 6px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			width: 120px;
		}
		span {
			font-size: 18px;
			width: 100px;
			margin-left: 10px;
			user-select: none;
		}
	}
	.colorWrap:hover {
		transition: 0.3s;
		background-color: #ededed;
		border-radius: 8px;
	}
}
</style>
