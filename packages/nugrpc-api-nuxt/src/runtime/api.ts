import { Plugin } from '@nuxt/types'
// import { setAxios } from '@privyid/nugrpc-api'

const accessor: Plugin = (context) => {
  // setAxios($axios)
  context.req.headers
}

export default accessor
