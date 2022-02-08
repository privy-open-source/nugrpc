<template>
  <div>
    <h1>Code: {{ code }}</h1>
    <h2>Message: {{ message }}</h2>
  </div>
</template>

<script>
import { $axios, getCode, getMessage } from '@privyid/nugrpc-api'

export default {
  async asyncData() {
    try {
      await $axios.get('/api/error')
    } catch (error) {
      return {
        code   : getCode(error),
        message: getMessage(error),
      }
    }
  }
}
</script>
