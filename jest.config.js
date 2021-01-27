// jest.config.js
module.exports = {
    setupFiles: ["./src/di/container.ts" /* import pour la configuration de l'injection de dépendances */],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    transform: {
        "\\.(ts|tsx)$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|jsx?|ts?|tsx?)$"
};