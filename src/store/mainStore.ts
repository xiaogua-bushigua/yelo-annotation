import { defineStore } from 'pinia';
import { nextTick, reactive, ref, toRaw } from 'vue';
import exFormData3 from '../formData3.json';
import exFormData2 from '../formData2.json';
import exFormData1 from '../formData1.json';
import { useEntityStore } from './entityStore';
import { useRelationStore } from './relationStore';
import { stringObj, initDataType, svgDataType, svgInfoType, relationType, entitiesInnerType, entitiesOuterType } from '../type';

export const useMainStore = defineStore('main', {
	state: () => {
		return {
			nowEx: ref(0),
			examples: [exFormData2, exFormData3, exFormData1],
			colorSets: reactive({
				方位: '#CB4042',
				解剖结构: '#24936E',
				临床表现: '#6F3381',
				否定: '#646A58',
				变化趋势: '#BEC23F',
				检查方式: '#58B2DC',
			}) as stringObj,
			// 收集表单中的数据
			initData: reactive({
				relationOverlap: 0,
				entityOverlap: 0,
				ids: [''],
				entityNames: {},
				entities: {},
				relations: [
					{
						relationName: '',
						relatedEntities: ['', ''],
					},
				],
				text: '',
			}) as initDataType,
			// svg基本参数
			svgData: reactive({
				relationOverlap: ref(0),
				entityOverlap: ref(0),
				baseConfig: {
					arcR: 10, // 圆弧半径
					circleY: 18, // 圆点位置
					circleR: 3, // 圆点半径
					lineY: 3, // 下划线Y位置
					downOffset: 30, // 实体类别重叠时下沉高度
					textOffsetX: 8, // 实体文本距离圆点的偏移量
					textOffsetY: 5, // 实体文本距离上面横线的偏移量
					relationOffsetY: 5, // 实体文本距离上面横线的偏移量
					baseHeight: ref(0), // 上半画布的高度
					downHeight: ref(0), // 下半画布的高度
				},
				html: ref(''),
				originText: ref(''),
				entityNames: reactive({}),
				ids: reactive([]),
				relations: reactive([]),
			}) as svgDataType,
			// svg绘制参数
			svgInfo: reactive({
				// 每个实体的左边界、右边界、宽度
				lefts: reactive({}),
				widths: reactive({}),
				rights: reactive({}),
				// 实体名称文本的x起始位置
				xOfEntity: reactive({}),
				// 每个关系曲线的x起始位置
				xOfRelation: reactive([]),
				// 每个关系曲线的y起始位置
				yOfRelation: reactive([]),
				// 每个关系曲线的轨迹
				Ds1: reactive([]),
				Ds2: reactive([]),
				Ds3: reactive([]),
				// 每个关系曲线的高度
				pathHeights: reactive([]),
				originalTextWidth: ref(0),
			}) as svgInfoType,
			svgShow: ref(false),
      dataFormShow: ref(false),
      tourShow: ref(false)
		};
	},
	actions: {
		// 初始化各个参数
		init() {
			this.initData = {
				relationOverlap: 0,
				entityOverlap: 0,
				ids: [''],
				entityNames: {},
				entities: {},
				relations: [
					{
						relationName: '',
						relatedEntities: ['', ''],
					},
				],
				text: '',
			};
			useEntityStore().entities = [
				{
					e: 1,
					entities: [{ s: 1, f: 1, text: '', label: '' }],
				},
				{
					e: 2,
					entities: [{ s: 1, f: 1, text: '', label: '' }],
				},
			];
			useEntityStore().ids = [];
			useEntityStore().regionNum = 2;
			useRelationStore().relations = [];
			this.svgInfo = {
				lefts: {},
				widths: {},
				rights: {},
				xOfEntity: {},
				xOfRelation: [],
				yOfRelation: [],
				Ds1: [],
				Ds2: [],
				Ds3: [],
				pathHeights: [],
				originalTextWidth: 0,
			};
			this.svgData = {
				relationOverlap: 0,
				entityOverlap: 0,
				baseConfig: {
					arcR: 10,
					circleY: 18,
					circleR: 3,
					lineY: 3,
					downOffset: 30,
					textOffsetX: 8,
					textOffsetY: 5,
					relationOffsetY: 5,
					baseHeight: 0,
					downHeight: 0,
				},
				html: '',
				originText: '',
				entityNames: {},
				ids: [],
				relations: [],
			};
		},
		// 计算svgData
		getSvgData() {
			this.svgData.entityNames = this.initData.entityNames;
			this.svgData.ids = this.initData.ids;
			this.svgData.relations = this.initData.relations;
			this.svgData.originText = this.initData.text;

			this.svgData.baseConfig.baseHeight = 80 + (this.initData.relationOverlap - 1) * 50;
			this.svgData.baseConfig.downHeight = 40 + (this.initData.entityOverlap - 1) * 30;

			let entitesID = this.initData.ids;
			let entitesLabel = Array.from(Object.values(this.initData.entities));
			let text = this.initData.text;
			let len = entitesID.length;

			function find(str: string, pat: string, n: number) {
				var L = str.length,
					i = -1;
				while (n-- && i++ < L) {
					i = str.indexOf(pat, i);
					if (i < 0) break;
				}
				return i;
			}
			let tempPat = '';
			let tempLen = 0;
			for (let i = 0; i < len; i++) {
				let f = Number(entitesID[i][5]);
				let s = Number(entitesID[i][3]);
				let pat = s == 1 ? entitesLabel[i] : tempPat + entitesLabel[i].slice(tempLen, entitesLabel[i].length);
				let start = find(text, pat, f);
				let end = start + entitesLabel[i].length + (Number(entitesID[i][3]) - 1) * 7;

				let one =
					text.slice(0, s === 1 ? start : start - 18 * (s - 1)) +
					"<span id='" +
					entitesID[i] +
					"'>" +
					(s === 1 ? '' : text.slice(start - 18 * (s - 1), start));
				let two = text.slice(start, end) + '</span>';
				let three = text.slice(end, text.length);
				text = one + two + three;
				tempPat = two;
				tempLen = two.replace('</span>', '').length;
			}
			this.svgData.html = text;
			this.svgData.entityOverlap = this.initData.entityOverlap;
			this.svgData.relationOverlap = this.initData.relationOverlap;
		},
		// 切换样例
		switchEx() {
			this.svgShow = false;
			this.init();
			this.initData.text = this.examples[this.nowEx % 3].text;
			useEntityStore().entities = this.examples[this.nowEx % 3].entities;
			this.examples[this.nowEx % 3].relations.map((item: relationType, index: number) => {
				if (index !== this.examples[this.nowEx % 3].relations.length - 1) {
					item.addDisplay = false;
					item.delDisplay = true;
				} else {
					item.addDisplay = true;
					item.delDisplay = true;
				}
			});
			let maxEntityOverlap = 0;
			useEntityStore().entities.forEach((entityRegion: entitiesOuterType) => {
				let e = entityRegion.e;
				entityRegion.entities.forEach((entity: entitiesInnerType) => {
					let s = entity.s;
					maxEntityOverlap = Math.max(maxEntityOverlap, s);
					let f = entity.f;
					let id = 'e' + e + 's' + s + 'f' + f;
					useEntityStore().ids.push(id);
				});
			});
			useEntityStore().regionNum = this.examples[this.nowEx % 3].entities.length;
			useRelationStore().relations = this.examples[this.nowEx % 3].relations;
			this.nowEx++;
		},
		// 把表单中的数据转换成initData
		getInitData() {
			// this.initData.ids.pop();
			this.initData.ids = [];
			//
			let maxEntityOverlap = 0;
			useEntityStore().entities.forEach((entityRegion: entitiesOuterType) => {
				let e = entityRegion.e;
				entityRegion.entities.forEach((entity: entitiesInnerType) => {
					let s = entity.s;
					maxEntityOverlap = Math.max(maxEntityOverlap, s);
					let f = entity.f;
					let id = 'e' + e + 's' + s + 'f' + f;
					this.initData.ids.push(id);
					this.initData.entityNames[id] = entity.label;
					this.initData.entities[id] = entity.text;
				});
			});
			//
			this.initData.entityOverlap = maxEntityOverlap;
			this.initData.relations.pop();
			useRelationStore().relations.forEach((relation: relationType) => {
				this.initData.relations.push({
					relationName: relation.relationName,
					relatedEntities: relation.relatedEntities,
				});
			});
			this.initData.relationOverlap = useRelationStore().relations.length;
		},
		getSvgInfo() {
			nextTick(() => {
				// 填充html文本
				let originalText: HTMLElement = document.getElementById('originalText') as HTMLElement;
				// 获取渲染框宽度
				this.svgInfo.originalTextWidth = originalText.offsetWidth;
				// 获取文本中每个实体的左右边界和宽
				this.svgData.ids.forEach((item) => {
					// 是动态的元素
					let el: HTMLElement = document.getElementById(item as string) as HTMLElement;
					this.svgInfo.lefts[item as keyof typeof this.svgInfo.lefts] = el.offsetLeft - 282;
					this.svgInfo.widths[item as keyof typeof this.svgInfo.lefts] = el.offsetWidth;
					this.svgInfo.rights[item as keyof typeof this.svgInfo.lefts] = el.offsetLeft + el.offsetWidth - 290;
					this.svgInfo.xOfEntity[item as keyof typeof this.svgInfo.lefts] = el.offsetLeft - 282 + this.svgData.baseConfig.textOffsetX;
				});
				// 计算每段关系的几何信息
				this.svgData.relations.forEach((item, index) => {
					let distance: number =
						this.svgInfo.lefts[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] +
						this.svgInfo.widths[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] / 2 -
						(this.svgInfo.lefts[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] +
							this.svgInfo.widths[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] / 2);
					this.svgInfo.xOfRelation.push(
						this.svgInfo.lefts[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] +
							this.svgInfo.widths[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] / 2 +
							distance / 2 -
							item.relationName.length * 8
					); // 默认字体大小的一半
					this.svgInfo.pathHeights.push(35 + 50 * (this.svgData.relations.length - 1 - index));
					this.svgInfo.Ds1.push(
						`M ${
							this.svgInfo.lefts[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] +
							this.svgInfo.widths[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] / 2
						} ${this.svgData.baseConfig.baseHeight}` +
							`V ${this.svgInfo.pathHeights[index] + this.svgData.baseConfig.arcR}` +
							`A ${this.svgData.baseConfig.arcR} ${this.svgData.baseConfig.arcR} 0 0 1 ${
								this.svgInfo.lefts[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] +
								this.svgInfo.widths[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] / 2 +
								this.svgData.baseConfig.arcR
							} ${this.svgInfo.pathHeights[index]}`
					);
					this.svgInfo.Ds2.push(
						`M ${
							this.svgInfo.lefts[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] +
							this.svgInfo.widths[item.relatedEntities[1] as keyof typeof this.svgInfo.lefts] / 2 +
							this.svgData.baseConfig.arcR
						} ${this.svgInfo.pathHeights[index]}` +
							`H ${
								this.svgInfo.lefts[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] +
								this.svgInfo.widths[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] / 2 -
								this.svgData.baseConfig.arcR
							}`
					);
					this.svgInfo.Ds3.push(
						`M ${
							this.svgInfo.lefts[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] +
							this.svgInfo.widths[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] / 2 -
							this.svgData.baseConfig.arcR
						} ${this.svgInfo.pathHeights[index]}` +
							`A ${this.svgData.baseConfig.arcR} ${this.svgData.baseConfig.arcR} 0 0 1 ${
								this.svgInfo.lefts[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] +
								this.svgInfo.widths[item.relatedEntities[0] as keyof typeof this.svgInfo.lefts] / 2
							} ${this.svgInfo.pathHeights[index] + this.svgData.baseConfig.arcR}` +
							`V ${this.svgData.baseConfig.baseHeight - 5}`
					);
				});
				this.svgInfo.pathHeights.forEach((item: number) => {
					this.svgInfo.yOfRelation.push(item - this.svgData.baseConfig.relationOffsetY);
				});
			});
		},
		// 绘制svg
		drawSvg() {
			this.getInitData();
			this.getSvgData();
			this.svgShow = true;
			this.getSvgInfo();
		},
		reset() {
			this.svgShow = false;
			this.init();
		},
		// 表单改变时初始化
		formChange() {
			this.svgShow = false;
			this.svgInfo = {
				lefts: {},
				widths: {},
				rights: {},
				xOfEntity: {},
				xOfRelation: [],
				yOfRelation: [],
				Ds1: [],
				Ds2: [],
				Ds3: [],
				pathHeights: [],
				originalTextWidth: 0,
			};
			this.svgData = {
				relationOverlap: 0,
				entityOverlap: 0,
				baseConfig: {
					arcR: 10,
					circleY: 18,
					circleR: 3,
					lineY: 3,
					downOffset: 30,
					textOffsetX: 8,
					textOffsetY: 5,
					relationOffsetY: 5,
					baseHeight: 0,
					downHeight: 0,
				},
				html: '',
				originText: '',
				entityNames: {},
				ids: [],
				relations: [],
			};
		},
	},
});
