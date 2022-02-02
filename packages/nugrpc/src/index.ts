import { Module } from '@nuxt/types'

export interface Service {
  target: string;
  protoFiles: string[];
  mode?: 'live' | 'fakery'
  swagger?: boolean;
}

export interface Options {
  basePath: string;
  service: Record<string, Service>;
}

const Nugrpc: Module<Options> = function (moduleOptions) {
  // Use this, this.options, this.nuxt
  // Use moduleOptions
}

export default Nugrpc

export const meta = require('../package.json')
