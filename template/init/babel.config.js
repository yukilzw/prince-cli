module.exports = {
    presets: [
        ['@babel/preset-env'],
        '@babel/preset-react'
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        '@babel/proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-object-assign',
        ['@babel/plugin-transform-runtime', { 'corejs': 2 }]
    ]
};
