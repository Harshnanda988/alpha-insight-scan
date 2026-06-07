/**
 * Indicator Service
 * Responsibilities: Pure math calculations for technical indicators from OHLCV data.
 */

export const indicatorService = {
  /**
   * Calculate Relative Strength Index (RSI)
   */
  calculateRSI(prices: number[], period: number = 14): number | null {
    if (prices.length <= period) return null;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - diff) / period;
      }
    }

    if (avgLoss === 0) return avgGain === 0 ? 50 : 100;
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    
    if (isNaN(rsi)) return 50;
    return parseFloat(rsi.toFixed(2));
  },

  /**
   * Calculate Exponential Moving Average (EMA)
   */
  calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }

    return parseFloat(ema.toFixed(2));
  },

  /**
   * Calculate Simple Moving Average (SMA)
   */
  calculateSMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;
    const slice = prices.slice(prices.length - period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return parseFloat((sum / period).toFixed(2));
  },

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(prices: number[], fast: number = 12, slow: number = 26, signal: number = 9) {
    const emaFast = this.calculateEMA(prices, fast);
    const emaSlow = this.calculateEMA(prices, slow);

    if (emaFast === null || emaSlow === null) return null;

    const macdLine = emaFast - emaSlow;
    // Note: To calculate signal line correctly, we need historical MACD lines
    // For now, returning basic MACD line
    return {
      macd: parseFloat(macdLine.toFixed(2)),
      emaFast,
      emaSlow
    };
  }
};
