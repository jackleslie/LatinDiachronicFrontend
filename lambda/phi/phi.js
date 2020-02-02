const chromium = require("chrome-aws-lambda")

exports.handler = async function(event, context) {
  try {
    const { line } = await event.queryStringParameters
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })
    const page = await browser.newPage()
    await page.goto(`https://latin.packhum.org/search?q=${line}`, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    })
    const link = await page.$eval("#match .tlink", elem => elem.innerText)
    const extract = await page.$eval("#match .slink", elem => elem.innerHTML)
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
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Please try again later, or use a separate reference tool.",
      }),
    }
  }
}
