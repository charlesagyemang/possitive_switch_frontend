import React, { useEffect, useState } from "react";

export const useURLOptions = () => {
  const [url, setURL] = useState<URL | undefined>();

  useEffect(() => {
    const obj = new URL(window.location.href);
    setURL(obj);
  }, []);

  return { url, pathname: url?.pathname };
};
