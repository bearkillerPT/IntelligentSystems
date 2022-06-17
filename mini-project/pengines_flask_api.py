from flask import Flask, request, Response
from flask import jsonify
from pengines.Builder import PengineBuilder
from pengines.Pengine import Pengine
import sys
app = Flask(__name__)


@app.route('/api', methods=['GET', 'POST'])
def callSwiProlog():
    # Connect to the SwiPl server 
    pengine_builder = PengineBuilder(urlserver="https://swipl.si.bearkillerpt.xyz")
    # User input query 
    query = request.args.get("query")
    print(query)
    if query is None: return Response("Bad Request: Input parameter 'query' is missing", status=400, mimetype='application/json')
    try:
        pengine = Pengine(builder=pengine_builder)
        
        pengine.doAsk(pengine.ask(query))
        i = 0
        if not pengine.currentQuery:
            response = jsonify([{"Answer":"No Results are Available"}])
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
           
        while pengine.currentQuery.hasMore and i<20:
            pengine.doNext(pengine.currentQuery)
            i+=1

    except Exception as e:
        response = jsonify([{"Answer":"An Error Occurred"}])
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    response = jsonify(pengine.currentQuery.availProofs)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


app.run(port=3009)
