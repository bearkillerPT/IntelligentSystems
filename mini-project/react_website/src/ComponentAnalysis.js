// npm init -y
// npm i express

//or 

//npm install wink-nlp --save
//node -e "require( 'wink-nlp/models/install' )" wink-eng-lite-model


//npm i natural
//npm i compromise
//npm i pengines
import nlp from 'compromise'



class ClientAnalysis {
    
    constructor(){  
       
      
       
        this.state = {
            client : {
                "Destination":-1,
                "Answer" : [],
                "!Action":[],
                "ToAnswer":false

            }
        }

        nlp.extend({
            // add new tags
            tags: {
            Season: {
                isA: 'Date',
            },
            },
            // add or change words in the lexicon
            words: {
                summer: 'Season',
                winter: 'Season',
                spring: 'Season',
                autumn: 'Season',
                

            },})
    }
   
    callProlog(input){
        //attraction_type(X,Y)
        input = input.trim();
        
    
        if (!input)
          return;
    
    
          var messages = this.state.messages.slice(0);
        fetch('http://localhost:5000/api?query='+this.fixup(input))
        .then(async response => {
            const data = await response.json();
    
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            console.log(data)
    
            //attraction_type(A,B)
            data.forEach(element => {
              messages = this.state.messages.slice(0);
              messages.push({
                user: true,
                text: element['A'].toString(),
                date: new Date(),
              });
              this.setState({
                messages,
              });
            });
            
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
      }
      

    analyze_question=(input)=> {
        let doc = nlp(input)
        doc.compute('root')
    
        // Clear Answers
        var client = this.state.client;
        client['Answer']= []
        client['!Action']= []

        console.log(doc.out('tags'))

        //Question
        if (doc.has("#QuestionWord")){
            client['ToAnswer']=true;
            if (doc.has("~(you)~")){
                client['!Action'].push("INTRODUCE")
            }else{
                client['!Action'].push("QUESTION")
            }
        } 
        //Order
        // Add function to provide data based on filter
        if (doc.has("~(show|find)~")){
            client['ToAnswer']=true;
        }

        //Welcome
        if (doc.has("~(hello|hi|howdy|hey)~ *")){
            client['!Action'].push("GREETING")
        }
        //Goodbye
        if (doc.has("(goodbye|bye|see you later|until next time|farewell)")){
            client['!Action'].push("FAREWELL")
        }

        if (doc.has("~(#Possessive|#Pronoun)~ * #Copula #Person") || doc.has("#Pronoun #Person")){
            client['ClientName'] = doc.match("#Person").canBe("Person").text()
        }



        //Questions Like:
        // Do you have a destination
        // 0-No, 1-Yes, -1- Not Answered




        // What do You Wanna Do (STAY|FLIGHT|ATTRACTION)
        if (doc.has("~(flights|fly|airplane|takeoff)~")){
            client['Action'] = "FLIGHT"

        }else if (doc.has("~(stay|accomodation|hotel|room|motel)~")){
            client['Action'] = "STAY"

        }else if (doc.has("~(attractions|events)~")){
            client['Action'] = "ATTRACTION"
        }


        //PLACES
        //Field: FinalLocation || InitialLocation for flights
        if (doc.has("(starting in|from) #City")){
            var cityInit =  doc.match("(starting in|from) #City").canBe("Place").text()
            client['InitialLocation'] = cityInit

        }
        if (doc.has("(in|to|visit|know) #City"))
        {	// STAY|ATTRACTION : Visiting City
            var cities =  doc.match("(in|to|visit) #City").canBe("Place").text().split(" ")
            client['FinalLocation'] = cities[0]
            client["Destination"] = 1
        }
        if (doc.has("#City") && client['LQ']=="FL"){
            var cities =  doc.match("#City").canBe("Place").text().split(" ")
            client['FinalLocation'] = cities[0]
            client['LQ']=undefined
            client["Destination"] = 1
        }

        if(doc.has("#Negative * (destination|city)") || doc.has("(somewhere|anywhere)"))
        {	//No Destination / Go Somewhere
            client["Destination"] = 0
        }



        //DATES
        if (doc.has("#Date")){
            client['Date'] = doc.match("#Date").canBe("Date").text()
        }
     
        //PRICE
        if (doc.has("(under|below|up to|until) #Money")){
            client['Price'] = {
                "Value":doc.match("#Money").canBe("Money").text(),
                "Filter":"-"
            }
        }else if((doc.has("(above|at least) #Money"))){
            client['Price'] = {
                "Value":doc.match("#Money").canBe("Money").text(),
                "Filter":"+"
            }
        }
        
        client["!Action"].forEach(element=>{
            if (element === "GREETING"){
                client['Answer'].push("hello! I'm Eliza!")
            }else if (element === "FAREWELL"){
                client['Answer'].push("Goodbye")
            }
        })
          
    
        if (!('FinalLocation' in client) && client['Destination']!=0){
            client['Answer'].push("Where are you planning to go?")
            client['LQ']="FL"
        }else if(!('Date' in client)){
            client['Answer'].push("When are you planning to go?")
            client['LQ']="DATE"
        }else if(!('Price' in client)){
            client['Answer'].push("Do you have any price range restrictions?")
        }
    

        
        return client
    
    
    }


   
   
}



  
export default ClientAnalysis




