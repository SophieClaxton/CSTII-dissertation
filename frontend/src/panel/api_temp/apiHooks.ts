import { useEffect, useState } from 'react';
import APIResponse from '../models/api_temp/APIResponse';

const useAPICall = <D>(
  apiFunction: () => Promise<APIResponse<D>>,
): APIResponse<D> => {
  const [data, setData] = useState<APIResponse<D>>({ status: 'Loading' });

  useEffect(() => {
    const getData = async () => {
      setData(await apiFunction());
    };
    getData();
  }, [apiFunction]);

  return data;
};

export { useAPICall };
