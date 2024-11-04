<template>
  <div class="home-container">
    <h1 class="title">Categorías de Productos</h1>
    <div class="categories-grid">
      <CategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @click="goToCategory(category.id)"
      />
    </div>
    <button @click="goToAllProducts" class="all-products-btn">
      Ver todos los productos
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '@/components/CategoryCard.vue'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'

const categories = ref([])
const router = useRouter()

const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    categories.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const goToCategory = categoryId => {
  router.push(`/category/${categoryId}`)
}

onMounted(fetchCategories)

const goToAllProducts = () => {
  router.push('/category/all')
}
</script>

<style scoped>
.home-container {
  padding: 1.5rem;
}

.title {
  font-size: 2rem;
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
.all-products-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.all-products-btn:hover {
  background-color: #45a049;
}
</style>
