import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./config/router"; // Ensure this is the correct path

const app = createApp(App);
app.use(createPinia()); // Register Pinia
app.use(router); // Register Vue Router
app.mount("#app");
