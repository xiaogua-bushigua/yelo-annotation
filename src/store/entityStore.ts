import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { entitiesOuterType } from '../type';

export const useEntityStore = defineStore('entity', {
	state: () => {
		return {
			regionNum: ref(2),
			entities: reactive([
				{
					e: 1,
					entities: [{ s: 1, f: 1, text: '', label: '' }],
				},
				{
					e: 2,
					entities: [{ s: 1, f: 1, text: '', label: '' }],
				},
			]) as Array<entitiesOuterType>,
      ids: [] as string[]
		};
	},
	actions: {},
});
