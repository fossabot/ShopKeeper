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

import * as Inventory from './types/inventory';

type ShopKeeperDefaultsConfig = {
  shipping: {
    grams: number,
    weight: number,
    weightUnit: Inventory.ShippingWeightUnit,
  },

  inventory: {
    requireShipping: boolean,
    fulfillmentService: Inventory.InventoryFulfillment,
    shippingManager: Inventory.InventoryManager,
    shippingPolicy: Inventory.InventoryPolicy,

    // Note this is the only optional property. We will
    // not specify it unless the user implicitly defines
    // it as it's possible to destroy inventory data.
    quantityAvailable?: number,
  },
};

/**
 * These are defaults for the entirety of the Shopify
 * platform as defined by ShopKeeper. These values are
 * then extended by the user configuration to allow
 * for modification of defaults otherwise outside of
 * the user's control.
 */
export const GLOBAL_SHOPKEEPER_DEFAULTS = {
  shipping: {

  },

  inventory: {

  }

};