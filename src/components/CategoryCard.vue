<template>
  <div class="category-card" @click="$emit('click')">
    <div class="category-image">
      <img :src="category.imageUrl || defaultImage" :alt="category.name" />
    </div>
    <div class="category-name">{{ category.name }}</div>
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

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.category-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: bold;
}
</style>
