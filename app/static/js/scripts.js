document.getElementById('stock-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    formData.append('start-date', startDate);
    formData.append('end-date', endDate);

    fetch('/get_stock_data', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received:', data);
        document.getElementById('chart').innerHTML = '';
        document.getElementById('metrics').innerHTML = '';
        createChart(data.stocks);
        createMetricsTable(data.metrics);
    });
});

function createChart(data) {
    console.log('Creating chart with data:', data);

    const svg = d3.select("#chart").append("svg").attr("width", 800).attr("height", 400),
        margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse("%Y-%m-%d");

    // Parse and clean the data
    data.forEach(d => {
        d.date = new Date(d.Date);
        d.close = parseFloat(d.Close);
    });

    // Filter out invalid data points
    const filteredData = data.filter(d => !isNaN(d.date) && !isNaN(d.close));
    console.log('Filtered data:', filteredData);

    if (filteredData.length === 0) {
        console.log('No valid data to plot.');
        return;
    }

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

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    nestedData.forEach((symbolData, i) => {
        const path = g.append("path")
            .datum(symbolData[1])
            .attr("fill", "none")
            .attr("stroke", colors(i))
            .attr("stroke-width", 1.5)
            .attr("class", `line-${i}`)
            .attr("d", line);

        g.selectAll(`.dot-${i}`)
            .data(symbolData[1])
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.close))
            .attr("fill", colors(i))
            .attr("class", `dot-${i}`)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Symbol: ${d.Symbol}<br>Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}<br>Close: ${d.close}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("r", 6);
                d3.select(`.line-${i}`).attr("stroke-width", 3);
            })
            .on("mouseout", function(event, d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr("r", 3);
                d3.select(`.line-${i}`).attr("stroke-width", 1.5);
            });
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
        .text(d => d)
        .on("click", function(event, d) {
            const ascending = d3.select(this).classed("asc");
            tbody.selectAll("tr")
                .sort((a, b) => ascending
                    ? d3.ascending(a[d], b[d])
                    : d3.descending(a[d], b[d]));
            d3.select(this).classed("asc", !ascending);
        });

    const rows = tbody.selectAll("tr")
        .data(metrics)
        .enter()
        .append("tr")
        .style("color", (d, i) => d3.schemeCategory10[i % 10])
        .attr("class", (d, i) => `row-${i}`)
        .on("mouseover", function(event, d, i) {
            d3.select(`.line-${i}`).attr("stroke-width", 3);
            d3.selectAll(`.dot-${i}`).attr("r", 6);
        })
        .on("mouseout", function(event, d, i) {
            d3.select(`.line-${i}`).attr("stroke-width", 1.5);
            d3.selectAll(`.dot-${i}`).attr("r", 3);
        });

    rows.selectAll("td")
        .data(d => columns.map(column => d[column]))
        .enter()
        .append("td")
        .text(d => d);
}
