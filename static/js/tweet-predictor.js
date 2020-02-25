// Select the submission button
var submit_button = d3.select("#tweet-submit-button");

// Apply an On-Click function to the button to retrieve the input value, return the text and fire the sentiment analysis model
submit_button.on("click", tweet_analyzer)
    
function tweet_analyzer() {

    
    
    // Select the text predictor input element and retrieve the value
    var text_predictor_input = d3.select("#text-form-input");
    var inputValue = text_predictor_input.property("value");


    
    var full_tweet_output_field = d3.select("#text-input-output-field")
    var sentiment_prediction_field = d3.select("#sentiment-prediction-output")
    var predicted_positive_percent = d3.select("#predicted-positive-percent-tag")
    var predicted_negative_percent = d3.select("#predicted-negative-percent-tag")
    var predicted_neutral_percent = d3.select("#predicted-general-percent-tag")

    
    // Check for input value before proceeding
    // If input value is blank, return a message
    if (inputValue!== ``) {

        console.log("Input value received: ", inputValue);

        // Wipe any values already displayed
        full_tweet_output_field.selectAll('p').remove();
        predicted_positive_percent.selectAll('p').remove();
        predicted_negative_percent.selectAll('p').remove();
        predicted_neutral_percent.selectAll('p').remove();
        
        // Display the text that the user wants analyzed in the output field
        full_tweet_output_field
            .append('p')
            .attr('id', 'tweet-output-format')
            .text(`"${inputValue}"`);

        // Display the model's prediction for the input value

        sentiment_prediction_field.selectAll('p').remove();

        if (sentiment_prediction === "Positive") {
            sentiment_prediction_field
                .append('p')
                .attr('id', 'sentiment-prediction-positive')
                .text("POSITIVE")
        } else {
            sentiment_prediction_field
                .append('p')
                .attr('id', 'sentiment-prediction-negative')
                .text("NEGATIVE")
        }

        predicted_positive_percent
            .append('p')
            .attr('id', 'predicted-percent-pos')
            .text(`${selected_time_positive_score}%`)

        predicted_negative_percent
            .append('p')
            .attr('id', 'predicted-percent-neg')
            .text(`${selected_time_negative_score}%`)

        predicted_neutral_percent 
            .append('p')
            .attr('id', 'predicted-general-percent')
            .text(`${selected_time_general_score}%`)


    // The Else clause of this if-statement handles situations when there is no value in the input field
    } else {
        

        // Wipe any values already displayed
        sentiment_prediction_field.selectAll('p').remove();
        full_tweet_output_field.selectAll('p').remove();
        predicted_positive_percent.selectAll('p').remove();
        predicted_negative_percent.selectAll('p').remove();
        predicted_neutral_percent.selectAll('p').remove();
        

        // Insert a message in the output field requesting that the user inputs a value
        full_tweet_output_field
            .append('p')
            .attr('id', 'tweet-output-format-need-text')
            .text(`Please input a value.`);

        sentiment_prediction_field
            .append('p')
            .attr('id', 'sentiment-prediction-need-text')
            .text("-")

        predicted_positive_percent
            .append('p')
            .attr('id', 'predicted-sent-need-text')
            .text(`-`)

        predicted_negative_percent
            .append('p')
            .attr('id', 'predicted-sent-need-text')
            .text(`-`)

        predicted_neutral_percent 
            .append('p')
            .attr('id', 'predicted-sent-need-text')
            .text(`-`)

    }




}

// Initialize the page by calling the function
tweet_analyzer()

// Data from informative-features.js
var word_data = feature_data;

// Populate Model Word Sentiment table and create Plot

// Create the table
var word_weight_table = d3.select("#word-weight-tag")

word_weight_table.selectAll('tr').remove();

function Build_Word_Table(array) {
    
    array.forEach(word => {


    var word_table_row = word_weight_table.append('tr');
        
    Object.entries(word).forEach(([key, value]) => {
        word_table_row
            .append('td')
            .attr('class', 'table-item-center')
            .text(value)
        });

        
    });
}
Build_Word_Table(word_data)

word_list = []

    // Unpack data from the API into an list for easy iteration
    word_data.forEach((item) => {

        var item_list = []

        // Iterate through each key/value
        Object.entries(item).forEach(([key, value]) => {
    
        // Add all values relevant to one timepoint to timepoint_list
        item_list.push(value)
        })

        // Append the timepoint data to the master Period List
        word_list.push(item_list)
    })

sent_graph_word_list = []
sent_graph_value_list = []

word_list.forEach((item) => {
    sent_graph_word_list.push(item[0])
    sent_graph_value_list.push(parseFloat(item[2]))
})




// Line Chart to display how sentiment is weighted
var trace1 = {
    x: sent_graph_word_list,
    y: sent_graph_value_list,
    type: "line"
};

var sent_graph_data = [trace1];

var sent_graph_layout = {
    title: "Model Word Sentiment Value",

    xaxis: {
        title: "Words"
    },

    yaxis: {
        title: "Sentiment Value"
    }

};

var responsive_functionality = {
    responsive: true
}

Plotly.newPlot("sentiment-line-chart", sent_graph_data, sent_graph_layout, responsive_functionality)

  
