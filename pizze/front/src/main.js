import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Importaj ruter

createApp(App)
  .use(router)  // Dodaj ruter u aplikaciju
  .mount('#app')
