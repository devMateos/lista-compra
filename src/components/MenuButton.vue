<template>
  <button class="menu-button" @click="toggleMenu">☰</button>
</template>

<script setup>
import { defineEmits } from 'vue'

// Define los eventos que se pueden emitir
const emit = defineEmits(['toggle-menu'])

const toggleMenu = () => {
  emit('toggle-menu') // Emitir el evento cuando se hace clic en el botón
}
</script>

<style scoped>
.menu-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
