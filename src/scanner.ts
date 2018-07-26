import { Lox } from "./lox"
import { Token } from "./token"
import { TokenType } from "./token-type"

interface IHash {
  [details: string]: TokenType
}

class Scanner {
  source: string
  tokens: Token[]
  start: number
  current: number
  line: number

  keywords: IHash = {
    "and": TokenType.AND,
    "class": TokenType.CLASS,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "for": TokenType.FOR,
    "fun": TokenType.FUN,
    "if": TokenType.IF,
    "nil": TokenType.NIL,
    "or": TokenType.OR,
    "print": TokenType.PRINT,
    "return": TokenType.RETURN,
    "super": TokenType.SUPER,
    "this": TokenType.THIS,  
    "true": TokenType.TRUE,
    "var": TokenType.VAR,
    "while": TokenType.WHILE
  }

  constructor(source: string) {
    this.source = source
    this.tokens = new Array<Token>()
    this.line = 1
    this.start = 0
    this.current = 0
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
  
      case "(": 
        this.addToken(TokenType.LEFT_PAREN, null) 
        break
      case ")": 
        this.addToken(TokenType.RIGHT_PAREN, null)
        break
      case "{": 
        this.addToken(TokenType.LEFT_BRACE, null)
        break
      case "}":  
        this.addToken(TokenType.RIGHT_BRACE, null)  
        break
      case ",": 
        this.addToken(TokenType.COMMA, null)
        break
      case ".":  
        this.addToken(TokenType.DOT, null)
        break
      case "-": 
        this.addToken(TokenType.MINUS, null)
        break
      case "+": 
        this.addToken(TokenType.PLUS, null)
        break
      case ";": 
        this.addToken(TokenType.SEMICOLON, null)  
        break
      case "*": 
        this.addToken(TokenType.STAR, null) 
        break
      case "!": 
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG, null)
        break
      case "=": this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null) 
        break
      case "<": this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS, null) 
        break
      case ">": this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER, null) 
        break
      case "/": 
        if (this.match("/")) {
          while(this.peek() != "\n" && !this.isAtEnd()) {
            this.advance()
          }
        } else {
          this.addToken(TokenType.SLASH)
        }
        break
      case " ":
      case "\r":
      case "\t":
        break
      case "\n":
        this.line += 1; break
      case '"': 
        this.string()
        break
      default: 
        if (this.isDigit(c)) {
          this.number()
        } else if (this.isAlpha(c)) {
          this.identifier(c)
        } else {
          Lox.error(this.line, `Unexpected character: ${c}.`)          
        }

    }
  }

  peek(): string {
    if (this.isAtEnd()) 
      return "\n"
    return this.source[this.current]
  }

  peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return "\0"
    }
    return this.source[this.current + 1]
  }

  identifier(c): void {
    while (this.isAlpha(this.peek())) {
      this.advance()
    }

    // see if identifier is a reserved word
    const text = this.source.substring(this.start, this.current)

    let type: TokenType = this.keywords[text]
    if (type == null) type = TokenType.IDENTIFIER
  
    this.addToken(type)
  }

  isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) && this.isAlphaNumeric(c)
  }

  isAlpha(c): boolean {
    return c >= "a" && c <= "z" ||
      c >= "A" && c <= "Z" ||
      c == "_"
  }

  isDigit(char: string): boolean {
    return parseInt(char) >= 0 && parseInt(char) <= 9
  }

  number(): void {
    // next lexeme is also a digit
    while (this.isDigit(this.peek())) {
      this.advance()
    }

    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // it is a floating point number
      // get digits to the LHS of .
      this.advance()

      // continue consuming numbers to the LHS
      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }

    this.addToken(TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current)))
  }

  string(): void {
    console.log("String")
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        this.line += 1
      }
      this.advance()
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.")
      return 
    }

    this.advance()

    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, value)
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
  addToken(tokenType: TokenType, literal?: any): void  
  addToken(tokenType: TokenType, literal?: any): void {
    if (literal == null) {
      const text = this.source.substring(this.start, this.current)
      this.tokens.push(new Token(tokenType, text, literal, this.line))
    } else {
      const text = this.source.substring(this.start, this.current)
      this.tokens.push(new Token(tokenType, text, literal, this.line))
    }
  }
}

export { Scanner }