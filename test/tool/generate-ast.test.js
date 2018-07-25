const { GenerateAst } = require("../../src/tool/generate-ast.ts")

const type = "Binary : left: Expr, operator: Token, right: Expr"

describe("getClassName", () => {
  it("gets the class name", () => {
    expect(GenerateAst.getClassName(type)).toBe("Binary")
  })
})

describe("getFields", () => {
  it("gets the fields", () => {
    expect(GenerateAst.getFields(type)).toBe("left: Expr, operator: Token, right: Expr")
  })
})