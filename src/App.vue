<script setup lang="ts">
import { ref, onMounted } from 'vue';
import nesting from './components/nesting.vue';
import relationBlock from './components/relationBlock.vue';
import entityBlock from './components/entityBlock.vue';
import { useMainStore } from './store/mainStore';
import ColorBlock from './components/colorBlock.vue';
import Modal from './components/modal.vue';

const intro = ref<Element>();
const dataForm = ref<Element>();
const example = ref<Element>();
const text = ref<Element>();
const entities = ref<Element>();
const relations = ref<Element>();
const colorBar = ref<Element>();
const start = ref<Element>();
const result = ref<Element>();

const tourOptions = [
	{
		target: intro,
		content: 'Yelo Anotation 是 NLP 文本标注工具，支持后端数据渲染和在线标注两种模式',
		position: ['bottom', 'right'],
	},
	{
		target: dataForm,
		content: '这里介绍了标记相关的概念，和后端应返回的数据格式，不妨点开看看吧',
		position: ['bottom', 'left'],
	},
	{
		target: example,
		content: '先从样例开始吧，这里仿真了后端响应的数据，并渲染成文本标记格式',
		position: ['bottom', 'left'],
	},
	{
		target: text,
		content: '在这里输入待标注的原始文本',
		position: ['bottom', 'right'],
	},
	{
		target: entities,
		content: '这里是实体标注部分，每一个实体都用 e、s 和 f 进行唯一标记，详见右上角“数据格式”；区域卡片每行信息依次为：实体 ID、实体文本和实体标签',
		position: ['bottom', 'right'],
	},
	{
		target: relations,
		content: '这里是关系标注部分，每一个关系需要填入起始实体 ID 和关系名称',
		position: ['bottom', 'right'],
	},
	{
		target: colorBar,
		content: '这里配置了实体对应的标注颜色，支持自定义本地保存',
		position: ['top', 'right'],
	},
	{
		target: start,
		content: '一切准备就绪，那就开始吧',
		position: ['bottom', 'left'],
	},
	{
		target: result,
		content:
			'后端数据的标注结果已经完成，文本的下半区是实体标注部分，上半区是关系标注部分，关系路径曲线两种颜色用以表示起始实体。基本引导到此结束，你可以切换别的样例继续探索',
		position: ['top', 'right'],
	},
	{
		target: example,
		content: '再次点击样例进行切换',
		position: ['bottom', 'left'],
	},
];

const handleClickTour = () => {
	localStorage.removeItem('doneTour');
	window.location.reload();
};
const handleClickForm = () => {
	useMainStore().dataFormShow = true;
};
onMounted(() => {
	if (localStorage.getItem('doneTour') !== 'yes') useMainStore().tourShow = true;
  else useMainStore().tourShow = false
});
</script>

<template>
	<yeloTour :option="tourOptions" v-if="useMainStore().tourShow"/>
	<header>
		<div style="display: flex; align-items: center; margin-left: 24px" ref="intro">
			<img src="../src/assets/logo.png" alt="" srcset="" />
			<span>yelo - annotation</span>
		</div>
		<div class="btns">
			<span @click="handleClickForm" ref="dataForm" id="dataForm">数据格式</span>
			<span @click="handleClickTour">新手指引</span>
		</div>
		<Modal />
	</header>
	<div class="content">
		<section class="taggingInfo">
			<div class="originTextWrap">
				<div ref="text">
					<span>原始文本</span>
					<input type="text" placeholder="origin text" v-model="useMainStore().initData.text" />
				</div>
				<button class="resetBtn" @click="useMainStore().reset">重置</button>
				<button class="runBtn" @click="useMainStore().drawSvg" ref="start">开始</button>
				<button class="exampleBtn" @click="useMainStore().switchEx" ref="example">样例</button>
			</div>
			<div class="entitiesAndRelationWrap">
				<div class="entitiesWrap" ref="entities">
					<p class="title">实体标注</p>
					<p class="intro">
						说明：每个实体的 ID 用三个字段标记，e 表示含有多个实体的区域 (对于有重叠的情况)，s 表示该区域内的某个实体，f
						表示在整段文本中该实体名称出现的次数
					</p>
					<entityBlock />
				</div>
				<div class="relationWrap" ref="relations">
					<p class="title">关系标注</p>
					<p class="intro">说明：一段关系需要填入两个实体的标记ID和关系名称</p>
					<relationBlock />
				</div>
			</div>
		</section>
		<section class="result">
			<div ref="colorBar">
				<ColorBlock />
			</div>
			<div class="wrap" ref="result">
				<nesting />
			</div>
		</section>
	</div>
</template>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	::-webkit-scrollbar {
		width: 4px;
	}
	/* 滚动条滑块 */
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(211, 211, 211, 0.8);
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
	}
}
body {
	background-color: rgb(253, 253, 255);
	width: 100vw;
	overflow-x: hidden;
}
#app {
	width: 100%;
}
:root {
	/* 实体名称和关系名称的字体大小 */
	--fontSize: 16px;
	/* 原始文本的字体大小 */
	--orifontSize: 18px;
	/* 关系曲线的颜色和粗细 */
	--relationColor: #2ea9df;
	--relationWidth: 3;
	/* 实体下划线的粗细 */
	--entityLineWidth: 4;
}

header {
	width: 100%;
	height: 60px;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.35);
	background-color: #f3f3f5;

	display: flex;
	align-items: center;
	justify-content: space-between;
	img {
		width: 30px;
		height: 30px;
	}
	span {
		font-size: 20px;
		font-weight: 600;
		margin-left: 18px;
		color: #4a4a4a;
		user-select: none;
	}
	.btns {
		margin-right: 14px;
		font-size: 16px;
		span {
			margin: 0 10px;
			width: 100px;
			height: 40px;
			text-align: center;
			line-height: 40px;
			display: inline-block;
			cursor: pointer;
			box-sizing: border-box;
			color: rgb(144, 144, 144);
			transition: 0.5s;
		}
		span:nth-child(1):hover {
			transition: 0.5s;
			color: #d89295;
		}
		span:nth-child(2):hover {
			color: #a19ada;
			transition: 0.5s;
		}
		#dataForm {
			position: relative;
		}
	}
}
.content {
	width: calc(100% - 28px);
	padding: 20px 14px;
	.taggingInfo {
		margin-bottom: 14px;
		.originTextWrap {
			padding: 14px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.35);
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			span {
				color: #4a4a4a;
			}
			input {
				height: 30px;
				padding-left: 8px;
				font-size: 18px;
				outline-color: #a29bda;
				border-radius: 6px;
				border: 1px solid rgb(212, 212, 212);
				border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
				margin-left: 14px;
				width: 800px;
			}
			.resetBtn {
				position: absolute;
				right: 120px;
				margin-right: 30px;
				padding: 6px 8px;
				border-radius: 8px;
				font-size: 16px;
				background-color: #f0f0f0;
				color: #fff;
				cursor: pointer;
				transition: 0.3s;
				color: rgb(66, 66, 66);
				border: none;
			}
			.resetBtn:hover {
				background-color: #ffffff;
				color: #000000;
				transition: 0.3s;
				border: 1px solid #cfcfcf;
			}
			.runBtn {
				position: absolute;
				right: 0;
				margin-right: 30px;
				padding: 6px 8px;
				border-radius: 8px;
				font-size: 16px;
				background-color: #a29bda;
				color: #fff;
				border: 1px solid #fff;
				cursor: pointer;
				transition: 0.3s;
			}
			.runBtn:hover {
				background-color: #4e3cc9;
				transition: 0.3s;
			}
			.exampleBtn {
				position: absolute;
				right: 60px;
				margin-right: 30px;
				padding: 6px 8px;
				border-radius: 8px;
				font-size: 16px;
				background-color: #da9394;
				color: #ffffff;
				border: 1px solid #fff;
				cursor: pointer;
				transition: 0.3s;
			}
			.exampleBtn:hover {
				background-color: #be0002;
				transition: 0.3s;
			}
		}
		.entitiesAndRelationWrap {
			display: flex;
			padding: 14px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.35);
			margin-top: 14px;
			border-radius: 8px;
			.entitiesWrap {
				width: 60%;
				align-items: center;
				.title {
					color: #4a4a4a;
				}
				.intro {
					color: #7d7d7d;
					width: 90%;
					word-wrap: break-word;
					word-break: break-all;
					line-height: 16px;
					font-size: 14px;
					margin: 8px 0;
					height: 36px;
				}
			}
			.relationWrap {
				width: 40%;
				border-left: 1px solid rgb(224, 224, 224);
				padding-left: 20px;
				.title {
					color: #4a4a4a;
				}
				.intro {
					color: #7d7d7d;
					width: 80%;
					word-wrap: break-word;
					word-break: break-all;
					line-height: 16px;
					font-size: 14px;
					margin: 8px 0;
					height: 36px;
				}
			}
		}
	}

	.result {
		display: flex;
		justify-content: space-between;
		.wrap {
			width: calc(100% - 220px);
			border-radius: 8px;
			border: 1px solid rgb(212, 212, 212);
			border-color: #ededed rgb(232, 232, 232) rgb(212, 212, 212) rgb(232, 232, 232);
			box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.35);
			padding: 14px;
			min-height: 100px;
			padding-left: 16px;
		}
	}
}
</style>
