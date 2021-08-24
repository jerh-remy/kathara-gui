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

  const [showRoutePaths, setShowRoutePaths] = useState(false);

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);
  const setElements = useStoreActions((actions) => actions.setElements);
  const updateNodeInternals = useUpdateNodeInternals();

  const [machines, setMachines] = useState(
    katharaConfig.machines.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [destinationNode, setDestinationNode] = useState(
    katharaConfig.machines[0]
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

  const routers = machines.filter((element) => {
    return element.type === 'router';
  });

  const [routerAndNextHop, setRouterAndNextHop] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log({ routerAndNextHop });

  // this runs whenever the machines array in kathara config changes
  // will occur normally when an existing lab is imported
  useEffect(() => {
    setMachines(() => katharaConfig.machines);
    setDestinationNode(() => katharaConfig.machines[0]);
    setRouterAndNextHop(() => {
      return katharaConfig.machines
        .filter((element) => {
          return element.type === 'router';
        })
        .map((router) => {
          return {
            routerName: router.name,
            nextHop: '',
          };
        });
    });
    // setDestinationIPAddress(() => '');
    // setconvertedIPtoNetworkAddress(() => '');

    return () => {
      console.log('CLEANING UP!!');
      setMachines(() => []);
      setRouterAndNextHop(() => []);
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

    // if the routing path overlay is refreshing reset the edges to default
    if (isRefreshing) {
      resetEdgesToDefault();
    }
  }, [destinationIPAddress, isRefreshing]);

  // registering a listener for the kathara output from ipcMain
  useEffect(() => {
    ipcRenderer.on('script:stdout-reply', (_, stdout) => {
      if (stdout.action.includes('route')) {
        // parse the routing table information to obtain the routing paths
        createRoutingPathFromRoutingTableInfo(
          stdout,
          getNetworkFromIpNet(destinationIPAddress)
        );
      } else {
        console.log({ stdout });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('script:stdout-reply');
      console.log('FINISH');
    };
  }, [destinationIPAddress]);

  // this is a hack to emulate real-time updates in the routing paths
  // by sending the 'show ip route' command every 10 secs
  useEffect(() => {
    const interval = setInterval(
      (function intervalFunc() {
        if (isRefreshing && destinationIPAddress !== '') {
          console.log(`TIMER USE EFFECT CALLED`);
          executeShowIpRoute();
        }

        return intervalFunc;
      })(),
      20000
    );
    return () => clearInterval(interval);
  }, [isRefreshing, destinationIPAddress]);

  // this effect runs when the show route switch is toggled
  useEffect(() => {
    if (showRoutePaths === false || katharaLabStatus.isLabRunning === false) {
      resetEdgesToDefault();
    }
  }, [showRoutePaths, katharaLabStatus.isLabRunning]);

  console.log(
    { destinationIPAddress },
    {
      convertedIPtoNetworkAddress,
    }
  );

  const createRoutingPathFromRoutingTableInfo = (stdout, destination) => {
    try {
      const output = stdout.output;
      const routerName = stdout.action.split('|')[1];
      const outputArr = output.split('\n');

      let nextHopToDestinationNetwork = '';

      console.log(`${routerName}:`, {
        destination,
      });

      outputArr.forEach((line) => {
        if (line.includes('>*')) {
          line.trim();
          let [status, network, ...rest] = line.split(/\s+/);
          // console.log(status, network, {
          //   rest,
          // });
          if (network === destination) {
            if (status.includes('C')) {
              // this router has a direct connection to that network, destination is reached
              nextHopToDestinationNetwork = '0.0.0.0';
              return;
            } else {
              // not directly connected, route could be BGP, RIP or IS-IS or static, find next hop router
              nextHopToDestinationNetwork = rest[2].replace(/[^0-9a-z.]/gi, '');
              return;
            }
          }
        }
      });

      // check if next hop to the destination for that specific router has changed
      let routerWithSavedNextHop = routerAndNextHop.find((router) => {
        return router.routerName === routerName;
      });

      console.log(
        { routerAndNextHop },
        { routerName },
        `Same? ${
          routerWithSavedNextHop.nextHop === nextHopToDestinationNetwork
        }`
      );

      if (isRefreshing) {
        if (routerWithSavedNextHop.nextHop !== nextHopToDestinationNetwork) {
          setRouterAndNextHop((oldArr) => {
            console.log({ oldValue: oldArr });
            const filteredArr = oldArr.filter((el) => {
              return el.routerName !== routerName;
            });

            const newRouter = oldArr.find((el) => {
              return el.routerName === routerName;
            });

            newRouter.nextHop = nextHopToDestinationNetwork;
            return [...filteredArr, newRouter];
          });
        } else {
          console.log(`ROUTING INFO HAS NOT CHANGED FOR ROUTER: ${routerName}`);
        }
        createRoutePath(routerName, nextHopToDestinationNetwork);
      }
    } catch (e) {
      console.log({ e });
    }
  };

  // This function runs after the routing information has been obtained from kathara
  function createRoutePath(routerName, nextHop) {
    try {
      console.log('OBTAINED ROUTING INFO FROM KATHARA!', {
        routerName,
      });

      let currentNode = machines.find((el) => {
        return el.name === routerName;
      });
      console.log(
        `Current node is: ${currentNode.name}`,
        `Current node type is: ${currentNode.type}`
      );
      let nextHopToDestinationNetwork = nextHop;

      if (nextHopToDestinationNetwork !== '0.0.0.0') {
        const nextHopRouter = machines.find((el) => {
          return el.interfaces.if.some((elem) => {
            return elem.eth.ip.split('/')[0] === nextHopToDestinationNetwork;
          });
        });

        const nextHopRouterInterfaceInfo = nextHopRouter.interfaces.if.find(
          (el) => {
            return el.eth.ip.split('/')[0] === nextHopToDestinationNetwork;
          }
        );

        const currentRouterCorrespondingInterfaceInfo = currentNode.interfaces.if.find(
          (el) => {
            return el.eth.domain === nextHopRouterInterfaceInfo.eth.domain;
          }
        );

        const path = {
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
        };
        modifyEdgeForRoutePath(path);
      } else {
        // directly connected edge
        const finalNodeInRoutePath = machines.find((el) => {
          return el.interfaces.if.some((elem) => {
            return elem.eth.ip === destinationIPAddress;
          });
        });

        const finalNodeInterfaceInfo = finalNodeInRoutePath.interfaces.if.find(
          (el) => {
            return el.eth.ip === destinationIPAddress;
          }
        );

        const currentRouterCorrespondingInterfaceInfo = currentNode.interfaces.if.find(
          (el) => {
            return el.eth.domain === finalNodeInterfaceInfo.eth.domain;
          }
        );

        const path = {
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
        };

        modifyEdgeForRoutePath(path);
      }
    } catch (err) {
      console.log('An error occured while trying to plot route path.', { err });
      // alert('An error occured while trying to plot route path.');
    }
  }

  // This function runs after a routing path is found from a source to the destination.
  // Tt is meant to modify the UI with the new edge.
  function modifyEdgeForRoutePath(path) {
    try {
      console.log({ path });
      let isEdgeDirectionCorrectlyConfigured = (el) => {
        return (
          el.source === path.source.id &&
          el.sourceHandle === `eth${path.source.interface.eth.number}` &&
          el.target === path.destination.id &&
          el.targetHandle === `eth${path.destination.interface.eth.number}`
        );
      };

      let isEdgeDirectionWronglyConfigured = (el) => {
        return (
          el.source === path.destination.id &&
          el.sourceHandle === `eth${path.destination.interface.eth.number}` &&
          el.target === path.source.id &&
          el.targetHandle === `eth${path.source.interface.eth.number}`
        );
      };

      const edgeToModify = edges.find((el) => {
        return (
          isEdgeDirectionCorrectlyConfigured(el) ||
          isEdgeDirectionWronglyConfigured(el)
        );
      });
      console.log(path.source.name, { edgeToModify });

      if (edgeToModify) {
        // remove this edge from the internal edges array
        const newEdges = edges.filter((el) => el.id !== edgeToModify.id);

        let modifiedEdge;
        // I need to reverse the source and target in the edge configuration
        console.log(
          `correctly configured edge? ${isEdgeDirectionCorrectlyConfigured(
            edgeToModify
          )}`
        );
        if (isEdgeDirectionCorrectlyConfigured(edgeToModify) === true) {
          // just animate the edge
          modifiedEdge = {
            ...edgeToModify,
            type: 'custom',
            arrowHeadType: 'arrowclosed',
            animated: true,
            style: {
              stroke: 'red',
            },
          };
        } else {
          modifiedEdge = {
            id: edgeToModify.id,
            source: path.source.id,
            sourceHandle: `eth${path.source.interface.eth.number}`,
            target: path.destination.id,
            targetHandle: `eth${path.destination.interface.eth.number}`,
            type: 'custom',
            arrowHeadType: 'arrowclosed',
            animated: true,
            style: { stroke: 'red' },
          };
        }

        updateNodeInternals(modifiedEdge.id);

        // setTimeout(() => {
        //   updateNodeInternals(modifiedEdge.id);
        //   console.log({ modifiedEdge });
        // }, 500);

        setElements([...nodes, ...newEdges, modifiedEdge]);
        // console.timeEnd(`Execution Time`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function executeShowIpRoute() {
    console.log({ sortedRouters: routers });

    console.log(`Executing show ip route`);
    for (let router of routers) {
      const dirPath = katharaConfig.labInfo.labDirPath;
      ipcRenderer.send('script:route', dirPath, router.name);
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
        delete edge.arrowHeadType;
        edge.type = 'default';

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
              <div className="mt-3 border-2 border-dashed rounded-md -mx-2 px-2 py-2">
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
                    {machines.map((machine) => {
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

              <div className="mt-2 -mx-2 flex items-center justify-between">
                <span
                  className={`${
                    !isRefreshing ? 'opacity-0' : 'opacity-100'
                  } ml-2 text-sm text-gray-500`}
                >
                  Refreshing route paths...
                </span>

                <button
                  className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isRefreshing) {
                      setIsRefreshing(() => false);
                      resetEdgesToDefault();
                    } else {
                      if (destinationIPAddress !== '') {
                        setIsRefreshing(() => true);
                      }
                    }
                  }}
                >
                  {isRefreshing ? 'Stop' : 'Start'}
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
