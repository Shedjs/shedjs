import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/shedjs.js',
            format: 'umd',
            name: 'ShedJS'
        },
        {
            file: 'dist/shedjs.esm.js',
            format: 'es'
        }
    ],
    plugins: [
        resolve({ browser: true }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            include: ["src/**/*"],
            exclude: ["node_modules/**"],
            noEmitOnError: false  // Ensure build completes even with type errors
        })
    ],
    onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
    }
};
