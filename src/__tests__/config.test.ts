import {ParsedArgs} from 'minimist';

import {getEnvironments} from '../config';
import {testCreateConfig, testCreateParsedArgs, testCreateStore} from '../testing/data';
import {Store} from '../types/store';

describe('Configuration', () => {
  describe('Internal Helpers', () => {
    describe('getEnvironments', () => {
      it('generally works', () => {
        const config = testCreateConfig();
        const args: ParsedArgs = {
          '_': [],
          'e': 'testing',
        };

        const results = getEnvironments(config, args, {});
        expect(results).toHaveLength(1);
      });

      describe('No environments given', () => {
        it('works without environments, when none are required', () => {
          const config = testCreateConfig({stores: {}});
          const args = testCreateParsedArgs();
          const results = getEnvironments(config, args, {
            required: false,
            multiple: false,
          });

          expect(results).toHaveLength(0);
        });

        it('fails without environments, when one is required', () => {
          expect(() => {
            const config = testCreateConfig({
              stores: {},
            });

            const args = testCreateParsedArgs();
            getEnvironments(config, args, {
              required: true,
              multiple: false,
            });
          }).toThrowErrorMatchingSnapshot();
        });
      });

      describe('Single environment given', () => {
        const config = testCreateConfig();

        it('fails when an environment name cannot be found', () => {
          expect(() => {
            const args = testCreateParsedArgs({'e': 'noexist'});

            getEnvironments(config, args, {});
          }).toThrowErrorMatchingSnapshot();
        });
      });

      describe('Multiple environments given', () => {
        const config = testCreateConfig();
        const args = testCreateParsedArgs({
          'e': 'testing,testing2',
        });

        config.stores['testing2'] = testCreateStore();

        it('fails when multiple envs selected, but multiple are disallowed',
           () => {
             expect(() => {
               getEnvironments(config, args, {
                 required: true,
                 multiple: false,
               });
             }).toThrowErrorMatchingSnapshot();
           });

        it('returns multiple environments properly', () => {
          const results = getEnvironments(config, args, {
            required: true,
            multiple: true,
          });

          expect(results).toHaveLength(2);
          expect(results[0]).toBeInstanceOf(Store);
          expect(results[1]).toBeInstanceOf(Store);
        });
      });
    });
  });
});