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
import {colorPath} from '../theme';
import {RenderEngine} from './lib';

const fs = require('fs');


export type RawRenderOptions = {};
export class RawRenderEngine extends RenderEngine<RawRenderOptions> {
  matchPattern = /.+\.html?/;

  render(path: PathLike) {
    if (!fs.existsSync(path)) {
      return Promise.reject(new Error(
          `Rendering failure: Template '${colorPath(path)}' does not exist`));
    }

    return Promise.resolve(path.toString());
  }
}