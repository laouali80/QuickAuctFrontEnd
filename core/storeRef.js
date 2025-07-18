// core/storeRef.js
let storeRef = null;

export const setStore = (store) => {
  storeRef = store;
};

export const getStore = () => storeRef;