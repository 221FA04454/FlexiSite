import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Enterprise Iframe Sandbox
 * Renders children into a clean iframe to isolate styles and behavior.
 */
const IframeSandbox = ({ children, title, head }) => {
  const [contentRef, setContentRef] = useState(null);
  const frameRef = useRef();

  const mountNode = contentRef?.contentWindow?.document?.body;
  const mountHead = contentRef?.contentWindow?.document?.head;

  return (
    <iframe 
        title={title} 
        ref={setContentRef} 
        className="w-full h-full border-none bg-white transition-opacity duration-500"
    >
      {mountNode && createPortal(children, mountNode)}
      {mountHead && createPortal(head, mountHead)}
    </iframe>
  );
};

export default IframeSandbox;
