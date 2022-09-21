// @ts-expect-error TS(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { when, whenDev } = require("@craco/craco")


// @ts-expect-error TS(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    plugins: whenDev(() => ['react-dev-inspector/plugins/babel'], [])
}