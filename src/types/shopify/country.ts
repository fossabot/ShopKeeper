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

import {Indexable, RawShopifyData, ShopifyItem, ShopifyTypes} from '../base';
import {Store} from '../store';

import {Province$Raw} from './province';


export class CountryItem<CC extends string> extends
    ShopifyItem<Country$Raw<CC>, Country$Raw<CC>> {
  itemType = ShopifyTypes.Country;

  constructor(store: Store, data: Country$Raw<CC>) {
    super(store, data);

    this.data = {...data};
    store.registerToCache(this);
  }

  mergeToRaw() {
    return this.data;
  }
}

export type Country$Raw<CC extends string> = RawShopifyData&Indexable&{
  name: string,
  tax: number,
  code: CC,
  tax_name: string,
  provinces: Array<Province$Raw<CC>>,
};
