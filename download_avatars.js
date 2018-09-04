var request = require('request');
var fs = require('fs');
var getToken= require('./secrets');

console.log('Welcome to the Github Avatar Downloader');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + getToken.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    console.log("Requesting the images...");
    cb(err, body, downloadImageByURL);
    
  });
}

function downloadImageByURL(url,filePath) {

  // for (let index = 0; index < urlArray.length; index++) {
    request.get(url)      
    .on('error', function (err) { 
      if(err)
      {
       throw err;
      }
      else{
        console.log("Contacting the server...")
      }                                
       
    })
    .on('response', function (response) { 
      
      response.on('end',function(){
        console.log('Download Completed');
      } )

     })
    .pipe(fs.createWriteStream("avatar/"+filePath+".png")); 
    
  //}
  
}


getRepoContributors("jquery", "jquery", function(err, result, downloadImageCb) {
  
  console.log("Errors:", err);
  arrayOfContributorsObj = JSON.parse(result);
  arrayOfContributorsObj.forEach(function(contributor){
    downloadImageCb(contributor.avatar_url, contributor.login);
  }
);
}

);