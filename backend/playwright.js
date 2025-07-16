import { chromium } from "playwright";

export async function launchGmail(wsServer) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  if (wsServer) {
    setInterval(async () => {
      const buf = await page.screenshot();
      wsServer.clients.forEach(c => c.readyState===1 && c.send(buf));
    }, 2000);
  }

  await page.goto("https://mail.google.com/");
  await page.fill("input[type=email]", process.env.GMAIL_EMAIL);
  await page.click("button:has-text('Next')");
  await page.fill("input[type=password]", process.env.GMAIL_PASSWORD);
  await page.click("button:has-text('Next')");

  return page;
}
