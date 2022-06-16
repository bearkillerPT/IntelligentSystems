# Run prolog file on terminal
````
swipl src/genealogy.pl
````

Colect the port and run python 
````
python3 src/main.py -p <port>
````

Examples of queries to use
````
father_of(X, tiago)
mother_of(X, jose)
grandfather_of(X, beatriz)
grandmother_of(X, miguel)
sister_of(X, tiago)
aunt_of(X, clara)
brother_of(X,ana)
uncle_of(X, miguel)
ancestor_of(X, clara)
````

# Genealogy tree
![alt text](https://github.com/detiuaveiro/study-of-tools-i-88194_90451_106346/blob/main/src/genealogy_tree.png?raw=true)