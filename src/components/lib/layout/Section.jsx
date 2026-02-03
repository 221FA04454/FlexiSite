import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Section = ({ 
  id, 
  children,
  style = {},
  className 
}) => {
  return (
    <section
      id={id}
      className={twMerge(clsx('py-12 px-6', className))}
      style={style}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;
