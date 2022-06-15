from pengines.Builder import PengineBuilder
from pengines.Pengine import Pengine

import sys

def main():
    run()


def run():
    # Connect to the SwiPl server 
    pengine_builder = PengineBuilder(urlserver="https://swipl.si.bearkillerpt.xyz")
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
    main()