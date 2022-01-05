import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { NumberConstant } from './Tree/NumberConstant';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { UnaryOperation } from './Tree/UnaryOperation';
import { Assingning } from './Tree/Assigning';
import { Variable } from './Tree/Variable';
/**
 * Синтаксический анализатор - отвечат за построения дерева выполнения
 */
export class SyntaxAnalyzer
{
    constructor(lexicalAnalyzer)
    {
        this.lexicalAnalyzer = lexicalAnalyzer;
        this.symbol = null;
        this.tree = null;
        this.trees = [];
    }

    nextSym()
    {
        this.symbol = this.lexicalAnalyzer.nextSym();
    }

    accept(expectedSymbolCode)
    {
        if (this.symbol.symbolCode === expectedSymbolCode) {
            this.nextSym();
        } else {
            throw `${expectedSymbolCode} expected but ${this.symbol.symbolCode} found!`;
        }
    }

    analyze()
    {
        this.nextSym();

        while (this.symbol !== null) {
            let expression = this.scanAssigning();
            this.trees.push(expression);

            // Последняя строка может не заканчиваться переносом на следующую строку.
            if (this.symbol !== null) {
                this.accept(SymbolsCodes.endOfLine);
            }

        }

        return this.tree;
    }

    scanAssigning()
    {
        let term = this.scanExpression();
        if (this.symbol !== null && 
            this.symbol.symbolCode === SymbolsCodes.equal)
            {
                this.nextSym();
                if (term instanceof Variable) {
                    term = new Assingning(term ,this.scanExpression());
                } else {
                    throw 'Variable is not defined.';
                }
                
            }
        return term;
    }
    
    scanExpression()
    {
        let term = this.scanTerm();
        let operationSymbol = null;

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.plus ||
                    this.symbol.symbolCode === SymbolsCodes.minus
            )) {

            operationSymbol = this.symbol;
            this.nextSym();

            switch (operationSymbol.symbolCode) {
                case SymbolsCodes.plus:
                    term = new Addition(operationSymbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.minus:
                    term = new Subtraction(operationSymbol, term, this.scanTerm());
                    break;
            }
        }

        return term;
    }
    
    scanTerm()
    {
        let term = this.scanMultiplier();
        let operationSymbol = null;

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.star ||
                    this.symbol.symbolCode === SymbolsCodes.slash
            )) {

            operationSymbol = this.symbol;
            this.nextSym();

            switch (operationSymbol.symbolCode) {
                case SymbolsCodes.star:
                    term = new Multiplication(operationSymbol, term, this.scanMultiplier());
                    break;
                case SymbolsCodes.slash:
                    term = new Division(operationSymbol, term, this.scanMultiplier());
                    break;
            }
        }

        return term;
    }

    
    scanMultiplier()
    {

        if(this.symbol.symbolCode === SymbolsCodes.minus)
        {
            this.nextSym();
            let element = null;
            if (this.symbol.symbolCode == SymbolsCodes.openStap)
            {
                element = this.scanParentheses();
            } else if (this.symbol.symbolCode == SymbolsCodes.integerConst) {
                let integerConstant = this.symbol;
                this.accept(SymbolsCodes.integerConst);
                element = new NumberConstant(integerConstant);
            } 
            return new UnaryOperation(SymbolsCodes.minus, element);

        } else if (this.symbol.symbolCode === SymbolsCodes.openStap)
        {
            let term = this.scanParentheses();
            return term;

        } else if (this.symbol.symbolCode === SymbolsCodes.identifier)
        {
            let value = this.symbol.value;
            this.nextSym();
            return new Variable(value);
   
        } else {
            let integerConstant = this.symbol;

            this.accept(SymbolsCodes.integerConst);

            return new NumberConstant(integerConstant);
        }

    }
    

    scanParentheses()
    {
        this.nextSym();
        let term = this.scanExpression();
        this.nextSym();
        return term;
    }

}
