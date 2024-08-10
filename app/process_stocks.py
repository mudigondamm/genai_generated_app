def process_stock_data(data, min_market_cap=1000000, min_pe_ratio=5, min_price_to_book=1):
    """
    Processes stock data and filters it based on given criteria.

    Parameters:
    - data: list of dictionaries with stock metrics
    - min_market_cap: minimum market capitalization required
    - min_pe_ratio: minimum PE ratio required
    - min_price_to_book: minimum price to book ratio required

    Returns:
    - dict: processed stock data categorized by 'valid' and 'invalid'
    """
    valid_stocks = []
    invalid_stocks = []

    for stock in data:
        try:
            if 'symbol' not in stock:
                raise ValueError(f"Missing symbol in stock data: {stock}")
            if 'market_cap' not in stock or stock['market_cap'] is None:
                raise ValueError(f"Missing or None market cap for {stock['symbol']}")
            if 'pe_ratio' not in stock or stock['pe_ratio'] is None:
                raise ValueError(f"Missing or None PE ratio for {stock['symbol']}")
            if 'price_to_book' not in stock or stock['price_to_book'] is None:
                raise ValueError(f"Missing or None price to book ratio for {stock['symbol']}")

            # Validate market cap
            if stock['market_cap'] < min_market_cap:
                invalid_stocks.append({
                    'symbol': stock['symbol'],
                    'reason': 'market_cap_below_threshold'
                })
                continue

            # Validate PE ratio
            if stock['pe_ratio'] < min_pe_ratio:
                invalid_stocks.append({
                    'symbol': stock['symbol'],
                    'reason': 'pe_ratio_below_threshold'
                })
                continue

            # Validate price to book ratio
            if stock['price_to_book'] < min_price_to_book:
                invalid_stocks.append({
                    'symbol': stock['symbol'],
                    'reason': 'price_to_book_below_threshold'
                })
                continue

            # If all conditions are met, add to valid stocks
            valid_stocks.append(stock)

        except ValueError as e:
            print(f"Error processing stock: {e}")
            invalid_stocks.append({
                'symbol': stock.get('symbol', 'Unknown'),
                'reason': 'error',
                'error': str(e)
            })
        except Exception as e:
            print(f"Unexpected error processing stock: {e}")
            invalid_stocks.append({
                'symbol': stock.get('symbol', 'Unknown'),
                'reason': 'unexpected_error',
                'error': str(e)
            })

    return {
        'valid': valid_stocks,
        'invalid': invalid_stocks
    }
