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
import {Handle, ShopifyTypes} from '../base';
import {Store} from '../store';

import {ProductItem} from './product';


export type OptionData$User = {
  name: string; values: string[];
  product?: ProductItem<Handle>;
};

export type OptionData$Raw = CoreTypes.Indexable&CoreTypes.Positional$Raw&{
  name: string;
  values: string[];
  product_id: number;
};

export class OptionItem<H extends CoreTypes.Handle> extends
    CoreTypes.ShopifyItem<OptionData$Raw, OptionData$User> {
  itemType = ShopifyTypes.Option;

  constructor(store: Store, data: OptionData$Raw) {
    super(store, data);
    this.data = data;

    store.registerToCache(this);
  }

  mergeToRaw(): OptionData$Raw {
    return this.rawData;
  }
}