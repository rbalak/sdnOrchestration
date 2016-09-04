//bwProv Configurations

function define(name, value) {
	Object.defineProperty(exports, name, {
	        value:      value,
        	enumerable: true
    	});
}

define("txTraffic","[MN=TransmittedBytes]");
define("rxTraffic","[MN=ReceivedBytes]");
define("portStats","[DC=PORTSTATS]");
define("odlHost", "192.168.231.103");
define("odlPort",8181);
define("path","/tsdr/metrics/query?tsdrkey=");
define("pollInterval",60000);
define("pollHistory",120);
define("influxDBHost", "influxdbos-sdnorchestrator.apps.10.2.2.2.xip.io");
define("influxDBPort",80);
define("influxDBwritePath","/write");
define("pmStatsDB","pm_stats");
define("influxDReadPath", "/query?pretty=true");
define("precisionms",  "&precision=ms");
define("metricCalulationInterval", 120000);
define("metricCalculationHistory",240);
define("txSeries", "TransmittedBytes");
define("rxSeries", "ReceivedBytes");
define("mininetHost", "192.168.231.102");
define("mininetPort", "8182");
define("mininetUpBwPath", "/linkbandwidthup/s1-s2/2");
define("mininetDownBwPath", "/linkbandwidthdown/s1-s2/2");
define("utilHighThreshold",50);
define("utilLowThreshold",30);
define("highUtilCount",2);
define("lowUtilCount",2);
