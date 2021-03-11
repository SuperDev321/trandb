import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config'
const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState('normal');
  const [prevUrl, setPrevUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${config.server_url}/api/checkToken`);
        if (data === 'un-auth') {
          setLoading(false);
        } else {
          if (data.role === 'super_admin') setRole('super_admin');
          else if (data.role === 'admin') setRole('admin');
          else if (data.role === 'guest') setRole('guest');
          else setRole('normal');
          if(data.gender === 'female') setGender('female');
          else setGender('female');
          if(data.avatar) setAvatar(data.avatar);
          setUsername(data.username);
          setAuth(true);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    })();
  }, [auth]);

  const removeCurrentUser = () => {
    setAuth(false);
    setUsername('');
    setRole('user');
  };

  return { auth, setAuth, gender, avatar, username, role, loading, setLoading, removeCurrentUser, prevUrl, setPrevUrl };
};

export default useAuth;
