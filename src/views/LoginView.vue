<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">Iniciar Sesión</h1>
      <form @submit.prevent="loginWithEmail" class="login-form">
        <input
          type="email"
          v-model="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <!-- Botón para iniciar sesión con Google -->
      <!-- <div class="divider">
        <span>o</span>
      </div>

      <button @click="loginWithGoogle" class="btn-google">
        Iniciar sesión con Google
      </button> -->
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

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
    router.push('/home')
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error)
    alert('Error al iniciar sesión con Google.')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: #f5f5f5;
}

.login-box {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.login-form input {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-login {
  width: 100%;
  padding: 0.8rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: #45a049;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

.divider span {
  margin: 0 0.5rem;
}

.divider:before,
.divider:after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ccc;
}

.btn-google {
  width: 100%;
  padding: 0.8rem;
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-google:hover {
  background-color: #357ae8;
}

.btn-google img {
  width: 20px;
  margin-right: 8px;
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
