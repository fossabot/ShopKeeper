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

import {dateToShopify, getOrNull, getOrUndefined} from '../../lib/typing';
import {Content$HTML, Content$HTML$Raw, Date$CreatedAt, Date$CreatedAt$Raw, Date$PublishedAt, Date$PublishedAt$Raw, Date$UpdatedAt, Date$UpdatedAt$Raw, Handle, Handleable, RawShopifyData, ShopifyData, ShopifyItem, ShopifyTypes, Titled,} from '../base';
import {Store} from '../store';

export type PageData$Raw<H extends Handle> =
    RawShopifyData&Titled&Handleable<H>&Content$HTML$Raw&Date$CreatedAt$Raw&
    Date$UpdatedAt$Raw&Date$PublishedAt$Raw&{
      template_suffix: string | null,
    };

export type PageData<H extends Handle> = ShopifyData&Titled&Handleable<H>&
    Content$HTML&Date$CreatedAt&Date$UpdatedAt&Date$PublishedAt&{
      templateSuffix?: string,
    };

export class PageItem<H extends Handle> extends
    ShopifyItem<PageData$Raw<H>, PageData<H>> {
  itemType = ShopifyTypes.Page;


  constructor(store: Store, data: PageData$Raw<H>) {
    super(store, data);

    const {
      id,
      title,
      handle,
      body_html,
      created_at,
      updated_at,
      published_at,
      template_suffix,
    } = data;

    this.data = {
      id,
      title,
      handle,
      html: body_html,
      template: null,
      templateSuffix: getOrUndefined(template_suffix),
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
      publishedAt: (published_at) ? new Date(published_at) : null,
    };

    store.registerToCache(this);
  }

  mergeToRaw(): PageData$Raw<H> {
    const {
      id,
      title,
      handle,
      template,
      templateSuffix,
      html,
      createdAt,
      updatedAt,
      publishedAt,
    } = this.data;

    return {
      id,
      title,
      handle,
      body_html: getOrNull(html || template) || '',
      template_suffix: getOrNull(templateSuffix),
      created_at: dateToShopify(createdAt),
      updated_at: dateToShopify(updatedAt),
      published_at: dateToShopify(publishedAt),
    };
  }
}