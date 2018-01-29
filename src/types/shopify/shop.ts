// Copyright (C) 2018 Sleep E-Z USA, Inc. / Evan Darwin
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import {Indexable, ShopifyItem, ShopifyTypes} from '../base';
import {Store} from '../store';

export class ShopItem extends ShopifyItem<ShopData$Raw, ShopData$Raw> {
  itemType = ShopifyTypes.Shop;

  constructor(store: Store, data: ShopData$Raw) {
    super(store, data);
    this.data = data;

    store.registerToCache(this);
  }

  mergeToRaw(): ShopData$Raw {
    return this.rawData;
  }
}

export type ShopData$Raw = Indexable&{
  name: string,
  email: string,
  domain: string,
  province: string,
  country: string,
  address1: string,
  address2: string,
  zip: string,
  city: string,
  source: string | null,
  phone: string,
  customer_email: string,
  latitude: number,
  longitude: number,
  primary_location_id: number | null,
  primary_locale: string,
  country_code: string,
  country_name: string,
  currency: string,
  timezone: string,
  iana_timezone: string,
  shop_owner: string,
  money_format: string,
  money_with_currency_format: string,
  weight_unit: string,
  province_code: string,
  taxes_included: null | boolean,
  tax_shipping: null | boolean,
  county_taxes: boolean,
  plan_display_name: string,
  plan_name: string,
  has_discounts: boolean,
  has_gift_cards: boolean,
  myshopify_domain: string,
  google_apps_domain: null | string,
  google_apps_login_enabled: null | boolean,
  money_in_emails_format: string,
  money_with_currency_in_emails_format: string,
  eligible_for_payments: boolean,
  requires_extra_payments_agreement: boolean,
  password_enabled: boolean,
  has_storefront: boolean,
  eligible_for_card_reader_giveaway: boolean | null,
  finances: boolean,
  setup_required: boolean,
  force_ssl: boolean,
};