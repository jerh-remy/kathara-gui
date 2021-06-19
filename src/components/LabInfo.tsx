import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';

export const LabInfo = () => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const { labInfo } = katharaConfig;
  const [lab, setLab] = useState(labInfo);

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    setLab((config: any) => ({
      ...config,
      [propertyName]: value,
    }));
  };

  useEffect(() => {
    setKatharaConfig((config: any) => {
      const { labInfo: oldLabInfo, ...rest } = config;
      let labInfo = lab;
      return {
        ...rest,
        labInfo,
      };
    });
  }, [lab]);

  // console.log({ lab }, { katharaConfig });

  return (
    <div className="mt-4 mb-4">
      <form className="mb-0 space-y-3" action="#" method="post">
        <div>
          <label htmlFor="description" className="block text-sm text-gray-300">
            Description
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="description"
              name="description"
              onChange={handleChange}
              value={lab.description}
              placeholder={`Exam ${new Date().getFullYear()}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="version" className="block text-sm text-gray-300">
            Version
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="version"
              name="version"
              onChange={handleChange}
              value={lab.version}
              placeholder="1.0"
            />
          </div>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm text-gray-300">
            Author(s)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="author"
              name="author"
              onChange={handleChange}
              value={lab.author}
              placeholder="Jeremy Offori"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={lab.email}
              placeholder="jeremy.offori@gmail.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="web" className="block text-sm text-gray-300">
            Website
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="web"
              name="web"
              onChange={handleChange}
              value={lab.web}
              placeholder="http://lboro.ac.uk"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
