function createMachineFolders(kathara, lab) {
  for (let machine of kathara) lab.folders.push(machine.name);
}

function createStartupFiles(kathara, lab) {
  for (let machine of kathara) {
    if (machine.name && machine.name != '')
      lab.file[machine.name + '.startup'] = '';
  }
}

/* -------------------------------------------------- */
/* -------------------- LAB CONF -------------------- */
/* -------------------------------------------------- */

function createLabInfo(info, lab) {
  if (info) {
    lab.file['lab.conf'] = '';
    if (info.description && info.description != '')
      lab.file['lab.conf'] += 'LAB_DESCRIPTION="' + info.description + '"\n';
    if (info.version && info.version != '')
      lab.file['lab.conf'] += 'LAB_VERSION="' + info.version + '"\n';
    if (info.author && info.author != '')
      lab.file['lab.conf'] += 'LAB_AUTHOR="' + info.author + '"\n';
    if (info.email && info.email != '')
      lab.file['lab.conf'] += 'LAB_EMAIL="' + info.email + '"\n';
    if (info.web && info.web != '')
      lab.file['lab.conf'] += 'LAB_WEB="' + info.web + '"\n';
    if (lab.file['lab.conf'] != '') lab.file['lab.conf'] += '\n';
  }
}

function createLabConfFile(kathara, lab) {
  if (!lab.file['lab.conf']) lab.file['lab.conf'] = '';
  for (let machine of kathara) {
    for (let intf of machine.interfaces.if) {
      if (intf.eth.domain && intf.eth.domain != '') {
        lab.file['lab.conf'] +=
          machine.name + '[' + intf.eth.number + ']=' + intf.eth.domain + '\n';
      }
    }
    lab.file['lab.conf'] += '\n';
  }
}

/* --------------------------------------------------- */
/* ------------------ STARTUP FILES ------------------ */
/* --------------------------------------------------- */

// TODO: Metti a fattor comune:
/*
	for (let machine of kathara) {
		if (machine.name && machine.name != "" && .....
*/

function createTerminal(kathara, lab) {
  for (let machine of kathara) {
    if (
      machine.name &&
      machine.name != '' &&
      machine.type == 'terminal' &&
      machine.pc.dns &&
      machine.pc.dns != '-'
    ) {
      lab.folders.push(machine.name + '/etc');
      lab.file[machine.name + '/etc/resolv.conf'] =
        'nameserver ' + machine.pc.dns + '\n';
    }
  }
}

function createWebserver(kathara, lab) {
  for (let machine of kathara) {
    if (machine.name && machine.name != '' && machine.type == 'ws') {
      if (machine.ws.userdir == true) {
        lab.folders.push(machine.name + '/home/guest/public_html');
        lab.file[machine.name + '/home/guest/public_html/index.html'] =
          '<html><head><title>Guest Home</title></head><body>Guest Home</body></html>';
        lab.file[machine.name + '.startup'] += 'a2enmod userdir\n';
      }
      lab.file[machine.name + '.startup'] += '/etc/init.d/apache2 start\n';
    }
  }
}

function createOther(kathara, lab) {
  for (let machine of kathara) {
    if (
      machine.name &&
      machine.name != '' &&
      machine.type == 'other' &&
      machine.other.image
    ) {
      lab.file['lab.conf'] +=
        machine.name + '[image]="' + machine.other.image + '"\n';
      for (let file of machine.other.files) {
        lab.file['/etc/scripts/' + file.name] = file.contents;
      }
    }
  }
}

function createNameserver(kathara, lab) {
  //Gestione Nameserver
  //variabili d'appoggio comuni ai vari cicli
  let authority = [];
  let nsroot;

  // generazione file e cartelle comuni
  for (let machine of kathara) {
    if (machine.name && machine.name != '' && machine.type == 'ns') {
      lab.file[machine.name + '.startup'] += '/etc/init.d/bind start\n';
      lab.folders.push(machine.name + '/etc/bind');
      lab.file[machine.name + '/etc/bind/named.conf'] = '';
    }
    //Trovo il root-ns e lo salvo
    if (
      machine.name &&
      machine.name != '' &&
      machine.type == 'ns' &&
      machine.ns.authority &&
      machine.ns.zone == '.'
    ) {
      nsroot = machine;
    }
  }

  //Se non ho root-ns evito di generare una configurazione incoerente
  //db.root in ogni macchina dns
  if (nsroot) {
    for (let machine of kathara) {
      if (machine.name && machine.name != '' && machine.type == 'ns') {
        lab.file[machine.name + '/etc/bind/db.root'] = '';
        if (machine.ns.authority && machine.ns.zone == '.') {
          lab.file[machine.name + '/etc/bind/db.root'] +=
            '$TTL   60000\n@    IN SOA ' +
            nsroot.interfaces.if[0].name +
            ' root.' +
            nsroot.interfaces.if[0].name +
            ' 2006031201 28800 14400 3600000 0\n\n';
        }
        if (machine.ns.recursion) {
          lab.file[machine.name + '/etc/bind/named.conf'] +=
            'options {\n allow-recursion {0/0; };\n};\n\n';
        }
        lab.file[machine.name + '/etc/bind/db.root'] +=
          '.    IN NS ' + nsroot.interfaces.if[0].name + '\n';
        lab.file[machine.name + '/etc/bind/db.root'] +=
          nsroot.interfaces.if[0].name +
          '    IN A ' +
          nsroot.interfaces.if[0].ip.split('/')[0] +
          '\n';
        if (machine.ns.authority && machine.ns.zone == '.') {
          lab.file[machine.name + '/etc/bind/named.conf'] +=
            'zone "." {\n type master;\n file "/etc/bind/db.root";\n};\n\n';
        } else {
          lab.file[machine.name + '/etc/bind/named.conf'] +=
            'zone "." {\n type hint;\n file "/etc/bind/db.root";\n};\n\n';
        }
      }
    }
    //entry in db.zona e named.conf per le altre macchine
    for (let machine of kathara) {
      if (
        machine.name &&
        machine.name != '' &&
        machine.type == 'ns' &&
        machine.ns.authority
      ) {
        authority[machine.ns.zone] = machine;
        if (machine.ns.zone != '.') {
          lab.file[
            machine.name + '/etc/bind/db' + machine.ns.zone.slice(0, -1)
          ] =
            '$TTL   60000\n@    IN SOA ' +
            machine.interfaces.if[0].name +
            ' root.' +
            machine.interfaces.if[0].name +
            ' 2006031201 28800 14400 3600000 0\n\n'; //ho preso il nome dell'interfaccia eth0
          lab.file[machine.name + '/etc/bind/named.conf'] +=
            'zone "' +
            machine.ns.zone.slice(1, -1) +
            '" {\n type master;\n file "/etc/bind/db' +
            machine.ns.zone.slice(0, -1) +
            '";\n};\n\n';
        }
      }
    }
    //entry per l'alberatura delle zone (. conosce .com, .com conosce pippo.com, ecc)
    for (let machine of kathara) {
      if (machine.name && machine.name != '') {
        for (let f in machine.interfaces.if) {
          let ip;
          if (machine.interfaces.if[f].ip)
            ip = machine.interfaces.if[f].ip.split('/')[0];
          if (machine.interfaces.if[f].name) {
            //Entrano tutte le interfacce di tutte le macchine con un nome ns
            //Caso particolare per ns di primo livello
            if (
              machine.ns.zone &&
              machine.type == 'ns' &&
              machine.ns.authority &&
              machine.ns.zone.split('.').length == 3
            ) {
              lab.file[authority['.'].name + '/etc/bind/db.root'] +=
                machine.ns.zone.substring(1) +
                '    IN NS ' +
                machine.interfaces.if[f].name +
                '\n' +
                machine.interfaces.if[f].name +
                '    IN A ' +
                ip +
                '\n';
              lab.file[
                machine.name + '/etc/bind/db' + machine.ns.zone.slice(0, -1)
              ] +=
                machine.ns.zone.substring(1) +
                '    IN NS ' +
                machine.interfaces.if[f].name +
                '\n' +
                machine.interfaces.if[f].name +
                '     IN A ' +
                machine.interfaces.if[f].ip.split('/')[0] +
                '\n';
            } else {
              let nome = machine.interfaces.if[f].name; //www.pluto.net.
              let nomediviso = nome.split('.'); //[0]www [1]pluto [2]net [3].
              let a = '.';

              //Questo for toglie il primo pezzo www.pluto.net. => pluto.net.
              for (let i = 1; i < nomediviso.length; i++) {
                if (nomediviso[i] != '') {
                  a += nomediviso[i] + '.';
                }
              }

              if (authority[a] && authority[a].ns.zone) {
                let fileExt = authority[a].ns.zone.slice(0, -1);
                //Evito che entri in caso di root-ns
                if (fileExt != '') {
                  //se è un NS inserisco il glue record
                  if (machine.type == 'ns' && machine.ns.authority) {
                    //Creo le linee relative a me stesso nel mio file db
                    let aSup = '.';
                    let nomediviso2 = authority[a].ns.zone.split('.');
                    //Questo for toglie il primo pezzo .www.pluto.net. => pluto.net.
                    for (let i = 2; i < nomediviso2.length; i++) {
                      if (nomediviso2[i] != '') {
                        aSup += nomediviso2[i] + '.';
                      }
                    }
                    lab.file[
                      authority[aSup].name +
                        '/etc/bind/db' +
                        authority[aSup].ns.zone.slice(0, -1)
                    ] +=
                      machine.ns.zone.substring(1) +
                      '    IN NS ' +
                      machine.interfaces.if[f].name +
                      '\n' +
                      machine.interfaces.if[f].name +
                      '    IN A ' +
                      machine.interfaces.if[f].ip.split('/')[0] +
                      '\n' +
                      machine.ns.zone.substring(1) +
                      '    IN NS ' +
                      machine.interfaces.if[f].name +
                      '\n';
                  }
                  //e poi inserisco anche il record A, altirmenti solo A
                  lab.file[authority[a].name + '/etc/bind/db' + fileExt] +=
                    machine.interfaces.if[f].name + '    IN A ' + ip + '\n';
                }
              }
            }
          }
        }
      }
    }
  }
}

function createRouter(kathara, lab) {
  // routing dinamico RIP e OSPF
  for (let machine of kathara) {
    if (machine.name && machine.name != '' && machine.type == 'router') {
      if (machine.routing.isis.en || machine.routing.bgp.en) {
        lab.file[machine.name + '.startup'] += '/etc/init.d/zebra start\n';
        lab.folders.push(machine.name + '/etc/quagga');
        lab.file[machine.name + '/etc/quagga/daemons'] = 'zebra=yes\n';

        lab.file[machine.name + '/etc/quagga/zebra.conf'] =
          'hostname zebra\n' +
          'password zebra\n' +
          'enable password zebra\n' +
          '\nlog file /var/log/zebra/zebra.log\n';
      }

      // if (machine.routing.rip.en) {
      //   lab.file[machine.name + '/etc/zebra/daemons'] += 'ripd=yes\n';

      //   lab.file[machine.name + '/etc/zebra/ripd.conf'] =
      //     'hostname ripd\n' +
      //     'password zebra\n' +
      //     'enable password zebra\n' +
      //     '\n' +
      //     'router rip\n';

      //   for (let network of machine.routing.rip.network)
      //     lab.file[machine.name + '/etc/zebra/ripd.conf'] +=
      //       'network ' + network + '\n';

      //   for (let route of machine.routing.rip.route) {
      //     if (route && route != '')
      //       lab.file[machine.name + '/etc/zebra/ripd.conf'] +=
      //         'route ' + route + '\n';
      //   }
      //   lab.file[machine.name + '/etc/zebra/ripd.conf'] += '\n';
      // }

      // if (machine.routing.ospf.en) {
      //   lab.file[machine.name + '/etc/zebra/daemons'] += 'ospfd=yes\n';

      //   lab.file[machine.name + '/etc/zebra/ospfd.conf'] =
      //     'hostname ospfd\n' +
      //     'password zebra\n' +
      //     'enable password zebra\n' +
      //     '\n' +
      //     'router ospf\n';

      //   for (let m /* non trasformare in un for... of */ in machine.routing.ospf
      //     .network) {
      //     lab.file[machine.name + '/etc/zebra/ospfd.conf'] +=
      //       'network ' +
      //       machine.routing.ospf.network[m] +
      //       ' area ' +
      //       machine.routing.ospf.area[m] +
      //       '\n';
      //     if (machine.routing.ospf.stub[m])
      //       lab.file[machine.name + '/etc/zebra/ospfd.conf'] +=
      //         'area ' + machine.routing.ospf.area[m] + ' stub\n';
      //   }
      //   lab.file[machine.name + '/etc/zebra/ospfd.conf'] += '\n';
      // }

      if (machine.routing.isis.en) createIsisConf(machine, lab);
      if (machine.routing.bgp.en) createBgpConf(machine, lab);

      //Free conf
      if (machine.routing.bgp.en) {
        if (machine.routing.bgp.free && machine.routing.bgp.free != '') {
          lab.file[machine.name + '/etc/quagga/bgpd.conf'] +=
            '\n' + machine.routing.bgp.free + '\n';
        }
      }
      //nb: e infine i log
      if (machine.routing.isis.en) {
        lab.file[machine.name + '/etc/quagga/isisd.conf'] +=
          '\nlog file /var/log/quagga/ripd.log\n';
      }
      if (machine.routing.bgp.en) {
        lab.file[machine.name + '/etc/quagga/bgpd.conf'] +=
          '\nlog file /var/log/quagga/ospfd.log\n';
      }
    }
  }
}

/* --------------------------------------------------- */
/* ------------------ AUX FUNCTIONS ------------------ */
/* --------------------------------------------------- */

function createStaticRouting(kathara, lab) {
  // generazione networking e routing statico
  let switchCounter = 2;
  for (let machine of kathara) {
    if (machine.name && machine.name != '') {
      for (let intf of machine.interfaces.if) {
        if (intf.eth.number == 0) {
          if (machine.type == 'switch') {
            intf.ip = '192.168.100.' + switchCounter++ + '/24'; // TODO: E se non bastassero 200+ switch?
          } else if (machine.type == 'controller') {
            intf.ip = '192.168.100.1/24';
          }
        }
        //ifconfig eth_ SELFADDRESS/MASK up
        if (
          intf.eth.domain &&
          intf.eth.domain != '' &&
          intf.ip &&
          intf.ip != ''
        ) {
          lab.file[machine.name + '.startup'] +=
            'ifconfig eth' + intf.eth.number + ' ' + intf.ip + ' up\n';
        }
      }

      for (let gateway of machine.gateways.gw) {
        if (gateway.gw && gateway.gw != '') {
          //route add default gw GATEWAY dev eth_
          if (gateway.route == '') {
            lab.file[machine.name + '.startup'] +=
              'route add default gw ' +
              gateway.gw +
              ' dev eth' +
              gateway.if +
              '\n';
          }
          //route add -net NETADDRESS/MASK gw GATEADDRESS dev eth_
          else {
            lab.file[machine.name + '.startup'] +=
              'route add -net ' +
              gateway.route +
              ' gw ' +
              gateway.gw +
              ' dev eth' +
              gateway.if +
              '\n';
          }
        }
      }

      if (machine.interfaces.free && machine.interfaces.free != '')
        lab.file[machine.name + '.startup'] +=
          '\n' + machine.interfaces.free + '\n';
    }
  }
}

function createIsisConf(router, lab) {
  lab.file[router.name + '/etc/zebra/daemons'] += 'bgpd=yes\n';

  lab.file[router.name + '/etc/zebra/bgpd.conf'] =
    '' +
    'hostname bgpd\n' +
    'password zebra\n' +
    'enable password zebra\n' +
    '\n' +
    // Inserimento nome AS
    'router bgp ' +
    router.routing.bgp.as +
    '\n\n';

  // Inserimento tutte le Network su cui annunciare BGP
  for (let network of router.routing.bgp.network) {
    if (network && network != '') {
      lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
        'network ' + network + '\n';
    }
  }

  lab.file[router.name + '/etc/zebra/bgpd.conf'] += '\n';

  router.routing.bgp.remote.forEach(function (remote) {
    if (remote && remote.neighbor != '' && remote.as != '') {
      //Aggiungo il remote-as
      lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
        'neighbor ' + remote.neighbor + ' remote-as ' + remote.as + '\n';

      //Aggiungo la descrizione
      if (remote.description && remote.description != '') {
        lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
          'neighbor ' +
          remote.neighbor +
          ' description ' +
          remote.description +
          '\n';
      }
    }
  });

  //Free conf
  if (router.routing.bgp.free && router.routing.bgp.free != '')
    lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
      '\n' + router.routing.bgp.free + '\n';

  lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
    '\nlog file /var/log/zebra/bgpd.log\n\n' +
    'debug bgp\ndebug bgp events\ndebug bgp filters\ndebug bgp fsm\ndebug bgp keepalives\ndebug bgp updates\n';
}
function createBgpConf(router, lab) {
  lab.file[router.name + '/etc/zebra/daemons'] += 'bgpd=yes\n';

  lab.file[router.name + '/etc/zebra/bgpd.conf'] =
    '' +
    'hostname bgpd\n' +
    'password zebra\n' +
    'enable password zebra\n' +
    '\n' +
    // Inserimento nome AS
    'router bgp ' +
    router.routing.bgp.as +
    '\n\n';

  // Inserimento tutte le Network su cui annunciare BGP
  for (let network of router.routing.bgp.network) {
    if (network && network != '') {
      lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
        'network ' + network + '\n';
    }
  }

  lab.file[router.name + '/etc/zebra/bgpd.conf'] += '\n';

  router.routing.bgp.remote.forEach(function (remote) {
    if (remote && remote.neighbor != '' && remote.as != '') {
      //Aggiungo il remote-as
      lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
        'neighbor ' + remote.neighbor + ' remote-as ' + remote.as + '\n';

      //Aggiungo la descrizione
      if (remote.description && remote.description != '') {
        lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
          'neighbor ' +
          remote.neighbor +
          ' description ' +
          remote.description +
          '\n';
      }
    }
  });

  //Free conf
  if (router.routing.bgp.free && router.routing.bgp.free != '')
    lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
      '\n' + router.routing.bgp.free + '\n';

  lab.file[router.name + '/etc/zebra/bgpd.conf'] +=
    '\nlog file /var/log/zebra/bgpd.log\n\n' +
    'debug bgp\ndebug bgp events\ndebug bgp filters\ndebug bgp fsm\ndebug bgp keepalives\ndebug bgp updates\n';
}

export function createFilesStructure(kathara, labInfo) {
  let isAllValidNames = kathara
    .map((machine) => machine.name && /[A-z0-9]+/i.test(machine.name))
    .reduce((prev, curr, ind) => (ind == 0 ? curr : prev && curr)); // Tutti i nomi devono aver soddisfatto la regex
  if (!isAllValidNames) return { folders: [], file: [] };

  const lab = {};
  lab.folders = [];
  lab.file = [];
  lab.warning = 0;
  lab.error = 0;

  createLabInfo(labInfo, lab);
  createMachineFolders(kathara, lab);
  createLabConfFile(kathara, lab);
  createStartupFiles(kathara, lab);
  createStaticRouting(kathara, lab);
  createTerminal(kathara, lab);
  createRouter(kathara, lab);
  createWebserver(kathara, lab);
  createNameserver(kathara, lab);
  createOther(kathara, lab);

  console.log({ lab });

  return lab;
}

function createScript(lab) {
  let text =
    '#! /bin/sh\n' +
    "# Remember to use 'chmod +x' (o 'chmod 500') on the .sh file. The script will self-destruct\n" +
    '\n' +
    'rm -rf "$(dirname "$0")/lab"\n' +
    'mkdir "$(dirname "$0")/lab"\n' +
    'cd "$(dirname "$0")/lab"\n';

  for (let folderName of lab.folders) {
    if (folderName != '') text += 'mkdir -p ' + folderName + '\n';
  }

  for (let fileName in lab.file) {
    text += '\ntouch ' + fileName + '\n';
    let lines = lab.file[fileName].split('\n');
    for (let line of lines) {
      if (line != '') text += "echo '" + line + "' >> " + fileName + '\n';
    }
  }

  text += '\nrm "../$0"\n';
  return text;
}

function createZip(lab) {
  let zip = new JSZip();

  for (let folderName of lab.folders) {
    zip.folder(folderName);
  }
  for (let fileName in lab.file) {
    zip.file(fileName, lab.file[fileName]);
  }
  let content = zip.generate({ type: 'blob' });
  saveAs(content, 'lab.zip');
}
