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

import {ParsedArgs} from 'minimist';

import {getEnvironments} from '../config';
import {errNoValidConfig} from '../error';
import {ShopifyClient} from '../http/client';
import {stageZero} from '../stages';
import {Config, ConsoleCommand} from '../types/config';

export const sync: ConsoleCommand = (config: Config|null, args: ParsedArgs) => {
  if (!config) {
    throw errNoValidConfig();
  }

  const envs = getEnvironments(config, args, {required: true});
  if (!envs || envs.length === 0) throw new Error('No environments found');

  const environment = envs[0];
  const client = new ShopifyClient(environment);

  /**
   * ..:: STAGE 0 ::..
   *
   * Load the Countries (and Provinces) into the cache
   * so they can be resolved first.
   */

  return stageZero(client).then(() => 0);
};
