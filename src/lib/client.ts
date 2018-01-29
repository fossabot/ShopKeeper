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

import * as CoreTypes from '../types/base';
import {Handle, LocalShopifyItem, ShopifyTypes} from '../types/base';
import {OptionData$Raw, OptionData$User} from '../types/shopify/option';
import {ProductData$LocalOnly, ProductData$User} from '../types/shopify/product';
import {VariantData$User} from '../types/shopify/variant';


export type Lib$ProductOptions = Array<{name: string, values: string[]}>;

export function generateProductOptions(options: Lib$ProductOptions) {
  const finalOptions: OptionData$Raw[] = [];
  const modifiedOptions = {...options};

  if (Object.keys(options).length > 3) {
    throw new Error(
        'Three option dimensions is the maximum allowed ' +
        'on the Shopify platform');
  }
}

export class Product<H extends Handle> extends
    LocalShopifyItem<ProductData$LocalOnly<H>> {
  itemType = ShopifyTypes.Product;
  data: ProductData$LocalOnly<H>;
}

export class Option<H extends Handle> extends
    LocalShopifyItem<OptionData$User> {
  itemType = ShopifyTypes.Option;
  data: OptionData$User;
}

export class Variant<H extends Handle> extends
    LocalShopifyItem<VariantData$User<H>> {
  itemType = ShopifyTypes.Variant;
  data: VariantData$User<H>;
}


export type Helpers$MakeOptions$Result = {
  unresolvedOptions: Array<Option<Handle>>; options: never[];
};
export type Helpers$MakeOptions$Option = {
  name: string; values: string[];
};
export function makeOptions(...options: Helpers$MakeOptions$Option[]):
    Helpers$MakeOptions$Result {
  if (options.length > 3) {
    throw new Error(`makeOptions Error: Maximum allowed is three (3)`);
  }

  if (options.length === 0) {
    // TODO: Possibly prefer to create the Shopify default instead?
    throw new Error(`makeOptions Error: You must provide at least one option`);
  }

  return {
    unresolvedOptions: options.map((option) => new Option(option)),
    options: [],
  };
}

export type Helpers$MakeVariants$Callback = (options: string[]) =>
    Variant<Handle>;
export type Helpers$MakeVariants$Result = {
  unresolvedVariants: Array<Variant<Handle>>; variants: never[];
};

export function makeVariants(
    options: Array<Option<Handle>>,
    cb: Helpers$MakeVariants$Callback): Helpers$MakeVariants$Result {
  // TODO: Remove me, makes missing params shut up
  if (options) {
    (false) ? cb([]) : cb([]);
  }

  return {
    unresolvedVariants: [],
    variants: [],
  };
}