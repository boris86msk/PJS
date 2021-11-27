import { TreeNodeBase } from './TreeNodeBase';

export class UnaryOperation extends TreeNodeBase
{
    constructor(symbol, right)
    {
        super(symbol);
        this.right = right;
    }
}