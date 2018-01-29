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

import * as CoreTypes from '../base';
import {Store} from '../store';
import {Country$Raw} from './country';


export type Province$Raw<CC extends string> =
    CoreTypes.RawShopifyData&CoreTypes.Indexable&{
      country_id: Country$Raw<CC>,
      name: string,
      tax: number,
      tax_name: string | null,
      tax_type: string | null,
      shipping_zone_id: number | null,
      tax_percentage: number,
    };


export class ProvinceItem<CC extends string> extends
    CoreTypes.ShopifyItem<Province$Raw<CC>, Province$Raw<CC>> {
  itemType = CoreTypes.ShopifyTypes.Province;

  constructor(store: Store, data: Province$Raw<CC>) {
    super(store, data);
    this.data = data;

    store.registerToCache(this);
  }

  mergeToRaw(): Province$Raw<CC> {
    return this.rawData;
  }
}