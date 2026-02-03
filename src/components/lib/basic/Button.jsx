import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  id, 
  text, 
  variant = 'primary', 
  style = {}, 
  onClick,
  link,
  className 
}) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-indigo-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-indigo-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400"
  };

  const content = (
    <span className="truncate">{text}</span>
  );

  if (link && link.trim() !== '') {
    return (
        <a 
            id={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={twMerge(clsx(baseClasses, variants[variant], className))}
            style={style}
            onClick={(e) => {
                // Prevent navigation in editor mode
                e.preventDefault();
                if (onClick) onClick(e);
            }}
        >
            {content}
        </a>
    );
  }

  return (
    <button
      id={id}
      type="button"
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      style={style}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
