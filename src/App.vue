<template>
  <div class="template">
    <header v-if="!isLoginRoute">
      <MenuButton @toggle-menu="toggleMenu" />
      <div>
        <h1>{{ viewTitle }}</h1>
        <button v-if="showConfigButton" @click="openEditModal">
          <img src="/src/assets/icons/config.svg" alt="">
        </button>
      </div>
    </header>
    <SidebarMenu
      v-if="!isLoginRoute"
      :isOpen="isMenuOpen"
      @close-menu="isMenuOpen = false"
    />
    <main @click="isMenuOpen = false">
      <router-view @updateCategoryName="handleUpdateCategoryName"/>
    </main>

   <!-- Modal para editar el nombre de la categoría -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-category" v-if="!deleteConfirmation">
        <h2>Editar categoría</h2>
        <div class="form__group">
          <label for="newCategoryName">Nombre de la categoría</label>
          <input
            class="form__input"
            v-model="newCategoryName"
            type="text"
            placeholder="Nuevo nombre"
          />
        </div>
        <div class="form__group">
          <label for="newCategoryImage">URL de la imagen</label>
          <input
            class="form__input"
            v-model="newCategoryImage"
            type="text"
            placeholder="URL de la imagen"
          />
        </div>
        <div class="modal-actions">
          <button class="button big white" @click="closeEditModal">Cancelar</button>
          <button class="button big green" @click="updateCategoryName">Guardar</button>
        </div>
        <button class="button small-btn red delete" @click="deleteConfirmation = true">
          <img src="/src/assets/icons/trash.svg" alt="">
        </button>
      </div>
      <!-- Modal para eliminar la categoría -->
      <div class="modal-category" v-if="deleteConfirmation">
        <h2>Eliminar categoría</h2>
        <p>¿Seguro de que quieres eliminar para siempre esta categoría?</p>
        <div class="modal-actions">
          <button class="button big white" @click="closeEditModal">Cancelar</button>
          <button class="button big red" @click="deleteCategory">Eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Importar useRoute para obtener la ruta actual
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase'

import MenuButton from '@/components/MenuButton.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

const isMenuOpen = ref(false)
const route = useRoute() // Obtener la ruta actual
const router = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Control del modal
const showEditModal = ref(false)
const newCategoryName = ref('')
const newCategoryImage = ref('')
// Cerrar el modal
const closeEditModal = () => {
  showEditModal.value = false
  deleteConfirmation.value = false
  newCategoryName.value = ''
  newCategoryImage.value = ''
}
const deleteConfirmation = ref(false)

// Computed property para verificar si estamos en la vista de login
const isLoginRoute = computed(() => {
  return route.path === '/' // Ajusta esta ruta según sea necesario
})

const categoryName = ref('')

function handleUpdateCategoryName(name) {
  categoryName.value = name
}

// Obtener el ID de la categoría desde la URL
const categoryId = computed(() => route.params.categoryId);

// Actualizar el nombre de la categoría
const updateCategoryName = async () => {
  if (newCategoryName.value.trim()) {
    try {
      const categoryRef = doc(db, 'categories', categoryId.value);
      await updateDoc(categoryRef, {
        name: newCategoryName.value.trim(),
        imageUrl: newCategoryImage.value.trim()
      });

      categoryName.value = newCategoryName.value.trim();
      closeEditModal();
      console.log('Categoría actualizada con éxito.');
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
    }
  }
};

const viewTitle = computed(() => {
  if (route.path === '/home') {
    return 'Categorías'
  } else if (route.path === '/add-product') {
    return 'Añadir producto'
  } else if (route.path === '/add-category') {
    return 'Añadir categoría'
  } else if (route.path.startsWith('/category/')) {
    if(route.path === '/category/all') {
      return "Todos los productos"
    } else {
      return categoryName
    }
  } else {
    return ''
  }
})

const showConfigButton = computed(() => {
  return route.path.startsWith('/category') && route.path !== '/category/all';
})
console.log(showConfigButton.value);

// Añadir la función para eliminar la categoría
const deleteCategory = async () => {
  try {
    const categoryRef = doc(db, 'categories', categoryId.value);
    await deleteDoc(categoryRef);
    closeEditModal();
    // Redirigir al usuario a la página de categorías después de eliminar
    router.push('/home');
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
  }
};

const openEditModal = async () => {
  try {
    const categoryRef = doc(db, 'categories', categoryId.value);
    const categoryDoc = await getDoc(categoryRef);
    if (categoryDoc.exists()) {
      newCategoryName.value = categoryDoc.data().name;
      newCategoryImage.value = categoryDoc.data().imageUrl || '';
    }
    showEditModal.value = true;
  } catch (error) {
    console.error('Error al cargar los datos de la categoría:', error);
  }
}

</script>

<style>
.template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
header {
  align-items: center;
  background-color: var(--light);
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-M);

  > div {
    display: flex;
    gap: var(--spacing-XS);

    button {
      height: fit-content;
    }
  }
}
main {
  overflow-y: auto;
  padding: var(--spacing-M);
}
main::-webkit-scrollbar {
  background-color: transparent;
  width: 0
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

.modal-category {
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
</style>
