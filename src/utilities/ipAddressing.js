function get_network_from_ip_net(ip_net) {
  let [ip, net] = ip_net.split('/');
  if (net > 32) net = 32;
  if (net < 0) net = 0;
  let binary = ip_to_bin(ip);
  let netmask = binary_netmask_from_decimal(net);
  let network = network_from_binary_ip_mask(binary, netmask);
  let network_ip = bin_to_ip(network);
  return network_ip + '/' + net;
}

function ip_to_bin(ip) {
  let binary = '';
  for (let octet of ip.split('.')) {
    if (octet > 255) octet = 255;
    if (octet < 0) octet = 0;

    let app = parseInt(octet).toString(2);
    let pad = '00000000';
    app =
      pad.substring(0, pad.length - app.toString(2).length) + app.toString(2);
    binary += '' + app.toString(2);
  }
  return binary;
}

function network_from_binary_ip_mask(binary, netmask) {
  let network = '';
  for (let j = 0; j < 32; j++) {
    network += netmask[j] == '1' ? binary[j] : '0';
  }
  return network;
}

function bin_to_ip(bin) {
  let ip = '';
  for (let i = 0; i < 32; i = i + 8) {
    let app = '';
    for (let k = 0; k < 8; k++) app += bin[i + k];
    ip += parseInt(app, 2) + (i < 24 ? '.' : '');
  }
  return ip;
}

function binary_netmask_from_decimal(dec) {
  let netmask = '';
  if (dec > 32) dec = 32;
  for (let j = 0; j < 32; j++) {
    netmask += j < dec ? '1' : '0';
  }
  return netmask;
}
