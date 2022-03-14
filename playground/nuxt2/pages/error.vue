<template>
  <div>
    <h1>Code: {{ code }}</h1>
    <h2>Message: {{ message }}</h2>
  </div>
</template>

<script>
import { useApi, getCode, getMessage } from '@privyid/nugrpc-api'

export default {
  async asyncData() {
    try {
      await useApi().get('/api/error')
    } catch (error) {
      return {
        code   : getCode(error),
        message: getMessage(error),
      }
    }
  }
}
</script>
