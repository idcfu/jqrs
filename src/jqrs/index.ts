import importAll from '../importAll';

importAll(require.context('.', true, /^(?!.*(?:test.ts$)).*\.(scss|ts)$/));
