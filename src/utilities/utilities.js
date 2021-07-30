import router from '../../assets/images/router.png';
import controller from '../../assets/images/controller.png';
import networkSwitch from '../../assets/images/switch.png';
import other from '../../assets/images/other.png';
import terminal from '../../assets/images/terminal.png';
import webServer from '../../assets/images/webserver.png';
import nameServer from '../../assets/images/nameserver.png';

const getImage = (deviceType) => {
  const dt = getDeviceTypeString(deviceType);
  // console.log(`The deviceType str is ${dt}`);
  let img;
  switch (dt) {
    case 'terminal':
      img = terminal;
      break;
    case 'router':
      img = router;
      break;
    case 'switch':
      img = networkSwitch;
      break;
    case 'nameserver':
      img = nameServer;
      break;
    case 'webserver':
      img = webServer;
      break;
    case 'custom':
      img = other;
      break;
    case 'controller':
      img = controller;
      break;
    default:
      img = terminal;
      break;
  }
  return img;
};

const getDefaultDeviceLabel = (deviceType) => {
  let label;
  switch (deviceType) {
    case 'terminal':
      label = 'Terminal';
      break;
    case 'router':
      label = 'Router';
      break;
    case 'switch':
      label = 'Switch';
      break;
    case 'nameserver':
      label = 'Name Server';
      break;
    case 'webserver':
      label = 'Web Server';
      break;
    case 'custom':
      label = 'Custom';
      break;
    case 'controller':
      label = 'Controller';
      break;
    default:
      label = 'Terminal';
      break;
  }
  return label;
};

const getDeviceTypeString = (deviceType) =>
  deviceType.replace(/ /g, '').toLowerCase();

const sortInterfacesString = (interfacesArr) => {
  let collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  return interfacesArr.sort(collator.compare);
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export {
  getImage,
  getDeviceTypeString,
  sortInterfacesString,
  toTitleCase,
  getDefaultDeviceLabel,
};
