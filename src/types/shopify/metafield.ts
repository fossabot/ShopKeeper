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

import * as CoreTypes from '../base';

export enum MetafieldType {
  String,
  Integer
}
export type Metafield<NS extends string> =
    CoreTypes.Indexable&CoreTypes.Date$CreatedAt&CoreTypes.Date$UpdatedAt&{
      namespace: NS,
      key: string,
      value: string | number,
      description?: string,
    };

export type Metafield$Raw<NS extends string> =
    CoreTypes.Indexable&CoreTypes.Date$CreatedAt$Raw&
    CoreTypes.Date$UpdatedAt$Raw&{
      namespace: NS,
      key: string,
      value: string,
      value_type: MetafieldType,
      description: string | null,
    };