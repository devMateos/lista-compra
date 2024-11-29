<template>
  <div class="add-product-view">
    <div class="add-product">
      <div class="title">
      <img src="/src/assets/icons/new.svg" alt="">
      <h2>Nuevo Producto</h2>
    </div>
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="productName">Nombre del Producto:</label>
        <input
          class="form__input"
          type="text"
          id="productName"
          v-model="productName"
          placeholder="Introduce el nombre del producto"
          required
        />
      </div>

      <div class="form-group">
        <label for="category">Categoría:</label>
        <select class="form__input" id="category" v-model="selectedCategory" required>
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

      <button class="button big primary-light" type="submit">Añadir Producto</button>
    </form>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
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
    message.value = 'Producto añadido con éxito 😎'
    productName.value = ''
    selectedCategory.value = ''
  } catch (error) {
    console.error('Error al añadir el producto:', error)
    message.value = 'Error al añadir el producto. Inténtalo de nuevo.'
  }
}
</script>

<style scoped>
.add-product-view {
  padding: var(--spacing-M);
}
.add-product {
  border: var(--border-02);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
  margin: 0 auto;
  max-width: 400px;
  padding: 60px var(--spacing-L)
}
.title {
  align-items: center;
  display: flex;
  gap: var(--spacing-XS);
  justify-content: center;
  margin-bottom: var(--spacing-M);
}

form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
}

label {
  margin-bottom: var(--spacing-S);
  font-weight: bold
}

.form__input {
  width: 100%;
}

.message {
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}
</style>
