<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Bienvenid@!
        <img src="/src/assets/icons/hi.svg" alt="Mano saludando" srcset="" width="24" height="24">
      </h1>
      <form @submit.prevent="loginWithEmail" class="login-form">
        <div>
          <label for="email">Usuario</label>
          <input
          class="form__input"
            type="email"
            v-model="email"
            placeholder="Introduce tu email"
            required
          />
        </div>
        <div>
          <label for="password">Contraseña</label>
          <input
          class="form__input"
            type="password"
            v-model="password"
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" class="button big primary-light">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

const email = ref('')
const password = ref('')
const router = useRouter()

const loginWithEmail = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert('Error al iniciar sesión. Por favor, verifica tus datos.')
  }
}

</script>

<style scoped>
.login-container {
  align-items: center;
  background-color: var(--primary-02);
  display: flex;
  height: 100vh;
  justify-content: center;
}

.login-box {
  background-color: var(--white);
  border: var(--border-02);
  border-radius: 4px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-L);
  max-width: 400px;
  padding: var(--spacing-XXL) var(--spacing-L);
  text-align: center;
  width: clamp(200px, 400px, 90%);

  h1 {
    align-items: center;
    display: flex;
    gap: var(--spacing-S);
    justify-content: center;
  }
}

.login-form{
  display: flex;
  flex-direction: column;
  gap: var(--spacing-M);

  label {
    font-weight: bold;
    margin-bottom: var(--spacing-S);
    text-align: start;
  }

 input {
  width: 100%;
}
}
</style>
