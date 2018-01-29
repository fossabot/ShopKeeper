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

import {errNoValidConfig} from '../error';
import {ShopifyClient} from '../http/client';
import {ShopifyLogger} from '../logging';
import * as colors from '../theme';
import {ShopifyTypes} from '../types/base';
import {Config, ConsoleCommand} from '../types/config';
import {ShopItem} from '../types/shopify/shop';

const table = require('cli-table2');
const logging = new ShopifyLogger();

enum EnvTestResult {
  Success = '✓ Success',
  Failed = '✗ Failed',
}

/**
 * This command is used to quickly validate that there are
 * no connection issues to the Shopify domain, and that the
 * API credentials given are valid.
 *
 * In reality, this command retrieves information about the
 * [[ShopItem]], available at `/admin/shop.json`.
 *
 * @param {Config|null} config  The user's configuration (if valid and parsable)
 * @param {ParsedArgs}  args    CLI arguments given by the user
 *
 * @returns {number}  The command's status code to return to the host
 */
export const envs: ConsoleCommand = (config: Config|null) => {
  if (!config) {
    throw errNoValidConfig();
  }

  const customCatchFn = () => null;  // noop
  const promiseQueue: Array<Promise<ShopItem[]|null>> = [];
  const environments = config.stores;
  const environmentNames = Object.keys(environments);

  const environmentCount = environmentNames.length;
  const envsArePlural = environmentCount > 1;

  logging.logStageStart(
      colors.colorCommandDesc(
          `Verifying connectivity and API credentials for ${
              colors.colorCommandHeader(environmentNames.length)} store` +
          (envsArePlural ? 's' : '')),
      0);
  logging.logStageMessage(' ');

  const tableResult = new table({
    head: ['Name', 'URL', 'Status'].map(i => colors.colorHeader(i)),
  });

  environmentNames.forEach((storeName) => {
    const env = environments[storeName];
    const client = new ShopifyClient(env);

    const resolvePromise =
        client.fetch<ShopItem>(ShopifyTypes.Shop).catch(customCatchFn);

    promiseQueue.push(resolvePromise);
  });

  return Promise.all(promiseQueue)
      .then((results) => {
        results.forEach((result, i) => {
          let status = EnvTestResult.Failed;

          if (result !== null) status = EnvTestResult.Success;

          const envName = environmentNames[i];
          const env = environments[envName];

          tableResult.push([
            colors.colorSuccess(envName),
            colors.colorURL(env.data.url),
            (status === EnvTestResult.Failed) ? colors.colorError(status) :
                                                colors.colorSuccess(status),
          ]);
        });

        const tableLines = tableResult.toString().split('\n');
        tableLines.forEach((line: string) => logging.logStageMessage(line));
      })
      .then(() => 0);
};