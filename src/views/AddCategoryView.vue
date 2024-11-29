<template>
  <div class="add-category-container">
    <h1 class="title">Añadir Nueva Categoría</h1>
    <form @submit.prevent="addCategory" class="add-category-form">
      <div>
        <label for="name">Nueva Categoría</label>
        <input
          class="form__input"
          type="text"
          v-model="name"
          id="name"
          placeholder="Ej. Verduras"
          required
        />
      </div>

      <div>
        <label for="imageUrl">URL de Imagen (Opcional)</label>
        <input
          class="form__input"
          type="url"
          v-model="imageUrl"
          id="imageUrl"
          placeholder="https://example.com/imagen.jpg"
        />
      </div>

      <button type="submit" class="button primary-light big">Guardar Categoría</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
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

// Añadir ref para el mensaje
const message = ref('')

// Función para agregar la categoría a Firestore
const addCategory = async () => {
  if (!name.value) {
    message.value = 'El nombre de la categoría es obligatorio.'
    return
  }

  try {
    await addDoc(collection(db, 'categories'), {
      name: name.value,
      imageUrl: imageUrl.value || null,
    })
    message.value = 'Categoría añadida con éxito 😎'
    name.value = ''
    imageUrl.value = ''
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  } catch (error) {
    console.error('Error al añadir la categoría:', error)
    message.value = 'Hubo un problema al añadir la categoría.'
  }
}
</script>

<style scoped>
.add-category-container {
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
