<template>
  <div class="home-container">
    <div class="categories-top">
      <input
        class="form__input"
        type="text"
        v-model="searchTerm"
        placeholder="Buscar categoría"
        required
      />
      <button @click="goToAllProducts" class="button big primary-light">
        Ver todos los productos
      </button>
    </div>
    <div class="categories-grid">
      <CategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        @click="goToCategory(category.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '@/components/CategoryCard.vue'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'

const categories = ref([])
const router = useRouter()
const searchTerm = ref('')

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

const filteredCategories = computed(() => {
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
  padding: var(--spacing-M);
}

.categories-top {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-M);
  margin-bottom: var(--spacing-XL);
}

@media(min-width: 768px) {
  .categories-top {
    flex-direction: row;
    justify-content: space-between;

    input {
      width: 300px;
    }
  }
}

</style>
