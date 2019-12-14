// Initial read in of Json Data
d3.json("samples.json").then(function(data) {
    console.log(data);
    // Loop through all IDs and append options to select html tag
    data.names.forEach(name => {
      // console.log(name);
      d3.select("#selDataset")
        .append("option")
        .property("value",name)
        .text(name);
    });
});

// This function is called when a dropdown menu item is selected
// When an individual is selected, display the top 10 OTUs found in
// that individual in a horizontal bar chart.
function optionChanged() {
  var subjectID = d3.select("#selDataset")
                    .property("value");
  // console.log(subjectID);
  d3.json("samples.json").then(function(data){
    // loop through all IDs to find the selected ID
    data.samples.forEach(sample => {
      // console.log(sample);
      if (sample.id == subjectID) {
        console.log(sample);
        // Slice top 10 data points
        var top_ids = sample.otu_ids.slice(0, 10);
        var top_labels = sample.otu_labels.slice(0, 10);
        var top_values = sample.sample_values.slice(0, 10);
        // Rev array for Plotly graphing
        var otu_ids = top_ids.reverse();
        var otu_labels = top_labels.reverse();
        var sample_values = top_values.reverse();
        // Reformat IDs for graphing
        var ref_ids = [];
        otu_ids.forEach(id => ref_ids.push(`OTU ${id}`));

        console.log(ref_ids);
        console.log(otu_labels);
        console.log(sample_values);

        // Bar Chart
        // Create the trace
        var trace = {
          x: sample_values,
          y: ref_ids,
          text: otu_labels,
          type: "bar",
          orientation: "h"
        };
        // Create data array
        var data = [trace];
        // Create layout
        var layout = {
          title: "Top 10 OTUs",
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          },
          xaxis: {title:"Sample Values"}
        };
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        // Create the trace
        var trace = {
          x: sample.otu_ids,
          y: sample.sample_values,
          mode: "markers",
          marker: {
            color: sample.otu_ids,
            size: sample.sample_values
          },
          text: sample.otu_labels
        };
        // Create data array
        var data = [trace];
        // Create layout
        var layout = {
          title: "All OTUs",
          showlegend: false,
          height: 500,
          width: 1000,
          xaxis: {title: "OTU ID"},
          yaxis: {title: "Sample Values"}
        };
        Plotly.newPlot("bubble", data, layout);
      };
    });
    //Clear html tag
    d3.select("#sample-metadata").html("");
    //Loop through metadata
    data.metadata.forEach(subject => {
      if (subject.id == subjectID) {
        // console.log(subject);
        Object.entries(subject).forEach(([key, value]) => {
          // console.log(`Key: ${key} Value: ${value}`)
          d3.select("#sample-metadata")
            .append("ul")
            .text(`${key}: ${value}`);
        });
      }
    })
  });
};
