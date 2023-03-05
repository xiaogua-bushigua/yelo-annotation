<script setup lang="ts">
import { useMainStore } from '../store/mainStore';
import 'highlight.js/styles/github.css';

const content = `
{
  "text": "治疗后，右耳溢液无明显好转且伴血样分泌物，无明显痛感",
  "entities": [
    {
      "e": 1,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "右",
          "label": "方位"
        },
        {
          "s": 2,
          "f": 1,
          "text": "右耳",
          "label": "解剖结构"
        },
        {
          "s": 3,
          "f": 1,
          "text": "右耳溢液",
          "label": "临床表现"
        }
      ]
    },
    {
      "e": 2,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "无",
          "label": "否定"
        }
      ]
    },
    {
      "e": 3,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "好转",
          "label": "变化趋势"
        }
      ]
    },
    {
      "e": 4,
      "entities": [
        {
          "s": 1,
          "f": 1,
          "text": "血样分泌物",
          "label": "临床表现"
        }
      ]
    },
    {
      "e": 5,
      "entities": [
        {
          "s": 1,
          "f": 2,
          "text": "无",
          "label": "否定"
        }
      ]
    }
  ],
  "relations": [
    {
      "relationName": "判断",
      "relatedEntities": ["e3s1f1", "e1s3f1"]
    },
    {
      "relationName": "病情",
      "relatedEntities": ["e3s1f1", "e2s1f1"]
    }
  ]
}
`;
const tableData1 = [
	{
		text: '原始文本',
		entities: '实体信息',
		relations: '关系信息',
	},
];
const tableData2 = [
	{
		e: '实体所在区域',
		s: '区域内的第几个实体',
		f: '该实体名称在原始文本出现次序',
		text: '实体文本',
		label: '实体标签',
	},
];
const tableData3 = [
	{
		relationName: '关系名称',
		'relatedEntities[0]': '关系的终点实体的 id',
		'relatedEntities[1]': '关系的起点实体的 id',
	},
];

const handleClose = (e: Event) => {
	if ((e.target as HTMLElement).classList[0] == 'modalWrap') useMainStore().dataFormShow = false;
};
</script>

<template>
	<div class="modalWrap" :style="{ display: useMainStore().dataFormShow ? 'flex' : 'none' }" @click="handleClose">
		<div class="modal">
			<div class="title">相关概念说明</div>
			<img src="../assets/intro.png" alt="" class="intro" />
			<div class="introWrap">
				<span>区域：</span>
				<span>实体之间存在嵌套关系的部分，例如“右耳”=“右”+“右耳”</span>
			</div>
			<div class="introWrap">
				<span>e、s、f：</span>
				<span>每个实体对应的标识符，e表示实体区域，s表示该实体在此区域内的次序，f表示该实体文本在段落中出现的次序</span>
			</div>
			<div class="introWrap">
				<span>id：</span>
				<span>每个实体的唯一标识符</span>
			</div>
			<div class="title">后端返回数据格式</div>
			<highlightjs JSON :code="content" class="dataCodes" />
			<div class="title">字段说明</div>
			<el-table :data="tableData1" style="width: 100%">
				<el-table-column prop="text" label="text" />
				<el-table-column prop="entities" label="entities" />
				<el-table-column prop="relations" label="relations" />
			</el-table>
			<div class="title title1">实体信息 entities</div>
			<el-table :data="tableData2" style="width: 100%">
				<el-table-column prop="e" label="e" width="140" />
				<el-table-column prop="s" label="s" width="160" />
				<el-table-column prop="f" label="f" />
				<el-table-column prop="text" label="text" width="120" />
				<el-table-column prop="label" label="label" width="120" />
			</el-table>
			<div class="title title1">关系信息 realtions</div>
			<el-table :data="tableData3" style="width: 100%">
				<el-table-column prop="relationName" label="relationName" />
				<el-table-column prop="relatedEntities[0]" label="relatedEntities[0]" />
				<el-table-column prop="relatedEntities[1]" label="relatedEntities[1]" />
			</el-table>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.modalWrap {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba($color: #000000, $alpha: 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	.modal {
		width: 800px;
		height: 80vh;
		background-color: #fff;
		border-radius: 8px;
		padding: 40px 40px 14px 20px;
		overflow: scroll;
		.intro {
			width: 480px;
			height: 260px;
      user-select: none;
		}
		.introWrap {
			margin: 8px 0;
			span:nth-child(1) {
				font-weight: 600;
				font-size: 16px;
			}
			span:nth-child(2) {
				font-weight: 500;
				font-size: 16px;
			}
		}
		.title {
			font-size: 18px;
			font-weight: 600;
			color: #5f5f5f;
			letter-spacing: 1px;
			margin: 30px 0 14px 0;
		}
		.title1 {
			font-size: 16px;
			color: #777777;
			margin-top: 20px;
		}
		.dataCodes {
			overflow: scroll;
			height: 580px;
			border-radius: 8px;
			:deep(code span) {
				font-size: 14px !important;
			}
		}
	}
}
</style>
