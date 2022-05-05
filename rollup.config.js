import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'

const name = 'cxValidation';
const about = `/**
 * cxValidation
 * @version ${pkg.version}
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxValidation
 * @license Released under the MIT license
 */`;

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cxvalidation.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
    },
    {
      file: 'dist/cxvalidation.min.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
      plugins: [
        terser({
          compress: {}
        })
      ],
    },
    {
      file: 'dist/cxvalidation.es.js',
      format: 'es',
      banner: about,
      indent: false,
    },
  ],
};