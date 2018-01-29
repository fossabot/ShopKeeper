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

export type Redirect$Raw = Indexable&Redirect$User;
export type Redirect$User = {
  path: string; target: string;
};

export class RedirectItem extends ShopifyItem<Redirect$Raw, Redirect$Raw> {
  itemType = ShopifyTypes.Redirect;

  constructor(store: Store, data: Redirect$Raw) {
    super(store, data);
    this.data = data;

    store.registerToCache(this);
  }

  mergeToRaw(): Redirect$Raw {
    return this.rawData;
  }
}
