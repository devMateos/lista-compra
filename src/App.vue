<template>
  <div>
    <header>
      <MenuButton v-if="!isLoginRoute" @toggle-menu="toggleMenu" />
    </header>
    <SidebarMenu
      v-if="!isLoginRoute"
      :isOpen="isMenuOpen"
      @close-menu="isMenuOpen = false"
    />
    <div @click="isMenuOpen = false">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router' // Importar useRoute para obtener la ruta actual
import MenuButton from '@/components/MenuButton.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

const isMenuOpen = ref(false)
const route = useRoute() // Obtener la ruta actual

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Computed property para verificar si estamos en la vista de login
const isLoginRoute = computed(() => {
  return route.path === '/' // Ajusta esta ruta según sea necesario
})
</script>

<style>
header {
  display: flex;
  padding: 0.8rem;
  padding-bottom: 1rem;
}
</style>
