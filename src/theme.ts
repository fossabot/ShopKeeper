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

const chalk = require('chalk');

export const colorError = chalk.red;
export const colorWarning = chalk.yellow;
export const colorSuccess = chalk.green;

export const colorType = colorWarning.bold.underline;
export const colorPath = colorWarning.underline;
export const colorURL = chalk.cyan.underline;
export const colorHeader = colorType;

export const colorCommandHeader = colorHeader;
export const colorCommandName = colorURL;
export const colorCommandDesc = colorSuccess;
export const colorAsciiArt = colorSuccess;

export const colorAppName = chalk.yellow;
export const colorAppVersion = colorURL;