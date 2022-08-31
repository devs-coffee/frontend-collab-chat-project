
import React from "react";
import data from "../datas/default";

const StoreContext = React.createContext(data);

const store:any = {
  get: {},
  set: () => {},
};

const StoreProvider = ({ children }:any) => {
    const [get, set] = React.useState(data);
    store.get = get;
    store.set = (newData: any) => update(newData);
    
    const update = (newData: any) => {
      set({
        ...get,
        ...newData,
      });
    };

    return (
      <StoreContext.Provider 
      value={[get, update]}>
        {children}
      </StoreContext.Provider>
    );
};

export { StoreProvider, StoreContext, store };