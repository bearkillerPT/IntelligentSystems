import sys
from textblob import TextBlob, Word


def main():
    print(Word("octopus").lemmatize() )
    print("Escreva Sair para parar o programa!")
    while (user_input := input("Introduza uma frase.\n")) != "Sair":
        input_textblob = TextBlob(user_input)
        input_sentiment = input_textblob.sentiment
        print("Tokenization and Lemmatization:")    
        print("\tTokenization:" + str(input_textblob.tokens))    
        print("\tPart-of-speech tags:" + str(input_textblob.tags))    
        print("\tNouns:" + str(input_textblob.noun_phrases))    
        print("\tAll words in Singular:" + str([Word(word).singularize() for word in input_textblob.words]))    
        print("\tAll words in Plural:" + str([Word(word).pluralize() for word in input_textblob.words]))    
        print("\tLemmatization:" + str([Word(word).lemmatize() for word in input_textblob.words]))    
        print("Sentiment Analisys:")    
        print("\tPolarity:" + str(input_sentiment.polarity))    
        print("\tSubjectivity:" + str(input_sentiment.subjectivity))    
        print("Spelling correction:" + str(input_textblob.correct()))    




if __name__ == "__main__":
    main()
