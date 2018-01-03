var TEMPLATE_PATH = "templates/";
var child_process = require('child_process');
var fs            = require('fs');
var Promise       = require('promise');
var _             = require('underscore');
var Handlebars    = require("handlebars");
var mkpath        = Promise.denodeify(require('mkpath'));
var path          = require('path');

var readFile  = Promise.denodeify(fs.readFile);
var WriteFile = Promise.denodeify(fs.writeFile);
var execFile  = Promise.denodeify(child_process.execFile);
//need a change
fs.existsSync(path)
function readJSON(filename){
  return readFile(filename, 'utf8')
    .then(JSON.parse)
}

function WriteJSON(filename, data, prettyprint, callback){
  if(prettyprint){
    	return WriteFile(filename, JSON.stringify(data, null, 4));
  }else{
    	return WriteFile(filename, JSON.stringify(data))
  }
}

function MakePaths(paths){
	var tasks = _.map(paths, function(path){
		return mkpath(path)
	});
	return Promise.all(tasks)
}

function ReadJSONDefaultArray(filename){
	var data = [];
	try {
	    data = JSON.parse(fs.readFileSync(filename,'utf8'))
	}
	catch(err) {
	   //we don't need to handle this
	}
	return data
}

function readJSONDefaultObject(filename){
	var data = {};
	try {
	    data = JSON.parse(fs.readFileSync(filename,'utf8'))
	}
	catch(err) {
	   //we don't need to handle this
	}
	return data
}

function renderTemplate(name, data){
	var str = ""
	try {
		var path = TEMPLATE_PATH+name;
	    str = fs.readFileSync(path,'utf8');
	    var template = Handlebars.compile(str);
	    return template(data);
	}
	catch(err) {
	   console.log('err', err);
	   return str
	}
}

//compareMethod(new, old) should return Boolean
//only add to existing if comparison method doesn't return true for any existing
//
function UniqueArrayByCompare(existing, results, compareMethod){

  _.each(results, function(result){
    var found = _.find(existing, function(old){
      return compareMethod(result, old);
    })
    if (!found){
      existing.push(result);
    }
  });
  return existing;
}

function UUID(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

function LogError(err, data){
  //TODO: write to somewhere
  console.log('Logging Error: ', err, data);
  return Promise.resolve();
}

function isDateValid(date){

  if (( Object.prototype.toString.call(date) === "[object Date]" )){
    if ( isNaN( date.getTime() ) ){
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
}

module.exports = {
  "WriteFile" : WriteFile,
  "readFile"  : readFile,
  "execFile"  : execFile,
  "WriteJSON" : WriteJSON,
  "readJSON"  : readJSON,
  "MakePaths" : MakePaths,
  "renderTemplate": renderTemplate,
  "ReadJSONDefaultArray": ReadJSONDefaultArray,
  "readJSONDefaultObject": readJSONDefaultObject,
  "UniqueArrayByCompare": UniqueArrayByCompare,
  "UUID" : UUID,
  "LogError": LogError,
  "isDateValid": isDateValid
};
