<script setup lang="ts">
import { toRefs, reactive, computed } from 'vue';
import { useMainStore } from '../store/mainStore';
import { storeToRefs } from 'pinia';
import { useRelationStore } from '../store/relationStore';

const mainStore = useMainStore();
const relationStore = useRelationStore()
const { initData, svgData, svgInfo, svgShow, colorSets } = storeToRefs(mainStore);
const { circleY, circleR, downOffset, textOffsetY } = toRefs(svgData.value.baseConfig);
</script>

<template>
	
		<!-- 关系曲线图 -->
		<svg :width="svgInfo.originalTextWidth" :height="svgData.baseConfig.baseHeight" v-if="svgShow">
			<marker
				v-for="(item, index) in svgData.relations"
				:id="'arrow_' + index"
				viewBox="0 0 10 10"
				refX="5"
				refY="5"
				markerWidth="3"
				markerHeight="3"
				orient="auto-start-reverse"
			>
				<path
					d="M 0 0 L 10 5 L 0 10 z"
					:stroke="String(colorSets[svgData.entityNames[item.relatedEntities[0] as string] as string])"
					:fill="String(colorSets[svgData.entityNames[item.relatedEntities[0] as string] as string])"
				></path>
			</marker>

			<path
				v-for="(item, index) in svgData.relations"
				:key="'relationPath_ds1_' + index"
				:d="svgInfo.Ds1[index]"
				:style="{ stroke: String(colorSets[svgData.entityNames[item.relatedEntities[1] as string] as string]) }"
				style="stroke-width: var(--relationWidth); fill: none"
			></path>
			<path
				v-for="(item, index) in svgData.relations"
				:key="'relationPath_ds2_' + index"
				:d="svgInfo.Ds2[index]"
				:style="{ stroke: String(colorSets[svgData.entityNames[item.relatedEntities[0] as string] as string]) }"
				style="stroke-width: var(--relationWidth); fill: none"
			></path>
			<path
				v-for="(item, index) in svgData.relations"
				:key="'relationPath_ds3_' + index"
				:marker-end="'url(#arrow_' + index + ')'"
				:d="svgInfo.Ds3[index]"
				:style="{ stroke: String(colorSets[svgData.entityNames[item.relatedEntities[0] as string] as string]) }"
				style="stroke-width: var(--relationWidth); fill: none"
			></path>
			<text
				v-for="(item, index) in relationStore.relations"
				:key="'relationContent_' + index"
				:id="'relationContent_' + index"
				:x="svgInfo.xOfRelation[index]"
				:y="svgInfo.yOfRelation[index]"
				style="font-size: var(--fontSize); fill: black"
			>
				{{ item.relationName }}
			</text>
		</svg>

		<!-- 文本图 -->
		<div id="originalText" style="font-size: var(--orifontSize)" v-html="svgData.html" v-if="svgShow"></div>

		<!-- 实体标注图 -->
		<svg :width="svgInfo.originalTextWidth" :height="svgData.baseConfig.downHeight" v-if="svgShow">
			<g>
				<line
					v-for="(idx, index) in initData.ids"
					:key="'line_' + index"
					:id="'line_' + idx"
					:x1="svgInfo.lefts[idx as string]"
					:y1="svgData.baseConfig.lineY + svgData.baseConfig.downOffset * (Number(idx[idx.length - 3]) - 1)"
					:x2="svgInfo.rights[idx as string]"
					:y2="svgData.baseConfig.lineY + svgData.baseConfig.downOffset * (Number(idx[idx.length - 3]) - 1)"
					style="stroke-linecap: round; stroke-width: var(--entityLineWidth)"
					:style="{ stroke: `${colorSets[svgData.entityNames[idx as string] as keyof typeof colorSets]}` }"
				/>
				<circle
					v-for="(idx, index) in initData.ids"
					:key="'circle_' + index"
					:id="'circle_' + idx"
					:cx="svgInfo.lefts[idx as string]"
					:cy="circleY + downOffset * (Number(idx[idx.length - 3]) - 1)"
					:r="circleR"
					:style="{ fill: `${colorSets[svgData.entityNames[idx as string] as keyof typeof colorSets]}` }"
				/>
				<text
					v-for="(idx, index) in initData.ids"
					:key="'text_' + index"
					:id="'text_' + idx"
					:x="svgInfo.xOfEntity[idx as string]"
					:y="circleY + downOffset * (Number(idx[idx.length - 3]) - 1) + textOffsetY"
					:r="circleR"
					style="font-size: var(--fontSize)"
					:style="{ fill: `${colorSets[svgData.entityNames[idx as string] as keyof typeof colorSets]}`}"
				>
					{{ initData.entityNames[idx as string] }}
				</text>
			</g>
		</svg>
</template>

<style lang="scss">

</style>
