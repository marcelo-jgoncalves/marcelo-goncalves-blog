
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
};

describe('logger', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.LOG_LEVEL;
    delete process.env._X_AMZN_TRACE_ID;
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  function importLogger(level?: string) {
    if (level) process.env.LOG_LEVEL = level;
    // require() (not import) is needed here: the module must be re-executed
    // on every call after jest.resetModules(), so the logger re-reads
    // LOG_LEVEL from scratch on every test.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./logger').logger;
  }

  describe('output format', () => {
    it('emits valid JSON with timestamp, level, message', () => {
      const logger = importLogger('DEBUG');
      logger.info('test_event', { requestId: 'abc' });

      const raw = consoleSpy.log.mock.calls[0][0];
      const parsed = JSON.parse(raw);
      expect(parsed.level).toBe('INFO');
      expect(parsed.message).toBe('test_event');
      expect(parsed.requestId).toBe('abc');
      expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('spreads context fields to root of JSON entry', () => {
      const logger = importLogger('DEBUG');
      logger.debug('event', { foo: 'bar', count: 42 });

      const parsed = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(parsed.foo).toBe('bar');
      expect(parsed.count).toBe(42);
    });

    it('works without context', () => {
      const logger = importLogger('DEBUG');
      logger.info('no_context');

      const parsed = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(parsed.message).toBe('no_context');
    });
  });

  describe('X-Ray trace ID correlation', () => {
    it('extracts traceId from _X_AMZN_TRACE_ID when present', () => {
      process.env._X_AMZN_TRACE_ID = 'Root=1-5e1b4151-5ac6c58fbe39d72f9b00f9bb;Parent=585b9a4a3b1d1c52;Sampled=1';
      const logger = importLogger('DEBUG');
      logger.info('event');

      const parsed = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(parsed.traceId).toBe('1-5e1b4151-5ac6c58fbe39d72f9b00f9bb');
    });

    it('omits traceId when _X_AMZN_TRACE_ID is absent (local/test runs)', () => {
      const logger = importLogger('DEBUG');
      logger.info('event');

      const parsed = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(parsed.traceId).toBeUndefined();
    });
  });

  describe('log level filtering', () => {
    it('defaults to INFO — suppresses DEBUG', () => {
      const logger = importLogger(); // no LOG_LEVEL, defaults to INFO
      logger.debug('should_be_suppressed');
      logger.info('should_appear');

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(parsed.message).toBe('should_appear');
    });

    it('DEBUG level emits all messages', () => {
      const logger = importLogger('DEBUG');
      logger.debug('d');
      logger.info('i');
      logger.warn('w');
      logger.error('e');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);   // debug + info
      expect(consoleSpy.error).toHaveBeenCalledTimes(2); // warn + error
    });

    it('WARN level suppresses DEBUG and INFO', () => {
      const logger = importLogger('WARN');
      logger.debug('skip');
      logger.info('skip');
      logger.warn('emit');
      logger.error('emit');

      expect(consoleSpy.log).toHaveBeenCalledTimes(0);
      expect(consoleSpy.error).toHaveBeenCalledTimes(2);
    });

    it('ERROR level only emits errors', () => {
      const logger = importLogger('ERROR');
      logger.debug('skip');
      logger.info('skip');
      logger.warn('skip');
      logger.error('emit');

      expect(consoleSpy.log).toHaveBeenCalledTimes(0);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('is case-insensitive for LOG_LEVEL env var', () => {
      const logger = importLogger('warn');
      logger.info('skip');
      logger.warn('emit');

      expect(consoleSpy.log).toHaveBeenCalledTimes(0);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('console routing', () => {
    it('routes WARN and ERROR to console.error', () => {
      const logger = importLogger('DEBUG');
      logger.warn('w');
      logger.error('e');

      expect(consoleSpy.error).toHaveBeenCalledTimes(2);
      expect(consoleSpy.log).toHaveBeenCalledTimes(0);
    });

    it('routes DEBUG and INFO to console.log', () => {
      const logger = importLogger('DEBUG');
      logger.debug('d');
      logger.info('i');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
      expect(consoleSpy.error).toHaveBeenCalledTimes(0);
    });
  });
});
