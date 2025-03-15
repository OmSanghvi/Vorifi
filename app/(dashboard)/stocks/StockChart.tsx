import React, { useEffect, useState, useTransition } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Plus, X } from 'lucide-react';

interface ChartDataPoint {
    time: string;
    price: number;
    isAfterHours: boolean;
}

interface Bar {
    t: string;
    c: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: ChartDataPoint;
    }>;
}

interface WatchlistResponse {
    data: {
        id: string;
        userId: string;
        watchlist: string;
    }[];
}

interface StockData {
    chartData: ChartDataPoint[];
    previousClose: number;
    currentPrice: number;
    priceChange: number;
}

const getDefaultStockData = (): StockData => ({
    chartData: [],
    previousClose: 0,
    currentPrice: 0,
    priceChange: 0
});

const formatPrice = (price: number | null | undefined): string => {
    return (price ?? 0).toFixed(2);
};

const formatPriceChange = (change: number | null | undefined, previousClose: number | null | undefined): string => {
    const safeChange = change ?? 0;
    const safePreviousClose = previousClose ?? 1;
    const percentage = (safeChange / safePreviousClose * 100);
    const sign = safeChange >= 0 ? '+' : '';
    return `${sign}${safeChange.toFixed(2)} (${percentage.toFixed(2)}%)`;
};

const StockChart: React.FC = () => {
    const [stocksData, setStocksData] = useState<{ [symbol: string]: StockData }>({});
    const [symbol, setSymbol] = useState<string>('AAPL');
    const [timeframe, setTimeframe] = useState<string>('1D');
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [showWatchlistInput, setShowWatchlistInput] = useState<boolean>(false);
    const [newSymbol, setNewSymbol] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    useEffect(() => {
        if (symbol) {
            fetchData(symbol, timeframe);
        }
    }, [symbol, timeframe]);

    useEffect(() => {
        const fetchAllWatchlistData = async () => {
            const promises = watchlist.map(stock => fetchData(stock, timeframe));
            await Promise.all(promises);
        };

        if (watchlist.length > 0) {
            fetchAllWatchlistData();
        }
    }, [watchlist, timeframe]);

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get<WatchlistResponse>('/api/watchlist-new');
            if (response.data.data && response.data.data.length > 0) {
                try {
                    const watchlistData = JSON.parse(response.data.data[0].watchlist);
                    const validWatchlist = Array.isArray(watchlistData) ? watchlistData : [];
                    setWatchlist(validWatchlist);
                    await fetchData('AAPL', timeframe);
                    validWatchlist.forEach(stock => fetchData(stock, timeframe));
                } catch (e) {
                    console.error('Error parsing watchlist:', e);
                    setWatchlist([]);
                }
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            setError('Failed to fetch watchlist');
        }
    };

    const saveWatchlist = async (updatedWatchlist: string[]) => {
        try {
            await axios.post('/api/watchlist-new', {
                watchlist: JSON.stringify(updatedWatchlist)
            });
            setWatchlist(updatedWatchlist);
            setError('');
        } catch (error) {
            console.error('Error saving watchlist:', error);
            setError('Failed to save watchlist');
        }
    };

    const handleSymbolChange = (newSymbol: string) => {
        startTransition(() => {
            setSymbol(newSymbol);
        });
    };

    const handleTimeframeChange = (newTimeframe: string) => {
        startTransition(() => {
            setTimeframe(newTimeframe);
        });
    };

    const fetchData = async (stockSymbol: string, selectedTimeframe: string) => {
        const endDate = new Date();
        let startDate = new Date();
        let interval = "5Min";

        switch (selectedTimeframe) {
            case '1D':
                startDate.setDate(endDate.getDate() - 1);
                interval = "5Min";
                break;
            case '5D':
                startDate.setDate(endDate.getDate() - 5);
                interval = "30Min";
                break;
            case '1M':
                startDate.setMonth(endDate.getMonth() - 1);
                interval = "1H";
                break;
            case '6M':
                startDate.setMonth(endDate.getMonth() - 6);
                interval = "1Day";
                break;
            case '1Y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                interval = "1Day";
                break;
        }

        try {
            const url = `https://data.alpaca.markets/v2/stocks/bars?symbols=${stockSymbol}&timeframe=${interval}&start=${startDate.toISOString()}&limit=10000&adjustment=raw&feed=sip&sort=asc`;

            const headers = {
                "accept": "application/json",
                "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_KEY,
                "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET
            };

            const response = await axios.get(url, { headers });
            const bars: Bar[] = response.data.bars[stockSymbol];

            if (bars && bars.length > 0) {
                const data = bars.map(bar => ({
                    time: new Date(bar.t).toLocaleString(),
                    price: bar.c,
                    isAfterHours: isAfterHours(new Date(bar.t))
                }));

                const previousClose = bars[0].c || 0;
                const currentPrice = bars[bars.length - 1].c || 0;
                const priceChange = currentPrice - previousClose;

                setStocksData(prevData => ({
                    ...prevData,
                    [stockSymbol]: {
                        chartData: data,
                        previousClose,
                        currentPrice,
                        priceChange
                    }
                }));

                setError('');
            } else {
                setStocksData(prevData => ({
                    ...prevData,
                    [stockSymbol]: getDefaultStockData()
                }));
            }
        } catch (error) {
            console.error(`Error fetching stock data for ${stockSymbol}:`, error);
            setError(`Failed to fetch stock data for ${stockSymbol}`);
            setStocksData(prevData => ({
                ...prevData,
                [stockSymbol]: getDefaultStockData()
            }));
        }
    };

    const isAfterHours = (date: Date): boolean => {
        const hours = date.getHours();
        return hours < 9 || hours >= 16;
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        handleSymbolChange(event.target.value.toUpperCase());
    };

    const addToWatchlist = async (newStockSymbol: string): Promise<void> => {
        if (newStockSymbol && !watchlist.includes(newStockSymbol.toUpperCase())) {
            const updatedWatchlist = [...watchlist, newStockSymbol.toUpperCase()];
            await saveWatchlist(updatedWatchlist);
            await fetchData(newStockSymbol.toUpperCase(), timeframe);
        }
        setNewSymbol('');
        setShowWatchlistInput(false);
    };

    const removeFromWatchlist = (symbolToRemove: string): void => {
        const updatedWatchlist = watchlist.filter(s => s !== symbolToRemove);
        saveWatchlist(updatedWatchlist);
        setStocksData(prevData => {
            const newData = { ...prevData };
            delete newData[symbolToRemove];
            return newData;
        });
    };

    const getYAxisDomain = (data: ChartDataPoint[]): [number, number] => {
        if (data.length === 0) return [0, 0];
        const prices = data.map(d => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    };

    const getPriceColor = (stockSymbol: string): string => {
        const stockData = stocksData[stockSymbol];
        if (!stockData || stockData.priceChange === 0) return "#000000";
        return stockData.priceChange > 0 ? "#34A853" : "#EA4335";
    };

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-lg font-semibold">${payload[0].value.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(payload[0].payload.time).toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const currentStockData = stocksData[symbol] ?? getDefaultStockData();

    return (
        <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow">
                    <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-center">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={symbol}
                                onChange={handleSearch}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Search stock symbol"
                            />
                            <Star
                                className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                                    watchlist.includes(symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 dark:text-gray-500'
                                }`}
                                onClick={() => {
                                    watchlist.includes(symbol)
                                        ? removeFromWatchlist(symbol)
                                        : addToWatchlist(symbol);
                                }}
                            />
                        </div>
                        <div className="flex gap-2 lg:mt-0 mt-4">
                            {['1D', '5D', '1M', '6M', '1Y'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => handleTimeframeChange(period)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                                        timeframe === period
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-semibold transition-colors duration-200"
                                 style={{ color: getPriceColor(symbol) }}>
                                ${formatPrice(currentStockData.currentPrice)}
                            </div>
                            <div className={`text-sm transition-colors duration-200 ${
                                currentStockData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                                {formatPriceChange(currentStockData.priceChange, currentStockData.previousClose)}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Previous close: ${formatPrice(currentStockData.previousClose)}
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={currentStockData.chartData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={(time: string) => {
                                    const date = new Date(time);
                                    return timeframe === '1D'
                                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : date.toLocaleDateString();
                                }}
                                tick={{ fill: '#666666', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={getYAxisDomain(currentStockData.chartData)}
                                tick={{ fill: '#666666', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke={getPriceColor(symbol)}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                                animationDuration={300}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:w-64 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold dark:text-white">Watchlist</h3><button
                        onClick={() => setShowWatchlistInput(!showWatchlistInput)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 text-gray-600 dark:text-gray-400"
                        aria-label="Add to watchlist"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    </div>

                    {showWatchlistInput && (
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSymbol}
                                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                                placeholder="Add symbol"
                            />
                            <button
                                onClick={() => addToWatchlist(newSymbol)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        {watchlist.map((watchedSymbol) => {
                            const stockData = stocksData[watchedSymbol] ?? getDefaultStockData();

                            return (
                                <div
                                    key={watchedSymbol}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        symbol === watchedSymbol
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => handleSymbolChange(watchedSymbol)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{watchedSymbol}</span>
                                        <span className="text-xs transition-colors duration-200"
                                              style={{ color: getPriceColor(watchedSymbol) }}>
                                            ${formatPrice(stockData.currentPrice)}
                                        </span>
                                    </div>
                                    <div className={`text-sm ml-2 transition-colors duration-200 ${
                                        stockData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {formatPriceChange(stockData.priceChange, stockData.previousClose)}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromWatchlist(watchedSymbol);
                                        }}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                                        aria-label={`Remove ${watchedSymbol} from watchlist`}
                                    >
                                        <X className="w-4 h-4 hover:text-red-500 transition-colors duration-200" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockChart;