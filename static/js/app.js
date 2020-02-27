
d3.json("static/js/test-data/API_testing.json").then(function (candidate_data) {
    
    console.log("Data Retrieved from API: ", candidate_data)

    var data_unpacking_tier_one = candidate_data
    var {
        candidate1: candidate_one,
        electoral_data: electoral_data_one,
        candidate2: candidate_two,
        electoral_data_2: electoral_data_two,
    } = data_unpacking_tier_one

    var candidate_list = [candidate_one, candidate_two]
    var electoral_data_list = [electoral_data_one, electoral_data_two]
    

    data_list = []
    
    // Unpack data from the API into an list for easy iteration
    electoral_data_list.forEach((item) => {
    
        var candidate_list = []
    
        // Iterate through each key/value
        Object.entries(item).forEach(([key, value]) => {
      
          // Add all values relevant to one candidate to candidate_list
          candidate_list.push(value)
        })
    
        // Append the candidate data to the master Data List
        data_list.push(candidate_list)
    })

    
    // Populate Dropdown Menu with Candidate Values
    var select_Candidate_Values = d3
        .selectAll("#candidate-dropdown")
        .selectAll(`candidate`)
        .data(candidate_list)
    
    select_Candidate_Values
        .enter()
        .append('option')
        .classed('candidate', true)
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return `${d}`;
        })
        .exit()
        .remove() 
     
    
    // Define D3 selections for each tag of interest
    var overallSent = d3.select("#overall-sent-tag")
    var positiveSent_percent = d3.select("#positive-percent-tag")
    var negativeSent_percent = d3.select("#negative-percent-tag")
    var general_percent = d3.select("#general-percent-tag")
    var total_tweetCount = d3.select("#total-count-tag")
    var model_accuracy = d3.select('#model-accuracy-tag')
    
    var positiveSent_Table = d3.select("#positive-tweet-tag")
    var negativeSent_Table = d3.select("#negative-tweet-tag")
    
        
    
    // Change values and tweets on dropdown selection
     d3.selectAll("#candidate-dropdown").on("change", updateCandidate)
     
    //  Function updateCandidate updates all Candidate data
     function updateCandidate() {
            // Select Candidate dropdown and take the value of the selected element
            var selected_candidate = d3.select("#candidate-dropdown");
            var selected_candidate_value = selected_candidate.property("value");
            
            // Print the selected candidate
            console.log(`Candidate selected: ${selected_candidate_value}`);
    
            // Function Locate Data_indx will return the index of an input value within an array
            function locateData_indx (array, input) {
                return array.indexOf(input)
            }
            
            // Call Locate Data_indx to return the index of the candidate to locate the right data
            var candidate_idx = locateData_indx(candidate_list, selected_candidate_value)
        
                

            // Filter by time period selection
            d3.selectAll("#time-dropdown").on('change', updateFilter)
    
    
            // Function updateFilter selects the time-frame of the candidate's tweets
            function updateFilter() {
                var selected_time_frame = d3.select("#time-dropdown");
                var selected_time_frame_value = selected_time_frame.property("value");
                // Print selected value
                console.log(`Tweet Table Filter Selected: ${selected_time_frame_value}`);
                
                // Convert the input time value to a label that matches the API output
                var selected_api_time_value;
                if (selected_time_frame_value === "Pre-Debate") {
                    selected_api_time_value = 'pre_debate'
                } else if (selected_time_frame_value === "Post-Debate") {
                    selected_api_time_value = 'post_debate'
                } else if (selected_time_frame_value === "Post-Caucus") {
                    selected_api_time_value = 'post_election'
                } else if (selected_time_frame_value === "Overall") {
                    selected_api_time_value = 'Overall'
                }

                // Retrieve the proper candidate's electoral data
                var selected_electoral_list = electoral_data_list[candidate_idx]
                
                // Unpack the electoral data for better organization
                var unpacking_electoral_data = selected_electoral_list
                var {
                    period1: time_period_one,
                    positive_sentiment_score_1: positive_score_one,
                    negative_sentiment_score_1: negative_score_one,
                    positive_tweets_1: positive_tweets_list_one,
                    negative_tweets_1: negative_tweets_list_one,
                    period2: time_period_two,
                    positive_sentiment_score_2: positive_score_two,
                    negative_sentiment_score_2: negative_score_two,
                    positive_tweets_2: positive_tweets_list_two,
                    negative_tweets_2: negative_tweets_list_two,
                    period3: time_period_three,
                    positive_sentiment_score_3: positive_score_three,
                    negative_sentiment_score_3: negative_score_three,
                    positive_tweets_3: positive_tweets_list_three,
                    negative_tweets_3: negative_tweets_list_three,
                    period4: time_period_four,
                    positive_sentiment_score_4: positive_score_four,
                    negative_sentiment_score_4: negative_score_four,
                    positive_tweets_4: positive_tweets_list_four,
                    negative_tweets_4: negative_tweets_list_four,
                } = unpacking_electoral_data

                // Assign the values to two lists with matching length and index values

                // electoral_time_list - A list of each time period
                var electoral_time_list = [time_period_one, time_period_two, time_period_three, time_period_four]
                
                // electoral_time_data_list = a list of lists, with each inner list corresponding to one time period
                var electoral_time_data_list = [
                    // Pre-debate
                    [positive_score_one, negative_score_one, positive_tweets_list_one, negative_tweets_list_one],
                    // Post-debate
                    [positive_score_two, negative_score_two, positive_tweets_list_two, negative_tweets_list_two],
                    // Post-election
                    [positive_score_three, negative_score_three, positive_tweets_list_three, negative_tweets_list_three],
                    // Overall
                    [positive_score_four, negative_score_four, positive_tweets_list_four, negative_tweets_list_four]]
                
                // Call the Locate Data_indx function to retrieve the index of the correct electoral data for the selected time period
                var time_idx = locateData_indx(electoral_time_list, selected_api_time_value)
                
                // Select the correct electoral time data using the index identified above
                var selected_electoral_data = electoral_time_data_list[time_idx]
                
                // Unpack the data from selected_electoral_data
    
                // var selected_time_overall_sentiment = selected_electoral_data[1]
                // var selected_time_model_accuracy = selected_electoral_data[2]
                var selected_time_positive_score = selected_electoral_data[0]
                var selected_time_negative_score = selected_electoral_data[1]
                // var selected_time_general_score = selected_electoral_data[2]
                // var selected_time_tweet_count = selected_electoral_data[6]
                
            
                var selected_time_positive_tweet_selections = selected_electoral_data[2]
                var selected_time_negative_tweet_selections = selected_electoral_data[3]
                
    
                // Wipe existing Positive and Negative Sentiment tables
                positiveSent_Table.selectAll('tr').remove();
                negativeSent_Table.selectAll('tr').remove();
    
                // Wipe existing Summary Statistic values
                overallSent.selectAll('p').remove();
                model_accuracy.selectAll('p').remove();
                positiveSent_percent.selectAll('p').remove();
                negativeSent_percent.selectAll('p').remove();
                general_percent.selectAll('p').remove();
                total_tweetCount.selectAll('p').remove();
    
    
                // if (selected_time_overall_sentiment === "Positive") {
                //     overallSent
                //         .append('p')
                //         .attr('id', 'overall-sentiment-positive')
                //         .text("POSITIVE")
                // } else {
                //     overallSent
                //         .append('p')
                //         .attr('id', 'overall-sentiment-negative')
                //         .text("NEGATIVE")
    
                // }
    
                
                // Repopulate Summary Statistics
    
                positiveSent_percent
                    .append('p')
                    .attr('id', 'percent-pos')
                    .text(`${selected_time_positive_score}%`)
    
                negativeSent_percent
                    .append('p')
                    .attr('id', 'percent-neg')
                    .text(`${selected_time_negative_score}%`)
    
                // general_percent 
                //     .append('p')
                //     .attr('id', 'general-percent')
                //     .text(`${selected_time_general_score}%`)
    
                // total_tweetCount
                //     .append('p')
                //     .attr('id', 'tweet-count')
                //     .text(selected_time_tweet_count)
    
                // model_accuracy
                //     .append('p')
                //     .attr('id', 'model-acc')
                //     .text(`${selected_time_model_accuracy}%`)
    
    
            
                // Function Build_Positive_Table will populate the Negative Tweet Table based on the input data
                function Build_Positive_Table(positive_tweet_list) {
                
                    
    
                    positive_tweet_list.forEach(candidate => {
                
                    
    
                        Object.entries(candidate).forEach(([key, value]) => {
                            var {date: tweet_date, username: tweet_username, tweet: tweet_text} = value
                            var tweet_item_list = [tweet_date, tweet_username, tweet_text]
                            var positive_table_row = positiveSent_Table.append('tr');
                            
                                tweet_item_list.forEach(item => {
                                    positive_table_row
                                    .append('td')
                                    .attr('class', 'table-item')
                                    .text(item)
                                })
                        
                        });
                    });
                }    
                
                // Call Build_Positive_Table to build the Positive Tweet table using Filtered Positive-Sentiment Tweets
                Build_Positive_Table(selected_time_positive_tweet_selections)
                
    
                // Function Build_Negative_Table will populate the Negative Tweet Table based on the input data
                function Build_Negative_Table(negative_tweet_list) {
                    
                    
    
                    negative_tweet_list.forEach(candidate => {
                
                        Object.entries(candidate).forEach(([key, value]) => {
                            var {date: tweet_date, username: tweet_username, tweet: tweet_text} = value
                            var tweet_item_list = [tweet_date, tweet_username, tweet_text]
                            var negative_table_row = negativeSent_Table.append('tr');
                            
                                tweet_item_list.forEach(item => {
                                    negative_table_row
                                    .append('td')
                                    .attr('class', 'table-item')
                                    .text(item)
                                })
                        
                        });
                    });
                }
                
                // Call Build_Negative_Table to build the Negative Tweet table using Filtered Negative-Sentiment Tweets
                Build_Negative_Table(selected_time_negative_tweet_selections)
    
    
                
    
            }
            // Call updateFilter to filter tweets to the selected value, even when candidate name changes
            updateFilter()
        
            
            
        
    }
    // Call updateCandidate to initialize the function and populate the website
    updateCandidate()



})


