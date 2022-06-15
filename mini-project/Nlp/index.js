// npm init -y
// npm i express

//or 

//npm install wink-nlp --save
//node -e "require( 'wink-nlp/models/install' )" wink-eng-lite-model


//npm i natural
//npm i compromise
//npm i pengines
import nlp from 'compromise'
import express from 'express';

//var Pengine = require('pengines');
//var pengine = new Pengine({
//	server: 'https://swipl.si.bearkillerpt.xyz/'
//});

const PORT = 3009;

const app = express();

let clients = {}

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





var rand = function() {
    return Math.random().toString(36).substring(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};


app.get("/question", (req, res) => {
	
	let doc = nlp(req.query['Q'])
	var clientId = req.query["id"];
	if (clientId==null) {
		clientId = token()
		clients[clientId] = {
			"ClientId":clientId,
			"Answer" : [],
			"!Action":[]
		}
	}else if (!(clientId in clients)){
		clients[clientId] = {
			"ClientId":clientId,
			"Answer" : [],
			"!Action":[]
		}
	}
	doc.compute('root')

	// Clear Answers
	clients[clientId]['Answer']= []
	console.log(clients[clientId])

	console.log(doc.out('tags'))
	
	//Welcome
	if (doc.has("~(hello|hi|howdy|hey)~ *")){
		clients[clientId]['!Action'].push("GREETING")
	}
	//Goodbye
	if (doc.has("(goodbye|bye|see you later|until next time|farewell)")){
		clients[clientId]['!Action'].push("FAREWELL")
	}

	if (doc.has("~(#Possessive|#Pronoun)~ * #Copula #Person") || doc.has("#Pronoun #Person")){
		clients[clientId]['ClientName'] = doc.match("#Person").canBe("Person").text()
	}



	//Questions Like:
	// Do you have a destination
	// 0-No, 1-Yes, -1- Not Answered



	
	// What do You Wanna Do (STAY|FLIGHT|ATTRACTION)
	if (doc.has("~(flights|fly|airplane|takeoff|go)~")){
		clients[clientId]['Action'] = "flight"

	}else if (doc.has("~(stay|accomodation|hotel|room|motel)~")){
		clients[clientId]['Action'] = "stay"
	
	}else if (doc.has("~(attractions|events)~")){
		clients[clientId]['Action'] = "attraction"
	}


	//PLACES
	//Field: FinalLocation || InitialLocation for flights
	if (doc.has("(starting in|from) #City")){
		var cityInit =  doc.match("(starting in|from) #City").canBe("Place").text()
		console.log("--------------------")
		clients[clientId]['InitialLocation'] = cityInit
	
	}
	if (doc.has("(in|to|visit|know) #City"))
	{	// STAY|ATTRACTION : Visiting City
		var cities =  doc.match("(in|to|visit) #City").canBe("Place").text().split(" ")
		clients[clientId]['FinalLocation'] = cities[0]

		clients[clientId]["Destination"] = 1
	}
	if(doc.has("~(no|don't)~ * (destination|city)") || doc.has("(somewhere|anywhere)"))
	{	//No Destination / Go Somewhere
		clients[clientId]["Destination"] = 0
	}



	//DATES
	if (doc.has("#Date")){
		clients[clientId]['Date'] = doc.match("#Date").canBe("Date").text()
	}

	//PRICE
	if (doc.has("(under|below|up to|until) #Money")){
		clients[clientId]['Price'] = {
			"Value":doc.match("#Money").canBe("Money").text(),
			"Filter":"-"
		}
	}else if((doc.has("(above|at least) #Money"))){
		clients[clientId]['Price'] = {
			"Value":doc.match("#Money").canBe("Money").text(),
			"Filter":"-"
		}
	}
	res.json({ message: clients[clientId] });
  });
  
  
  






app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});