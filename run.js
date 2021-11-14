import { FileIO } from './src/IO/FileIO';
import { LexicalAnalyzer } from './src/LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from './src/SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from './src/Semantics/Engine';

let fileIO = new FileIO('example.code');

let lexicalAnalyzer = new LexicalAnalyzer(fileIO);


let syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
syntaxAnalyzer.analyze();

let trees = syntaxAnalyzer.trees;

let engine = new Engine(trees);
engine.run();
