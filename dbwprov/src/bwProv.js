var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");

var run = function(){
	
	var utilQuery = "SELECT count(value) FROM trafficUtilPct  WHERE time > now() - 1800s and value > "  + config.utilThreshold;
	influxDb.read(utilQuery, function(res){
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
			        var bwPath = config.mininetBwPath
				var bwOptions = {
			                header: header,
			                host: mininetHost,
			                port: mininetPort,
			                path: bwPath,
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

