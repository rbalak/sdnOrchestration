from mininet.net import Mininet
from mininet.link import TCLink
from MininetRestServer import MininetRestServer
from mininet.topo import LinearTopo
from mininet.node import RemoteController
from mininet.util import custom
from mininet.link import TCIntf



class MininetLinearTopology():

	def create_linear_topo(self):
		#intf = custom( TCIntf, bw=5)
		self.net = Mininet(topo=LinearTopo(k=2),controller=lambda name: RemoteController( "ODL",ip='192.168.231.103'),listenPort=6633,link=TCLink)
		#self.net = Mininet(topo=LinearTopo(k=2),intf=intf, controller=lambda name: RemoteController( "ODL",ip='192.168.231.103'),listenPort=6633,link=TCLink)
		self.net.start()
		self.update_bandwidth()
		
	
	def add_mininet_to_restservice(self):
		mininetRest = MininetRestServer(self.net)
		mininetRest.run(host='192.168.231.102',port=8182)
		self.net.stop()
		
	def update_bandwidth(self):
		intf_params={'bw':5}
		for link in self.net.links:
			link.intf1.config(**intf_params)
			link.intf1.params.update(intf_params)
			link.intf2.config(**intf_params)
			link.intf2.params.update(intf_params)
			
if __name__ == '__main__':
	mnLinearTopo=MininetLinearTopology();
	mnLinearTopo.create_linear_topo()
	mnLinearTopo.add_mininet_to_restservice()