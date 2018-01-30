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

import {errConfigInvalidEntry, errInvalidEntityPath, errNoValidConfig, errUnknownShopifyType} from './error';
import {GenericShopifyType} from './http/client';
import {GenericRenderEngine, RenderEngine} from './renderers/lib';
import {colorPath, colorType} from './theme';
import {ShopifyTypes} from './types/base';
import {Config, Config$Templates, Config$Unsafe} from './types/config';
import {Store, StoreData$Raw} from './types/store';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

export const DEFAULT_CONFIG_NAME = 'shopify.config.ts';

export function loadConfig(dir: PathLike): Promise<Config|null|Error> {
  const userConfigPath = path.join(dir, DEFAULT_CONFIG_NAME);
  let untrustedUserConfig: Config$Unsafe|null = require(userConfigPath);

  try {
    untrustedUserConfig = require(userConfigPath);

    if (!(untrustedUserConfig instanceof Object)) {
      return Promise.reject(errNoValidConfig());
    }
  } catch (e) {
    return Promise.resolve(null);
  }

  const stores: {[name: string]: Store} = {};
  const unsafeStores: {[name: string]: StoreData$Raw}|string|number|null =
      untrustedUserConfig['stores'] || null;

  let data: PathLike;
  const unsafeData = untrustedUserConfig['data'] || null;

  let templates: Config$Templates;
  const unsafeTemplates: Partial<Config$Templates>|null =
      untrustedUserConfig['templates'] || null;

  if (unsafeStores === null) {
    return Promise.reject(errConfigInvalidEntry('stores'));
  }

  if (unsafeData === null) {
    return Promise.reject(errConfigInvalidEntry('data'));
  }

  if (unsafeTemplates === null) {
    return Promise.reject(errConfigInvalidEntry('templates'));
  }

  for (const unsafeStoreName of Object.keys(unsafeStores)) {
    const unsafeStore: Partial<StoreData$Raw> = unsafeStores[unsafeStoreName];

    if (!unsafeStoreName || !unsafeStores[unsafeStoreName]) {
      const err = new Error(
          `Invalid store name provided: '${chalk.yellow(unsafeStoreName)}'`);
      return Promise.reject(err);
    }

    const requiredKeys = ['url', 'apiKey', 'password'];
    const error: Error|null =
        requiredKeys.reduce((err: Error|null, key: string) => {
          if (err || key in unsafeStore) return err;

          return new Error(
              `Failed to process store ${
                  chalk.cyan(`'${unsafeStoreName}'`)}: ` +
              chalk.yellow(`Required key ${chalk.underline(key)} is missing`));
        }, null);


    // There was an error processing the user's store
    if (error) return Promise.reject(error);

    const url = unsafeStore.url || '';
    const apiKey = unsafeStore.apiKey || '';
    const password = unsafeStore.password || '';

    stores[unsafeStoreName] = new Store({
      url,
      production: unsafeStore.production || false,
      secrets: {
        _key: apiKey,
        _password: password,
      }
    });
  }

  if (!fs.existsSync(unsafeData || '___noexist')) {
    const err = new Error(`Invalid data file provided: '${
        chalk.underline.cyan(unsafeData)}' does not exist or export a default`);

    return Promise.reject(err);
  }

  data = path.resolve(unsafeData);

  const templateRequiredFields = ['path', 'engines'];
  let err: Error|null = null;

  templateRequiredFields.forEach((field) => {
    if (!(field in unsafeTemplates)) {
      err = new Error(`Invalid templates configuration: Missing '${
          colorType(field)}' property`);
    }
  });

  if (err) return Promise.reject(err);

  const unsafeTemplatePath = unsafeTemplates.path;
  const unsafeTemplateEngines = unsafeTemplates.engines;

  if (!unsafeTemplatePath) {
    const err = new Error(`Invalid template path provided at 'templates.path'`);

    return Promise.reject(err);
  }

  if (!Array.isArray(unsafeTemplateEngines)) {
    err = new Error(
        `Invalid array of template engines provided. Please refer to the documentation.`);
  }

  const validRenderEngines: GenericRenderEngine[] = [];

  // Empty array is fine, invalid type is not
  (unsafeTemplateEngines || []).forEach((element, index) => {
    if (!(element instanceof RenderEngine)) {
      err = new Error(`Render engine in array position ${
          colorType(index)} is not a RenderEngine type`);
    } else {
      validRenderEngines.push(element);
    }
  });

  if (err) return Promise.reject(err);

  templates = {
    path: path.resolve(unsafeTemplatePath),
    engines: validRenderEngines,
  };

  const finalConfig: Config = {
    stores,
    data,
    templates,
  };

  return Promise.resolve(finalConfig);
}

export type GetEnvParams = {
  required?: boolean,
  multiple?: boolean,
  tags?: boolean,
};

export function getEnvironments(
    config: Config, args: ParsedArgs, opts: GetEnvParams): Store[] {
  const {required = false, multiple = false} = opts;

  const resolvedEnvironments: Store[] = [];
  const envString = args['env'] || args['e'] || null;
  const envStrings =
      (!envString) ? [] : envString.split(',').map((i: string) => i.trim());

  const hasOneValidEnv = envStrings.some((str: string) => (str.length > 0));

  if (required && !hasOneValidEnv) {
    throw new Error(
        `A valid environment name ${chalk.underline('MUST')} be provided`);
  }

  envStrings.forEach((environmentName: string) => {
    const environment = config.stores[environmentName];

    if (!environment) {
      throw new Error(`No environment named ${
          chalk.underline.yellow(environmentName)} found`);
    }

    resolvedEnvironments.push(environment);
  });

  if (!multiple && resolvedEnvironments.length > 1) {
    throw new Error(
        `Multiple environments are not supported for ` +
        `this command (${resolvedEnvironments.length} were given)`);
  }

  return resolvedEnvironments;
}

export type EntityPathResult = {
  type: ShopifyTypes|undefined; entity: GenericShopifyType | undefined;
};

export type EntityPathOpts = {
  required: boolean; allowEntireType: boolean;
};
export function getUserDefinedEntity(
    store: Store, args: ParsedArgs,
    userOptions: Partial<EntityPathOpts>): EntityPathResult {
  const opts: EntityPathOpts = {
    allowEntireType: false,
    required: false,
    ...userOptions,
  };

  const path: string|undefined = args['_'][1];

  if (!path) {
    if (opts.required) {
      throw new Error(
          `This command requires an entity path (example: 'collections/featured')`);
    }

    return {type: undefined, entity: undefined};
  }

  const pathParts = (path).replace('\\', '/').split('/');
  const pathPartLen = pathParts.length;

  // Verify that the number of path parts is in the expected range
  if (pathPartLen < 1 || pathPartLen > 2) {
    if (opts.required) {
      throw errInvalidEntityPath(path);
    }

    return {entity: undefined, type: undefined};
  }

  // Next, make sure the type they've given actually exists
  const itemType = pathParts[0];
  const itemIdentifier = pathParts[1] || undefined;

  if (!Object.values(ShopifyTypes).includes(itemType)) {
    throw errUnknownShopifyType(itemType);
  }

  // If a specific entity (and not the entire type) must be specified...
  if (!opts.allowEntireType && pathPartLen !== 2) {
    throw new Error(`This command does not support generic entities: '${
        colorPath(path)}' is missing an item handle/ID`);
  }

  const entity = (isNaN(Number(itemIdentifier))) ?
      store.cache.findByHandle(
          itemType as ShopifyTypes, itemIdentifier as string) :
      store.cache.findById(itemType as ShopifyTypes, Number(itemIdentifier));

  return {
    type: itemType as ShopifyTypes,
    entity,
  };
}