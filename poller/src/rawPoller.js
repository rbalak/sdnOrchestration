var http = require('http');
var moment = require('moment-timezone');
var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");
var content = "";
//Poll the 2 stats - transmitted and recieved bytes from ODL
//Poll data for past 2 minutes
//Check if data is already available in DB. if no, insert data into the InfluxDB.
   

var poll = function(id){

	var header = 
	{ 
		'content-type': 'application/json'
	};

	var until = Math.floor((new Date())/1000);
	var from = until - config.pollHistory;

	var host =  config.odlHost;
	var port = config.odlPort;
	var txTrafficpath = config.path
	+ config.portStats
	+ config.txTraffic
	+ id
	+ "&from=" + from
	+ "&until=" + until;
	var rxTrafficpath = config.path
	+ config.portStats
	+ config.rxTraffic
	+ id
	+ "&from=" + from
	+ "&until=" + until;

	//Set options for TxBytes polling
	var txOptions = {
		header: header,
		host: host,
		port: port,
		path: txTrafficpath, 
		method: 'GET'
	};

	//Set optons for RXBytes polling
	 var rxOptions = {
                header: header,
                host: host,
                port: port,
                path: rxTrafficpath,
                method: 'GET'
        };


	//Make HTTP call & parse the response
	var txReq = http.request(txOptions,function(res){
		parseResponse(res);
	});
	txReq.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	txReq.end();

	//Make HTTP call & parse the response
         var rxReq = http.request(rxOptions,function(res){
                parseResponse(res);
        });
	rxReq.on('error', function(e) {
                console.log('problem with request: ' + e.message);
        });
	rxReq.end();

	//Repeat polling after waiting for polling interval
	setTimeout(function() {
		poll(id);	
	},config.pollInterval);

}

var parseResponse = function(res){
	res.on('data', function (chunk) {
		var data = JSON.parse(chunk);
		var metricRecords = data.metricRecords;
		for(var i=0;i<metricRecords.length;i++){
			var metricRecord = metricRecords[i];
			var metricName = metricRecord.metricName;
			var metricRecordKey = "";
			var recordKeys= metricRecord.recordKeys;
			for(var j=0;j<recordKeys.length;j++)
			{
				recordKey = recordKeys[j];
				metricRecordKey = metricRecordKey + recordKey.keyName + "="+ recordKey.keyValue;
				if (j<recordKeys.length-1){
					metricRecordKey=metricRecordKey+",";
				}
			}
			var metricValue = metricRecord.metricValue;
			var metricTimestamp = (moment(metricRecord.timeStamp,"ddd MMM DD HH:mm:ss z YYYY").valueOf());
			if (content != ""){
				content=content+"\n";
			}
			content = content + metricName + "," + metricRecordKey + " value=" + metricValue + " " + metricTimestamp;
		}
		influxDb.write(content);	
	});
}

module.exports = 
{
	poll: poll
}


