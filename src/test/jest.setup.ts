import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Fix TS type incompatibility by casting to any
(globalThis as any).TextEncoder = TextEncoder as any;
(globalThis as any).TextDecoder = TextDecoder as any;