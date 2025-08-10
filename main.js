// Example: Sector inflows/outflows chart (bar)
const sectorCtx = document.getElementById('sectorChart').getContext('2d');
const sectorChart = new Chart(sectorCtx, {
    type: 'bar',
    data: {
        labels: ['Technology', 'Energy', 'Financials', 'Healthcare', 'Consumer Discretionary'],
        datasets: [{
            label: 'Net Flows (USD)',
            data: [3208, 1108, -800, 500, -120],
            backgroundColor: [
                '#1ea3ff', '#37c36d', '#ff5566', '#ffc244', '#7e6ef7'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } }
    }
});

// Example: Indices charts (simple line, random for demo)
const placeholderData = {
    labels: ['-200d', '-50d', '-20d', 'Now'],
    datasets: [{ label: 'Price', data: [5390, 5839, 6263, 6389], borderColor: '#1ea3ff' }]
};
['spxChart', 'ndxChart', 'djiChart', 'vixChart'].forEach(id => {
    new Chart(document.getElementById(id).getContext('2d'), {
        type: 'line',
        data: placeholderData,
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
});

// Utility function to fetch latest stock price from Yahoo Finance public JSON endpoint
async function fetchYahooFinanceQuote(ticker) {
    // Use good User-Agent to avoid blocks, public API endpoint for daily quotes
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' } // Some browsers require this for CORS, may still fail cross-origin in client
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const quote = result.quoteResponse.result[0];
        if (!quote) {
            throw new Error(`No data found for ${ticker}`);
        }
        return {
            price: quote.regularMarketPrice,
            changePercent: quote.regularMarketChangePercent
        };
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null; // Handle gracefully in UI
    }
}

// Example: Update dashboard prices dynamically
async function updateDashboardPrices() {
    // List of some sample large cap tickers
    const tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'];

    for (const ticker of tickers) {
        const data = await fetchYahooFinanceQuote(ticker);
        if (data) {
            const priceElem = document.querySelector(`#price-${ticker}`);
            const changeElem = document.querySelector(`#change-${ticker}`);
            if (priceElem && changeElem) {
                priceElem.textContent = `$${data.price.toFixed(2)}`;
                changeElem.textContent = `${data.changePercent.toFixed(2)}%`;
                changeElem.style.color = data.changePercent >= 0 ? 'green' : 'red';
            }
        } else {
            // Fallback UI update on error
            const priceElem = document.querySelector(`#price-${ticker}`);
            const changeElem = document.querySelector(`#change-${ticker}`);
            if (priceElem && changeElem) {
                priceElem.textContent = 'N/A';
                changeElem.textContent = '-';
                changeElem.style.color = 'gray';
            }
        }
    }
}

// Call at page load or on demand
updateDashboardPrices();
