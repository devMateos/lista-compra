/* CSS */
import '/src/assets/css/base/fonts.css'
import '/src/assets/css/base/properties.css'
import '/src/assets/css/base/reset.css'
import '/src/assets/css/components/text.css'
import '/src/assets/css/components/forms.css'
import '/src/assets/css/components/buttons.css'
import '/src/assets/css/components/card.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

let app

// Espera el estado de autenticación antes de inicializar la app
onAuthStateChanged(auth, user => {
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }

  if (user) {
    // Si el usuario está autenticado, establece el estado global si usas Pinia o almacén de estado
    // y permite el acceso directo a rutas autenticadas
    if (router.currentRoute.value.path === '/login') {
      router.push('/home')
    }
  } else {
    // Si no hay usuario autenticado y no estamos en la página de login, redirige al login
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/login')
    }
  }
})

// Eliminar cualquier service worker existente
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister()
    }
  })
}
