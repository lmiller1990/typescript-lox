import { Token } from "./token"
abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T
}

interface Visitor<T> {
  visitBinaryExpr(expr: Binary): T
  visitGroupingExpr(expr: Grouping): T
  visitLiteralExpr(expr: Literal): T
  visitUnaryExpr(expr: Unary): T
}

class Binary extends Expr {
  left: Expr
  operator: Token
  right: Expr

  constructor(left: Expr, operator: Token, right: Expr) {
    super()
    this.left = left
    this.operator = operator
    this.right = right
  }

  accept<T>(vistor: Visitor<T>) {
    return visitor.visitBinaryExpr(this)
  }
}

class Grouping extends Expr {
  expression: Expr

  constructor(expression: Expr) {
    super()
    this.expression = expression
  }

  accept<T>(vistor: Visitor<T>) {
    return visitor.visitGroupingExpr(this)
  }
}

class Literal extends Expr {
  value: any

  constructor(value: any) {
    super()
    this.value = value
  }

  accept<T>(vistor: Visitor<T>) {
    return visitor.visitLiteralExpr(this)
  }
}

class Unary extends Expr {
  operator: Token
  right: Expr

  constructor(operator: Token, right: Expr) {
    super()
    this.operator = operator
    this.right = right
  }

  accept<T>(vistor: Visitor<T>) {
    return visitor.visitUnaryExpr(this)
  }
}

