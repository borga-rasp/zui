import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

import { isEmpty } from 'lodash';
import { VulnerabilityIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';

// Custom Tooltip component in pure Tailwind CSS
const Tooltip = ({ title, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="group relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {title && show && (
        <div className="absolute bottom-full left-1/2 z-[2000] mb-2 -translate-x-1/2 select-none pointer-events-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 shadow-xl max-w-xs whitespace-normal text-left">
            {title}
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-800 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

function PreviewCard(props) {
  const navigate = useNavigate();
  const { name, vulnerabilityData, logo } = props;

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  return (
    <div
      onClick={goToDetails}
      className="group w-full max-w-[270px] bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer shadow-lg text-left"
    >
      <div className="flex items-center justify-between gap-3">
        <img
          src={!isEmpty(logo) ? `data:image/png;base64, ${logo}` : randomImage()}
          alt="icon"
          className="w-6 h-6 object-contain rounded"
        />
        <Tooltip title={name}>
          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition truncate max-w-[100px]">
            {name}
          </h4>
        </Tooltip>
        <div className="ml-auto shrink-0">
          <VulnerabilityIconCheck {...vulnerabilityData} />
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;
