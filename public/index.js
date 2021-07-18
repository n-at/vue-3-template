import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './index.css';

import { createApp } from 'vue'

import Store from './store'
import App from './components/App.vue'

const app = createApp(App);
app.use(Store);
app.mount('#app');
