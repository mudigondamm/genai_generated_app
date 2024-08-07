document.getElementById('stock-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    fetch('/get_stock_data', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('chart').innerHTML = '';
        document.getElementById('metrics').innerHTML = '';
        createChart(data.stocks);
        createMetricsTable(data.metrics);
    });
});

function createChart(data) {
    const svg = d3.select("#chart").append("svg").attr("width", 800).attr("height", 400),
        margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse("%Y-%m-%d");
    console.log("data:", data);

    // Parse and clean the data
    data.forEach(d => {
        d.date = new Date(d.Date);
        d.close = parseFloat(d.Close);
    });

    // Filter out invalid data points
    const filteredData = data.filter(d => !isNaN(d.date) && !isNaN(d.close));
    console.log(filteredData);
    const x = d3.scaleTime().range([0, width]),
          y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(filteredData, d => d.date));
    y.domain([0, d3.max(filteredData, d => d.close)]);

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.close))
        .curve(d3.curveMonotoneX);

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const nestedData = d3.groups(filteredData, d => d.Symbol);
    console.log(nestedData);

    nestedData.forEach((symbolData, i) => {
        console.log("symbolData:", symbolData[1]);
        g.append("path")
            .datum(symbolData[1])
            .attr("fill", "none")
            .attr("stroke", colors(i))
            .attr("stroke-width", 1.5)
            .attr("d", line);
    });

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Date");

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Close Price");
}

function createMetricsTable(metrics) {
    const table = d3.select("#metrics").append("table"),
          thead = table.append("thead"),
          tbody = table.append("tbody");

    const columns = ["symbol", "market_cap", "pe_ratio", "price_to_book", "industry", "sector"];

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(d => d);

    const rows = tbody.selectAll("tr")
        .data(metrics)
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(d => columns.map(column => d[column]))
        .enter()
        .append("td")
        .text(d => d);
}
