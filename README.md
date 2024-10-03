# Discussion Forum | [LINK](https://icarforum-dhg9g2d8bzfmdbgf.brazilsouth-01.azurewebsites.net/auth)
A discussion forum platform built using MERN Stack.
As In the government organisation ICAR there are various posts varies in ranking and multiple groups / divisions with different or similar intrests it became quite a complex task to communicate or connect to specific person without going through a long chain of people.  
A need was felt to have a such wonderful communication platform where everyone can contribute their views/ ideas on particular topic of interest. This powerful medium will help the authorities to share information ,seek suggestions or ideas of a group or sepcific group member in a short time.

### Features
User authentication and authorization
Posts /Thread creation and management
Commenting system
User profiles and settings

## Technologies Used
Node.js
Express.js
MongoDB
Mongoose
Passport.js (for authentication)
EJS (template engine)

## Getting Started
Clone the repository: git clone https://github.com/ApeSkillx/discussion.git
Split Terminal into Two Parts:
a-> cd client
b-> cd server 
Install dependencies: npm install or npm install --f to force install
Start the server : nodemon
Start client side: npm start
Visit http://localhost:3000 in your web browser
> Likewise you can also cd to admin and install packages to access its features

### Set up Database
> Make sure you either setup Mongo Compass locally or Use Mongo Atlas for cloud storage

For Local storage of Database
1. Install and setup mongo compass
2. create database "discussion" and collections based on .json files
3. Import .json files in in their respective collections.
> Now the database is ready for CRUD operations and you can use the discussion forum locally

For Cloud Storage of Database
1. Set up mongoAtlas 
2. Create Cluster and Collections and import .json files
3. Link them to the server
>Now the database is setup on your Atlas Credentials

## Usage
Register or login to create Posts / Threads or contribute in ongoing conversations.
Comment or share information according to their accessibility rights.
Explore threads across various groups and engage in discussions

## Contributing
Pull requests and issues are welcome! Please see the  file for details.

## Author

- **[ApeSkillx](https://github.com/ApeSkillx)** - Creator and maintainer of the project.
- **[Nitin](https://github.com/nitin621)** - Creator and maintainer of the project.
