import { Addition } from '../SyntaxAnalyzer/Tree/Addition';
import { BinaryOperation } from '../SyntaxAnalyzer/Tree/BinaryOperation';
import { Multiplication } from '../SyntaxAnalyzer/Tree/Multiplication';
import { Subtraction } from '../SyntaxAnalyzer/Tree/Subtraction';
import { Division } from '../SyntaxAnalyzer/Tree/Division';
import { UnaryOperation } from '../SyntaxAnalyzer/Tree/UnaryOperation';
import { NumberConstant } from '../SyntaxAnalyzer/Tree/NumberConstant';
import { NumberVariable } from './Variables/NumberVariable';
import { Assingning } from '../SyntaxAnalyzer/Tree/Assigning';
import { Variable } from '../SyntaxAnalyzer/Tree/Variable';

export class Engine
{
    /**
     * Результаты вычислений (изначально - один для каждой строки)
     * 
     * @type string[]
     */
    results;

    constructor(trees)
    {
        this.trees = trees;
        this.results = [];
        this.savedVariables = new Map();
    }

    run()
    {
        let self = this;

        this.trees.forEach(

            function(tree)
            {
                let result = self.evaluateAssigning(tree);
                if (result instanceof NumberVariable) {
                    console.log(result.value);
                    self.results.push(result.value); // пишем в массив результатов
                } else {
                    console.log(result);
                }
            }
        );

    }

    evaluateAssigning(expression)
    {
        if (expression instanceof Assingning) {
            let leftOperand = null;
            if (expression.left instanceof Variable) {
                leftOperand = expression.left.value;
            } else {
                throw 'Variable is not defined.';
            }
            let rightOperand = this.evaluateSimpleExpression(expression.right);
            this.savedVariables.set(leftOperand, rightOperand.value);
            return `${leftOperand} = ${rightOperand.value}`;

        } else {
            return this.evaluateSimpleExpression(expression);
        }
    }

    evaluateSimpleExpression(expression)
    {
        if (expression instanceof Addition ||
                expression instanceof Subtraction) {

            let leftOperand = this.evaluateSimpleExpression(expression.left);
            let rightOperand = this.evaluateSimpleExpression(expression.right);

            let result = null;
            if (expression instanceof Addition) {
                result = leftOperand.value + rightOperand.value;
            } else if (expression instanceof Subtraction) {
                result = leftOperand.value - rightOperand.value;
            }

            return new NumberVariable(result);

        } else {
            return this.evaluateTerm(expression);
        }
    }

    evaluateTerm(expression)
    {
        if (expression instanceof Multiplication) {
            let leftOperand = this.evaluateTerm(expression.left);
            let rightOperand = this.evaluateTerm(expression.right);
            let result = leftOperand.value * rightOperand.value;

            return new NumberVariable(result);
        } else if (expression instanceof Division) {
            let leftOperand = this.evaluateTerm(expression.left);
            let rightOperand = this.evaluateTerm(expression.right);
            let result = leftOperand.value / rightOperand.value;

            return new NumberVariable(result);
        } else {
            return this.evaluateExpression(expression);
        }
    }

    evaluateExpression(expression)
    {
        if (expression instanceof UnaryOperation)
        {
            let result = this.evaluateSimpleExpression(expression.right);
            result.value = -result.value;
            return result;
        } else if (expression instanceof BinaryOperation) {
            let result = this.evaluateSimpleExpression(expression);
            return result;
        } else {
            return this.evaluateMultiplier(expression);
        }
    }

    evaluateMultiplier(expression)
    {
        if (expression instanceof NumberConstant) 
        {
            return new NumberVariable(expression.symbol.value);

        } else if (expression instanceof Variable) {

            let variable = this.savedVariables.get(expression.value);
            if (variable !== undefined) {
               return new NumberVariable(variable); 
            } else {
                throw 'variable is not defined'
            }

        } else {
            throw 'Number Constant expected.';
        }
    }

}