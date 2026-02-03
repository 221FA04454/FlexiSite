import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Container = ({ 
  id, 
  children, 
  style = {},
  className 
}) => {
  return (
    <div
      id={id}
      className={twMerge(clsx('flex flex-col w-full min-h-[50px]', className))}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
