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

import {Handle} from './types/base';
import {PageData} from './types/shopify/page';
import {ProductData$User} from './types/shopify/product';
import {ShopData$Raw} from './types/shopify/shop';

/**
 * This type describes the entirety of the context object
 * that is used for rendering templates. Values that exist
 * in liquid but are not declared have not been implemented
 * because they're not relevant to the scope of ShopKeeper's use.
 *
 * This context attempts to be analogous to Shopify's own Liquid
 * template engine context. This allows for an easy transition and
 * a more familiar API for Shopify website developers.
 *
 * For more detailed information about data provided by
 * the Liquid template engine, a cheat sheet for the objects
 * and their types are available here:
 *    https://www.shopify.com/partners/shopify-cheat-sheet
 */
export type RenderViewContext = {
  /**
   * This value represents the current template type being rendered,
   * typically `product`, `page`, etc. This will also include the
   * `template_suffix` value if it is provided.
   */
  template: string,

  /**
   * This value is the absolute URL to the item that is currently
   * being rendered. This will be a complete URL, including the
   * domain.
   */
  canonical_url: string,

  /**
   * This is the handle of the current element being rendered.
   */
  handle: string|null,

  /**
   * An iterable list of scripts available to be loaded on the
   * page. This utilizes Shopify's `ScriptTag` element.
   */
  scripts: never[],

  /**
   * This object contains a list of all known products, indexed
   * via the product's handle.
   */
  all_products: {[handle: string]: ProductData$User<Handle>},

  /**
   * This object contains a list of all known pages, indexed by the
   * page's handle.
   */
  pages: {[handle: string]: PageData<Handle>},

  /**
   * This is the raw Shop representation as provided by Shopify. This
   * can be useful for dynamically generating contact information,
   * but likely has many other uses.
   */
  shop: ShopData$Raw,

  // Will implement later
  theme: null,
};