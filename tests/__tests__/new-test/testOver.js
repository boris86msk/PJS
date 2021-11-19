import { runFile } from '../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'testOver.code');

test('все операции', () => {
    expect(pjs.engine.results[0]).toBe(-8);
  });