<template>
  <div class="sidebar-menu" :class="{ open: isOpen }">
    <button class="close-menu" @click="closeMenu">←</button>
    <ul>
      <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
      <li>
        <router-link to="/add-product" @click="closeMenu"
          >Añadir Producto</router-link
        >
      </li>
      <li>
        <router-link to="/add-category" @click="closeMenu"
          >Añadir Categoría</router-link
        >
      </li>
      <li><button @click="logout">Cerrar Sesión</button></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase' // Asegúrate de importar el módulo de autenticación

const props = defineProps({
  isOpen: {
    type: Boolean,
  },
})

const router = useRouter()

const emit = defineEmits(['close-menu'])

const closeMenu = () => {
  emit('close-menu')
}

const logout = async () => {
  try {
    await auth.signOut()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<style scoped>
.close-menu {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 25px;
}
.sidebar-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background-color: #333;
  color: #fff;
  padding: 3rem 1rem;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  text-align: center;
}

.sidebar-menu.open {
  transform: translateX(0);
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 1rem 0;
}

a,
button {
  color: #fff;
  text-decoration: none;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

button:hover,
a:hover {
  text-decoration: underline;
}
</style>
