import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

declare global {
  const expect: typeof import('@jest/globals').expect;
  const test: typeof import('@jest/globals').test;
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const jest: typeof import('@jest/globals').jest;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
}