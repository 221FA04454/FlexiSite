import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Text = ({ 
  id, 
  content, 
  style = {},
  className 
}) => {
  return (
    <p
      id={id}
      className={twMerge(clsx('text-base text-slate-700 dark:text-slate-300 leading-relaxed', className))}
      style={style}
    >
      {content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
    </p>
  );
};

export default Text;
