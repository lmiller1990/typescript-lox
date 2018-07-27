import * as Exp from "./Expr"

class AstPrinter implements Exp.Visitor<string> {
  print(expr: Exp.Expr): string {
    return expr.accept(expr)
  }

  visitBinaryExpr(expr: Exp.Binary): string {
    return parenthesize(expr.operator.lexeme, expr.left, expr.right)
  }

  visitGroupingExpr(expr: Exp.Grouping): string {
      return parenthesize("group", expr.expression)
  }

  visitLiteralExpr(expr: Exp.Literal): string {
    if (expr.value == null) return "nil"
    return String(expr.value)
  }

  visitUnaryExpr(expr: Exp.Unary): string {
    return parenthesize(expr.operator, expr.right)
  }

  protected parenthesize(name: string, ...exprs: Exp.Expr[]): string {
    let val = `(${name})`
    for (let ex of exprs) {
      val += ` ${ex.accept(this)}`
    }

    val += ")"

    return val
  }
}