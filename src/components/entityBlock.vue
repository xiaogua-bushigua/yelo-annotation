<script setup lang="ts">
import { useEntityStore } from '../store/entityStore';
import { storeToRefs } from 'pinia';
import { useMainStore } from '../store/mainStore';
import { entitiesOuterType, entitiesInnerType } from '../type';

const entityStore = useEntityStore();
const { entities, regionNum, ids } = storeToRefs(entityStore);

const handleRangeChange = () => {
	useMainStore().formChange();
	let prevLen = entities.value.length;
	if (regionNum.value > prevLen)
		for (let i = prevLen; i < regionNum.value; i++)
			entities.value.push({
				e: i + 1,
				entities: [{ s: 1, f: 1, text: '', label: '' }],
			});
	else for (let i = 0; i < prevLen - regionNum.value; i++) entities.value.pop();
  ids.value = []
	entities.value.forEach((entityRegion: entitiesOuterType) => {
		let e = entityRegion.e;
		entityRegion.entities.forEach((entity: entitiesInnerType) => {
			let s = entity.s;
			let f = entity.f;
			let id = 'e' + e + 's' + s + 'f' + f;
			ids.value.push(id);
		});
	});
};

const handleEntityAdd = (index: number) => {
	entities.value[index].entities.push({ s: entities.value[index].entities.length + 1, f: 1, text: '', label: '' });
};
const handleEntityDel = (index: number) => {
	entities.value[index].entities.pop();
};
const handleEntityChange = (indexRegion: number, indexEntity: number) => {
	useMainStore().formChange();
	let entitiesArray = [] as string[];
	let text = '';
	entities.value.forEach((item) => {
		item.entities.forEach((entity) => {
			if (entity.text != '') {
				entitiesArray.push(entity.text);
				text = entity.text;
			}
		});
	});

	let map = new Map();
	for (let i = 0; i < entitiesArray.length; i++) {
		let val = entitiesArray[i];
		if (map.get(val) !== undefined) map.set(val, map.get(val) + 1);
		else map.set(val, 1);
	}
	console.log(Object.fromEntries(map.entries()));
	entities.value[indexRegion].entities[indexEntity].f = Object.fromEntries(map.entries())[text];
};
</script>

<template>
	<div class="block">
		<div class="topWrap">
			<span class="entityTitle">实体区域个数</span>
			<span class="rangeVal">{{ regionNum }}</span>
			<div class="slider"><el-slider v-model="regionNum" placement="right" :min="1" :max="8" :show-tooltip="false" @change="handleRangeChange" /></div>
		</div>
		<div class="entityReigons">
			<div class="entityRegion" v-for="(item, index) in entities" :key="index">
				<div class="reginTitle">
					<p>区域{{ '  ' + String(index + 1) }}</p>
					<div class="btns">
						<img src="../assets/add.png" alt="" srcset="" @click="handleEntityAdd(index)" />
						<img src="../assets/del.png" alt="" srcset="" @click="handleEntityDel(index)" />
					</div>
				</div>
				<div class="regionWrap" v-for="(entity, n) in item.entities" :key="n">
					<div style="display: flex">
						<div class="entityIdTitle">{{ 'e' + item.e + 's' + entity.s + 'f' }}</div>
						<input
							type="text"
							class="entityId"
							v-model="entity.f"
							@change="
								() => {
									useMainStore().svgShow = false;
								}
							"
						/>
					</div>
					<div style="display: flex">
						<input type="text" class="entityText" v-model="entity.text" @change="handleEntityChange(index, n)" />
						<input type="text" class="entityLabel" v-model="entity.label" @change="useMainStore().formChange()" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.slider-demo-block {
	display: flex;
	align-items: center;
}
.slider-demo-block .el-slider {
	margin-top: 0;
	margin-left: 12px;
}
.block {
	.topWrap {
		display: flex;
		align-items: center;
		.entityTitle {
			color: rgb(89, 89, 89);
		}
		.rangeVal {
			color: #4d3cc9;
			margin: 0 14px 0 14px;
		}
		.slider {
			padding-top: 2px;
			width: 120px;
			display: flex;
			align-items: center;
			:deep(.el-slider__bar) {
				background-color: #4d3cc9 !important;
			}
			:deep(.el-slider__button) {
				border-color: #4d3cc9 !important;
				width: 16px !important;
				height: 16px !important;
			}
		}
	}
	.entityReigons {
		display: flex;
		margin-top: 10px;
		flex-wrap: wrap;
		.entityRegion {
			width: 240px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.35);
			border-radius: 8px;
			margin-right: 16px;
			padding: 12px 10px;
			margin-bottom: 26px;
			min-height: 60px;
			.reginTitle {
				display: flex;
				justify-content: space-between;
				color: rgb(89, 89, 89);
				.btns {
					img {
						cursor: pointer;
						width: 20px;
						height: 20px;
						margin-left: 4px;
					}
				}
			}
			.regionWrap {
				display: flex;
				justify-content: space-between;
				margin: 8px 0;
				color: rgb(89, 89, 89);
				.entityIdTitle {
					width: 44px;
				}
				input {
					height: 20px;
					padding-left: 8px;
					font-size: 14px;
					color: #616161;
					outline-color: #a29bda;
					border-radius: 6px;
					border: 1px solid rgb(212, 212, 212);
					border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
				}
				.entityText {
					width: 60px;
				}
				.entityLabel {
					width: 60px;
					margin-left: 6px;
					outline-color: #da9394;
				}
				.entityId {
					width: 20px;
					margin-left: 0;
					outline-color: rgb(162, 162, 162);
				}
			}
		}
	}
}
</style>
