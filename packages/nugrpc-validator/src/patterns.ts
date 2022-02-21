export const ALPHA                  = "^[a-zA-Z]+$"
export const ALPHA_SPACE            = "^[a-zA-Z\\s]+$"
export const ALPHA_UNDERSCORE       = "^[a-zA-Z_]+$"
export const LOWER_ALPHA_UNDERSCORE = "^[a-z_]+$"

export const ALPHA_NUMERIC                    = "^[a-zA-Z0-9]+$"
export const ALPHA_NUMERIC_SPACE              = "^[a-zA-Z0-9\\s]+$"
export const ALPHA_NUMERIC_SPACE_SPECIAL_CHAR = "^[a-zA-Z0-9_+\\s]+$"

export const NUMERIC = "^[0-9]+$"
export const TIME    = "^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])(:[0-5][0-9])?$"

export const REGEX_ALPHA                            = new RegExp(ALPHA)
export const REGEX_ALPHA_SPACE                      = new RegExp(ALPHA_SPACE)
export const REGEX_ALPHA_UNDERSCORE                 = new RegExp(ALPHA_UNDERSCORE)
export const REGEX_LOWER_ALPHA_UNDERSCORE           = new RegExp(LOWER_ALPHA_UNDERSCORE)
export const REGEX_ALPHA_NUMERIC                    = new RegExp(ALPHA_NUMERIC)
export const REGEX_ALPHA_NUMERIC_SPACE              = new RegExp(ALPHA_NUMERIC_SPACE)
export const REGEX_ALPHA_NUMERIC_SPACE_SPECIAL_CHAR = new RegExp(ALPHA_NUMERIC_SPACE_SPECIAL_CHAR)
export const REGEX_NUMERIC                          = new RegExp(NUMERIC)
export const REGEX_TIME                             = new RegExp(TIME)
