import router from '../assets/images/router.png';
import controller from '../assets/images/controller.png';
import networkSwitch from '../assets/images/switch.png';
import other from '../assets/images/other.png';
import terminal from '../assets/images/terminal.png';
import webServer from '../assets/images/webserver.png';
import nameServer from '../assets/images/nameserver.png';

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
    case 'other':
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

const getDeviceTypeString = (deviceType) =>
  deviceType.replace(/ /g, '').toLowerCase();

export { getImage, getDeviceTypeString };
