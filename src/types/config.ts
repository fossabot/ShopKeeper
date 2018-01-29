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

import {PathLike} from 'fs';
import {ParsedArgs} from 'minimist';

import {RenderEngine} from '../renderers/lib';

import {Store, StoreData$Raw} from './store';

export type ConsoleCommand = (config: Config|null, args: ParsedArgs) =>
    Promise<number>;

export type Config$Templates = {
  path: PathLike,
  engines: Array<RenderEngine<{}>>
};

export type Config$Unsafe = {
  [key: string]: undefined|null|number|string|{}
};

export type Config$Stores = {
  [name: string]: Store
};
export type Config = {
  data: PathLike,
  stores: Config$Stores,
  templates: Config$Templates,
};

export type Config$User = {
  data: PathLike,
  stores: {[name: string]: StoreData$Raw},
  templates: Config$Templates,
};

export type UserConfigData = {
  pages?: null[],
};