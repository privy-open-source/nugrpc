import TransformerRules from "."
import { listRules } from "@privyid/nugrpc-validator"

export default function install (plugin: TransformerRules) {
  for (const rule of listRules)
    plugin.addRule(rule, '@privyid/nugrpc-validator')
}
