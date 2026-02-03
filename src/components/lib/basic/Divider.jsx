import React from 'react';
import { twMerge } from 'tailwind-merge';

const Divider = ({ 
  id, 
  style = {},
  className 
}) => {
  return (
    <hr
      id={id}
      className={twMerge('border-t border-slate-200 dark:border-slate-800 my-4', className)}
      style={style}
    />
  );
};

export default Divider;
