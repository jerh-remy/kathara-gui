import React from 'react';

export const TerminalConfigurationInfo = () => {
  return (
    <div className="mt-4 mb-4">
      <form className="space-y-8">
        <div>
          <span className="text-teal-600">Machine Information</span>
          <label
            htmlFor="device-name"
            className="mt-1 block text-sm text-gray-800"
          >
            Device name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="device-name"
              name="device-name"
              // value={deviceName}
              // onChange={handleChange}
              placeholder="pc1"
            />
          </div>
        </div>
        <div>
          <span className="text-teal-600">Network Interfaces</span>
          <label
            htmlFor="collision-domain"
            className="mt-1 block text-sm text-gray-800"
          >
            Eth0
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="collision-domain"
              name="collision-domain"
              placeholder="A"
            />
          </div>
          <label htmlFor="ip-address" className="block text-sm text-gray-800">
            IP address/Net
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="ip-address"
              name="ip-address"
              placeholder="0.0.0.0/0"
            />
          </div>
          <label htmlFor="dns" className="block text-sm text-gray-800">
            Complete DNS name
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="dns"
              name="dns"
              placeholder="www.x.y or ROOT-SERVER"
            />
          </div>
          <label htmlFor="dns" className="block text-sm text-gray-800">
            Directly in .startup
          </label>
          <div className="mt-1 mb-2">
            <textarea
              className="resize-none"
              id="startup"
              name="startup"
              rows={4}
            />
          </div>
        </div>
        <div>
          <span className="text-teal-600">Gateway (static) </span>
          <label
            htmlFor="static-route"
            className="mt-1 block text-sm text-gray-800"
          >
            Route (leave empty for default gateway)
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="static-route"
              name="static-route"
              placeholder="0.0.0.0/0"
            />
          </div>
          <div>
            <label htmlFor="gateway" className="block text-sm text-gray-800">
              Gateway (leave empty to generate nothing)
            </label>
            <div className="mt-1 mb-2">
              <input
                type="text"
                id="gateway"
                name="gateway"
                placeholder="0.0.0.0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="interface" className="block text-sm text-gray-800">
              Interface
            </label>
            <div className="mt-1 mb-2">
              <select>
                <option>eth0</option>
                <option>eth1</option>
                <option>eth2</option>
                <option>eth3</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <span className="text-teal-600">Additional functions</span>
          <label htmlFor="ref-ns" className="mt-1 block text-sm text-gray-800">
            Reference DNS
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="ref-ns"
              name="ref-ns"
              placeholder="resolv.conf nameserver"
            />
          </div>
        </div>
        <div className="invisible">
          <p>Should not require this workaround</p>
        </div>
      </form>
    </div>
  );
};
