import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getClientId } from '@actions/soundcloud';

type ScContextType = {
  cid: string | undefined;
};

const ScContext = createContext<ScContextType>({
  cid: undefined,
});

export const useSc = () => useContext(ScContext);

export const ScProvider = ({ children }: { children: ReactNode }) => {
  const [cid, setCid] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (cid === undefined) {
        const cid = await getClientId();
        setCid(cid);
      }
    })();
  });

  return (
    <ScContext.Provider value={{ cid: cid }}>{children}</ScContext.Provider>
  );
};
