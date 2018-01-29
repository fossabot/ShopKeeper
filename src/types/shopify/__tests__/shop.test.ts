import {testCreateStore} from '../../../testing/data';
import {ShopifyTypes} from '../../base';
import {ShopData$Raw, ShopItem} from '../shop';


describe('Shop Shopify Type', () => {
  const store = testCreateStore();
  const shopDefaultDate = '2000-01-01T00:00:00.000Z';
  const shopData = {
    // General Store Information
    id: 100000,
    phone: '8001237890',
    name: 'Egdar\'s Example Store',
    email: 'edgar@example.com',
    source: 'developer-abc123',
    domain: 'edgars-example-store.myshopify.com',
    shop_owner: 'Edgar Example',
    customer_email: 'support@edgars.com',
    myshopify_domain: 'edgars-example-store.myshopify.com',

    // Address
    primary_location_id: 123,
    latitude: 1.111111,
    longitude: 2.22222,
    address1: '123 E. Example Ln.',
    address2: '',
    city: 'Los Angeles',
    zip: '12345',
    province: 'California',
    province_code: 'CA',
    country: 'US',
    country_code: 'US',
    country_name: 'United States',

    // Currency and Formatting
    weight_unit: 'lb',
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} USD',
    money_in_emails_format: '${{amount}}',
    money_with_currency_in_emails_format: '${{amount}} USD',
    primary_locale: 'en',
    currency: 'USD',
    timezone: '(GMT-07:00) Arizona',
    iana_timezone: 'America/Phoenix',

    // Shopify Flags
    taxes_included: false,
    tax_shipping: null,
    county_taxes: true,
    plan_display_name: 'affiliate',
    plan_name: 'affiliate',
    has_discounts: true,
    has_gift_cards: true,
    eligible_for_payments: true,
    setup_required: false,
    requires_extra_payments_agreement: false,
    has_storefront: true,
    eligible_for_card_reader_giveaway: null,
    finances: true,

    // Security
    force_ssl: true,
    password_enabled: false,
    google_apps_domain: 'edgars.com',
    google_apps_login_enabled: true,

    // Dates
    created_at: shopDefaultDate,
    updated_at: shopDefaultDate,
  } as ShopData$Raw;

  it('defines itemType properly', () => {
    const shop = new ShopItem(store, shopData);

    expect(shop.itemType).toEqual(ShopifyTypes.Shop);
  });

  it('is instantiable', () => {
    const shop = new ShopItem(store, shopData);

    expect(shop).toBeDefined();
    expect(shop).toBeInstanceOf(ShopItem);
    expect(shop.data).toEqual(shopData);
    expect(shop.toShopifyJSON()).toEqual(shopData);
  });
});
