const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const SITE_URL = "https://k04-testing-sm.dtduc.name.vn/"
const LOGIN_URL = `${SITE_URL}Login.aspx`
const PRODUCT_URL = `${SITE_URL}Products.aspx`
const HOMEPAGE_URL = `${SITE_URL}Default.aspx`

const BROWSER = 'chrome'

const screen = {
	width: 1920,
	height: 1080
  };
const getDriver = async () => {
	let builder = new Builder().forBrowser(BROWSER);
	if (BROWSER === 'chrome') {
		builder = builder
			.setChromeOptions(new chrome.Options().headless().windowSize(screen))
			.setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
	}
	return builder.build();
}
describe(SITE_URL, () => {
	let driver;
	beforeAll(async () => {
		driver = await getDriver();
	});

	afterAll(async () => {
		await driver.quit();
	});

	it("Login successfully", async () => {
		await driver.get(LOGIN_URL);
		await driver.findElement(By.id("UserName")).sendKeys("hienviluong125");
		await driver.findElement(By.id("Password")).sendKeys("123-456789");
		await driver.findElement(By.id("LoginButton")).click();

		let menuItem = await driver.wait(until.elementLocated(By.id('Header_LoginViewHeader_LoginName1')), 5000);
		await menuItem.click();
		await driver.findElement(By.id("Header_LoginViewHeader_HyperLink4")).click();

		let fullnameLabel = await driver.wait(until.elementLocated(By.id("MainContent_ProfileSidebar_LabelUserFullName")), 5000);
		let fullname = await fullnameLabel.getText();
		expect(fullname).toEqual("Hien Luong");
	})

	it('Cart must have one Item', async () => {
		await driver.get(PRODUCT_URL);
		await driver.findElement(By.id("MainContent_ItemList_ProductsListView_ctrl0_ButtonAddToCart_0")).click();
		await new Promise((r) => setTimeout(r, 1000));

		await driver.findElement(By.id("LinkButtonViewCart")).click();
		let itemCountInCartEl = await driver.wait(until.elementLocated(By.id("MainContent_LabelItemCount")), 5000);
		let itemCountInCart = await itemCountInCartEl.getText();
		expect(parseInt(itemCountInCart, 10)).toEqual(1);
	});
});
describe("Performance test", () => {
	beforeEach(async () => {
		driver = await getDriver();
	});

	afterEach(async () => {
		await driver.quit();
	});

	jest.setTimeout(100 * 1000) // 100s
	it('100 CCU on homepage within 100s: ', async () => {
		console.time('test');
		const reqArr = []
		for (let index = 0; index < 100; index++) {
			reqArr.push(driver.get(HOMEPAGE_URL));
		}
		await Promise.all(reqArr)
		console.time('test');
		// expect(parseInt(itemCountInCart, 10)).toEqual(1);
	});
});
//==================== End Main ====================
