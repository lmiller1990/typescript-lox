import * as fs from "fs"
import * as path from "path"

class GenerateAst {
  static run(): void {
    const args: string[] = process.argv.slice(2)

      console.log(args, args.length)
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
    let template = `abstract class ${baseName} {
    }`
    for (let type of types) {
      const className = this.getClassName(type)
      const fields = this.getFields(type)
      template = this.defineType(template, baseName, className, fields)
    }

    const outputPath: string = path.join(outputDir, `${baseName}.ts`)

    console.log(outputPath)

    fs.writeFile(outputPath, template, "utf8", (err) => {
      if (err) throw err
    })
  }

  static defineType(template: string, baseName: string, className: string, fields: string): string {
    const fieldDeclarations = fields.split(", ").join("\n")

    template += `
      class ${className} extends ${baseName} {
        ${fieldDeclarations}
        
        constructor(${fields}) {
      ` 
    const fieldsList: string[] = fields.split(", ")
    for (let field of fieldsList) {
      let name = field.split(" ")[0]
      name = name.substring(0, name.length-1)
      template += `this.${name} = ${name}\n`
    }

    return template += "}\n}"
  }
}

if (process.env.NODE_ENV !== 'test') 
  GenerateAst.run()

export { GenerateAst }