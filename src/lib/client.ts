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

export * from '../types/index';
export * from '../renderers/index';

import {Handle, LocalShopifyItem, ShopifyTypes} from '../types/base';
import {OptionData$User} from '../types/shopify/option';
import {ProductData$LocalOnly} from '../types/shopify/product';
import {VariantData$User} from '../types/shopify/variant';

export class Product<H extends Handle> extends
    LocalShopifyItem<ProductData$LocalOnly<H>> {
  itemType = ShopifyTypes.Product;
  data: ProductData$LocalOnly<H>;
}

export class Option extends LocalShopifyItem<OptionData$User> {
  itemType = ShopifyTypes.Option;
  data: OptionData$User;
}

export class Variant<H extends Handle> extends
    LocalShopifyItem<VariantData$User<H>> {
  itemType = ShopifyTypes.Variant;
  data: VariantData$User<H>;
}

export type Helpers$MakeOptions$Option = {
  name: string; values: string[];
};
function makeOptions(...options: Helpers$MakeOptions$Option[]): Option[] {
  if (options.length > 3) {
    throw new Error(`makeOptions Error: Maximum allowed is three (3)`);
  }

  if (options.length === 0) {
    // TODO: Possibly prefer to create the Shopify default instead?
    throw new Error(`makeOptions Error: You must provide at least one option`);
  }

  return options.map((option) => new Option(option));
}

export type Helpers$MakeVariants$Callback = (options: string[]) =>
    VariantData$User<Handle>;
export type Helpers$MakeVariants$Result = {
  unresolvedVariants: Array<Variant<Handle>>; variants: never[];
  options: Option[];
};

export function makeVariants(
    rawOptions: Helpers$MakeOptions$Option[],
    cb: Helpers$MakeVariants$Callback): Helpers$MakeVariants$Result {
  const generatedOptionMap: string[][] = [];
  const options = makeOptions(...rawOptions);

  const hasSecondary = options.length >= 2;
  const hasTertiary = options.length === 3;

  options[0].data.values.forEach((firstOption: string) => {
    if (!hasSecondary) return generatedOptionMap.push([firstOption]);

    return options[1].data.values.forEach((secondOption: string) => {
      if (!hasTertiary) {
        return generatedOptionMap.push([firstOption, secondOption]);
      }

      return options[2].data.values.forEach((thirdOption: string) => {
        generatedOptionMap.push([firstOption, secondOption, thirdOption]);
      });
    });
  });

  const resultVariants: Array<Variant<Handle>> = [];
  const rawProcessedVariants: Array<Partial<VariantData$User<Handle>>> =
      generatedOptionMap.map((optionList) => cb(optionList));
  rawProcessedVariants.forEach(
      (data: Partial<VariantData$User<Handle>>, index: number) => {
        const currentVariantOptions = generatedOptionMap[index];
        const final = new Variant({
          title: currentVariantOptions.join(' / '),
          options: currentVariantOptions,
          ...data,
        });

        resultVariants.push(final);
      });

  return {
    unresolvedVariants: resultVariants,
    options,
    variants: [],
  };
}