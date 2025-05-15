// chartMethods.js

function createChart(containerId, chartData) {
    return new Promise(function (resolve, reject) {
        var container = document.getElementById(containerId);
        if (!container) {
            reject('Container not found: ' + containerId);
            return;
        }

        var categories = chartData.data.map(function (item) { return item.name; });
        var values = chartData.data.map(function (item) { return item.count; });
        var urls = chartData.data.map(function (item) { return item.url; });

        chart(containerId, {
            chart: { type: chartData.chartType },
            title: { text: chartData.title },
            xAxis: {
                categories: categories,
                title: { text: chartData.xAxisTitle },
                labels: {
                    style: { color: '#000000', fontSize: '12px' }
                }
            },
            yAxis: {
                title: { text: "Number of Records" },
                labels: {
                    style: { color: '#000000', fontSize: '12px' }
                }
            },
            series: [{
                name: chartData.title,
                data: values,
                dataLabels: { enabled: true }
            }],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                var url = urls[this.index];
                                if (url) {
                                    window.location.href = url;
                                } else {
                                    console.warn('No URL available for this data point');
                                }
                            }
                        }
                    }
                }
            }
        });

        resolve();
    });
}


function createCountChart(containerId, countData) {
    return new Promise(function (resolve, reject) {
        var container = document.getElementById(containerId);
        if (!container) {
            reject('Container not found: ' + containerId);
            return;
        }

        container.innerHTML = '';
        var title = document.createElement('h3');
        title.innerText = countData.title;
        title.style.color = '#000000';
        container.appendChild(title);

        var countDisplay = document.createElement('p');
        var countLink = document.createElement('a');
        countLink.href = countData.url || '#';
        countLink.innerHTML = "<h1 style='color: #000000;'>" + countData.uniqueCount + "</h1>";
        countLink.target = "_blank";
        container.appendChild(countDisplay);
        countDisplay.appendChild(countLink);
    });
}

function initCharts(data) {
    //loadHighchartsModules()
    var promises = [];
    if (Array.isArray(data.globalCountDataArray)) {
        data.globalCountDataArray.forEach(function (countData, index) {
            promises.push(
                createCountChart('globalCountContainer' + (index + 1), countData).catch(console.warn)
            );
        });
    }

    if (Array.isArray(data.countDataArray)) {
        data.countDataArray.forEach(function (countData, index) {
            promises.push(
                createCountChart('countContainer' + (index + 1), countData).catch(console.warn)
            );
        });
    }

    if (Array.isArray(data.chartDataArray)) {
        data.chartDataArray.forEach(function (chartData, index) {
            promises.push(
                createChart('chartContainer' + (index + 1), chartData).catch(console.warn)
            );
        });
    }

    if (typeof Highcharts !== 'undefined' && $scope.data && $scope.data.geoJSON) {
        generatingMaps();
    } else {
        console.warn('Map initialization delayed - waiting for resources');
        setTimeout(initCharts, 500); // Retry after a short delay
    }

    return Promise.all(promises).then(function (results) {
        console.log(
            results.filter(Boolean).length +
            " out of " +
            promises.length +
            " charts created successfully"
        );
    });
}