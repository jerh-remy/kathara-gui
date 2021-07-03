var labInfo = {
  description: '',
  version: '',
  author: '',
  email: '',
  web: '',
};

var device = {
  id: '',
  name: '',
  type: 'terminal',
  interfaces: {
    if: [
      // {
      //   eth: {
      //     number: 0,
      //     domain: '',
      //     ip: '',
      //   },
      //   dns: '',
      // },
    ],
    free: '',
  },
  gateways: {
    gw: [
      // {
      //   id: '',
      //   route: '',
      //   if: 0,
      //   gw: '',
      // },
    ],
  },
  pc: {
    dns: '-',
  },
  ws: {
    userdir: false,
  },
  ns: {
    recursion: true,
    authority: true,
  },
  other: {
    image: '',
    files: [],
  },
  routing: {
    // rip: {
    //   en: false,
    //   connected: false,
    //   ospf: false,
    //   bgp: false,
    //   network: [''],
    //   route: [''],
    //   free: '',
    // },
    // ospf: {
    //   en: false,
    //   connected: false,
    //   rip: false,
    //   bgp: false,
    //   if: [],
    //   network: [''],
    //   area: ['0.0.0.0'],
    //   stub: [false],
    //   free: '',
    // },
    isis: {
      en: false,
      loopback: '',
      word: '',
      afi: '',
      areaId: '',
      interfaces: [],
    },
    bgp: {
      en: false,
      as: '',
      network: [
        // {
        //   id: '',
        //   ip: '',
        // }
      ],
      remote: [
        // {
        //   id:'',
        //   neighbor: '',
        //   as: '',
        //   description: '',
        // },
      ],
      free: '',
    },
  },
};

export { labInfo, device };
