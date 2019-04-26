import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
    {
        input: 'index.js',
        output: {
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'nsGmx',
            globals: {
                leaflet: 'L',                        
            }             
        },
        external: ['leaflet'],
        plugins: [       
            resolve(),            
            commonjs(),
            json(),
            css({dest: 'public/main.css', minified: true}),
            copy({
                targets: [                    
                    'src/search-input-field.png',
                ],                
            }),
            babel({
                include: 'node_modules/svelte/shared.js',
                exclude: 'node_modules/**'
            })
        ]
    },
    {
        input: 'index.js',
        output: {
            file: pkg.module,
            format: 'cjs',
            sourcemap: true,            
            globals: {
                leaflet: 'L',                        
            }             
        },
        external: ['leaflet'],
        plugins: [       
            resolve(),            
            commonjs(),
            json(),
            css({dest: 'dist/main.css', minified: true}),
            copy({
                targets: [                    
                    'src/search-input-field.png',
                ],
            }),
            babel({ exclude: 'node_modules/**' })
        ]
    }
];
