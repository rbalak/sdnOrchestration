#!/usr/bin/python
from bottle import Bottle, request
import time
import random
from mininet.cli import CLI


class MininetRestServer(Bottle):
    
    def __init__(self, net):
        super(MininetRestServer, self).__init__()
        self.net = net
        self.route('/nodes',method='GET', callback=self.get_nodes)
        self.route('/linkbandwidth/up/<link_name>', method='PUT', callback=self.put_link_bandwidthup)
        self.route('/linkbandwidth/down/<link_name>', method='PUT', callback=self.put_link_bandwidthdown)
        self.route('/nodes/<node_name>/<intf_name>',method='GET',callback=self.get_intf)
        self.route('/links', method='GET', callback=self.get_links)
        self.route('/iperf/<hosts>', method='GET', callback=self.get_iperf)
        self.route('/linkbandwidth/<link_name>', method='GET', callback=self.get_link_bandwidth)
        self.route('/traffic/<hosts>', method='PUT', callback=self.generate_traffic)
        self.route('/traffic/<hosts>/<file_name>', method='PUT', callback=self.generate_traffic_using_files)
      
        
    def get_nodes(self):
        return {'nodes': [n for n in self.net]}

    def get_intf(self, node_name, intf_name):
        node = self.net[node_name]
        intf = node.nameToIntf[intf_name]
        intf_params={'bw':10}
        intf.config(**intf_params)
        intf.params.update(intf_params)
        return {'name': intf.name, 'status': 'up' if intf.name in intf.cmd('ifconfig') else 'down',
                "params": intf.params}
        
    def get_iperf(self, hosts):
        node_name1, node_name2 = hosts.split("-")
        node1 = self.net[node_name1]
        node2 = self.net[node_name2]
        return {'bandwidth': self.net.iperf((node1, node2))}
        
    def get_link_bandwidth(self, link_name):
        #self.put_link_bandwidth(link_name)
        node1, node2 = link_name.split("-")
        link = None
        intf1_bw = None
        intf2_bw = None
        linkbw = None
        for temp_link in self.net.links:
            temp_node1=temp_link.intf1.node.name
            temp_node2=temp_link.intf2.node.name
            if ((str(temp_node1) == str(node2) and str(temp_node2) == str(node1)) or (str(temp_node1) == str(node1) and str(temp_node2) == str(node2))):
               link=temp_link
               break            
        for key in link.intf1.params:
            if key == 'bw':
                intf1_bw = link.intf1.params[key]
                break
        for key in link.intf2.params:
            if key == 'bw':
                intf2_bw = link.intf2.params[key]
                break
        if intf1_bw <= intf2_bw:
            linkbw=intf1_bw
        else:
            linkbw=intf2_bw
        return {'linkbandwidth': linkbw}
    
    def put_link_bandwidthup(self, link_name):
        node1, node2 = link_name.split("-")
        for temp_link in self.net.links:
            temp_node1=temp_link.intf1.node.name
            temp_node2=temp_link.intf2.node.name
            if ((str(temp_node1) == str(node2) and str(temp_node2) == str(node1)) or (str(temp_node1) == str(node1) and str(temp_node2) == str(node2))):
               link=temp_link
               for key in link.intf1.params:
                   if key == 'bw':
                       intf1_bw = link.intf1.params[key]
                       intf1_bw = intf1_bw+10
                       intf_params={'bw':intf1_bw}
                       link.intf1.config(**intf_params)
                       link.intf1.params.update(intf_params)
                       break
	       for key in link.intf2.params:
                   if key == 'bw':
                       intf2_bw = link.intf2.params[key]
                       intf2_bw = intf2_bw+10
                       intf_params={'bw':intf1_bw}
                       link.intf2.config(**intf_params)
                       link.intf2.params.update(intf_params)
                       break
	       break

    def put_link_bandwidthdown(self, link_name):
        node1, node2 = link_name.split("-")
        for temp_link in self.net.links:
            temp_node1=temp_link.intf1.node.name
            temp_node2=temp_link.intf2.node.name
            if ((str(temp_node1) == str(node2) and str(temp_node2) == str(node1)) or (str(temp_node1) == str(node1) and str(temp_node2) == str(node2))):
                link=temp_link
                for key in link.intf1.params:
                    if key == 'bw':
                        intf1_bw = link.intf1.params[key]
                        intf1_bw = intf1_bw-10
                        intf_params={'bw':intf1_bw}
                        link.intf1.config(**intf_params)
                        link.intf1.params.update(intf_params)
                        break
                for key in link.intf2.params:
                    if key == 'bw':
                        intf2_bw = link.intf2.params[key]
                        intf2_bw = intf2_bw-10
                        intf_params={'bw':intf1_bw}
                        link.intf2.config(**intf_params)
                        link.intf2.params.update(intf_params)
                        break
            break		   
			   
			   
    def get_links(self):
		return {'links': [dict(name=l.intf1.node.name + '-' + l.intf2.node.name,
                               node1=l.intf1.node.name, node2=l.intf2.node.name,
                               intf1=l.intf1.name, intf2=l.intf2.name) for l in self.net.links]}

    def generate_traffic(self, hosts):
        str_host1, str_host2 = hosts.split("-")
        src = self.net[str_host1]
        dst = self.net[str_host2]
        filepath = "/home/testfile"
	filename = "testfile"
	port =6666
	dst_cmd = 'nc -l %d > /home/mininet/sent/%s.out' % (port, filename)
    	dst.popen( dst_cmd, shell=True )
	src_cmd = 'nc %s %s < %s' % (dst.IP(), port, filepath )
	print "copying"
	src.popen( src_cmd, shell=True )
	return "OK"

    def generate_traffic_using_files(self, hosts, file_name):
        str_host1, str_host2 = hosts.split("-")
        src = self.net[str_host1]
        dst = self.net[str_host2]
        #filepath = "/home/testFiles/temp.txt"
        #filename = "testfile"
        port = random.randint(1024, 65535)
        #port =6666
        start_time = time.time()
        end_time = start_time + 15
        dst_cmd = 'nc -l -p %d > /home/testFiles/dest/%s.txt' % (port, file_name)
        dst_proc = dst.popen( dst_cmd, shell=True )
        print dst_proc.pid
        src_cmd = 'nc %s %s < /home/testFiles/src/%s.txt' % (dst.IP(), port, file_name )
        print "copying"
        src_proc = src.popen( src_cmd, shell=True )
        print src_proc.pid
        return "OK"

