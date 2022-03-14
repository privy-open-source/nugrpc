import { Module } from "@nuxt/types"
import { ModuleMeta } from "@nuxt/schema"
import path from "pathe"
import type { ApiInstance } from "@privyid/nugrpc-api"
import defu from "defu"

interface Options {
  baseURL: string;
  browserBaseURL: string;
  https: boolean;
  proxyHeaders: boolean;
  proxyHeadersIgnore: string[];
}

function toHttps (url: string): string {
  return url.replace('http://', 'https://')
}

// REQUIRED if publishing the module as npm package
export const meta: ModuleMeta = {
  name     : '@privyid/nugrpc-api',
  version  : '1.0.0',
  configKey: 'nugrpcApi',
}

const NugrpcApi: Module<Partial<Options>> = function (_moduleOptions) {
  const { nuxt } = this

  // Combine options
  const moduleOptions = {
    ...nuxt.options.axios,
    ..._moduleOptions,
    ...(nuxt.options.runtimeConfig && nuxt.options.runtimeConfig.axios)
  }

  const defaultPort =
    process.env.API_PORT ||
    moduleOptions.port ||
    process.env.PORT ||
    process.env.npm_package_config_nuxt_port ||
    (this.options.server && this.options.server.port) ||
    3000

  // Default host
  let defaultHost =
    process.env.API_HOST ||
    moduleOptions.host ||
    process.env.HOST ||
    process.env.npm_package_config_nuxt_host ||
    (this.options.server && this.options.server.host) ||
    'localhost'

  /* istanbul ignore if */
  if (defaultHost === '0.0.0.0') {
    defaultHost = 'localhost'
  }

  const https   = Boolean(this.options.server && this.options.server.https)
  const options = defu(moduleOptions, {
    baseURL       : `http://${defaultHost}:${defaultPort}`,
    browserBaseURL: undefined,
    https         : https,
  })

  // Convert http:// to https:// if https option is on
  if (options.https === true) {
    options.baseURL        = toHttps(options.baseURL)
    options.browserBaseURL = toHttps(options.browserBaseURL)
  }

  this.addPlugin({
    src     : path.resolve(__dirname, './runtime/api.mjs'),
    fileName: 'axios.js',
    options : options,
  })

  // Set _AXIOS_BASE_URL_ for dynamic SSR baseURL
  process.env._AXIOS_BASE_URL_ = options.baseURL
}

export default NugrpcApi

declare module '@nuxt/types' {
  export interface Context {
    /**
     * Api instance attached to the app.
     */
    $api: ApiInstance;
  }

  export interface NuxtOptions {
    nugrcpApi?: Partial<Options>;
  }
}
