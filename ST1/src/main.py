from operator import le
from jinja2 import Undefined
from pengines.Builder import PengineBuilder
from pengines.Pengine import Pengine

import sys, getopt

# Usage
def usage():
    print('main.py -p <port>')

def main(argv):
    # ARG parsing and client start! 
    if len(argv) == 0:
        usage()
        sys.exit(1)
    try:
        opts, args = getopt.getopt(argv,"hp:")
    except getopt.GetoptError:
        usage()
        sys.exit(1)
    for opt, arg in opts:
        if opt == '-h':
            usage()
            sys.exit()
        elif opt in ("-p"):
            port = arg
    run(port)


def run(port):
    # Connect to the SwiPl server 
    pengine_builder = PengineBuilder(urlserver="http://localhost:{}".format(port))
    # User input query 
    while (query := input("Enter your query: ")) != '':
        try:
            pengine = Pengine(builder=pengine_builder)
            pengine.doAsk(pengine.ask(query))
            if not pengine.currentQuery:
                print("The query failed!")
                continue
            while pengine.currentQuery.hasMore:
                pengine.doNext(pengine.currentQuery)
                print(pengine.currentQuery.availProofs)
        except Exception as e:
            print(e)
            



if __name__ == "__main__":
    main(sys.argv[1:])