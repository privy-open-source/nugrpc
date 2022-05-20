<template>
  <div>
    <h1>Code: {{ code }}</h1>
    <h2>Message: {{ message }}</h2>
  </div>
</template>

<script setup>
import { useApi, getCode, getMessage } from '@privyid/nugrpc-api'

const code    = ref('')
const message = ref('')

try {
  await useApi().get('/api/error')
} catch (error) {
  code.value    = getCode(error)
  message.value = getMessage(error)
}
</script>
