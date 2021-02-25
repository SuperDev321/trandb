import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config'
const useSetting = () => {
  const [defaultTheme, setDefaultTheme] = useState(false);
  const [messageSize, setMessageSize] = useState(16);
  const [enablePokeSound, setEnablePokeSound] = useState(true);
  const [enablePublicSound, setEnablePublicSound] = useState(true);
  const [enablePrivateSound, setEnablePrivateSound] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await axios.get(`${config.server_url}/api/setting`);
//       } catch (err) {
//         setLoading(false);
//       }
//     })();
//   }, [auth]);

  return { defaultTheme, messageSize, enablePokeSound, enablePrivateSound, enablePublicSound,
    setDefaultTheme, setMessageSize, setEnablePokeSound, setEnablePrivateSound, setEnablePublicSound};
};

export default useSetting;
