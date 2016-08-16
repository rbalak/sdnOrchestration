var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");

var run = function(){
	
	var utilHighQuery = "SELECT count(value) FROM trafficUtilPct  WHERE time > now() - 400s and value*2 > "  + config.utilHighThreshold;
	influxDb.read(utilHighQuery, function(res){
		var responseData = "";
		res.on("data", function(chunk){
			responseData += chunk;
		});
		res.on("end", function(){
			data = JSON.parse(responseData);
			console.log(data);
			if (data.results[0].series[0].values[0][1] > config.highUtilCount) {
				var header = 
				{ 
					'content-type': 'application/json'
				};
				var mininetHost =  config.mininetHost;
			        var mininetPort = config.mininetPort;
			        var bwUpPath = config.mininetUpBwPath;
				var bwOptions = {
			                header: header,
			                host: mininetHost,
			                port: mininetPort,
			                path: bwUpPath,
			                method: 'PUT'
			        };
				var bwReq = http.request(bwOptions);
				bwReq.end();
			}
			
		});
	});
	
	var utilLowQuery = "SELECT count(value) FROM trafficUtilPct  WHERE time > now() - 1800s and value/2 < "  + config.utilLowThreshold;
	influxDb.read(utilLowQuery, function(res){
		var responseData = "";
		res.on("data", function(chunk){
			responseData += chunk;
		});
		res.on("end", function(){
			data = JSON.parse(responseData);
			console.log(data);
			if (data.results[0].series[0].values[0][1] > config.lowUtilCount) {
				var header = 
				{ 
					'content-type': 'application/json'
				};
				var mininetHost =  config.mininetHost;
			        var mininetPort = config.mininetPort;
			        var bwDownath = config.mininetDownBwPath;
				var bwOptions = {
			                header: header,
			                host: mininetHost,
			                port: mininetPort,
			                path: bwDownPath,
			                method: 'PUT'
			        };
				var bwReq = http.request(bwOptions);
				bwReq.end();
			}
			
		});
	});


	setTimeout(function(){
                run();
        },config.metricCalulationInterval);
}

module.exports =
{
	run: run
}

