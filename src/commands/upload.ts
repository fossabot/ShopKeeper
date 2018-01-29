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

import {getEnvironments, getUserDefinedEntity} from '../config';
import {errNoValidConfig} from '../error';
import {ShopifyClient} from '../http/client';
import {ShopifyLogger} from '../logging';
import {stageZero} from '../stages';
import {Config, ConsoleCommand} from '../types/config';

const logging = new ShopifyLogger();

export const upload: ConsoleCommand =
    (config: Config|null, args: ParsedArgs) => {
      if (!config) {
        throw errNoValidConfig();
      }

      // let's only support a single env for right now
      const environments = getEnvironments(config, args, {required: true});
      const [store] = environments;
      const client = new ShopifyClient(store);

      return stageZero(client)
          .then(stageZeroResults => {
            const {shop, pages, products, countries} = stageZeroResults;
            const entity = getUserDefinedEntity(store, args, {required: true});

            logging.logStageStart(`Merging remote and local data...`, 1);

            console.log(entity);
          })
          .then(() => 0);
    };