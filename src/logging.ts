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

import {colorSuccess} from './theme';

const chalk = require('chalk');

const INDENT_WIDTH = 3;
const INDENT_STAGE_WIDTH = INDENT_WIDTH * 3;

export type UnknownLogData = Array<null|string|number|{}>;
export class ShopifyLogger {
  console: Console;

  constructor() {
    this.console = global.console;
  }

  logStageStart(message: string, stage: number) {
    this.info(`${chalk.bold.red(`Stage ${stage}`)} :: ${message}`);
  }

  logStageMessage(message: string) {
    const indent = ' '.repeat(INDENT_STAGE_WIDTH - 1);
    this.info(indent + `${chalk.cyan('::')} ${message}`);
  }

  logStageItemCount(items: {[type: string]: number}) {
    const itemCount =
        Object.values(items).reduce((a: number, b: number) => (a + b), 0);
    this.logStageMessage(' ');
    this.logStageMessage(chalk.white(
        `${colorSuccess(itemCount)} Items Processed In This Stage:`));

    // Let's quickly sort them for easy readability
    type SortListItem = [string, number];
    const sortedList =
        Object.keys(items)
            .map(
                (itemType):
                    SortListItem => {
                      const count = items[itemType];
                      return [itemType, count];
                    })
            .sort((a: SortListItem, b: SortListItem) => (a[1] - b[1]))
            .reverse();

    sortedList.forEach(([type, count]) => {
      const indent = ' '.repeat(INDENT_STAGE_WIDTH - 1);

      this.info(
          indent +
          `::   ${chalk.white('+')} ${
              chalk.underline.yellow(
                  padStr(type, 11))} : ${chalk.green(count)}`);
    });
  }

  log(data: string, ...args: UnknownLogData) {
    this.console.log(data, ...args);
  }

  info(data: string, ...args: UnknownLogData) {
    this.console.info(chalk.cyan(`[I] ` + data), ...args);
  }

  warn(data: string, ...args: UnknownLogData) {
    this.console.warn(chalk.yellow(`[W] ` + data), ...args);
  }

  error(data: string|Error, ...args: UnknownLogData) {
    let errStr;

    if (data instanceof Error) {
      const stack = (data.stack || '');
      const allButMsg = stack.split('\n').slice(1).join('\n');
      errStr = `${chalk.redBright(data.message.toString())}\n` +
          `${chalk.gray(allButMsg)}`;
    } else {
      errStr = chalk.redBright(data);
    }

    this.console.error(chalk.red(`\n[E] ` + errStr), ...args);
  }
}

export function padStr(content: string, width: number) {
  const left = width - content.length;
  if (left <= 0) return content;

  return content + ' '.repeat(left);
}