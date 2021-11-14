
import fs from 'fs';

export class FileIO  //новый объект класса 'example.code'
{
    constructor(fileName)
    {
        this.charPointer = 0;
        this.text = fs.readFileSync(fileName, 'UTF-8');//считываем в память всё содержимое файла.
    }                                                 // храним в text

    nextCh()
    {
        return this.charPointer < this.text.length ?
            this.text[this.charPointer++] :
            null;
    }
}