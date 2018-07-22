import * as fs from "fs"
import * as readline from "readline"
import { Token } from "./token"
import { Scanner } from "./scanner"

export default {
  hasError: false, 

  runFile: (file): Boolean => {
    const content = fs.readFileSync(file, "utf8")
    return this.run(content)
  },

  runPrompt: () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    console.log("> ")
    rl.on("line", (line) => {
      this.run(line)
    })
  },

  run: (source: string): Boolean => {
    const scanner = new Scanner(source)
    const tokens: Token[] = scanner.scanTokens()
    
    for (let token of tokens) {
      console.log(token)
    }

    return false
  },

  error: (line: number, message: string): void => {
    this.report(line, "", message)
  },

  report: (line: number, where: string, message: string): void => {
    console.error(`[line ${line}] Error ${where}: ${message}`)
    this.hadError = true
  }
}