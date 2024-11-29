<template>
  <button class="menu-button" @click="toggleMenu">
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66667 13.25H18.3333C18.9062 13.25 19.375 12.7812 19.375 12.2083C19.375 11.6354 18.9062 11.1667 18.3333 11.1667H1.66667C1.09375 11.1667 0.625 11.6354 0.625 12.2083C0.625 12.7812 1.09375 13.25 1.66667 13.25ZM1.66667 8.04167H18.3333C18.9062 8.04167 19.375 7.57292 19.375 7C19.375 6.42708 18.9062 5.95833 18.3333 5.95833H1.66667C1.09375 5.95833 0.625 6.42708 0.625 7C0.625 7.57292 1.09375 8.04167 1.66667 8.04167ZM0.625 1.79167C0.625 2.36458 1.09375 2.83333 1.66667 2.83333H18.3333C18.9062 2.83333 19.375 2.36458 19.375 1.79167C19.375 1.21875 18.9062 0.75 18.3333 0.75H1.66667C1.09375 0.75 0.625 1.21875 0.625 1.79167Z" fill="black"/>
</svg>

  </button>
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
  aspect-ratio: 1;
  background-color: var(--white);
  border: var(--border-02);
  border-radius: 50%;
  box-shadow: var(--small-shadow);
  cursor: pointer;
  height: 40px;
  width: 40px;
}
.menu-button:active {
  box-shadow: var(--small-shadow-inverse);
  transform: translate(3px, 3px)
}
</style>
