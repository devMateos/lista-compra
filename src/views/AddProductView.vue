<template>
  <div class="add-product">
    <h2>Añadir Nuevo Producto</h2>
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="productName">Nombre del Producto:</label>
        <input
          type="text"
          id="productName"
          v-model="productName"
          placeholder="Introduce el nombre del producto"
          required
        />
      </div>

      <div class="form-group">
        <label for="category">Categoría:</label>
        <select id="category" v-model="selectedCategory" required>
          <option value="" disabled>Selecciona una categoría</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <button type="submit">Añadir Producto</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

const productName = ref('')
const selectedCategory = ref('')
const categories = ref([])
const message = ref('')

// Cargar las categorías al montar el componente
onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    categories.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
})

// Función para añadir un nuevo producto
const addProduct = async () => {
  if (!productName.value || !selectedCategory.value) return

  try {
    await addDoc(collection(db, 'products'), {
      name: productName.value,
      categoryId: selectedCategory.value,
      createdAt: new Date(),
    })
    message.value = 'Producto añadido con éxito'
    productName.value = ''
    selectedCategory.value = ''
  } catch (error) {
    console.error('Error al añadir el producto:', error)
    message.value = 'Error al añadir el producto. Inténtalo de nuevo.'
  }
}
</script>

<style scoped>
.add-product {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
select {
  width: -webkit-fill-available;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 1rem;
  text-align: center;
  color: green;
}
</style>
