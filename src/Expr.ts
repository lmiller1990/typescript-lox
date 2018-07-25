abstract class Expr {
    }
      class Binary extends Expr {
        left: Expr
operator: Token
right: Expr
        
        constructor(left: Expr, operator: Token, right: Expr) {
      this.left = left
this.operator = operator
this.right = right
}
}
      class Grouping extends Expr {
        expression: Expr
        
        constructor(expression: Expr) {
      this.expression = expression
}
}
      class Literal extends Expr {
        value: any
        
        constructor(value: any) {
      this.value = value
}
}
      class Unary extends Expr {
        operator: Token
right: Expr
        
        constructor(operator: Token, right: Expr) {
      this.operator = operator
this.right = right
}
}