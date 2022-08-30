/**
 * contain all global values and method in order to update
 * @typedef  {Object}   storage
 * @property {Object}   get contain all global values
 * @property {Function} set method in order to update values
 */

import React from "react";
import data from "../datas/default";


const StoreContext = React.createContext(data);

/**
 * @type {storage}
 */
const store = {
  get: {},
  set: () => {},
};




const StoreProvider = ({ children }) => {
    const [get, set] = React.useState(data);
    store.get = get;
    store.set = (newData) => update(newData);
    
    const update = newData => {
      set({
        ...get,
        ...newData,
      });
    };

    return (
      <StoreContext.Provider 
// @ts-ignore
      value={[get, update]}>
        {children}
      </StoreContext.Provider>
    );
};

export { StoreProvider, StoreContext, store };