<template>
  <div class="card" @click="$emit('click')">
    <div class="card__image">
      <img :src="category.imageUrl || defaultImage" :alt="category.name" />
    </div>
    <div class="card__text">
      <p>{{ category.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Props: Recibe la información de la categoría desde el componente padre
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
})

// Imagen por defecto en caso de que la categoría no tenga una imagen específica
const defaultImage = '/assets/default-category.png' // Ruta de una imagen por defecto
</script>

