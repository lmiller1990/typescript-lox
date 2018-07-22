import Lox from "./lox"
import { Token } from "./token"
import { TokenType } from "./token-type"

class Scanner {
  source: string
  tokens: Token[]
  line: number = 1
  start: number = 0
  current: number = 0

  constructor(source: string) {
    this.source = source
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line))

    return this.tokens
  }

  isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  scanToken(): void {
    const c = this.advance()
    switch (c) {
  
      case "(": this.addToken(TokenType.LEFT_PAREN, null); break
      case ")": this.addToken(TokenType.RIGHT_PAREN, null); break
      case "{": this.addToken(TokenType.LEFT_BRACE, null); break
      case "}": this.addToken(TokenType.RIGHT_BRACE, null); break
      case ",": this.addToken(TokenType.COMMA, null); break
      case ".": this.addToken(TokenType.DOT, null); break
      case "-": this.addToken(TokenType.MINUS, null); break
      case "+": this.addToken(TokenType.PLUS, null); break
      case ";": this.addToken(TokenType.SEMICOLON, null); break
      case "*": this.addToken(TokenType.STAR, null); break
      case "!": this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG); break
      case "=": this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break
      case "<": this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS); break
      case ">": this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER); break
      case "/": 
        if (this.match("/")) {
          while(this.peek() != "\n" && !this.isAtEnd()) {
            this.advance()
          }
        } else {
          this.addToken(TokenType.SLASH)
        }
        break
      default: Lox.error(this.line, "Unexpected character.")

    }
  }

  peek(): string {
    if (this.isAtEnd()) 
      return "\n"
    return this.source[this.current]
  }

  advance(): string {
    this.current += 1
    return this.source[this.current - 1]
  }

  match(expected: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source[this.current] != expected) return false

    this.current += 1
    return true
  }

  addToken(tokenType: TokenType): void
  addToken(tokenType: TokenType, literal: object): void
  addToken(tokenType: TokenType, literal?: object): void {
    if (literal == null) {
      const text = this.source.substring(this.start, this.current)
      this.tokens.push(new Token(tokenType, text, literal, this.line))
    }
  }
}

export { Scanner }