import { Token } from "./token"

class Scanner {
  source: string
  tokens: Token[]

  constructor(source: string) {
    this.source = source
  }
}

export { Scanner }