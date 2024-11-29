<template>
  <div class="sidebar-menu" :class="{ open: isOpen }">
    <button class="close-menu" @click="closeMenu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <ul>
      <li><router-link to="/" @click="closeMenu">Categorías</router-link></li>
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
      <li><button @click="logout"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12.5L12.5 9.99999M12.5 9.99999L10 7.49999M12.5 9.99999H3.33334M7.5 6.04083V5.99999C7.5 5.06666 7.5 4.59999 7.68167 4.24333C7.84167 3.92916 8.09584 3.67499 8.41 3.51499C8.76667 3.33333 9.23334 3.33333 10.1667 3.33333H14C14.9333 3.33333 15.4 3.33333 15.7558 3.51499C16.07 3.67499 16.325 3.92916 16.485 4.24333C16.6667 4.59916 16.6667 5.06583 16.6667 5.99749V14.0033C16.6667 14.935 16.6667 15.4008 16.485 15.7567C16.325 16.0704 16.0697 16.3253 15.7558 16.485C15.4 16.6667 14.9342 16.6667 14.0025 16.6667H10.1642C9.2325 16.6667 8.76584 16.6667 8.41 16.485C8.09641 16.3252 7.84146 16.0703 7.68167 15.7567C7.5 15.4 7.5 14.9333 7.5 14V13.9583" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Cerrar Sesión
      </button></li>
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
  top: var(--spacing-S);
  right: var(--spacing-S);
}
.sidebar-menu {
  background-color: var(--white);
  border-right: var(--border-02);
  color: var(--black);
  font-weight: bold;
  height: 100%;
  left: 0;
  min-width: 230px;
  padding: var(--spacing-XXL) var(--spacing-XL);
  position: fixed;
  top: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 10;

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-M);
  }
}

.sidebar-menu.open {
  transform: translateX(0);
}


button {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  gap: var(--spacing-XS)
}

button:hover,
a:hover {
  text-decoration: underline;
}
</style>
