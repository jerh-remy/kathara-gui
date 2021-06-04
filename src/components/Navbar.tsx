import React from 'react';
import logo from '../../assets/logo_kathara_white.png';

export const Navbar = () => {
  return (
    <nav className="flex justify-between px-4 py-2 bg-gray-800 shadow-2xl align-center">
      {/* <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center"> */}

      <div className="">
        <img className="w-auto h-8 mt-1" src={logo} alt="kathara logo" />
      </div>
      {/* </a> */}
      <button
        type="button"
        aria-label="Run Lab"
        onClick={() => {
          console.log('clicked');
        }}
        className="relative inline-flex items-center px-4 py-1 text-sm font-bold tracking-wide text-white border border-transparent rounded-lg shadow-sm bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
      >
        {/* <img className="w-auto h-6 mr-2 cursor-pointer" src="download.svg" /> */}
        <span>Run lab</span>
      </button>
    </nav>
  );
};
