import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import 'highlight.js/styles/base16/edge-light.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
// @ts-ignore
import yeloUI from "yelo-ui";
import 'yelo-ui/dist/style.css';

const pinia = createPinia()

createApp(App).use(pinia).use(ElementPlus).use(hljsVuePlugin).use(Vue3ColorPicker).use(yeloUI).mount('#app')
