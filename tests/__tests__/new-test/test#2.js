import { runFile } from '../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'test2.code');

test('плюс минус', () => {
    expect(pjs.engine.results[0]).toBe(2);
  });