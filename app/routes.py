from flask import Blueprint, render_template, request, jsonify
import yfinance as yf

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    return render_template('index.html')

@routes.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    companies = request.form.get('companies').split(',')
    start_date = request.form.get('start-date')
    end_date = request.form.get('end-date')
    data = {'stocks': [], 'metrics': []}
    for company in companies:
        ticker = yf.Ticker(company.strip())
        hist = ticker.history(start=start_date, end=end_date)
        hist['Symbol'] = company.strip()
        data['stocks'].extend(hist.reset_index().to_dict(orient='records'))
        metrics = {
            'symbol': company.strip(),
            'market_cap': ticker.info.get('marketCap'),
            'pe_ratio': ticker.info.get('trailingPE'),
            'price_to_book': ticker.info.get('priceToBook'),
            'industry': ticker.info.get('industry'),
            'sector': ticker.info.get('sector')
        }
        data['metrics'].append(metrics)
    return jsonify(data)
