# Morty Travel Chat bot

A react based interface for chatting with [Morty](https://si.bearkillerpt.xyz).

This project makes use of swi-prolog for compiling and serving the prolog database. It then has a python flask api that interfaces with pengines to comunicate via https to our front-end React website.
The goal is to create a chat bot that is able to ask questions about what the user likes and try to determine an ideal travel destination!
Example of a prolog query for the testDb script query:
attraction(X, Y, "Zoo", Z, W )