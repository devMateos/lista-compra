<template>
  <div class="add-category-container">
    <h1 class="title">Añadir Nueva Categoría</h1>
    <form @submit.prevent="addCategory" class="add-category-form">
      <label for="name">Nombre de la Categoría</label>
      <input
        type="text"
        v-model="name"
        id="name"
        placeholder="Ej. Verduras"
        required
      />

      <label for="imageUrl">URL de Imagen (Opcional)</label>
      <input
        type="url"
        v-model="imageUrl"
        id="imageUrl"
        placeholder="https://example.com/imagen.jpg"
      />

      <button type="submit" class="btn-submit">Guardar Categoría</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/services/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Referencias a los campos del formulario
const name = ref('')
const imageUrl = ref('')

// Router para redireccionar tras agregar la categoría
const router = useRouter()

// Función para agregar la categoría a Firestore
const addCategory = async () => {
  if (!name.value) {
    alert('El nombre de la categoría es obligatorio.')
    return
  }

  try {
    await addDoc(collection(db, 'categories'), {
      name: name.value,
      imageUrl: imageUrl.value || null,
    })
    alert('Categoría añadida con éxito')
    router.push('/home')
  } catch (error) {
    console.error('Error al añadir la categoría:', error)
    alert('Hubo un problema al añadir la categoría.')
  }
}
</script>

<style scoped>
.add-category-container {
  max-width: 500px;
  margin: auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.8rem;
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.add-category-form {
  display: flex;
  flex-direction: column;
}

.add-category-form label {
  margin-top: 1rem;
  font-weight: bold;
  color: #555;
}

.add-category-form input {
  padding: 0.8rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-submit {
  margin-top: 1.5rem;
  padding: 0.8rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #45a049;
}
</style>
