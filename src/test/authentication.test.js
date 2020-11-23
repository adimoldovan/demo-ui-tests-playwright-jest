describe("Authentication tests", () => {
    it('Normal user can login', async () => {

        await page.click("span > button.btn-link")
        await page.type("#user-name", "dino")
        await page.type("#password", "choochoo")
        await page.click("button.btn-primary")

        await expect(page.title()).resolves.toMatch('Demo shop');
        const element = await page.$("a[href='#/account']");
        await expect(await page.evaluate(element => element.textContent, element)).toBe("dino")
    })
});