var samplesFile = "../samples.json"

// build Demographic info box with metadata
function buildDemographic(id) {
    console.log(id)
    // use d3 to select the demographic info box
    d3.json(samplesFile).then(data => {
        var sampleDem = d3.select("#sample-metadata")
        // clear any existing metadata
        sampleDem.html("")
        // declare metadata variable
        var metadata = data.metadata

        for (i=0; i<metadata.length; i++) {

            if (metadata[i].id == id) {
                Object.entries(metadata[i]).forEach(([key,value]) => {
                    var row = sampleDem.append("p");
                    row.text(`${key}: ${value}`)
                })                
            }
        }
        
    })
    
}

var barValues = []
var barLabels = []
var barHovertext = []
var stringLabels =[]

function buildPlots(id) {
    d3.json(samplesFile).then(function(data) {
        var dropdownValues = data.names
        var samples = data.samples
        var metadata = data.metadata
        
        // loop through each individual
        for (i=0; i<samples.length; i++) {
            if (samples[i].id == id) {
                console.log(samples[i].id)
                // declare variables for bar graph
                barValues = samples[i].sample_values.slice(0,9)
                barLabels = samples[i].otu_ids.slice(0,9)
                barHovertext = samples[i].otu_labels.slice(0,9)
                var stringLabel = barLabels.toString().split(",")
                stringLabels.push(stringLabel)

                // declare variables for bubble chart
                var xValues = samples[i].otu_ids
                var yValues = samples[i].sample_values
                var markerSize = samples[i].sample_values
                var markercolor = samples[i].otu_ids
                var textValues = samples[i].otu_labels
            }
            // create variable for belly button washing frequency
            if (metadata[i].id == id) {
                var washFrequency = metadata[i].wfreq
            }
            
        }
        // console.log bar chart variables
        // console.log(barValues)
        // console.log(stringLabels)
        // console.log(barHovertext)

        // declare data variable for plot
        data = [{
            // Reverse the array to accommodate Plotly's defaults
            x: barValues.reverse(),
            y: stringLabels[0].reverse(),
            text: barHovertext.reverse(),
            type: "bar",
            orientation: "h"
        }]
        // set the bar graph layout
        layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 50
            },
            yaxis: {
                type: 'category'
            }
        }
        // Create bar chart
        Plotly.newPlot("bar", data, layout)

        // console.log bubble chart variables
        // console.log(xValues)
        // console.log(yValues)
        // console.log(textValues)

        // declare data variable for bubble plot
        data2 = [{
            // Reverse the array to accommodate Plotly's defaults
            x: xValues.reverse(),
            y: yValues.reverse(),
            mode: 'markers',
            marker: {
                size: markerSize,
                color: markercolor,
            },
            text: textValues.reverse(),
            type: "bubble"
        }]
        // set the bubble chart layout
        layout2 = {
            title: "Bacteria Cultures per Sample",
            xaxis: {
                title: "OTU ID"
            },
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 50
            },
        }
        // Create bubble chart 
        Plotly.newPlot("bubble", data2, layout2)

        // declare data variable for gauge chart
        data3 = [{
            domain: { x: [0,1], y: [0,1] },
            type: "indicator",
            mode: "gauge+number",
            value: washFrequency,
            gauge: { 
                axis: { range: [null, 9] } 
            },
        }]
        // set the gauge chart layout
        layout3 = { 
            title: "Belly Button Washing Frequency",
            width: 600, 
            height: 500,
            margin: {
                t: 120,
                b: 140,
                r: 120
            }
        }
        // create gauge chart
        Plotly.newPlot("gauge", data3, layout3)
    })
}



function init() {
    // get a reference to the dropdown select element
    var selector = d3.select("#selDataset")
    // remove any children from the div
    selector.html("");
    // use sample names to populate dropdown options
    d3.json(samplesFile).then(data => {
        var dropdownLabels = data.names;
        // loop through each dropdownlabel and add it as an option for the dropdown
        dropdownLabels.forEach(label => {
            selector.append("option")
            .text(label)
            .property("value", label)
        })  
        // declare variable for first sample id
        const firstSample = dropdownLabels[0]
        // use the first sample to build the initial plots
        buildDemographic(firstSample)    
        buildPlots(firstSample)
    });
    
}

function optionChanged(newSample) {
    buildDemographic(newSample)
    buildPlots(newSample)
}

// initialize the dashboard
init()