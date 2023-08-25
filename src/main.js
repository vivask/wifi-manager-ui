import { createApp } from 'vue';
import './assets/css/style.css';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {};

const app = createApp(App);
app.use(Toast, options);
app.mount('#app');
