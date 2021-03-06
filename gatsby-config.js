const proxy = require("http-proxy-middleware")
require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `Latin Diachronic Frontend`,
    description: `Quantitative analysis of Latin literature.`,
    author: `@jackleslie`,
  },
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      proxy({
        target: process.env.GATSBY_FUNCTION_PROXY_URL,
        pathRewrite: {
          "/.netlify/functions/": "",
        },
      })
    )
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    {
      resolve: "gatsby-plugin-chakra-ui",
      options: {
        isUsingColorMode: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `latin-frontend`,
        short_name: `latin`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#edf2f7`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    {
      resolve: `gatsby-source-graphql`,
      options: {
        // This type will contain remote schema Query type
        typeName: `LATIN`,
        // This is field under which it's accessible
        fieldName: `latin`,
        // Url to query from
        url:
          process.env.NODE_ENV === "production"
            ? process.env.GATSBY_API_URL
            : process.env.GATSBY_API_URL_DEV,
      },
    },
  ],
}
