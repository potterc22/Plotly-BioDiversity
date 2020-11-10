var samplesFile = "../samples.json"
// create an object to hold the 
var barValues = []
var barLabels = []
var barHovertext = []
var stringLabels =[]


d3.json("../samples.json").then(function(data){
    var bars = unpack(data.samples[0], 2)
    console.log(bars)
  })

d3.json(samplesFile).then(function(data) {
    // loop through each individual
    for (i=0; i<10; i++) {
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
    console.log(barLabels[0])
    console.log(stringLabels[0])
    console.log(barHovertext[0])
    // declare data variable for plot
    data = [{
        x: barValues[0],
        y: stringLabels[0],
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
            t: 100,
            b: 100
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
    });

    // use the first sample to build the initial plots

}

// initialize the dashboard
init()