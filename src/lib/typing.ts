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

// https://github.com/Microsoft/TypeScript/issues/15012#issuecomment-338070277
export type Required<T> = T&{[K in (keyof T)]: T[K]};

export function getOrUndefined<T>(item?: {}|null): T|undefined {
  return (item === null || item === undefined) ? undefined : item as T;
}

export function getOrFail<T>(item: undefined|null|{}): T {
  if (item === null || item === undefined) {
    throw new Error('Failed to fetch expected item');
  }

  return item as T;
}

export function getOrNull<T>(item: undefined|null|T): T|null {
  return (item === null || item === undefined) ? null : item;
}

export function dateOrUndefined(item: string|null): Date|undefined {
  if (item === null || item === undefined) return undefined;

  const date = new Date(item);

  // Not documented in TypeScript, if the date cannot
  // be processed, then it returns a vague object with
  // a .toString() value of 'Invalid Date'. Inspecting
  // with util.inspect() is no help.
  if (date.toString() === 'Invalid Date') {
    return undefined;
  }

  return new Date(item);
}

export function dateToShopify(item: Date): string {
  return item.toISOString();
}