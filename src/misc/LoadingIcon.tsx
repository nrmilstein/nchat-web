import React from 'react';

import "./LoadingIcon.css";

interface LoadingIconProps {
  width?: number,
  height?: number,
}

function LoadingIcon(props: LoadingIconProps) {
  const style = {
    width: props.width ?? 40,
    height: props.height ?? 40,
  }
  return (
    <div className="LoadingIcon" style={style}>
    </div>
  )
}

export default LoadingIcon;