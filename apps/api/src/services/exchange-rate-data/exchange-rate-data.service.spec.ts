import { Logger } from '@nestjs/common';

import { ExchangeRateDataService } from './exchange-rate-data.service';

describe('ExchangeRateDataService', () => {
  let exchangeRateDataService: ExchangeRateDataService;

  beforeEach(() => {
    exchangeRateDataService = new ExchangeRateDataService(
      null,
      null,
      null,
      null
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('toCurrency', () => {
    it('should return 0 if value is 0', () => {
      expect(exchangeRateDataService.toCurrency(0, 'USD', 'EUR')).toBe(0);
    });

    it('should return the value and warn if fromCurrency is null', () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(exchangeRateDataService.toCurrency(100, null, 'EUR')).toBe(100);
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=null, toCurrency=EUR',
        'ExchangeRateDataService'
      );
    });

    it('should return the value and warn if fromCurrency is undefined', () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(exchangeRateDataService.toCurrency(100, undefined, 'EUR')).toBe(
        100
      );
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=undefined, toCurrency=EUR',
        'ExchangeRateDataService'
      );
    });

    it('should return the value and warn if toCurrency is null', () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(exchangeRateDataService.toCurrency(100, 'USD', null)).toBe(100);
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=USD, toCurrency=null',
        'ExchangeRateDataService'
      );
    });

    it('should return the value and warn if toCurrency is undefined', () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(exchangeRateDataService.toCurrency(100, 'USD', undefined)).toBe(
        100
      );
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=USD, toCurrency=undefined',
        'ExchangeRateDataService'
      );
    });

    it('should return the value if fromCurrency equals toCurrency', () => {
      expect(exchangeRateDataService.toCurrency(100, 'EUR', 'EUR')).toBe(100);
    });
  });

  describe('toCurrencyAtDate', () => {
    it('should return 0 if value is 0', async () => {
      expect(
        await exchangeRateDataService.toCurrencyAtDate(
          0,
          'USD',
          'EUR',
          new Date()
        )
      ).toBe(0);
    });

    it('should return undefined and warn if fromCurrency is null', async () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(
        await exchangeRateDataService.toCurrencyAtDate(
          100,
          null,
          'EUR',
          new Date()
        )
      ).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=null, toCurrency=EUR',
        'ExchangeRateDataService'
      );
    });

    it('should return undefined and warn if toCurrency is undefined', async () => {
      const warnSpy = jest.spyOn(Logger, 'warn').mockImplementation();

      expect(
        await exchangeRateDataService.toCurrencyAtDate(
          100,
          'USD',
          undefined,
          new Date()
        )
      ).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(
        'Missing currency: fromCurrency=USD, toCurrency=undefined',
        'ExchangeRateDataService'
      );
    });
  });
});
