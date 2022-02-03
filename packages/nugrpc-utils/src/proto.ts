import { Root } from "protobufjs"

export function load (files: string | string[]): Root {
  return (new Root())
    .loadSync(files, {
      keepCase             : true,
      alternateCommentMode : true,
      preferTrailingComment: true,
    }).root
}
