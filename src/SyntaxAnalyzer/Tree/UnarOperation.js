import { TreeNodeBase } from './TreeNodeBase';

export class UnarOperation extends TreeNodeBase
{
    constructor(symbol, right)
    {
        super(symbol);
        this.right = right;
    }
}