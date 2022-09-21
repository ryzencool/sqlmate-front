
const { when, whenDev } = require("@craco/craco")


module.exports = {
    plugins: [
        ...whenDev(() => ['react-dev-inspector/plugins/babel'], []),
        ["@babel/plugin-proposal-class-properties"]
    ],
    "assumptions": {
        "setPublicClassFields": false
    }
}