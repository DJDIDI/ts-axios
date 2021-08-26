import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const libraryName = 'ts-axios';
const umdName = 'tsAxios';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      name: umdName,
      format: 'umd',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};
