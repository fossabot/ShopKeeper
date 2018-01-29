import {padStr, ShopifyLogger} from '../logging';
import {UndefinedStackError} from '../testing/data';

describe('Logging Utilities', () => {
  it('padStr()', () => {
    type PadStrTestArr = [string, number, string];
    const test1: PadStrTestArr = ['hello', 10, 'hello     '];
    const test2: PadStrTestArr = ['verylongword', 2, 'verylongword'];
    const test3: PadStrTestArr = ['exactlen', 8, 'exactlen'];

    expect(padStr(test1[0], test1[1])).toEqual(test1[2]);
    expect(padStr(test2[0], test2[1])).toEqual(test2[2]);
    expect(padStr(test3[0], test3[1])).toEqual(test3[2]);
  });

  it('is instantiable', () => {
    const logger = new ShopifyLogger();

    expect(logger).toBeTruthy();
    expect(logger).toBeInstanceOf(ShopifyLogger);
  });

  describe('Common Functions', () => {
    it('log()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        info: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.log('Hello, world - %s', 'log');

      expect(global.console.info).toMatchSnapshot();
      expect(global.console.log).toMatchSnapshot();
    });

    it('info()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        info: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.info('I have some info! - %s', 'info');

      expect(global.console.info).toMatchSnapshot();
      expect(global.console.log).toMatchSnapshot();
    });

    it('warn()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        warn: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.warn('I have a warning! - %s', 'warn');

      expect(global.console.warn).toMatchSnapshot();
      expect(global.console.log).toMatchSnapshot();
    });

    it('error()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        error: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      const customError = new UndefinedStackError('Some error');

      logger.error('I have some info! - %s', 'err');
      logger.error(customError);

      expect(global.console.log).toMatchSnapshot();
      expect(global.console.error).toMatchSnapshot();
      expect((global.console.error as jest.Mock<{}>).mock.calls[1][0])
          .toContain('[E]');
      expect((global.console.error as jest.Mock<{}>).mock.calls[1][0])
          .toContain('Some error');
    });
  });

  describe('Staging', () => {
    it('logStageStart()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        info: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.logStageStart('Hello, world', 0);
      logger.logStageStart('Hello, world', 1);

      // Added to ensure that console.info() is called, not .log()
      expect(global.console.log).toMatchSnapshot();
      expect(global.console.info).toMatchSnapshot();
    });

    it('logStageMessage()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        info: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.logStageMessage('Some more progress');
      logger.logStageMessage('Doing stuff...');

      expect(global.console.log).toMatchSnapshot();
      expect(global.console.info).toMatchSnapshot();
    });

    it('logStageItemCount()', () => {
      global.console = {
        ...global.console,
        log: jest.fn(),
        info: jest.fn(),
      } as Console;

      const logger = new ShopifyLogger();
      logger.logStageItemCount({
        Something: 5,
        Cool: 20,
      });

      expect(global.console.log).toMatchSnapshot();
      expect(global.console.info).toMatchSnapshot();
    });
  });
});