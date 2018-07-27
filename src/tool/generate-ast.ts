import * as fs from "fs"
import * as path from "path"

class GenerateAst {
  static run(): void {
    const args: string[] = process.argv.slice(2)

    if (args.length != 1) {
      console.error("Usage: generate_ast <output directory>")
      return
    }

    const outputDir: string = args[0]

    this.defineAst(outputDir, "Expr", [
      "Binary : left: Expr, operator: Token, right: Expr",
      "Grouping : expression: Expr",
      "Literal : value: any",
      "Unary : operator: Token, right: Expr"
    ])
  }

  static getClassName(type: string): string {
    return type.split(":")[0].trim()
  }

  static getFields(type: string): string {
    let match = /:(.*)/.exec(type)
    
    // ! workaround for object is possibly null
    // TODO: capture error and fail gracefully?
    return match![1].trim()
  }

  static defineAst(outputDir: string, baseName: string, types: string[]): void {
    let template = `import { Token } from "./token"\n` +
      `export abstract class ${baseName} {\n` +
      "  abstract accept<T>(visitor: Visitor<T>): T" +
      "\n}\n\n"

    template = this.defineVisitor(template, baseName, types)

    for (let type of types) {
      const className = this.getClassName(type)
      const fields = this.getFields(type)
      template = this.defineType(template, baseName, className, fields)
    }

    const outputPath: string = path.join(outputDir, `${baseName}.ts`)

    fs.writeFile(outputPath, template, "utf8", (err) => {
      if (err) throw err
    })
  }

  static defineType(template: string, baseName: string, className: string, fields: string): string {
    const fieldDeclarations = fields.split(", ").join("\n  ")

    template += `export class ${className} extends ${baseName} {\n` +
        `  ${fieldDeclarations}\n\n` +
        `  constructor(${fields}) {\n` +
        `    super()\n`
      
    const fieldsList: string[] = fields.split(", ")
    for (let field of fieldsList) {
      let name = field.split(" ")[0]
      name = name.substring(0, name.length-1)
      template += `    this.${name} = ${name}\n`
    }

    template += "  }\n\n"

    template += "  accept<T>(visitor: Visitor<T>) {\n"
    template += `    return visitor.visit${className}${baseName}(this)\n`
    template += "  }"  
    
    return template += "\n}\n\n"
  }

  static defineVisitor(template: string, baseName: string, types: string[]): string {
    template += "export interface Visitor<T> {\n"
    
    for (let type of types) {
      const className = this.getClassName(type)
      template += `  visit${className}${baseName}(${baseName.toLowerCase()}: ${className}): T\n`
    }

    return template + "}\n\n"
  }
}

if (process.env.NODE_ENV != 'test') {
  GenerateAst.run()
}

export { GenerateAst }