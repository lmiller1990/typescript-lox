"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var GenerateAst = /** @class */ (function () {
    function GenerateAst() {
    }
    GenerateAst.run = function () {
        var args = process.argv.slice(2);
        if (args.length != 1) {
            console.error("Usage: generate_ast <output directory>");
            return;
        }
        var outputDir = args[0];
        this.defineAst(outputDir, "Expr", [
            "Binary : left: Expr, operator: Token, right: Expr",
            "Grouping : expression: Expr",
            "Literal : value: any",
            "Unary : operator: Token, right: Expr"
        ]);
    };
    GenerateAst.getClassName = function (type) {
        return type.split(":")[0].trim();
    };
    GenerateAst.getFields = function (type) {
        var match = /:(.*)/.exec(type);
        // ! workaround for object is possibly null
        // TODO: capture error and fail gracefully?
        return match[1].trim();
    };
    GenerateAst.defineAst = function (outputDir, baseName, types) {
        var template = "import { Token } from \"./token\"\n" +
            ("abstract class " + baseName + " {\n}\n");
        template = this.defineVisitor(template, baseName, types);
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            var className = this.getClassName(type);
            var fields = this.getFields(type);
            template = this.defineType(template, baseName, className, fields);
        }
        var outputPath = path.join(outputDir, baseName + ".ts");
        fs.writeFile(outputPath, template, "utf8", function (err) {
            if (err)
                throw err;
        });
    };
    GenerateAst.defineType = function (template, baseName, className, fields) {
        var fieldDeclarations = fields.split(", ").join("\n  ");
        template += "class " + className + " extends " + baseName + " {\n" +
            ("  " + fieldDeclarations + "\n\n") +
            ("  constructor(" + fields + ") {\n") +
            "    super()\n";
        var fieldsList = fields.split(", ");
        for (var _i = 0, fieldsList_1 = fieldsList; _i < fieldsList_1.length; _i++) {
            var field = fieldsList_1[_i];
            var name_1 = field.split(" ")[0];
            name_1 = name_1.substring(0, name_1.length - 1);
            template += "    this." + name_1 + " = " + name_1 + "\n";
        }
        return template += "  }\n}\n\n";
    };
    GenerateAst.defineVisitor = function (template, baseName, types) {
        template += "interface Visitor<T> {\n";
        for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
            var type = types_2[_i];
            var className = this.getClassName(type);
            template += "  visit" + className + baseName + "(" + baseName.toLowerCase() + ": " + className + "): T\n";
        }
        return template + "}\n\n";
    };
    return GenerateAst;
}());
exports.GenerateAst = GenerateAst;
if (process.env.NODE_ENV != 'test') {
    GenerateAst.run();
}
