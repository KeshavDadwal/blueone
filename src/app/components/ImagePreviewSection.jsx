'use client';

import { useEffect } from 'react';
import { IoShareSocialOutline } from 'react-icons/io5';

const AddToAnyShare = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.addtoany.com/menu/page.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='flex items-center '>
      <a className="a2a_dd bg-[#f2f2f2] p-2 rounded-full" href="https://www.addtoany.com/share">
      <IoShareSocialOutline />
      </a>
    </div>
  );
};

export default AddToAnyShare;
