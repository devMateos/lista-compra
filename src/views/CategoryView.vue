<template>
  <div class="category-view">
    <h2 v-if="categoryId === 'all'">Todos los productos</h2>
    <h2 v-else>Productos en {{ categoryName }}</h2>

    <!-- Filtros -->
    <div class="filters">
      <button
        @click="toggleFilter('showAcquired')"
        :class="{ active: showAcquired }"
      >
        Mostrar "Ya lo tengo"
      </button>
      <button
        @click="toggleFilter('showNotNeeded')"
        :class="{ active: showNotNeeded }"
      >
        Mostrar "Terminado"
      </button>
      <button
        @click="toggleFilter('showNeeded')"
        :class="{ active: showNeeded }"
      >
        Mostrar "Necesito comprarlo"
      </button>
    </div>

    <!-- Lista de productos -->
    <ul class="product-list">
      <li
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-item"
      >
        <label @click="toggleProductStatus(product)">
          <span :class="getProductClass(product)">
            {{ product.name }} - {{ getStatusText(product) }}
          </span>
        </label>
        <!-- Botón de eliminación -->
        <button @click="confirmDelete(product)" class="delete-btn">🗑️</button>
      </li>
    </ul>

    <!-- Modal de confirmación -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>
          ¿Estás seguro de que quieres eliminar {{ productToDelete?.name }}?
        </p>
        <button @click="deleteProduct" class="confirm-btn">Sí, eliminar</button>
        <button @click="cancelDelete" class="cancel-btn">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/services/firebase'
import {
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore'

const route = useRoute()
const categoryId = route.params.categoryId
const categoryName = ref('')
const products = ref([])

// Estados de los filtros
const showAcquired = ref(true)
const showNotNeeded = ref(true)
const showNeeded = ref(true)

// Estado del modal de confirmación
const showModal = ref(false)
const productToDelete = ref(null)

// Función para cargar los productos de la categoría
function loadProductsRealtime() {
  let q
  if (categoryId === 'all') {
    q = query(collection(db, 'products'))
  } else {
    q = query(collection(db, 'products'), where('categoryId', '==', categoryId))
  }

  // Configurar el listener de Firestore
  onSnapshot(q, querySnapshot => {
    products.value = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        adquirido: doc.data().adquirido || false,
        necesario:
          doc.data().necesario !== undefined ? doc.data().necesario : true, // 'necesario' por defecto a true
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) // Orden alfabético por nombre
  })
}

// Cargar el nombre de la categoría
async function loadCategoryName() {
  try {
    const categoryRef = doc(db, 'categories', categoryId)
    const categoryDoc = await getDoc(categoryRef)
    if (categoryDoc.exists()) {
      categoryName.value = categoryDoc.data().name
    }
  } catch (error) {
    console.error('Error al cargar nombre de categoría:', error)
  }
}

// Función para alternar el estado de cada producto
async function toggleProductStatus(product) {
  if (!product.adquirido && product.necesario) {
    product.adquirido = true
  } else if (product.adquirido) {
    product.adquirido = false
    product.necesario = false
  } else {
    product.necesario = true
  }

  try {
    const productRef = doc(db, 'products', product.id)
    await updateDoc(productRef, {
      adquirido: product.adquirido,
      necesario: product.necesario,
    })
  } catch (error) {
    console.error('Error al actualizar estado de producto:', error)
  }
}

// Función para alternar filtros
function toggleFilter(filter) {
  if (filter === 'showAcquired') showAcquired.value = !showAcquired.value
  else if (filter === 'showNotNeeded')
    showNotNeeded.value = !showNotNeeded.value
  else if (filter === 'showNeeded') showNeeded.value = !showNeeded.value
}

// Computed para obtener los productos filtrados
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    if (product.adquirido && !showAcquired.value) return false
    if (!product.adquirido && !product.necesario && !showNotNeeded.value)
      return false
    if (!product.adquirido && product.necesario && !showNeeded.value)
      return false
    return true
  })
})

// Funciones para el modal de confirmación
function confirmDelete(product) {
  productToDelete.value = product
  showModal.value = true
}

function cancelDelete() {
  productToDelete.value = null
  showModal.value = false
}

async function deleteProduct() {
  try {
    const productRef = doc(db, 'products', productToDelete.value.id)
    await deleteDoc(productRef)
    products.value = products.value.filter(
      p => p.id !== productToDelete.value.id,
    )
    cancelDelete()
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}

// Establece clases para estilos según el estado del producto
function getProductClass(product) {
  if (product.adquirido) return 'acquired'
  if (!product.adquirido && !product.necesario) return 'not-needed'
  return 'needed'
}

// Función para obtener el texto según el estado
function getStatusText(product) {
  if (product.adquirido) return 'Ya lo tengo'
  if (!product.necesario) return 'Terminado'
  return 'Necesito comprarlo'
}

onMounted(() => {
  loadCategoryName()
  /* loadProducts() */
  loadProductsRealtime()
})
</script>

<style scoped>
.category-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

button.active {
  background-color: #4caf50;
  color: white;
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #f44336;
  font-size: 1.2em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  max-width: 300px;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  margin-right: 0.5rem;
}

.cancel-btn {
  background-color: #ccc;
}

label {
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    border-radius: 4px;
    color: white;
    padding: 0.2rem 0.4rem;
  }
}

.acquired {
  text-decoration: line-through;
  background-color: #1f845a;
}

.not-needed {
  background-color: #ff9800;
  font-style: italic;
}

.needed {
  background-color: #c9372c;
  font-weight: bold;
}
</style>
