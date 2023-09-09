import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [newScannedImages, setNewScannedImages] = useState([]);

  return (
    <ImageContext.Provider value={{ newScannedImages, setNewScannedImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  return useContext(ImageContext);
};
