// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-unistyles/plugin',
            'expo-router/babel',
        ]
    };
};