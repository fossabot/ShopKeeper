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

import {GenericShopifyType} from '../http/client';
import {StoreCache} from './cache';

export type StoreData = {
  url: string,
  production: boolean,
  secrets: {
    _key: string,
    _password: string,
  },
};

export type StoreData$Raw = {
  url: string,
  apiKey: string,
  password: string,
  production?: boolean,
};

export class Store {
  cache: StoreCache;
  data: StoreData;

  constructor(data: StoreData) {
    this.data = data;
    this.cache = new StoreCache();
  }

  registerToCache<T extends GenericShopifyType>(elem: T): T {
    return this.cache.register(elem);
  }
}
