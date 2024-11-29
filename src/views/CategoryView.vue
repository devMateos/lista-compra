<template>
  <div class="category-view">

    <!-- Filtros -->
    <div class="filters">
      <button
        @click="toggleFilter('showAcquired')"
        class="button small-btn primary-light"
        :class="{ active: showAcquired }"
      >
        Comprado
      </button>
      <button
        @click="toggleFilter('showNotNeeded')"
        class="button small-btn primary-light"
        :class="{ active: showNotNeeded }"
      >
        Terminado
      </button>
      <button
        @click="toggleFilter('showNeeded')"
        class="button small-btn primary-light"
        :class="{ active: showNeeded }"
      >
        Necesario
      </button>
    </div>

    <!-- Buscador -->
    <input
      class="form__input"
      type="text"
      v-model="searchTerm"
      id="search"
      placeholder="Buscar producto"
      required
    />

    <!-- Lista de productos -->
    <ul class="product-list">
      <li
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-item"
        :class="getProductClass(product)"
        >
        <!-- Botón de eliminación -->
        <div>
          <button @click="confirmDelete(product)" class="edit-btn">
            <img src="/src/assets/icons/edit.svg" alt="">
          </button>
          <label @click="toggleProductStatus(product)">
            <span class="product-name">
              {{ product.name }}
            </span>
          </label>
        </div>
        <label @click="toggleProductStatus(product)">
          <span class="product-tag">
            {{ getStatusText(product) }}
          </span>
        </label>
      </li>
    </ul>

    <!-- Modal de confirmación -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-product" v-if="!deleteConfirmation">
        <h2>Editar producto</h2>
        <div class="form__group">
          <label for="newProductName">Nombre del producto</label>
          <input
            class="form__input"
            v-model="newProductName"
            type="text"
            placeholder="Nuevo nombre"
          />
        </div>
        <div class="modal-actions">
          <button class="button big white" @click="closeEditModal">Cancelar</button>
          <button class="button big green" @click="updateProductName">Guardar</button>
        </div>
        <button class="button small-btn red delete" @click="deleteConfirmation = true">
          <img src="/src/assets/icons/trash.svg" alt="">
        </button>
      </div>
      <!-- Modal para eliminar la categoría -->
      <div class="modal-product" v-if="deleteConfirmation">
        <h2>Eliminar producto</h2>
        <p>¿Seguro de que quieres eliminar para siempre este producto?</p>
        <div class="modal-actions">
          <button class="button big white" @click="closeEditModal">Cancelar</button>
          <button class="button big red" @click="deleteProduct">Eliminar</button>
        </div>
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

// Estado del modal y variables relacionadas
const showModal = ref(false)
const deleteConfirmation = ref(false)
const productToEdit = ref(null)
const newProductName = ref('')

const searchTerm = ref('')

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

const emit = defineEmits(['updateCategoryName'])


// Cargar el nombre de la categoría
async function loadCategoryName() {
  try {
    const categoryRef = doc(db, 'categories', categoryId)
    const categoryDoc = await getDoc(categoryRef)
    if (categoryDoc.exists()) {
      categoryName.value = categoryDoc.data().name
      emit('updateCategoryName', categoryName)
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
    // Primero aplicar el filtro de búsqueda
    if (!product.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return false
    }

    // Luego aplicar los filtros de estado
    if (product.adquirido && !showAcquired.value) return false
    if (!product.adquirido && !product.necesario && !showNotNeeded.value) return false
    if (!product.adquirido && product.necesario && !showNeeded.value) return false
    return true
  })
})

// Funciones para el modal
function confirmDelete(product) {
  productToEdit.value = product
  newProductName.value = product.name
  showModal.value = true
}

function closeEditModal() {
  showModal.value = false
  deleteConfirmation.value = false
  productToEdit.value = null
  newProductName.value = ''
}

async function updateProductName() {
  if (!newProductName.value.trim()) return

  try {
    const productRef = doc(db, 'products', productToEdit.value.id)
    await updateDoc(productRef, {
      name: newProductName.value.trim()
    })
    closeEditModal()
  } catch (error) {
    console.error('Error al actualizar nombre del producto:', error)
  }
}

async function deleteProduct() {
  if (!productToEdit.value) return

  try {
    const productRef = doc(db, 'products', productToEdit.value.id)
    await deleteDoc(productRef)
    closeEditModal()
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
  if (product.adquirido) return 'Comprado'
  if (!product.necesario) return 'Terminado'
  return 'Necesario'
}

onMounted(() => {
  loadCategoryName()
  loadProductsRealtime()
})
</script>

<style scoped>
.category-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
  max-width: 500px;
  margin: 0 auto;
  padding: var(--spacing-M);
}

.filters {
  display: flex;
  justify-content: center;
  gap: var(--spacing-S);

  .button {
    width: 100%;
  }
}

.product-list {
  display: flex;
  flex-direction: column;
}

.product-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-S) var(--spacing-XS);

  > div:first-of-type {
    align-items: center;
    display: flex;
    gap: var(--spacing-S)
  }
}
.product-item:not(:last-of-type) {
  border-bottom: solid 1px var(--gray)
}

.product-name {
  cursor: pointer;
  font-size: var(--font-size-M);
}

.edit-btn {
  align-items: center;
  aspect-ratio: 1;
  background-color: var(--white);
  border: var(--border-01);
  border-radius: 4px;
  box-shadow: var(--small-shadow);
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: var(--spacing-XS);
}
.edit-btn:active {
  box-shadow: var(--small-shadow-inverse);
  transform: translate(3px, 3px);
}

.product-tag {
  align-items: center;
  border: var(--border-01);
  border-radius: 4px;
  color: var(--white);
  display: flex;
  justify-content: center;
  min-width: 96px;
  padding: var(--spacing-XS);
  text-shadow:
    -1px -1px 0 var(--black),
    1px -1px 0 var(--black),
    -1px 1px 0 var(--black),
    1px 1px 0 var(--black);
}

/* Estilos para el modal */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

.modal-product {
  background-color: var(--white);
  border: var(--border-01);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
  max-width: 400px;
  padding: var(--spacing-M);
  position: relative;
  width: 90%;

  .form__group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-S);

    label {
      font-weight: bold;
    }
  }
  .button.delete {
    position: absolute;
    right: var(--spacing-M);
    top: var(--spacing-M);
  }
}

.modal-actions {
  display: flex;
  gap: var(--spacing-M);

  .button {
    flex: 1;
  }
}

label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.acquired {

  .product-tag {
    background-color: #1f845a;
  }
}

.not-needed {
  .product-tag {
    background-color: #ff9800;
  }
}

.needed {
  .product-tag {
    background-color: #c9372c;
  }
}
</style>
