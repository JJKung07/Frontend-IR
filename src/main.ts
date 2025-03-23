import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./config/router"; // Ensure this is the correct path
import "./style.css";
import 'slick-carousel/slick/slick.css'; // Should work if installed correctly
import 'slick-carousel/slick/slick-theme.css';


const app = createApp(App);
app.use(createPinia()); // Register Pinia
app.use(router); // Register Vue Router
app.mount("#app");
