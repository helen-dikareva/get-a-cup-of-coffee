import { Selector, ClientFunction } from 'testcafe';

// Page model
class OrderPage {
    constructor () {
        this.nameInput      = Selector('#ffio');
        this.telephoneInput = Selector('#ftel');
        this.citySelect     = Selector('#fgorod');
        this.cityOptions    = this.citySelect.find('option');
        this.streetInput    = Selector('#fulica');
        this.houseInput     = Selector('#fdom');
        this.sendInput      = Selector('input[type="submit"]');
    }
}

class PageModel {
    constructor () {
        this.menu       = Selector('#nav').find('a').withText('меню');
        this.coffeeMenu = Selector('#content').find('#smenu-150');

        this.titles    = Selector('.title');
        this.latte     = this.titles.withText('Латте классический').sibling('.labels');
        this.flatWhite = this.titles.withText('Флэт уайт попкорн').sibling('.labels');

        this.cart        = Selector('.myShop-cartmini');
        this.cartItems   = Selector('.myShop-cart-item');
        this.orderButton = Selector('.myShop-button-order');

        this.order = new OrderPage();
    }
}

const page = new PageModel();


// Test
fixture `Let\'s take a look at the new TestCafe`
    .page `http://www.pitcofe.ru/`;

test(`Get a cup of coffee`, async t => {
    await t
        .click(page.menu)
        .click(page.coffeeMenu)
        .click(page.latte)
        .click(page.cart)
        .expect(page.cartItems.count).eql(2)
        .expect(page.cartItems.nth(0).innerText).contains('Латте классический')
        .expect(page.cartItems.nth(1).innerText).contains('Доставка');

    const getOrderCount = ClientFunction(() => document.querySelectorAll('.myShop-cart-item').length);

    let orderCount = await getOrderCount();

    await t.expect(orderCount).eql(2);


    orderCount = await t.eval(() => document.querySelectorAll('.myShop-cart-item').length);

    await t
        .expect(orderCount).eql(2)

        .click(page.cart)
        .click(page.coffeeMenu)
        .click(page.flatWhite)
        .click(page.cart)
        .expect(page.cartItems.count).eql(3)
        .expect(page.cartItems.nth(0).innerText).contains('Латте классический')
        .expect(page.cartItems.nth(1).innerText).contains('Флэт уайт попкорн')
        .expect(page.cartItems.nth(2).innerText).contains('Доставка')

        .click(page.orderButton)
        .typeText(page.order.nameInput, 'Ваше Имя')
        .typeText(page.order.telephoneInput, '+79999999999')
        .click(page.order.citySelect)
        .click(page.order.cityOptions.withText('Ростов-на-Дону'))
        .typeText(page.order.streetInput, 'Ленина')
        .typeText(page.order.houseInput, '1')
        .click(page.order.sendInput);
});