class ConversationProvider {
    
    constructor(){  
      this.loadQuestions()
    }

    loadQuestions(){
        this.answers =
        {
            Action :[
                "What do you plan on doing?"
            ],
            InitialLocation:[
                "Where are you taking your flight from?"
            ],
            FinalLocation: [
                "Where Are You Going?",
                "What is you destination?",
                "Do you know where you want to go?"
            ],
            Price: [
                "Would you like to set a maximum price range?"
            ],
            Date: [
                "When do you want to go?"
            ],
            Type: [
                "What kind of attraction are you looking for? Close to nature? In the city, historical or something fun?",
                "What do you want to do? Something fun to spend your time? Something history related to increase your knowledge, do you want to visit a city or do you just want to have peace in the middle of nature?"
            ],

            //Conversational
            Greeting:[
                "Hello, how are you?"
            ],
            Farewell:[
                "See ya!"
            ],
            Introduction:[
                "My name is Morty! I am your personal Travel Assistant. I can help you find accomodations in different cities, flights and different events!",
                "I'm Morty! Your newest Travel Assistant. Talk to me and I will find you the best accomodations, flights or attractions in different cities!"
            ],
            Unsupported:[
                "I'm sorry, I don't quite understand what you want! Please try to answer my questions!" 
            ],
            Confirmation:[
                "Oki-doki", "Okay!", "As you wish", "Your wish is my command"
            ],
            ClientName:[
                "what is your name?"
            ],
            Reset:[
                "Okay, let's start over!", 
                "From the top:"
            ],
            InvalidDate:[
                "I'm sorry, this date is invalid. Give me more information. If you're looking for flights give me the month and day. You can also just give me a season if you're looking for anything else"
            ],
            ClarifyDestination:[
                "I mean where are you going? Do you have a destination in mind?"
            ],
            ClarifyAction:[
                "Do you want a flight, to find accomodation or to visit some attraction?"
            ],
            ClarifyType:[
                "When selecting an activity, there are four main categories: Fun, City, Historic or Nature"
            ],
            ClarifyDate:[
                "Do you have a specific date in mind? You can just give me the season or if you're looking for flights give me day and month if you have them"
            ]
        }
    }

    getQuestion(topic){
        return this.answers[topic][Math.floor(Math.random() * this.answers[topic].length)];
    }   
}

export default ConversationProvider
