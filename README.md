<p align="center">

  <h2 align="center">Lendsqr Assessment</h2>
</p>


<p h3 align="center">
 <aSystem that allow user to create account, fund it, transfer funds to another users and withdraw funds
</p>

## Prerequisites

- [Node.js > 12](https://nodejs.org "Node Js")
- [Express.js > 4](https://expressjs.com/ "Express JS")
- [mysql2 mysql > 2](https://www.npmjs.com/package/mysql2 "MySql2")
- [Nodemon > 1](https://www.npmjs.com/package/nodemon "Nodemon")
- [Knex bookshelf > 1]

## Base dependencies

- [Jest] for testing asynchronous Javascript.
- [Nodemon](https://www.npmjs.com/package/nodemon "Nodemon") for restarting the node application when file changes in the directory are detected.
- swagger for api documentation




## Installation

Install the required packages in your Node JS project


npm install



Installing dependencies into a bare Node JS project

As a general rule, when installing Node js dependencies, you can use the command 

npm i (package)

For example, 
npm i nodemon
npm i knex bookshelf




Start up application



npm run dev


<!-- Work on installation process -->

## Usage

## Folder structure


  - `controllers`: Contains all the logic for each feature.
  - `config`: contains database cofigurations  

  - `events`: Contains the folders that listen for certain events such as the rekognition, savings, wallets events and so on.

  - `middlewares`: contains authentication and authorization
  - `models`: contains database models for each schema
  - `routes`: Contains all the defined routes available in the backend application
  - `services`: contains all the external calls for the application
  - `utils`: Contains helper functions. 
  



# How to use it

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:8700/`

# Endpoints 
swagger documentation 
http://localhost:8700/api-docs/

