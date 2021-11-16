import { Engine } from '../../../src/Semantics/Engine';
import { runFile } from '../../helpers/testsHelper';
import { insp } from '../../helpers/testsHelper';


let pjs = runFile(import.meta.url, 'test1.code');

test('два минуса', () => {
    expect(pjs.engine.results[0]).toBe(8);
  });