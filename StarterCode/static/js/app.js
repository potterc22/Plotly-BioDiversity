var samplesFile = "../samples.json"
// create an object to hold the 
var barValues = []
var barLabels = []
var barHovertext = []
var stringLabels =[]

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
        console.log(metadata)
        for (i=0; i<metadata.length; i++) {
            console.log([metadata[i].id, id])

            if (metadata[i].id == id) {
                Object.entries(metadata[i]).forEach(([key,value]) => {
                    var row = sampleDem.append("p").append("b");
                    console.log([key, value])
                    row.text(`${key}:${value}`)
                })                
            }
        }
        
    })
    
}



d3.json(samplesFile).then(function(data) {
    var dropdownValues = data.names
    // loop through each individual
    for (i=0; i<dropdownValues.length; i++) {
        barValues.push(data.samples[i].sample_values.slice(0,9))
        barLabels.push(data.samples[i].otu_ids.slice(0,9))
        barHovertext.push(data.samples[i].otu_labels.slice(0,9))
        var stringLabel = barLabels[i].toString().split(",")
        stringLabels.push(stringLabel)
    }

    // sort bar values in descending order
    barValues.sort((a,b) => b - a)

    // Reverse the array to accommodate Plotly's defaults
    

    console.log(barValues[0])
    console.log(stringLabels[0])
    console.log(barHovertext[0])
    // declare data variable for plot
    data = [{
        x: barValues[0].reverse(),
        y: stringLabels[0].reverse(),
        text: barHovertext[0],
        type: "bar",
        orientation: "h"
    }]
    // set the bar graph layout
    layout = {
        title: "Top 10 OTUs Found",
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
    Plotly.newPlot("bar", data, layout)
})


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
    });
    
}

// initialize the dashboard
init()