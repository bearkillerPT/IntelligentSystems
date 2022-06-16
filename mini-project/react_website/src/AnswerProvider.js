

class ConversationProvider {
    
    constructor(){  
      this.loadQuestions()
    }

    loadQuestions(){
        this.answers =
        {
            Action :[
                "What do you plan on doing?"
            ] 
            ,
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
                "Whe do you want to go?"
            ],
            Date: [
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
            ]

        }
    }


    getQuestion(topic){
        return this.answers[topic][0]
    }
   
}

export default ConversationProvider

  




