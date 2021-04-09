// @generated: @expo/next-adapter@2.1.5
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/guides/using-nextjs.md

const { withExpo } = require('@expo/next-adapter')
const withFonts = require('next-fonts')
const withTM = require('next-transpile-modules')(['@ui-kitten/components']);

module.exports = withExpo(
  withFonts(
    withTM({
      projectRoot: __dirname
    })
  )
)
