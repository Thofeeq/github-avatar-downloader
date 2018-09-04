var args = process.argv.splice(2);
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

function downloadImageByURL(url,filePath,currentFile) {
  
    request.get(url)      
    .on('error', function (err) { 
      if(err){
       throw err;
      }else{
        console.log("Contacting the server...")
      }                                   
    })
    .on('response', function (response) { 
      response.on('end',function(){
        console.log('Downloaded Image[ ' + (currentFile+1) + ' ]');
      } )

     })
    .pipe(fs.createWriteStream("avatars/"+filePath+".png")); 
}


getRepoContributors(args[0], args[1], function(err, result, downloadImageCb) {
  if(args.length <= 1 || args.length >= 3){
    console.log("Please add EXACTLY 2 arguments [repoOwner][repoName]")
    return null;
  };
  if (!fs.existsSync("avatars/")){
    fs.mkdirSync("avatars/");
  }
  console.log("Errors:", err);
  arrayOfContributorsObj = JSON.parse(result);
  console.log(arrayOfContributorsObj.length + " files to be downloaded" );
  arrayOfContributorsObj.forEach(function(contributor,i){
  downloadImageCb(contributor.avatar_url, contributor.login,i);
  }
);
});