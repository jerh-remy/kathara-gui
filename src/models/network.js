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
    fileCounter: 0,
  },
  routing: {
    rip: {
      en: false,
      connected: false,
      ospf: false,
      bgp: false,
      network: [''],
      route: [''],
      free: '',
    },
    ospf: {
      en: false,
      connected: false,
      rip: false,
      bgp: false,
      if: [],
      network: [''],
      area: ['0.0.0.0'],
      stub: [false],
      free: '',
    },
    bgp: {
      en: false,
      as: '',
      network: [''],
      remote: [
        {
          neighbor: '',
          as: '',
          description: '',
        },
      ],
      free: '',
    },
  },
};

export { labInfo, device };
