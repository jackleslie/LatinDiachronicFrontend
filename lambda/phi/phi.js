const chromium = require("chrome-aws-lambda")

exports.handler = async function(event, context) {
  try {
    const { line } = await event.queryStringParameters
    const browser = await chromium.puppeteer.launch()
    const page = await browser.newPage()
    // page.waitForSelector("#results")
    await page.goto(`https://latin.packhum.org/search?q=${line}`, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    })
    const link = await page.$eval("#match .tlink", elem => elem.innerText)
    const extract = await page.$eval("#match .extr", elem => elem.innerText)
    const result = {
      link,
      extract,
    }
    await browser.close()
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
