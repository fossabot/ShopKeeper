const path = require('path');
import {Config$User} from './src/types/config';
import {RenderEngine$Raw} from './src/renderers/raw';

const workspacePath = path.resolve(__dirname, 'workspace-example');

export = {
    data: path.join(workspacePath, 'index.ts'),

    templates: {
        path: path.join(workspacePath, 'templates'),
        engines: [
            new RenderEngine$Raw({}),
        ]
    },

    stores: {
        'testing': {
            url: process.env.SHOPIFY_STORE_DOMAIN,
            apiKey: process.env.STORE_KEY,
            password: process.env.STORE_SECRET,
        },
    },
} as Config$User;
