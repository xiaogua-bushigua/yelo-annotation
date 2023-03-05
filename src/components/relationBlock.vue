<script setup lang="ts">
import { onMounted } from 'vue';
import { useRelationStore } from '../store/relationStore';
import { useEntityStore } from '../store/entityStore';

const relationStore = useRelationStore();
const entityStore = useEntityStore()

onMounted(() => {
	relationStore.computeRelations();
});
</script>

<template>
	<div class="block">
		<div class="blockTitles">
			<p id="from">起点ID</p>
			<p id="end">终点ID</p>
			<p id="relation">关系名称</p>
			<div></div>
		</div>
		<div class="blockItems" v-for="(item, index) in relationStore.relations" :key="index">
			<el-select v-model="item.relatedEntities[1]" class="select" placeholder="Select">
				<el-option v-for="item in entityStore.ids" :key="item" :label="item" :value="item" />
			</el-select>
      <el-select v-model="item.relatedEntities[0]" class="select" placeholder="Select">
				<el-option v-for="item in entityStore.ids" :key="item" :label="item" :value="item" />
			</el-select>
			<input type="text" class="relation" v-model="item.relationName"/>
			<div class="btns">
				<img src="../assets/add.png" alt="" srcset="" v-show="item.addDisplay" @click="relationStore.handleAdd" />
				<img src="../assets/del.png" alt="" srcset="" v-show="item.delDisplay" @click="relationStore.handleDel(index)" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.block {
	.blockTitles {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 0.5fr;
		place-items: center;
		justify-items: start;
		p {
			height: 30px;
			color: rgb(89, 89, 89);
		}
	}
	.blockItems {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 0.5fr;
		place-items: center;
		justify-items: start;
		input {
			height: 30px;
			padding-left: 8px;
			font-size: 16px;
			color: #616161;
			outline-color: #a29bda;
			border-radius: 6px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			width: 60%;
			margin: 4px 0;
		}
    .select {
      width: 120px;
      --el-select-input-focus-border-color: #a29bda
    }
		.relation {
			width: 80%;
		}
		.btns {
			img {
				height: 24px;
				width: 24px;
				margin-right: 8px;
				cursor: pointer;
			}
		}
	}
}
</style>
