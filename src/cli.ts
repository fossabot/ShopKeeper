#!/usr/bin/env node

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

require('isomorphic-fetch');

import {ParsedArgs} from 'minimist';

import {envs} from './commands/envs';
import {sync} from './commands/sync';
import {upload} from './commands/upload';
import {DEFAULT_CONFIG_NAME, loadConfig} from './config';
import {handlePromiseError} from './error';
import {ShopifyLogger} from './logging';
import {colorAppVersion, colorAsciiArt, colorCommandDesc, colorCommandHeader, colorCommandName, colorWarning, colorType, colorPath,} from './theme';
import {Config, ConsoleCommand} from './types/config';


const path = require('path');
const console = new ShopifyLogger();

process.on('unhandledRejection', handlePromiseError);

// Import the configuration loading utility
// Read information from the `package.json`
const packagePath = path.resolve(__dirname, '../package.json');
const {name, version} = require(packagePath);
const packageNiceName = name.split('/')[1] || name;

// Parse the user's arguments
const minimist = require('minimist');
const userArgs = minimist(process.argv.slice(2));

// Import our commands
const commands: {[name: string]: ConsoleCommand} = {
  envs,
  sync,
  upload,
};

// Determine the user's first unnamed param
const calledCommand = (userArgs as ParsedArgs)['_'][0] || null;

const HELP_MESSAGE =
    colorAsciiArt(`
 ___ _             _  __                      
/ __| |_  ___ _ __| |/ /___ ___ _ __  ___ _ _ 
\\__ \\ ' \\/ _ \\ '_ \\ ' </ -_) -_) '_ \\/ -_) '_|
|___/_||_\\___/ .__/_|\\_\\___\\___| .__/\\___|_|  
             |_|  by ${colorWarning('Sleep EZ')}  |_|  v. ${
        colorAppVersion(version)}          

`) +
    `  ${colorCommandHeader(`Usage:`)}  ${
        packageNiceName} <command> [path] [-e|--env=<store>] [-t|--tags=<tags>]
        
  ${colorCommandHeader(`Commands:`)}
    ${colorCommandName('envs')}        ${
        colorCommandDesc('Display and test Shopify store credentials')}
    ${colorCommandName('sync')}        ${
        colorCommandDesc(
            'Compare and synchronize changes between local and a remote store')}
    ${colorCommandName('upload')}      ${
        colorCommandDesc('Publish an item to remote Shopify stores')}
    `;

function callCommand(config: Config|null, calledCommand: string): void {
  // Return if being called directly
  if (require.main !== module) process.exit(0);

  // Warn the user when we can't find their configuration
  if (!config) {
    console.warn(
        `No valid ShopKeeper configuration ` +
        `was found (${colorPath(DEFAULT_CONFIG_NAME)})`);
  }

  // Check if the command isn't known
  if (!calledCommand || !(calledCommand in commands)) {
    if (calledCommand.length > 0) {
      console.error(`Command not found: ${colorType(calledCommand)}`);
    }

    // Display the help message
    console.log(HELP_MESSAGE);
    process.exit(1);
  }

  // Find and run the command, imported commands are all Promises
  try {
    const commandFn = commands[calledCommand];

    commandFn(config, userArgs)
        .then((result: number) => process.exit(result))
        .catch((e: Error) => {
          throw e;
        });
  } catch (e) {
    handlePromiseError(e);
  }
}

loadConfig(process.cwd()).then((config: Config|null|Error) => {
  if (config instanceof Error) {
    throw config;
  }

  callCommand(config, calledCommand || '');
});  //.catch(handlePromiseError);