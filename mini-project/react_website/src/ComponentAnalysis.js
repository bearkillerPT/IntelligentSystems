import nlp from 'compromise'
import ConversationProvider from './AnswerProvider'

class ClientAnalysis {
    
    constructor(){  
        this.dljs = 
        this.cp = new ConversationProvider()
        this.state = {
            client : {
                "Destination":-1,
                "Answer" : [],
                "!Action":[],
                "ToAnswer":false,
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
                fall: 'Season',
                no:     'Negative',
                nope:     'Negative',
                city:   ['City', "AttType"],
                nature: ['Nature', 'AttType'],
                historical: ['AttType','Historical'],
                fun:    ['AttType','Fun'],
            },
        })
    }
   
   
      seasonDate(date){
        var seasons = ["summer", "winter", "autumn", "spring"]
        var winter_months = ["january", "february", "march"]
        var spring_months = ["april", "may", "june"]
        var summer_months = ["july", "august", "september"]
        var autumn_months = ["october", "november", "december"]

        var new_date = date.toLowerCase();
        date = date.toLowerCase();

        if(date.includes("fall")){
            new_date = "Autumn";
        }
        if (seasons.includes(new_date.toLowerCase()))
            return new_date.substr(0,1).toUpperCase()+new_date.substr(1);

        seasons.forEach(element =>{
            if(date.includes(element.toLowerCase())){
                new_date = element;
                console.log(new_date);
            }
        })

        summer_months.forEach(element =>{
            if(date.includes(element)){
                new_date = "Summer";
                console.log(new_date);                
            }
        })
        winter_months.forEach(element =>{
            if(date.includes(element)){
                new_date = "Winter";             
            }
        })
        autumn_months.forEach(element =>{
            if(date.includes(element)){
                new_date = "Autumn";  
            }
        })
        spring_months.forEach(element =>{
            if(date.includes(element)){
                new_date = "Spring";      
            }
        })
        console.log(new_date)
        return new_date;
    }
    
    update_date_format(date){
        var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

        var new_date = "";
        for(var i = 0; i<12; i++){
            if(date.includes(months[i].toLowerCase())){
                console.log(months[i])
                var day = date.replace(/\D/g, '');
                console.log(day)
                if (day){
                    if(i<9){
                        new_date = day + "-0" + (i+1);    
                    }else{
                        new_date = day + "-" + (i+1);
                    }
                    return new_date;
                }else{
                    if(i<9){
                        new_date = "01-0" + (i+1);    
                    }else{
                        new_date = "01-0" + (i+1);
                    }
                    return new_date;
                }
            }
        }
        return;
    }




    handleProlog(){
        var txt = "";
        
        switch(this.state.client.Action){
            // accomodation("Where", "Season", "Type", "Price").
            case "STAY":
                txt = 'accomodation(FinalLocation,Date,Type,Price)';
                if ("Price" in this.state.client && this.state.client["Price"]!==undefined){
                    switch(this.state.client["Price"]['Filter']){
                        case "+":
                            txt='accomodation_price_greater(FinalLocation,Date,Type,Price,"'+this.state.client["Price"]['Min']+'")';
                     
                            break;
                        case "-":
                            txt='accomodation_price_lower(FinalLocation,Date,Type,Price,"'+this.state.client["Price"]['Max']+'")';
                            break;
                        case "+-":
                            txt = 'accomodation_price_between(FinalLocation,Date,Type,Price"'+this.state.client["Price"]["Min"]+'","'+ this.state.client["Price"]['Max']+'")';
                         
                            break;
                    }
                }

           

                ["FinalLocation", "Date"].forEach(element=>{
                    if(element in this.state.client && this.state.client[element]!==undefined){
                        if (element === "Date"){
                            txt = txt.replace("Date", '"'+this.seasonDate(this.state.client[element])+'"')
                        }else{
                            txt = txt.replace(element, '"'+this.state.client[element]+'"');
                        }
                    }
                })
                break;
               
            // flight("From - Country", "From - Continent", "To - Country", "To - Continent", "Date", "Hour", "Class", "Price").
            case "FLIGHT":
                txt = 'flight(InitialLocation,_,FinalLocation,_,Date,Hour,Class,Price)';
                if ("Price" in this.state.client && this.state.client["Price"]!==undefined){
                    switch(this.state.client["Price"]['Filter']){
                        case "+":
                            txt='flight_price_greater(InitialLocation,FinalLocation,Date,Hour,Class,Price,"'+this.state.client["Price"]['Min']+'")';
                     
                            break;
                        case "-":
                            txt='flight_price_lower(InitialLocation,FinalLocation,Date,Hour,Class,Price,"'+this.state.client["Price"]['Max']+'")';
                            break;
                        case "+-":
                            txt = 'flight_price_between(InitialLocation,FinalLocation,Date,Hour,Class,Price,"'+this.state.client["Price"]["Min"]+'","'+ this.state.client["Price"]['Max']+'")';
                         
                            break;
                    }
                }

                ["InitialLocation", "Date", "FinalLocation"].forEach(element=>{
                    if(element in this.state.client && this.state.client[element]!==undefined){
                        if (element === "Date"){
                            txt = txt.replace("Date", '"'+this.update_date_format(this.state.client[element])+'"')
                        }else{
                            txt = txt.replace(element, '"'+this.state.client[element]+'"');
                        }
                    }
                });
                break;


           
            // attraction("Where", "Season", "Type", "Name", "Price").
            case "ATTRACTION":
                txt = 'get_attractions_given_type(FinalLocation,Date,Type,AttractionSubtype,Name,Price)';
                if ("Price" in this.state.client && this.state.client["Price"]!==undefined){
                console.log(this.state.client["Price"])
                    switch(this.state.client["Price"]['Filter']){
                        case "+":
                            txt='attraction_price_greater(FinalLocation,Date,Type,Name,Price,"'+this.state.client["Price"]['Min']+'")';
                     
                            break;
                        case "-":
                            txt='attraction_price_lower(FinalLocation,Date,Type,Name,Price,"'+this.state.client["Price"]['Max']+'")';
                            break;
                        case "+-":
                            txt = 'attraction_price_between(FinalLocation,Date,Type,Name,Price,"'+this.state.client["Price"]["Min"]+'","'+ this.state.client["Price"]['Max']+'")';
                            break;
                    }
                }

                ["FinalLocation", "Date", "Type"].forEach(element=>{
                    if(element in this.state.client && this.state.client[element]!==undefined){
                        if (element === "Date"){
                            txt = txt.replace("Date", '"'+this.seasonDate(this.state.client[element])+'"')
                        }else{
                            txt = txt.replace(element, '"'+this.state.client[element]+'"');
                        }
                    }
                });
                break;
            default:
                break;
        }
        
        console.log(txt)  
        return txt;
    };
   
      
    analyze_question=(input)=> {
        let doc = nlp(input)
        doc.contractions().expand()
        doc.compute('root')
        // Clear Answers
        var changed = false;
        var client = this.state.client;
        client['Answer']= []
        client['!Action']= []
        client['ToAnswer']= false
        client['Query']= undefined

        console.log(doc.out('tags'))


        if (doc.has("~(hello|hi|howdy|hey)~ *")){
            client['!Action'].push("GREETING")
            changed = true
        }
        //Goodbye
        if (doc.has("(goodbye|bye|see you later|until next time|farewell)")){
            client['!Action'].push("FAREWELL")
            changed = true
        }

        if (doc.has("~(#Possessive|#Pronoun)~ * #Copula #Person") || doc.has("#Pronoun #Person" )){
            client['ClientName'] = doc.match("#Person").canBe("Person").text()
            client['Answer'].push(this.cp.getQuestion('Greeting')+" "+client['ClientName'])
            changed = true
        }


        //Question
        if (doc.has("#QuestionWord")){
            client['ToAnswer']=true;
            
            if (doc.has("~(mean)~", null, {fuzzy:0.5})){
                switch(client['LQ']){
                    case "FinalLocation":
                        client['Answer'].push(this.cp.getQuestion('ClarifyDestination'))
                        break;
                    case "Action":
                        client['Answer'].push(this.cp.getQuestion('ClarifyAction'))
                        break;
                    case "Date":
                        client['Answer'].push(this.cp.getQuestion('ClarifyDate'))
                        break;
                    case "Type":
                        client['Answer'].push(this.cp.getQuestion('ClarifyType'))
                        break;
                    default:
                        client['!Action'].push("INTRODUCE")
                        break;
                }
    
            }else if (doc.has("~(you)~")){
                client['!Action'].push("INTRODUCE")
            }else{
                client['!Action'].push("QUESTION")
            }
            changed = true
        }
        if  (doc.has("~reset~",null,{fuzzy:0.8}) || doc.has("~start~",null,{fuzzy:0.8}) || doc.has("~clear~",null,{fuzzy:0.8})){
            client = {
                    "Destination":-1,
                    "Answer" : [],
                    "ClientName" : client["ClientName"],
                    "!Action":[],
                    "ToAnswer":false
    
                
            }
            client['Answer'].push(this.cp.getQuestion('Reset'))
            changed = true
        }

        //Negative Answers
        if ('LQ' in client && client['LQ']!==undefined){
            console.log(client['LQ'])
            switch(client['LQ']){
                case "FinalLocation":
                    if(doc.has("#City")){
                        client['LQ']=undefined
                        var city = doc.match("#City").canBe("Place").text()
                        client["FinalLocation"] = city.substring(0,1).toUpperCase() + city.substring(1).toLowerCase() 
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
                    }else if (doc.has("#NumericValue")){
                        client["Price"] = {
                            "Max":doc.match("#NumericValue").canBe("NumericValue").text(),
                            "Filter":"-"
                        }
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
                    break;
                case "ClientName":
                    if(doc.has("#Negative")){
                        client['LQ']=undefined
                        client["ClientName"] = undefined
                    }else if(doc.has("#Person")){

                        client['ClientName'] = doc.match("#Person").canBe("Person").text()
                        client['LQ']=undefined
                    }
                    break;
                default:
                    break;
            }
            if (client['LQ']===undefined){
                client['Answer'].push(this.cp.getQuestion('Confirmation'))
                changed = true
            }
               
        }

        //Questions Like:
        // Do you have a destination
        // 0-No, 1-Yes, -1- Not Answered

            // What do You Wanna Do (STAY|FLIGHT|ATTRACTION)
            if ((doc.has("~flights~") || doc.has("~takeoff~") || doc.has("~airplane~") || doc.has("~fly~"))){
                
                client['Action'] = "FLIGHT"
                if (client['LQ']==="Action") client['LQ']=undefined;
                changed = true

            }else if (doc.has("~stay~") || doc.has("~accomodation~") || doc.has("~sleep~") || doc.has("~hotel~")){
                client['Action'] = "STAY"
                if (client['LQ']==="Action") client['LQ']=undefined;
                changed = true

            }else if (doc.has("~attractions~") || doc.has("~events~")){
                client['Action'] = "ATTRACTION"
                if (client['LQ']==="Action") client['LQ']=undefined;
                changed = true
            }
            if (doc.has("#Place") && !doc.has("#City")){
                client['Answer'].splice(0,0,"Help me out! If you have a destination give me the city");
            }
            //PLACES
            //Field: FinalLocation || InitialLocation for flights
            if (doc.has("(starting in|from) #City")){
                var cityInit =  doc.match("(starting in|from) #City").canBe("Place").text()
                client['InitialLocation'] = cityInit.substring(0,1).toUpperCase() + cityInit.substring(1).toLowerCase()
                if (client['LQ']==="InitialLocation") client['LQ']=undefined;
                changed = true
            }
            if (doc.has("(in|to|visit|know) #City"))
            {	// STAY|ATTRACTION : Visiting City
                var cities =  doc.match("(in|to|visit) #City").canBe("Place").text().split(" ")
            
                client['FinalLocation'] = cities[0].substring(0,1).toUpperCase() + cities[0].substring(1).toLowerCase()
                client["Destination"] = 1
                if (client['LQ']==="FinalLocation") client['LQ']=undefined;
                changed = true
            }
        
            if(doc.has("#Negative * (destination|city)") || doc.has("(somewhere|anywhere)"))
            {	//No Destination / Go Somewhere
                client["Destination"] = 0
                if (client['LQ']==="FinalLocation") client['LQ']=undefined;
                changed = true
            }

            //DATES
            if (doc.has("#Date")){
                var data =  doc.match("#Date").canBe("Date").text();
                changed = true;
                client['Date'] = data;
                if (client['LQ']==="Date")
                    client['LQ']=undefined;
            }
        
            //PRICE
            if (doc.has("(under|below|up to|until|at most) #Money")){
                client["Price"] = {
                    "Max":doc.match("#Money").canBe("Money").text(),
                    "Filter":"-"
                }
                if (client['LQ']==="Price") client['LQ']=undefined;
                changed = true
            }
            else if((doc.has("(above|at least) #Money"))){
                client["Price"] = {
                    "Min":doc.match("#Money").canBe("Money").text(),
                    "Filter":"+"
                }
                if (client['LQ']==="Price") client['LQ']=undefined;
                changed = true


            }else if(doc.has("(between|from) #NumericValue * #NumericValue"))
            {
                var values = doc.match("#NumericValue").canBe("NumericValue").text().split(" ")
                client["Price"] = {
                    "Filter":"+-"
                }
                if (parseInt(values[0],10)<parseInt(values[1],10)) {
                    client['Price']['Min'] = values[0];
                    client['Price']['Max'] = values[1]
                }else{
                    client['Price']['Min'] = values[1];
                    client['Price']['Max'] = values[0]
                }
                if (client['LQ']==="Price") client['LQ']=undefined;
                changed = true
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

                changed = true
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
    var show = false;
    if (!('ClientName' in client) ){
        client['Answer'].push(this.cp.getQuestion('ClientName'))
        client['LQ']="ClientName"
        
    }else if ((!('FinalLocation' in client) && client['Destination']===-1 ) || client['LQ']==="FinalLocation" ){
        client['Answer'].push(this.cp.getQuestion('FinalLocation'))
        client['LQ']="FinalLocation"

    }else if((!('Date' in client) && !("Season" in client)) || client['LQ']==="Date" ){
        client['Answer'].push("When are you planning to go?")
        client['LQ']="Date"

    }else if(!('Price' in client)  || client['LQ']==="Price" ){
        client['Answer'].push("Do you have any price range restrictions?")
        client['LQ']="Price"

    }else if(!('Action' in client) || client['LQ']==="Action" ){
        client['Answer'].push("What are you planning to do?")
        client['LQ']="Action"
    }
    else if(client['Action'] === 'ATTRACTION' || client['LQ']==="Type" ){
        client['Answer'].push("What kind of attraction are you looking for? Fun, Nature, historical or City?")
        client['LQ']="Type"
    }else{
        show =true;
    }
    if (changed === false){
        client['Answer'].splice(0,0,this.cp.getQuestion('Unsupported'));
    
    }

    //Order
    // Add function to provide data based on filter
    if (doc.has("~(show|find|see|give|tell)~") || client.Answer.length===0 || show ==true){
        client['ToAnswer']=true;

        var txt;
        if (client['Action']==="FLIGHT"){
            if('Date' in client && client['Date']!== undefined && ["summer", "winter", "autumn", "spring", "fall"].includes(client['Date'])){
                client['Answer'].push("In what date are you planning to go (day of month)?")
                client['LQ']="Date"
            }else{
                txt = this.handleProlog();
            }
        }else{
            txt = this.handleProlog();
        }
        client['Query']=txt
        // 
        //this.callProlog(txt);
    }
    console.log(client['Query'])
    return client
    
    }
}

export default ClientAnalysis
