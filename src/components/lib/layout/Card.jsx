import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ 
  id, 
  children,
  style = {},
  className 
}) => {
  return (
    <div
      id={id}
      className={twMerge(clsx('bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-100 dark:border-slate-700', className))}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
