import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Image = ({ 
  id, 
  src, 
  alt,
  width,
  height,
  style = {},
  className 
}) => {
  return (
    <img
      id={id}
      src={src || 'https://via.placeholder.com/150'}
      alt={alt || 'Image'}
      className={twMerge(clsx('max-w-full rounded-lg object-cover', className))}
      style={style}
      // If user sets width/height props explicitly
      width={width}
      height={height}
    />
  );
};

export default Image;
