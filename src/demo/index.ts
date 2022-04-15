import { importAll } from '../helpers/helpers';

importAll(require.context('.', true, /\.(scss|ts)$/));
