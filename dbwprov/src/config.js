function define(name, value) {
	Object.defineProperty(exports, name, {
	        value:      value,
        	enumerable: true
    	});
}

define("txTraffic","[MN=TransmittedBytes]");
define("rxTraffic","[MN=ReceivedBytes]");
define("portStats","[DC=PORTSTATS]");
define("odlHost", "54.254.188.41");
define("odlPort",8181);
define("path","/tsdr/metrics/query?tsdrkey=");
define("pollInterval",60000);
define("pollHistory",120);
define("influxDBHost", "192.168.231.104");
define("influxDBPort",18086);
define("influxDBwritePath","/write");
define("pmStatsDB","pmstats");
define("influxDReadPath", "/query?pretty=true");
define("precisionms",  "&precision=ms");
define("metricCalulationInterval", 120000);
define("metricCalculationHistory",240);
define("txSeries", "TransmittedBytes");
define("rxSeries", "ReceivedBytes");
define("mininetHost", "54.254.188.41");
define("mininetPort", "8182");
define("mininetBwPath", "/linkbandwidth/s1-s2");

