<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';

const props = defineProps({
	option: {
		type: Array<{
			// @ts-ignore
			target?: ref<Element>;
			content: string;
			position: Array<string>;
		}>,
		default: [
			{
				target: null,
				content: '',
				position: [],
			},
		],
	},
});

// 起始位置
let nowTip = ref(0);
// 引导显示与否
let tourShow = ref(false);

// 遮罩
const mark = ref<Element>();
// 提示框
const tooltip = ref<Element>();
// 当前引导元素及其坐标尺寸信息
let show_now = null;
let showLeft = ref(0);
let showTop = ref(0);
let showWidth = ref(0);
let showHeight = ref(0);
// 提示框内容
let content = ref('');

// 判断是否在视窗内
const isInViewPort = (el: HTMLElement) => {
	let viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	let offsetTop = el.offsetTop;
	let scollTop = document.documentElement.scrollTop;
	let top = offsetTop - scollTop;
	return top + el.offsetHeight <= viewPortHeight && top >= 0;
};
// 滚动浏览器到元素位置
const scrollToEl = (el: HTMLElement) => {
	let needScroll: boolean = !isInViewPort(el);
	if (needScroll) {
		let offsetY = el.offsetTop - window.screen.height / 2 + el.offsetHeight;
		window.scrollTo({
			top: offsetY,
			left: 0,
		});
	}
};

const handleBtnClick = () => {
	if (nowTip.value >= props.option.length) {
		tourShow.value = false;
		nowTip.value = 0;
		document.body.removeEventListener('mousewheel', fn1);
		document.body.removeEventListener('keyup', fn2);
		localStorage.setItem('doneTour', 'yes');
	} else draw(props.option[nowTip.value].target.value);
};

// 设置遮罩打开时禁止用户滚动
const fn1 = (e: Event) => {
	e.preventDefault();
};
// esc关闭
const fn2 = (e: KeyboardEvent) => {
	if (e.key == 'Escape') {
		tourShow.value = false;
		nowTip.value = 0;
		document.body.removeEventListener('mousewheel', fn1);
		document.body.removeEventListener('keyup', fn2);
	}
};
onMounted(() => {
	document.body.addEventListener('mousewheel', fn1, { passive: false });
	document.body.addEventListener('keyup', fn2);
	draw(props.option[nowTip.value].target.value);
});
onUnmounted(() => {
	document.body.removeEventListener('mousewheel', fn1);
	document.body.removeEventListener('keyup', fn2);
});

const draw = (target: HTMLElement) => {
	// 获取引导元素的尺寸位置信息
	show_now = target;
	showLeft.value = show_now.offsetLeft;
	showTop.value = show_now.offsetTop;
	showWidth.value = show_now.offsetWidth;
	showHeight.value = show_now.offsetHeight;
	// 遮罩打开时，让引导元素可操作（设置z-index）
	props.option.forEach(
		(item: {
			// @ts-ignore
			target?: ref<Element>;
			content: string;
			position: Array<string>;
		}) => {
			item.target.value.style.zIndex = '1';
		}
	);
	target.style.zIndex = '10';
	// 滚动浏览器到引导元素位置
	scrollToEl(target);
	// 设置遮罩
	let _mark = mark.value as HTMLElement;
	_mark.style.width = showWidth.value + 12 + 'px';
	_mark.style.height = showHeight.value + 12 + 'px';
	_mark.style.border = '0px solid rgba(0,0,0,0.3)';
	_mark.style.borderLeftWidth = showLeft.value - 6 + 'px';
	_mark.style.borderRightWidth = window.screen.width - showWidth.value - showLeft.value + 'px';
	_mark.style.borderTopWidth = showTop.value - document.documentElement.scrollTop - 6 + 'px';
	_mark.style.borderBottomWidth = window.screen.height - (showTop.value - document.documentElement.scrollTop) - showHeight.value + 'px';
	// 提示框设置
	let _tooltip = tooltip.value as HTMLElement;
	content.value = props.option[nowTip.value].content;
	nextTick(() => {
		if (props.option[nowTip.value].position[0] === 'bottom') {
			_tooltip.style.top = showTop.value - document.documentElement.scrollTop + showHeight.value + 20 + 'px';
		} else {
			//
			_tooltip.style.top = showTop.value - document.documentElement.scrollTop - _tooltip.getBoundingClientRect().height - 20 + 'px';
		}
		if (props.option[nowTip.value].position[1] === 'right') {
			_tooltip.style.left = showLeft.value + 10 + 'px';
		} else {
			_tooltip.style.left = showLeft.value + showWidth.value - _tooltip.offsetWidth - 20 + 'px';
		}
		// 进行下一步
		nowTip.value += 1;
	});
};
</script>

<template>
	<div v-if="tourShow">
		<div class="mark" ref="mark"></div>
		<div class="tooltip" ref="tooltip">
			<div class="content">{{ content }}</div>
			<button @click="handleBtnClick">{{ nowTip !== props.option.length ? '下一步' : '结束' }}</button>
			<div class="radios">
				<div class="radio" v-for="(item, index) in props.option" :style="{ backgroundColor: index === nowTip - 1 ? '#4d3cc9' : '#e6e6e6' }"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.mark {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 5;
}
.mark::after {
	content: '';
	display: block;
	position: absolute;
	top: -4px;
	left: -4px;
	width: 100%;
	height: 100%;
	border-radius: 10px;
	border: 4px solid #fff;
	box-shadow: 0 0 0 1px #fff;
	background: transparent;
}
.tooltip {
	background: white;
	min-width: 240px;
	max-width: 300px;
	position: fixed;
	border-radius: 10px;
	font-size: 14px;
	padding: 10px 14px;
	z-index: 10;
	.content {
		padding: 10px 2px;
		width: 100%;
		line-height: 22px;
	}
	button {
		float: right;
		margin: 4px 0 2px 0;
		border: none;
		padding: 4px 6px;
		border-radius: 4px;
		color: #fff;
		background-color: #4d3cc9;
		cursor: pointer;
		letter-spacing: 1px;
	}
	.radios {
		float: left;
		display: flex;
		margin-top: 8px;
		.radio {
			height: 6px;
			width: 6px;
			border-radius: 50%;
			background-color: #e6e6e6;
			margin: 4px;
		}
	}
}
</style>
