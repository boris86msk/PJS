import { runFile } from '../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'test3.code');

test('умножить минус', () => {
    expect(pjs.engine.results[0]).toBe(-12);
  });