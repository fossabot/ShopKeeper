import {errClientInvalidResult, errConfigInvalidEntry, errInvalidEntityPath, errNoValidConfig, errUnknownShopifyType, handlePromiseError} from '../error';
import {UndefinedStackError} from '../testing/data';
import {ShopifyTypes} from '../types/base';


describe('Shared Error Functions', () => {
  it('UnknownShopifyType', () => {
    expect(() => {
      throw errUnknownShopifyType('segap');  // pages
    }).toThrowErrorMatchingSnapshot();
  });

  it('InvalidEntityPath', () => {
    expect(() => {
      throw errInvalidEntityPath('some/path');  // pages
    }).toThrowErrorMatchingSnapshot();
  });

  it('NoValidConfig', () => {
    expect(() => {
      throw errNoValidConfig();
    }).toThrowErrorMatchingSnapshot();
  });

  it('ClientInvalidResult', () => {
    expect(() => {
      throw errClientInvalidResult(ShopifyTypes.Product);
    }).toThrowErrorMatchingSnapshot();
  });

  it('ConfigInvalidEntry', () => {
    expect(() => {
      throw errConfigInvalidEntry('somekey');
    }).toThrowErrorMatchingSnapshot();
  });

  it('Default Promise Handler', () => {
    global.console.error = jest.fn();
    global.console.log = jest.fn();

    const testErr = new UndefinedStackError('Testing');

    handlePromiseError(testErr);
    expect(global.console.log).toMatchSnapshot();
    expect(global.console.error).toMatchSnapshot();
  });
});
