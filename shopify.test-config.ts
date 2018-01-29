const path = require('path');

import {Config, Config$Unsafe, Config$User} from './src/types/config';
import {RawRenderEngine} from './src/renderers/raw';

const workspacePath = path.resolve(__dirname, 'workspace-example');

const ShopifyConfig: Config$User = {
    data: path.join(workspacePath, 'index.ts'),

    templates: {
        path: path.join(workspacePath, 'templates'),
        engines: [
            new RawRenderEngine({}),
        ]
    },

    stores: {
        'testing': {
            url: process.env.SHOPIFY_STORE_DOMAIN,
            apiKey: process.env.STORE_KEY,
            password: process.env.STORE_SECRET,
        },
    },
};

module.exports = ShopifyConfig;