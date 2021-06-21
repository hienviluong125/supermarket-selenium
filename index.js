const { Builder, By, Key, until } = require('selenium-webdriver');
const BROWSER = 'safari'

//==================== Automation tests====================
// Test login function
async function testLogin(testCaseTitle) {
	const LOGIN_URL = 'https://k04-testing-sm.dtduc.name.vn/Login.aspx'
	let driver = await new Builder().forBrowser(BROWSER).build();
	try {
		await driver.get(LOGIN_URL);
		await driver.findElement(By.id("UserName")).sendKeys("hienviluong125");
		await driver.findElement(By.id("Password")).sendKeys("123-456789");
		await driver.findElement(By.id("LoginButton")).click();

		let menuItem = await driver.wait(until.elementLocated(By.id('Header_LoginViewHeader_LoginName1')), 2000);
		await menuItem.click();
		await driver.findElement(By.id("Header_LoginViewHeader_HyperLink4")).click();

		let fullnameLabel = await driver.wait(until.elementLocated(By.id("MainContent_ProfileSidebar_LabelUserFullName")), 2000);
		let fullname = await fullnameLabel.getText();

		console.log(`TESTCASE ${testCaseTitle} PASSED ? : `, fullname === "Hien Luong");
	} catch(e) {
		console.log("Error message: ", e);
	}finally {
		setTimeout(() => {
			driver.quit();
		}, 5000);
	}
};
//==================== End Automation tests ====================

//==================== Main ====================
async function main() {
	await testLogin("Login with exsiting account");
	// await testOrder();
}
//==================== End Main ====================

main();
