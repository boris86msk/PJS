import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { NumberConstant } from './Tree/NumberConstant';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { Symbol } from '../LexicalAnalyzer/Symbols/Symbol';
import { IntegerConstant } from '../LexicalAnalyzer/Symbols/IntegerConstant';

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

    // accept(expectedSymbolCode)
    // {
    //     if (this.symbol.symbolCode === expectedSymbolCode) {
    //         this.nextSym();
    //     } else {
    //         throw `${expectedSymbolCode} expected but ${this.symbol.symbolCode} found!`;
    //     }
    // }

    analyze()
    {
        this.nextSym();

        while (this.symbol !== null) {
            let expression = this.scanExpression();
            this.trees.push(expression);

            // Последняя строка может не заканчиваться переносом на следующую строку.
            if (this.symbol !== null) {
                this.accept(SymbolsCodes.endOfLine);
            }

        }

        return this.tree;
    }
    // Разбор выражения
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
                    if(this.symbol.symbolCode === SymbolsCodes.minus){
                        operationSymbol = this.symbol;
                        this.nextSym();
                        term = new Subtraction(operationSymbol, term, this.scanTerm());
                        break;
                    }
                    else{
                        term = new Addition(operationSymbol, term, this.scanTerm());
                        break;
                    }
                case SymbolsCodes.minus:
                    if(this.symbol.symbolCode === SymbolsCodes.minus){
                        operationSymbol = new Symbol(SymbolsCodes.plus, '+');
                        this.nextSym();
                        term = new Addition(operationSymbol, term, this.scanTerm());
                        break;
                    }
                    else{
                        term = new Subtraction(operationSymbol, term, this.scanTerm());
                        break;
                    }
            }
        }

        return term;
    }
    // Разбор слагаемого
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
    // Разбор множителя
    scanMultiplier()
    {   
        if(this.symbol instanceof IntegerConstant){
            let integerConstant = this.symbol;
            this.nextSym();
            return new NumberConstant(integerConstant);
        } else if(this.symbol.symbolCode === SymbolsCodes.minus){
            this.nextSym();
            this.symbol.value = -this.symbol.value;
            let integerConstant = this.symbol;
            this.nextSym();
            return new NumberConstant(integerConstant);
        } else{
            throw `${expectedSymbolCode} expected but ${this.symbol.symbolCode} found!`;
        }
    }
};