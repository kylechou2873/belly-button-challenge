// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let selection = metaData.filter((item)=>item.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(key in selection[0]){
      sampleMetadata.append("ul").text(`${key.toUpperCase()}: ${selection[0][key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selection = samples.filter((item)=>item.id === sample);
    
    // Get the otu_ids, otu_labels, and sample_values
    let myOtu_ids = [];
    let myOtu_labels = [];
    let mySample_values = [];
    if (selection.length > 0){
      myOtu_ids = selection[0].otu_ids;
      myOtu_labels = selection[0].otu_labels;
      mySample_values = selection[0].sample_values;
    }
  
    // Build a Bubble Chart
    let bubbleData = [
      {
        x: myOtu_ids,
        y: mySample_values,
        mode: 'markers',
        marker:{
          colorscale: 'RdBu',
          size: mySample_values,
          color: myOtu_ids
        },
        text: myOtu_labels
      }
    ];
    let bubbleLayout = {
      title: `Bacteria Culture by Sample ID: ${sample}.`,
      xaxis:{
        title: 'OTU IDs'
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let topTenIDs = selection.length > 0 ? selection[0].otu_ids.slice(0,10).map((id) => `OTU ${id}`).reverse() : [];
    let topTenVal = selection.length > 0 ? selection[0].sample_values.slice(0,10).reverse() : [];

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      type: 'bar',
      y: topTenIDs,
      x: topTenVal,
      orientation: 'h'
    };
    let barData = [barTrace];
    let barLayout = {
      title: "Top 10 Bacteria Culture Found",
      xaxis:{
        title: {text: 'Number of Bacteria'}
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar",barData,barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
   
    // Use d3 to select the dropdown with id of `#selDataset`
    let dataSelect = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i<names.length; i++){
      dataSelect.append("option").text(names[i]);
    }

    // Get the first sample from the list
    let firstSam = names[0];
    // Build charts and metadata panel with the first sample
    buildCharts(firstSam);
    buildMetadata(firstSam);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
