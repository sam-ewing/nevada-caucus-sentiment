import pickle
import string
import re
from nltk.corpus import stopwords 
from nltk.stem import PorterStemmer
from nltk.tokenize import TweetTokenizer
from nltk import classify
from nltk import NaiveBayesClassifier
import json

def clean_tweets(tweet):
    stopwords_english = stopwords.words('english')

    stopwords_english = stopwords.words('english')

    tweet = re.sub(r'\$\w*', '', tweet)

    ## Cleaing up RTs
    tweet = re.sub(r'^RT[\s]+', '', tweet)

    ## Removing hyperlinks
    tweet = re.sub(r'https?:\/\/.*[\r\n]*', '', tweet)

    ## Removing hastags
    tweet = re.sub(r'#', '', tweet)
    
    # tokenize tweets
    tokenizer = TweetTokenizer(preserve_case=False, strip_handles=True, reduce_len=True)
    tweet_tokens = tokenizer.tokenize(tweet)
    
    tweets_clean = []    
    for word in tweet_tokens:
        if (word not in stopwords_english and # remove stopwords
                word not in string.punctuation): # remove punctuation
            ##stem_word = stemmer.stem(word) # stemming word
            tweets_clean.append(word)

    return tweets_clean

def bag_of_words(tweet):
    words = clean_tweets(tweet)
    words_dictionary = dict([word, True] for word in words)    
    return words_dictionary

def run(tweet):
    filename = 'pre_debate_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))
    user_input = tweet
    custom_tweet_set = bag_of_words(user_input)
    prob_result = loaded_model.prob_classify(custom_tweet_set)

    final_result = str(prob_result.max())
    negative_percent = round(((prob_result.prob("neg"))*100),2)
    positive_percent = round(((prob_result.prob("pos"))*100),2)
    general_percent = round(((prob_result.prob("gen"))*100),2)
    jsondata = {}
    json_final = {}
    json_final['Tweet'] = user_input
    json_final['Overall_Sentiment'] = final_result
    json_final['Negative_Percent'] = negative_percent
    json_final['Positive_Percent'] = positive_percent
    json_final['General_Percent'] = general_percent
    
    jsondata['Sentiment'] = json_final
    
    myjson = json.dumps(jsondata)
    
    return myjson