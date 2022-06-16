/* WebServer */
:- style_check(-singleton).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(pengines)).
:- http_server(http_dispatch, [port(Port)]).

/* Source Template used: 'https://www.101computing.net/prolog-family-tree/' */

/* Facts */
male(rafael).
male(jose).
male(tiago).
male(afonso).
male(miguel).
female(maria).
female(rita).
female(carlina).
female(ana).
female(beatriz).
female(clara).

parent_of(maria, jose).
parent_of(maria, tiago).
parent_of(maria, ana).
parent_of(rafael, jose).
parent_of(rafael, tiago).
parent_of(rafael, ana).
parent_of(jose, beatriz).
parent_of(rita, beatriz).
parent_of(tiago, clara).
parent_of(carolina, clara).
parent_of(ana, miguel).
parent_of(afonso, miguel).



/* rules */
father_of(X,Y):- male(X),
    parent_of(X,Y).

mother_of(X,Y):- female(X),
    parent_of(X,Y).

grandfather_of(X,Y):- male(X),
    parent_of(X,Z),
    parent_of(Z,Y).

grandmother_of(X,Y):- female(X),
    parent_of(X,Z),
    parent_of(Z,Y).

sibling_of(X, Y):- male(P1),
    female(P2),
    parent_of(P1, X),
    parent_of(P1, Y),
    parent_of(P2, X),
    parent_of(P2, Y),X \= Y.

sister_of(X,Y):- 
    female(X),
    sibling_of(X, Y),X \= Y.

brother_of(X,Y):-
    male(X),
    sibling_of(X, Y),X \= Y.
 
uncle_of(X,Y):-
    male(X),
    brother_of(X,P),
    parent_of(P,Y),X \= Y.

aunt_of(X,Y):-
    female(X),
    sister_of(X,P),
    parent_of(P,Y),X \= Y.

ancestor_of(X,Y):- parent_of(X,Y).
ancestor_of(X,Y):- parent_of(X,Z),
    ancestor_of(Z,Y).