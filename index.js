const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
var githubRepoArray = [];
var githubAvatar;
var githubFollowers;
var repoCount;
var location;
var actualName;
var userBio;

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "What is your Github username?"
    },
    {
      type: "input",
      name: "colour",
      message: "What colour do you want?"
    }
  ])
}

function getGithub(answers) {


  const queryUrl = `https://api.github.com/users/${answers.github}/repos?per_page=100`;
  const queryUrlFollowers = `https://api.github.com/users/${answers.github}/followers`;
  const queryUrl2 = `https://api.github.com/users/${answers.github}`;
  axios
    .get(queryUrl).then(async function (response) {

      repoCount = response.data.length;

      githubAvatar = response.data[0].owner.avatar_url;
      console.log(githubAvatar);

      axios.get(queryUrlFollowers).then(async function (response) {

        githubFollowers = response.data.length;

        axios.get(queryUrl2).then(async function (response) {
          location = response.data.location;
          actualName = response.data.name;
          userBio = response.data.bio;
        

        const html = generateHTML(answers);

        await writeFileAsync("index.html", html);
        });
      
      })




    });
};


function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid" style='background-color: ${answers.colour}'>
  <div class="container">
    <h1 class="display-4">Hi! My name is ${actualName}</h1>
    <p class="lead">I am from ${location}.</p>
    <ul class="list-group">
    <img src="${githubAvatar}" width="200px" height="200px">
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">My location is ${location}</li>
      <li class="list-group-item">Num of Followers: ${githubFollowers}</li>
      <li class="list-group-item">Num of Github Repositories: ${repoCount}</li>
      <p>${userBio}</p>
     
    </ul>
  </div>
</div>
</body>
</html>`;
}

async function init() {

  try {
    const answers = await promptUser();

    getGithub(answers);

    //const html = generateHTML(answers);

    //await writeFileAsync("index.html", html);

    console.log("Successfully wrote to index.html");
  } catch (err) {
    console.log(err);
  }
}

init();
