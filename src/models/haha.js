var device = {
  id: '',
  name: '',
  type: 'terminal',
  interfaces: {
    if: [],
    free: '',
  },
  gateways: {
    gw: [],
  },
  pc: {
    dns: '',
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
      network: [],
      remote: [],
      free: '',
    },
  },
};

const katharaConfig = {
  labInfo,
  machines: [],
  elements: [],
  position: [],
  zoom: 1,
};
