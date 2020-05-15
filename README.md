# PowerUpNextTask

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.3.

Trello's PowerUp which allows to automatically switch from one task to another process task from a BPMN diagram while respecting the conditions specified in the diagram. 

## Heroku deployment
https://tfm-powerup-trello.herokuapp.com/

# Installation

## Trello 
### Create a Trello team if you don't have one. (Important to use a custom PowerUp)
### Create the PowerUp

![alt text](https://i.imgur.com/W0Rajz4.png)
![alt text](https://i.imgur.com/WxYBR36.png)

In blue the name of the PowerUp (Indicate the same as in the environment variables)
In green the name of the team associated with the PowerUp
In red is the access url to the PowerUp. If you are in local use the ngrok url or https://localhost:<port>/

### Setting up the PowerUp
Activate the following capacities:
![alt text](https://i.imgur.com/hGCXlvy.png)

### Activate the PowerUp

There are two ways to activate the PowerUp. The first one is automatic by following the tutorial of the following project: https://github.com/Xiirf/tfm-bpmn-to-trello in the Setting part of the README.
The second is to add it manually once the Trello board has been created by following the instructions below:
![alt text](https://i.imgur.com/xtMm1jO.png)<br/>
![alt text](https://i.imgur.com/XDrtLOu.png)

### Authorize the PowerUp
You have to add the url where you are using the app in your Trello origin (https://trello.com/app-key)<br/>
![alt text](https://i.imgur.com/nMcRekp.png)

## Local launch
npm install <br/>

2 Possibilities: 
- npm run devMode -> Using localhost + https<br/>
- npm run devModeNgrok + ./ngrok.exe http 4200 (Using ngrok to deploy your app)

## Setting
Environmental variables:<br/>
    - appKey: Trello API Keys for Developer (https://trello.com/app-key)<br/>
    - appName: The name of the PowerUp (Only used as an indicator on Trello)

# Utilisation
Once the installation and the launch are done, if it is not already done, the following applications must be installed: https://github.com/Xiirf/tfm-bpmn-to-trello and https://github.com/Xiirf/tfm-bpmn-to-trello-api in order to generate the Trello table. 
The PowerUp is active when you click on a card. In this case you will have a button that will appear in the menu on the right side of the map to automatically change the map.<br/>
![alt text](https://i.imgur.com/An75qZP.png)

# Other information

## Author
Flavien Cocu

## Context
Master's final project, University of Seville, Master's degree in software engineering.
