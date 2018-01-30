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

import {ShopifyLogger} from './logging';
import {colorPath, colorType} from './theme';
import {ShopifyTypes} from './types/base';

const logging = new ShopifyLogger();

export class ConfigError extends Error {}

export function errNoValidConfig() {
  return new ConfigError(
      `This command requires a valid configuration. ` +
      `Verify '${colorPath('shopify.config.js')}' exists and is valid`);
}

export function errUnknownShopifyType(type: string) {
  return new Error(`Fatal Error: Unknown Shopify type '${colorType(type)}'.`);
}

export function errConfigInvalidEntry(key: string) {
  return new ConfigError(`Invalid '${colorType(key)}' configuration provided`);
}

export function errClientInvalidResult(type: ShopifyTypes) {
  return new Error(`Failed to retrieve items of type '${colorType(type)}'`);
}

export function errInvalidEntityPath(path: string) {
  return new Error(`Invalid entity path provided: '${
      colorPath(path)}' (example: 'collections/featured')`);
}

export function handlePromiseError(e: Error) {
  logging.error(e);
}