<template>
  <div>
    <h1>Message: {{ message }}</h1>
    <h2>Header: {{ header }}</h2>
  </div>
</template>

<script>
import { useApi } from '@privyid/nugrpc-api'

export default {
  async asyncData () {
    const response = await useApi().get('/api/ping', { requestId: 'ping' })
    const message  = response.data.message
    const header   = response.data.data.header

    return { message, header }
  },
}
</script>
