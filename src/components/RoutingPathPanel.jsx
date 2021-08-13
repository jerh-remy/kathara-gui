import React, { useEffect, useState } from 'react';

import {
  useStoreState,
  useStoreActions,
  useUpdateNodeInternals,
} from 'react-flow-renderer';
import { Switch } from '@headlessui/react';

import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
import { Heading2 } from './Heading2';
import { getNetworkFromIpNet } from '../utilities/ipAddressing';
import { ipcRenderer, remote, shell } from 'electron';

export const RoutingPathPanel = () => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();

  const [routingType, setRoutingType] = useState('bgp');
  const [showRoutePaths, setShowRoutePaths] = useState(false);

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);
  const setElements = useStoreActions((actions) => actions.setElements);
  const updateNodeInternals = useUpdateNodeInternals();

  console.log({ edges });

  const [machines, setMachines] = useState(
    katharaConfig.machines.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [sourceNode, setSourceNode] = useState(katharaConfig.machines[0]);
  const [destinationNode, setDestinationNode] = useState(
    katharaConfig.machines[1]
  );

  const [
    destinationNetworkInterfaces,
    setDestinationNetworkInterfaces,
  ] = useState([]);
  const [destinationIPAddress, setDestinationIPAddress] = useState();
  const [
    convertedIPtoNetworkAddress,
    setconvertedIPtoNetworkAddress,
  ] = useState();

  const [bgpRouterArr, setBgpRouterArr] = useState([]);
  const [routePaths, setRoutePaths] = useState([]);

  const sortedRouters = katharaConfig.machines
    .filter((element) => {
      return element.type === 'router';
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // this runs whenever the machines array in kathara config changes
  // will occur normally when an existing lab is imported
  useEffect(() => {
    setMachines(() => katharaConfig.machines);
    setSourceNode(() => katharaConfig.machines[0]);
    setDestinationNode(() => katharaConfig.machines[1]);
    setDestinationIPAddress(() => '');
    setconvertedIPtoNetworkAddress(() => '');

    return () => {
      console.log('CLEANING UP!!');
      setMachines(() => []);
      setSourceNode(() => null);
      setDestinationNode(() => null);
      setDestinationIPAddress(() => '');
      setconvertedIPtoNetworkAddress(() => '');
    };
  }, [katharaConfig.machines]);

  // set the interfaces of the selected destination node
  useEffect(() => {
    if (destinationNode) {
      setDestinationNetworkInterfaces(() => {
        return destinationNode.interfaces.if;
      });
    }
  }, [destinationNode]);

  // after selecting a destination device, set the first interface
  // in the array as default
  useEffect(() => {
    if (destinationNetworkInterfaces.length > 0) {
      setDestinationIPAddress(() => {
        return destinationNetworkInterfaces[0].eth.ip;
      });
    } else {
      setDestinationIPAddress(() => '');
    }
  }, [destinationNetworkInterfaces]);

  // convert the destination ip address to the network address it belongs to
  useEffect(() => {
    if (destinationIPAddress) {
      setconvertedIPtoNetworkAddress(() => {
        return getNetworkFromIpNet(destinationIPAddress);
      });
    }
  }, [destinationIPAddress]);

  // registering a listener for the kathara output from ipcMain
  useEffect(() => {
    ipcRenderer.on('script:stdout-reply', (_, stdout) => {
      console.log({ stdout });

      switch (stdout.action) {
        case 'IS-IS':
          createISISRoutingPath(stdout.output);
          break;
        case 'BGP':
          createBGPRoutingPath(stdout.output);
          break;
        default:
          console.log({ stdout });
          break;
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('script:stdout-reply');
      console.log('FINISH');
    };
  }, []);

  console.log({ routePaths });

  // this effect runs after the bgp routing information has been obtained from kathara
  useEffect(() => {
    try {
      if (bgpRouterArr.length === sortedRouters.length) {
        console.log('FINISHED GETTING BGP ROUTING INFO FROM KATHARA!', {
          bgpRouterArr,
        });

        let isFinalDestinationFound = false;
        let currentNode = sourceNode;
        let routePathsArr = [];
        while (isFinalDestinationFound === false) {
          const router = bgpRouterArr.find((elem) => {
            return elem.router === currentNode.name;
          });

          const nextHopToDestinationNetwork = router.bgpRoutes.find((el) => {
            return el.networks.includes(convertedIPtoNetworkAddress);
          }).nextHop;

          console.log({ nextHopToDestinationNetwork });

          if (nextHopToDestinationNetwork !== '0.0.0.0') {
            const nextHopRouter = machines.find((el) => {
              return el.interfaces.if.some((elem) => {
                return (
                  elem.eth.ip.split('/')[0] === nextHopToDestinationNetwork
                );
              });
            });

            console.log({ nextHopRouter });

            const nextHopRouterInterfaceInfo = nextHopRouter.interfaces.if.find(
              (el) => {
                return el.eth.ip.split('/')[0] === nextHopToDestinationNetwork;
              }
            );
            console.log({ nextHopRouterInterfaceInfo });

            const currentRouterCorrespondingInterfaceInfo = currentNode.interfaces.if.find(
              (el) => {
                return el.eth.domain === nextHopRouterInterfaceInfo.eth.domain;
              }
            );

            console.log({ currentRouterCorrespondingInterfaceInfo });

            routePathsArr.push({
              source: {
                id: currentNode.id,
                name: currentNode.name,
                interface: currentRouterCorrespondingInterfaceInfo,
              },
              destination: {
                id: nextHopRouter.id,
                name: nextHopRouter.name,
                interface: nextHopRouterInterfaceInfo,
              },
            });

            setRoutePaths(() => {
              return [...routePathsArr];
            });

            if (nextHopRouterInterfaceInfo.eth.ip === destinationIPAddress) {
              // break out of the loop since the complete routing path has now been obtained
              isFinalDestinationFound = true;
            } else {
              // make the next hop router the current node
              currentNode = nextHopRouter;
            }
          } else {
            // once the destination network is reached, use the actual destination ip address
            // to find the final route path to the destination node
            const finalNodeInRoutePath = machines.find((el) => {
              return el.interfaces.if.some((elem) => {
                return elem.eth.ip === destinationIPAddress;
              });
            });

            console.log({ finalNodeInRoutePath });

            const finalNodeInterfaceInfo = finalNodeInRoutePath.interfaces.if.find(
              (el) => {
                return el.eth.ip === destinationIPAddress;
              }
            );
            console.log({ finalNodeInterfaceInfo });

            const currentRouterCorrespondingInterfaceInfo = currentNode.interfaces.if.find(
              (el) => {
                return el.eth.domain === finalNodeInterfaceInfo.eth.domain;
              }
            );

            console.log({ currentRouterCorrespondingInterfaceInfo });

            routePathsArr.push({
              source: {
                id: currentNode.id,
                name: currentNode.name,
                interface: currentRouterCorrespondingInterfaceInfo,
              },
              destination: {
                id: finalNodeInRoutePath.id,
                name: finalNodeInRoutePath.name,
                interface: finalNodeInterfaceInfo,
              },
            });

            setRoutePaths(() => {
              return [...routePathsArr];
            });

            // break out of the loop since the complete routing path has now been obtained
            isFinalDestinationFound = true;
          }
        }
        console.timeEnd('Execution Time');
        console.log({ routePathsArr });
      }
    } catch (err) {
      console.log({ err });
    }
  }, [bgpRouterArr]);

  // this effect runs after an element is added to the routing path array.
  // it is meant to modify the UI with the new edges representing the paths
  useEffect(() => {
    if (routePaths && routePaths.length > 0) {
      console.log(`THIS EDGE MODIFICATION EFFECT JUST RAN`);
      for (let i = 0; i < routePaths.length; i++) {
        const path = routePaths[i];
        console.log({ path });
        const edgeToModify = edges.find((el) => {
          return (
            (el.source === path.source.id &&
              el.sourceHandle === `eth${path.source.interface.eth.number}` &&
              el.target === path.destination.id &&
              el.targetHandle ===
                `eth${path.destination.interface.eth.number}`) ||
            (el.source === path.destination.id &&
              el.sourceHandle ===
                `eth${path.destination.interface.eth.number}` &&
              el.target === path.source.id &&
              el.targetHandle === `eth${path.source.interface.eth.number}`)
          );
        });
        console.log({ edgeToModify });

        if (edgeToModify) {
          // remove this edge from the internal edges array
          const newEdges = edges.filter((el) => el.id !== edgeToModify.id);

          // animate the edge
          const modifiedEdge = {
            ...edgeToModify,
            animated: true,
            style: { stroke: 'red' },
          };

          updateNodeInternals(modifiedEdge.id);

          console.log({ modifiedEdge });

          setElements([...nodes, ...newEdges, modifiedEdge]);
        }
      }
    }
    // return () => {
    //   routePaths = [];
    // };
  }, [routePaths]);

  // this effect runs when the show route switch is toggled
  useEffect(() => {
    if (showRoutePaths === false) {
      resetEdgesToDefault();
    }
  }, [showRoutePaths]);

  // console.log(machines);
  // console.log(sourceNode.name);
  // console.log(destinationNode.name);
  console.log({ destinationIPAddress });
  console.log({ convertedIPtoNetworkAddress });

  function createBGPRoutingPath(output) {
    try {
      const outputArr = output.split('\n');
      const routerIDArr = outputArr[0].split(',')[1].split(' ');
      const routerID = routerIDArr[routerIDArr.length - 1];
      // console.log({
      //   routerID,
      // });

      let routerName;
      try {
        routerName = sortedRouters.find((router) => {
          return router.interfaces.if.some((intf) => {
            if (!intf.eth.ip) {
              return;
            }
            return intf.eth.ip.split('/')[0].trim() === routerID.trim();
          });
        }).name;
      } catch (error) {
        console.log({ error });
        routerName = sortedRouters.find((router) => {
          if (!router.routing.isis && router.routing.isis.en) {
            return false;
          }
          return (
            router.routing.isis.loopback.split('/')[0].trim() ===
            routerID.trim()
          );
        }).name;
      }

      // console.log({
      //   routerName,
      // });

      let bestPathNetwork;
      let bgpRoutes = [];

      outputArr.forEach((line) => {
        if (line.startsWith('*') || line.startsWith('*>')) {
          line.trim();
          let [status, network, nextHop] = line.split(/\s+/);
          console.log(status, network, nextHop);
          if (status === '*>') {
            if (nextHop === '0') {
              nextHop = network;
              network = bestPathNetwork;
            }

            const existingNextHop = bgpRoutes.find((elem) => {
              return elem.nextHop === nextHop;
            });
            // console.log({
            //   existingNextHop,
            // });
            if (!existingNextHop) {
              bgpRoutes.push({
                nextHop: nextHop,
                networks: [network],
              });
            } else {
              const filteredArr = bgpRoutes.filter((elem) => {
                return elem.nextHop !== nextHop;
              });
              bgpRoutes = [
                ...filteredArr,
                {
                  ...existingNextHop,
                  networks: [...existingNextHop.networks, network],
                },
              ];
            }
          } else if (status === '*') {
            bestPathNetwork = network;
            return;
          }
        }
      });
      // console.log({
      //   bgpRoutes,
      // });

      setBgpRouterArr((arr) => {
        const newArr = [
          ...arr,
          {
            router: routerName,
            bgpRoutes: bgpRoutes,
          },
        ];
        return newArr.sort((a, b) => a.router.localeCompare(b.router));
      });

      // clear the internal array
      bgpRoutes = [];
    } catch (e) {
      console.log({ e });
    }
  }

  function createISISRoutingPath(output) {
    try {
      const outputArr = output.split('\n');
      const routerIDArr = outputArr[0].split(',')[1].split(' ');
      const routerID = routerIDArr[routerIDArr.length - 1];
      // console.log({
      //   routerID,
      // });

      const routerName = sortedRouters.find((router) => {
        return router.interfaces.if.some((intf) => {
          if (!intf.eth.ip) {
            return;
          }
          return intf.eth.ip.split('/')[0].trim() === routerID.trim();
        });
      }).name;

      // console.log({
      //   routerName,
      // });

      let bestPathNetwork;
      outputArr.forEach((line) => {
        if (line.startsWith('*') || line.startsWith('*>')) {
          line.trim();
          let [status, network, nextHop] = line.split(/\s+/);
          // console.log(
          //   {
          //     status,
          //   },
          //   {
          //     network,
          //   },
          //   {
          //     nextHop,
          //   }
          // );
          if (status === '*>') {
            if (nextHop === '0') {
              nextHop = network;
              network = bestPathNetwork;
            }

            const existingNextHop = bgpRoutes.find((elem) => {
              return elem.nextHop === nextHop;
            });
            // console.log({
            //   existingNextHop,
            // });
            if (!existingNextHop) {
              bgpRoutes.push({
                nextHop: nextHop,
                networks: [network],
              });
            } else {
              const filteredArr = bgpRoutes.filter((elem) => {
                return elem.nextHop !== nextHop;
              });
              bgpRoutes = [
                ...filteredArr,
                {
                  ...existingNextHop,
                  networks: [...existingNextHop.networks, network],
                },
              ];
            }
          } else if (status === '*') {
            bestPathNetwork = network;
            return;
          }
        }
      });
      console.log({
        bgpRoutes,
      });
      bgpRouterArr.push({
        router: routerName,
        bgpRoutes: bgpRoutes,
      });
      bgpRouterArr.sort((a, b) => a.router.localeCompare(b.router));

      // clear the array
      bgpRoutes = [];

      console.log({
        bgpRouterArr,
      });
    } catch (e) {
      console.log({ e });
    }
  }

  function executeShowIpBgp() {
    console.log({ sortedRouters });
    // clear the array
    setBgpRouterArr(() => []);
    setRoutePaths(() => []);

    // const dirPath = katharaConfig.labInfo.labDirPath;
    // ipcRenderer.send('script:bgp', dirPath, 'r2');
    for (let router of sortedRouters) {
      const dirPath = katharaConfig.labInfo.labDirPath;
      ipcRenderer.send('script:bgp', dirPath, router.name);
    }
  }

  function executeShowIpISIS() {
    console.log({ sortedRouters });
    // clear the array
    bgpRouterArr = [];
    // const dirPath = katharaConfig.labInfo.labDirPath;
    // ipcRenderer.send('script:isis', dirPath, 'r2');
    for (let router of sortedRouters) {
      const dirPath = katharaConfig.labInfo.labDirPath;
      ipcRenderer.send('script:isis', dirPath, router.name);
    }
  }

  function resetEdgesToDefault() {
    const originalEdgesArr = edges.filter((el) => {
      return !el.hasOwnProperty('animated');
    });
    const modifiedEdgesArr = edges.filter((el) => {
      return el.hasOwnProperty('animated');
    });
    console.log({ modifiedEdgesArr });

    // remove the animation
    if (modifiedEdgesArr.length > 0) {
      modifiedEdgesArr.forEach((edge) => {
        delete edge.animated;
        delete edge.style;

        updateNodeInternals(edge.id);
      });

      const elements = [...nodes, ...originalEdgesArr, ...modifiedEdgesArr];
      setElements(elements);
    }
  }

  return (
    <div
      className={`${
        !katharaLabStatus.isRoutingPathPanelOpen ? 'hidden' : 'block'
      } absolute z-[5] top-[10px] right-[10px] h-auto w-full max-w-[16rem] px-5 py-4 bg-white shadow-md rounded-md`}
    >
      <div className="flex justify-between items-center space-x-4">
        <Heading2 text={`Routing Path`} />
        <button
          type="button"
          aria-label="Hide routing path overlay"
          onClick={(e) => {
            e.preventDefault();
            if (!katharaLabStatus.isRoutingPathPanelOpen) {
              setKatharaLabStatus((status) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: true,
                };
                return newStatus;
              });
            } else {
              setKatharaLabStatus((status) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: false,
                };
                return newStatus;
              });
            }
          }}
          className="w-auto flex whitespace-nowrap items-center px-2 py-0 text-xs font-normal tracking-normal rounded-sm text-gray-500 border hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 focus:outline-none focus:ring-1  focus:ring-teal-50"
        >
          Hide
        </button>
      </div>

      {machines.length > 1 ? (
        <>
          <Switch.Group>
            <div className="flex items-center justify-between mt-3">
              <Switch.Label className="mr-4 text-sm text-gray-600">
                Show route paths
              </Switch.Label>
              <Switch
                checked={showRoutePaths}
                onChange={setShowRoutePaths}
                className={`${
                  showRoutePaths ? 'bg-teal-100' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
              >
                <span
                  className={`${
                    showRoutePaths ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-teal-600 rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>
          {showRoutePaths && (
            <>
              <div className="flex mt-3">
                <label className="flex items-center w-1/2">
                  <input
                    className="mr-[5px] rounded-full"
                    type="radio"
                    id="routing-type"
                    value="bgp"
                    onChange={(e) => {
                      setRoutingType(e.target.value);
                    }}
                    checked={routingType === 'bgp'}
                    name="routing-type"
                  />
                  <span className="text-sm text-gray-800 mr-4">BGP</span>
                </label>
                <label className="flex items-center w-1/2">
                  <input
                    className="mr-[5px] rounded-full"
                    type="radio"
                    id="routing-type"
                    value="isis"
                    onChange={(e) => {
                      setRoutingType(e.target.value);
                    }}
                    checked={routingType === 'isis'}
                    name="routing-type"
                  />
                  <span className="text-sm text-gray-800">IS-IS</span>
                </label>
              </div>
              <div className="mt-3 border-2 border-dashed rounded-md -mx-2 px-2 py-2">
                <label htmlFor="source" className="block text-sm text-gray-800">
                  Source node
                </label>
                <div className="mt-1 mb-2">
                  <select
                    name="source"
                    onChange={(e) => {
                      setSourceNode(() => {
                        const source = machines.find((el) => {
                          return el.name === e.target.value;
                        });
                        return source;
                      });
                    }}
                    value={sourceNode.name}
                  >
                    {machines
                      .filter((machine) => {
                        return machine.name !== destinationNode.name;
                      })
                      .map((machine) => {
                        return (
                          <option key={machine.name} value={machine.name}>
                            {machine.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <label
                  htmlFor="destination"
                  className="block text-sm text-gray-800"
                >
                  Destination node
                </label>
                <div className="mt-1 mb-2">
                  <select
                    name="destination"
                    onChange={(e) => {
                      setDestinationNode(() => {
                        const dest = machines.find((el) => {
                          return el.name === e.target.value;
                        });
                        return dest;
                      });
                    }}
                    value={destinationNode.name}
                  >
                    {machines
                      .filter((machine) => {
                        return machine.name !== sourceNode.name;
                      })
                      .map((machine) => {
                        return (
                          <option key={machine.name} value={machine.name}>
                            {machine.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <label
                  htmlFor="interface"
                  className="block text-sm text-gray-800"
                >
                  Destination IP address
                </label>
                <div className="mt-1 mb-2">
                  <select
                    name="interface"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setDestinationIPAddress(e.target.value);
                    }}
                  >
                    {destinationNetworkInterfaces.map((intf) => {
                      return (
                        <option key={intf.eth.number} value={intf.eth.ip}>
                          {`${intf.eth.ip} - eth${intf.eth.number}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-2 -mx-2 block text-right">
                <button
                  className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log({ routingType });
                    resetEdgesToDefault();

                    if (routingType === 'bgp' && destinationIPAddress !== '') {
                      console.time('Execution Time');
                      executeShowIpBgp();
                    }
                    if (routingType === 'isis' && destinationIPAddress) {
                      executeShowIpISIS();
                    }
                  }}
                >
                  Start
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="block text-center mt-2">
          <p className="text-sm text-gray-500">
            You can only find the routing path for more than one device
          </p>
        </div>
      )}
    </div>
  );
};
