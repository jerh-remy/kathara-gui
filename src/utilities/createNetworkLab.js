// import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

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
          '\nlog file /var/log/quagga/zebra.log\n';

        if (machine.routing.isis.en) createIsisConf(machine, lab);
        if (machine.routing.bgp.en) createBgpConf(machine, lab);
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
        // if (intf.eth.number == 0) {
        //   if (machine.type == 'switch') {
        //     intf.ip = '192.168.100.' + switchCounter++ + '/24'; // TODO: E se non bastassero 200+ switch?
        //   } else if (machine.type == 'controller') {
        //     intf.ip = '192.168.100.1/24';
        //   }
        // }
        if (
          intf.eth.domain &&
          intf.eth.domain != '' &&
          intf.eth.ip &&
          intf.eth.ip != ''
        ) {
          lab.file[machine.name + '.startup'] +=
            'ifconfig eth' + intf.eth.number + ' ' + intf.eth.ip + ' up\n';
        }
      }

      // if machine is router, create loopback interface for IS-IS
      if (machine.type === 'router') {
        lab.file[machine.name + '.startup'] +=
          'ifconfig lo' + ' ' + machine.routing.isis.loopback + ' up\n';
      }

      for (let gateway of machine.gateways.gw) {
        if (gateway.gw && gateway.gw != '') {
          //route add default gw GATEWAY dev eth_
          // if (gateway.route == '') {
          //   lab.file[machine.name + '.startup'] +=
          //     'route add default gw ' +
          //     gateway.gw +
          //     ' dev eth' +
          //     gateway.if +
          //     '\n';
          // }
          if (!gateway.route) {
            lab.file[machine.name + '.startup'] +=
              'route add default gw ' + gateway.gw + '\n';
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

function createNSAP(router) {
  if (!router || !router.routing.isis.loopback) {
    return '';
  }
  const loopbackAddress = router.routing.isis.loopback;
  const afi = router.routing.isis.afi;
  const areaId = router.routing.isis.areaId;

  try {
    const arr = loopbackAddress.split('/')[0].split('.');

    const newArr = arr.map((el) => {
      const newEl = el.padStart(3, '0');
      return newEl;
    });

    const muskedLoopback = newArr.join('');

    const newMuskedLoopback = muskedLoopback.match(/.{4}/g).join('.');
    console.log({ newMuskedLoopback });

    const nsap = `${afi}.${areaId}.${newMuskedLoopback}.00`;
    return nsap;
  } catch (error) {
    return '';
  }
}

function createIsisConf(router, lab) {
  lab.file[router.name + '/etc/quagga/daemons'] += 'isisd=yes\n';

  lab.file[router.name + '/etc/quagga/isisd.conf'] =
    '' + 'hostname isisd\n' + 'password zebra\n' + 'enable password zebra\n\n';

  // configure all the interfaces taking part in IS-IS
  for (let intf of router.routing.isis.interfaces) {
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      'interface ' + intf + '\n';
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      ' ip router isis ' + router.routing.isis.word + '\n';
    // lab.file[router.name + '/etc/quagga/isisd.conf'] +=
    //   ' ipv6 router isis ' + router.routing.isis.word + '\n';
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      ' isis circuit-type level-1' + '\n';
  }

  lab.file[router.name + '/etc/quagga/isisd.conf'] += '\n';

  // Create the network service access point (NSAP).
  const nsap = createNSAP(router);

  if (!nsap || nsap !== '') {
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      'router isis ' + router.routing.isis.word + '\n';
    lab.file[router.name + '/etc/quagga/isisd.conf'] += ' net ' + nsap + '\n';
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      ' metric-style wide' + '\n';
    lab.file[router.name + '/etc/quagga/isisd.conf'] +=
      ' is-type level-1' + '\n';
  }

  lab.file[router.name + '/etc/quagga/isisd.conf'] += '\n';
}

function createBgpConf(router, lab) {
  lab.file[router.name + '/etc/quagga/daemons'] += 'bgpd=yes\n';

  lab.file[router.name + '/etc/quagga/bgpd.conf'] =
    '' +
    'hostname bgpd\n' +
    'password zebra\n' +
    'enable password zebra\n' +
    '\n' +
    // Insert the name of the AS
    'router bgp ' +
    router.routing.bgp.as +
    '\n\n';

  // Insert all the Networks on which to advertise BGP
  for (let network of router.routing.bgp.network) {
    if (network && network.ip != '') {
      lab.file[router.name + '/etc/quagga/bgpd.conf'] +=
        'network ' + network.ip + '\n';
    }
  }

  lab.file[router.name + '/etc/quagga/bgpd.conf'] += '\n';

  router.routing.bgp.remote.forEach(function (remote) {
    if (remote && remote.neighbor != '' && remote.as != '') {
      // add the remote-as
      lab.file[router.name + '/etc/quagga/bgpd.conf'] +=
        'neighbor ' + remote.neighbor + ' remote-as ' + remote.as + '\n';

      // add the description if applicable
      if (remote.description && remote.description != '') {
        lab.file[router.name + '/etc/quagga/bgpd.conf'] +=
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
    lab.file[router.name + '/etc/quagga/bgpd.conf'] +=
      '\n' + router.routing.bgp.free + '\n';

  lab.file[router.name + '/etc/quagga/bgpd.conf'] +=
    '\nlog file /var/log/quagga/bgpd.log\n\n' +
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

export function createScript(lab) {
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

  // text += '\nrm "../$0"\n';
  return text;
}

export function createZip(katharaConfig) {
  const lab = createFilesStructure(
    katharaConfig.machines,
    katharaConfig.labInfo
  );
  const zip = require('jszip')();

  for (let folderName of lab.folders) {
    zip.folder(folderName);
  }
  for (let fileName in lab.file) {
    zip.file(fileName, lab.file[fileName]);
  }
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const zipName =
      katharaConfig.labInfo.description || dayjs().format('DD/MM/YYYY');
    saveAs(content, `${zipName} (Lab).zip`);
  });
}
