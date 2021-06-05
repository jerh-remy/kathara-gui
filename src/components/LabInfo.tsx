import React from 'react';

export const LabInfo = () => {
  return (
    <div className="mt-4 mb-4">
      <form className="mb-0 space-y-3" action="#" method="post">
        <div>
          <label htmlFor="description" className="block text-sm text-gray-300">
            Description
          </label>
          <div className="mt-1">
            <input type="text" id="description" name="description" />
          </div>
        </div>
        <div>
          <label htmlFor="version" className="block text-sm text-gray-300">
            Version
          </label>
          <div className="mt-1">
            <input type="text" id="version" name="version" />
          </div>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm text-gray-300">
            Author(s)
          </label>
          <div className="mt-1">
            <input type="text" id="author" name="author" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300">
            Email
          </label>
          <div className="mt-1">
            <input type="email" id="email" name="email" />
          </div>
        </div>
        <div>
          <label htmlFor="website" className="block text-sm text-gray-300">
            Website
          </label>
          <div className="mt-1">
            <input type="text" id="website" name="website" />
          </div>
        </div>
      </form>
    </div>
  );
};
