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

import * as errors from './error';
import {ShopifyClient} from './http/client';
import {ShopifyLogger} from './logging';
import {colorType} from './theme';
import * as CoreTypes from './types/base';
import {Handle, ShopifyTypes} from './types/base';
import {CountryItem} from './types/shopify/country';
import {PageItem} from './types/shopify/page';
import {ProductItem} from './types/shopify/product';
import {ShopItem} from './types/shopify/shop';


export type StageZeroResult = Promise<{
  shop: ShopItem,
  pages: Array<PageItem<CoreTypes.Handle>>,
  products: Array<ProductItem<CoreTypes.Handle>>,
  countries: Array<CountryItem<string>>,
}>;

export type StageZeroPromiseResult = [
  ShopItem[] | null, Array<PageItem<Handle>>| null,
  Array<CountryItem<string>>| null, Array<ProductItem<CoreTypes.Handle>>| null
];

export const stageZero = (client: ShopifyClient): StageZeroResult => {
  const logger = new ShopifyLogger();

  const stageZeroMsg = `Fetching ${colorType('Countries')} and ` +
      `${colorType(`Products`)}, ` +
      `${colorType(`Pages`)}, and ` +
      `${colorType(`Provinces`)}`;

  logger.logStageStart(stageZeroMsg, 0);

  return Promise
      .all([
        client.fetch<ShopItem>(ShopifyTypes.Shop),
        client.list<PageItem<Handle>>(ShopifyTypes.Page),
        client.list<CountryItem<string>>(ShopifyTypes.Country),
        client.list<ProductItem<string>>(ShopifyTypes.Product),
      ])
      .then((results: StageZeroPromiseResult) => {
        const [shopResults, pageResults, countryResults, productResults] =
            results;

        if (countryResults === null) {
          throw errors.errClientInvalidResult(ShopifyTypes.Country);
        }

        if (productResults === null) {
          throw errors.errClientInvalidResult(ShopifyTypes.Product);
        }

        if (shopResults === null) {
          throw errors.errClientInvalidResult(ShopifyTypes.Shop);
        }

        if (pageResults === null) {
          throw errors.errClientInvalidResult(ShopifyTypes.Page);
        }

        const reduceCountFn = ((n: number) => (n + 1));
        const counters = {
          Shop: 1,
          Pages: pageResults.length,
          Products: 0,
          Variants: 0,
          Options: 0,
          Countries: 0,
          Provinces: 0,
        };

        productResults.forEach((product) => {
          counters.Products += 1;
          counters.Options =
              product.data.options.reduce(reduceCountFn, counters.Options);
          counters.Variants =
              product.data.variants.reduce(reduceCountFn, counters.Variants);
        });

        countryResults.forEach((country) => {
          counters.Countries += 1;
          counters.Provinces =
              country.data.provinces.reduce(reduceCountFn, counters.Provinces);
        });

        logger.logStageItemCount(counters);
        logger.logStageMessage(' ');

        return {
          shop: shopResults[0],
          pages: pageResults,
          countries: countryResults,
          products: productResults,
        };
      });
};