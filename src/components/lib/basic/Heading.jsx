import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Heading = ({ 
  id, 
  text, 
  level = 'h1',
  style = {},
  className 
}) => {
  const Tag = level;
  const sizes = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
  };

  return (
    <Tag
      id={id}
      className={twMerge(clsx(sizes[level], 'text-slate-900 dark:text-white', className))}
      style={style}
    >
      {text}
    </Tag>
  );
};

export default Heading;
