import * as fs from "fs"
import * as readline from "readline"
import { Token } from "./token"
import { Scanner } from "./scanner"

class Lox {
  static hasError: boolean = false

  static runFile (file): Boolean {
    const content = fs.readFileSync(file, "utf8")
    return this.run(content)
  }

  static runPrompt(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    console.log("> ")
    rl.on("line", (line) => {
      this.run(line)
    })
  }

  static run(source: string): boolean {
    const scanner = new Scanner(source)
    const tokens: Token[] = scanner.scanTokens()
    
    for (let token of tokens) {
      console.log(token)
    }

    return false
  }

  static error(line: number, message: string): void {
    this.report(line, "", message)
  }

  static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error ${where}: ${message}`)
    this.hasError = true
  }
}

export { Lox }