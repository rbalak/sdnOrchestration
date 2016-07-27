var config = require("./config.js");
var influxDb = require("./influxDbFunctions.js");

var run = function(){
	
	var rxBytesQuery = "SELECT MAX(value) FROM " + config.rxSeries 
	+ "  WHERE time > now() - " +  config.metricCalculationHistory + "s"
	+ " GROUP BY time(15s)";

        var txBytesQuery = "SELECT MAX(value) FROM " + config.txSeries
        + "  WHERE time > now() - " +  config.metricCalculationHistory + "s"
        + " GROUP BY time(15s)"; 
	
//	console.log(rxBytesQuery);
//	console.log(txBytesQuery);

	influxDb.read(rxBytesQuery, function(res){	
		console.log(res.statusCode);
		res.on("data", function(chunk){
                	console.log("data:" + chunk);
		});
	});

        influxDb.read(txBytesQuery, function(res){
                console.log(res.statusCode);
                res.on("data", function(chunk){
                        console.log("data:" + chunk);
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

