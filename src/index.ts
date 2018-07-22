import { Lox } from "./lox"

const args: string[] = process.argv.slice(2)

if (args.length > 1) {
  console.log("Usage: tslox [script]")
} else if (args.length == 1) {
  Lox.runFile(args[0])
} else {
  Lox.runPrompt()
}

console.log(args)


