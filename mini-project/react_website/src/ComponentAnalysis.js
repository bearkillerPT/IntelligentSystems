// npm init -y


//npm i compromise
import nlp from 'compromise'
import ConversationProvider from './AnswerProvider'
import dljs from 'damerau-levenshtein-js'

class ClientAnalysis {
    
    constructor(){  
        this.dljs = 
        this.cp = new ConversationProvider()
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
                no:     'Negative',
                nope:     'Negative',
                city:   'City',
                city:   "AttType",
                nature: 'Nature',
                nature: 'AttType',
                historical: 'AttType',
                historical: 'Historical',
                fun:    'AttType',
                fun:    'Fun',
                

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
        doc.contractions().expand()
        doc.compute('root')
        // Clear Answers
        var client = this.state.client;
        client['Answer']= []
        client['!Action']= []

        console.log(doc.out('tags'))


        if (doc.has("~(hello|hi|howdy|hey)~ *")){
            client['!Action'].push("GREETING")
        }
        //Goodbye
        if (doc.has("(goodbye|bye|see you later|until next time|farewell)")){
            client['!Action'].push("FAREWELL")
        }

        if (doc.has("~(#Possessive|#Pronoun)~ * #Copula #Person") || doc.has("#Pronoun #Person")){
            client['ClientName'] = doc.match("#Person").canBe("Person").text()
            client['!Action'].push(this.cp.getQuestion('Greeting')+" "+client['ClientName'])
        }


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

      

        //Negative Answers
        if ('LQ' in client && client['LQ']!=undefined){
            console.log(client['LQ'])
            switch(client['LQ']){
                case "FinalLocation":
                    if(doc.has("#City")){
                        client['LQ']=undefined
                        client["FinalLocation"] = doc.match("#City").canBe("Place").text()
                        client['Destination']=1
                    }
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["FinalLocation"] = undefined
                        client['Destination']=0
                    }
                    break;
                case "Date":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["Date"] = undefined
                    }
                    break;
                case "Price":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["Price"] = undefined
                    }
                    break;
                case "Action":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["Action"] = undefined
                    }
                    break;
                case "Type":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["Type"] = undefined
                    }
                case "ClientName":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["ClientName"] = undefined
                    }
                    break;
            }

            if (client['LQ']==undefined)
                client['Answer'].push(this.cp.getQuestion('Confirmation'))
        }
        //Welcome
       


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
                if (client['LQ']=="InitialLocation") client['LQ']=undefined;

            }
            if (doc.has("(in|to|visit|know) #City"))
            {	// STAY|ATTRACTION : Visiting City
                var cities =  doc.match("(in|to|visit) #City").canBe("Place").text().split(" ")
                client['FinalLocation'] = cities[0]
                client["Destination"] = 1
                if (client['LQ']=="FinalLocation") client['LQ']=undefined;
            }
        
            if(doc.has("#Negative * (destination|city)") || doc.has("(somewhere|anywhere)"))
            {	//No Destination / Go Somewhere
                client["Destination"] = 0
                if (client['LQ']=="FinalLocation") client['LQ']=undefined;
            }



            //DATES
            if (doc.has("#Date")){
                
                if (doc.has("#Month") && doc.has("#NumericValue") ){
                    var month =  doc.match("#Month").canBe("Month").text()                
                    let max = {"value":100, "month":0};
                    var mCounter = 1;
                    ["January","February","March","April","May","June","July","August","September","October","November","December"].forEach(element=>{
                        let result = dljs.distance(element, month);
                        if (result<max['value']) max = {"value":result, "month":mCounter}
                        mCounter++;
                    });

                    var month_st = max['month'].toString()
                    if (month_st.length!=2) month_st = "0"+month_st
                   

                    var day =  doc.match("#NumericValue").canBe("NumericValue").text()  
                    if (day.length==1) day = "0"+day
                    if (day.length!=2) day = day.substring(0,2)
                    client['Date'] = day+"-"+month_st
                    if (client['LQ']==="Date") client['LQ']=undefined;

                }else if (doc.has("#Season")){

                }
            }
        
            //PRICE
            if (doc.has("(under|below|up to|until|at most) #Money")){
                client["Price"] = {
                    "Value":doc.match("#Money").canBe("Money").text(),
                    "Filter":"-"
                }
                if (client['LQ']==="Price") client['LQ']=undefined;
            }
            else if((doc.has("(above|at least) #Money"))){
                client["Price"] = {
                    "Value":doc.match("#Money").canBe("Money").text(),
                    "Filter":"+"
                }
                if (client['LQ']==="Price") client['LQ']=undefined;
            }
            
            //Type

            if (doc.has("~(fun|nature|city|historic)~", null, {fuzzy:0.6})){
                if (doc.has("~fun~", null, {fuzzy:0.6})){
                   client['Type'] = "Fun"

                }else if(doc.has("~City~", null, {fuzzy:0.6})){
                    client['Type'] = "City"

                 }else if(doc.has("~nature~", null, {fuzzy:0.6})){
                    client['Type'] = "Nature"

                 }else if(doc.has("~historic~", null, {fuzzy:0.6})){
                    client['Type'] = "Historical"

                 }
                if (client['LQ']==="Type") client['LQ']=undefined;
            }
          

            client["!Action"].forEach(element=>{
                if (element === "GREETING"){
                    client['Answer'].push(this.cp.getQuestion('Greeting'))
                }else if (element === "FAREWELL"){
                    client['Answer'].push(this.cp.getQuestion('Farewell'))
                }else if (element === "INTRODUCE"){
                    client['Answer'].push(this.cp.getQuestion('Introduction'))
                }
            })
            
        

 
    if (!('ClientName' in client) ){
        client['Answer'].push(this.cp.getQuestion('ClientName'))
        client['LQ']="ClientName"
        
    }else if ((!('FinalLocation' in client) && client['Destination']===-1 ) || client['LQ']==="FinalLocation" ){
        client['Answer'].push(this.cp.getQuestion('FinalLocation'))
        client['LQ']="FinalLocation"

    }else if(!('Date' in client) || client['LQ']==="Date" ){
        client['Answer'].push("When are you planning to go?")
        client['LQ']="Date"
    }else if(!('Price' in client) || client['LQ']==="Price" ){
        client['Answer'].push("Do you have any price range restrictions?")
        client['LQ']="Price"
    }else if(!('Action' in client) || client['LQ']==="Action" ){
        client['Answer'].push("What are you planning to do?")
        client['LQ']="Action"
    }
    else if(client['Action'] == 'ATTRACTION' || client['LQ']==="Type" ){
        client['Answer'].push("What kind of attraction are you looking for? Fun, Nature, historical or City?")
        client['LQ']="Type"
    }
    if (client['ToAnswer']==false && client['Answer'].length==0){
        client['Answer'].push(this.cp.getQuestion('Unsupported'))
    }
    
   
    
    return client
    
}


   
   
}

export default ClientAnalysis

  




