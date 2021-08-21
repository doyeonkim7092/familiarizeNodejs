const { Builder, By, Key, util, until } = require('selenium-webdriver');
require('chromedriver');

async function example() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://map.kakao.com/');
        await driver.findElement(By.name('q')).sendKeys('양재굿데이치과', Key.RETURN);
        await driver.sleep(2000)

        await driver.wait(until.elementLocated(By.className('moreview')));
        let button = driver.findElement(By.className('moreview'));
        // console.log('1')
        await driver.wait(until.elementIsEnabled(button, 1000));
        // console.log('2')
        await driver.executeScript('arguments[0].click()', button);
        // console.log('3')

        await driver.sleep(3000)

        const tabs = await driver.getAllWindowHandles();
        console.log(tabs, 'adsfa');

        await driver.switchTo().window(tabs[1]);

        await driver.sleep(1000)

        let title = await driver.findElement(By.className('txt_url'));
        await driver.wait(until.elementIsEnabled(title, 1000));
        console.log(await title.getAttribute('innerHTML'),'innerHTML')
    }
    catch (e) {
        console.log(e);
        throw e;
    }
    finally {
        // await driver.quit();
    }
}

example()