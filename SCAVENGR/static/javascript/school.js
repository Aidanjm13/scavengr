let jsonStatData;
let maxTablePage = 0;
let currTablePage = 0;


$(document).ready(function() {
    loadButtonFunc();

    let urlArgs = window.location.href.split("/");
    lastSegmentOfUrl = urlArgs[urlArgs.length-2];

    console.log(lastSegmentOfUrl);

    var xhr = new XMLHttpRequest();
    var url = "/test_endpoint/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            jsonStatData = JSON.parse(xhr.responseText);
            maxTablePage = jsonStatData["Years"].length;
            reloadStatTable();
            createGraph(jsonStatData);
        }
    };
    var dict = {"schools": [lastSegmentOfUrl]}
    var data = JSON.stringify(dict);
    xhr.send(data);


});

function createTable(tableData, parentElementID, title, tableId) {//TODO clean up function
    var table = document.createElement('table');
    table.setAttribute('class', 'table table-striped');
    table.setAttribute('id', tableId);
    var tableHead = document.createElement('thead');
    var tableBody = document.createElement('tbody');

    var titleHeader = document.createElement('tr');
    var titleCell = document.createElement('th');
    titleCell.setAttribute('scope', 'col');
    titleCell.setAttribute('colspan', tableData[0].length.toString());
    titleCell.appendChild(document.createTextNode(title));
    titleHeader.appendChild(titleCell);
    tableHead.appendChild(titleHeader);
    console.log(tableData[0]);
    var headerRow = document.createElement('tr');
    tableData[0].forEach(function(headerData) {
        var header = document.createElement('th');
        header.setAttribute('scope', 'col');
        header.appendChild(document.createTextNode(headerData));
        headerRow.appendChild(header);
    });
    tableHead.appendChild(headerRow);
  
    for(let i = 1; i < tableData.length; i++) {
        rowData = tableData[i];
        
        var row = document.createElement('tr');
        
        let firstCell = true;
        rowData.forEach(function(cellData) {

            var cell = document.createElement('td');
            if(firstCell) {
                var anchor = document.createElement('a');
                anchor.setAttribute('href', "/schools/" + rowData[0].toString());
                anchor.appendChild(document.createTextNode(cellData));
                cell.appendChild(anchor);
            } else {
                cell.appendChild(document.createTextNode(cellData));
            }
            
            row.appendChild(cell);
            firstCell = false;
      });
      
      
      tableBody.appendChild(row);
    }
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    document.getElementById(parentElementID).appendChild(table);
}

function parseStatData(data, yearIndex) { //TODO proper data parsing
    const nonStatHeaders = 4;
    let schoolData = data["Data"];
    let numStats = data["Headers"].length - nonStatHeaders;
    let output = [data["Headers"]];
    for(let schoolStats of schoolData) {
        let stats = []
        for(let i = 0; i < nonStatHeaders; i++) {
            stats.push(schoolStats[i]);
        }
        for(let i = 0; i < numStats; i++) {
            let stat = schoolStats[i + nonStatHeaders][yearIndex];
            stats.push(stat);
        }
        output.push(stats);
    }
    console.log(output);
    return output;
}

function reloadStatTable() {
    var tableData = parseStatData(jsonStatData, currTablePage);
    try {
        document.getElementById("school-stats-table").remove();
    } catch (err) {

    } finally {
        createTable(tableData, "table-container", jsonStatData["Years"][currTablePage], "school-stats-table");
    }
}

function createGraph(tableData) {
    console.log(tableData);
    // Labels for x-axis
    

    // Function to generate random colors for the lines
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    Chart.defaults.color = "white";

    // Get the chart container div
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = "";
    console.log("headers");
    console.log(tableData["Headers"]);
    // Loop through the tableData and create a separate chart for each attribute
    const nonStatHeaders = 4;
    for(let i = nonStatHeaders; i < tableData["Headers"].length; i++) {
        // Create a new canvas element for each chart
        const canvas = document.createElement('canvas');
        canvas.id = `chart_${tableData["Headers"][i]}`;
        canvas.width = 400;
        canvas.height = 200;
        chartContainer.appendChild(canvas); // Append canvas to the container

        // Create the chart for this attribute
        const ctx = canvas.getContext('2d');
        var currChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tableData["Years"], // X-axis labels
                datasets: []  // Start with an empty datasets array
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,       // Show the title
                        text: tableData["Headers"][i],  // Title text
                        font: {
                            size: 18          // Title font size
                        },
                        padding: {
                            top: 10,
                            bottom: 30        // Adjust padding for title
                        }
                    }
                }
            }   
        });

        for(let j = 0; j < tableData["Data"].length; j++){
            var labelColor = getRandomColor();
            var currDataset = {
                label: tableData["Data"][j][3],
                data: tableData["Data"][j][i],
                backgroundColor: labelColor,
                borderColor: labelColor,
                borderWidth: 2
            };
            currChart.data.datasets.push(currDataset);
        }
        currChart.update();
    };
}

function loadButtonFunc() {
    $('#table-back-btn').click(function() {
        if(currTablePage > 0) {
            currTablePage--;
            reloadStatTable();
        }
    });

    $('#table-forward-btn').click(function() {
        console.log("click");
        if(currTablePage < maxTablePage - 1) {
            console.log("boom");
            currTablePage++;
            reloadStatTable();
        }
    });
}