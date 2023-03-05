import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useMainStore } from './mainStore';
import { relationType } from '../type';

export const useRelationStore = defineStore('relation', {
	state: () => {
		return {
			relations: reactive([]) as Array<relationType>,
		};
	},
	actions: {
		reformRelations() {
			this.relations.forEach((item) => {
				item.delDisplay = true;
				item.addDisplay = false;
			});
			this.relations[this.relations.length - 1].addDisplay = true;
		},
		computeRelations() {
			this.relations = [
				{
					relationName: '',
					relatedEntities: ['', ''],
				},
			];
			this.reformRelations();
		},
		handleAdd() {
			useMainStore().svgShow = false;
			this.relations.push({
				relationName: '',
				relatedEntities: ['', ''],
				addDisplay: true,
				delDisplay: true,
			});
			this.relations[this.relations.length - 2].addDisplay = false;
		},
		handleDel(index: number) {
			useMainStore().svgShow = false;
			if (this.relations.length > 1) {
				this.relations.splice(index, 1);
				this.reformRelations();
			} else {
				this.relations[0] = {
					relationName: '',
					relatedEntities: ['', ''],
					delDisplay: true,
					addDisplay: true,
				};
			}
		},
	},
});
