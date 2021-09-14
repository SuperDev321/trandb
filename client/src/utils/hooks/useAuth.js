import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import config from '../../config'
const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [myUser, setMyUser] = useState(null)
  const [role, setRole] = useState('normal');
  const [prevUrl, setPrevUrl] = useState(null);
  const [point, setPoint] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        let token = window.localStorage.getItem('token');
        const { data } = await axios.post(`${config.server_url}/api/checkToken`, {token});
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
          else setAvatar(null);
          setMyId(data._id);
          setUsername(data.username);
          setPoint(data.point);
          setMyUser(data)
          setAuth(true);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    })();
  }, [auth]);

  const updateUser = useCallback(async () => {
    try {
      let token = window.localStorage.getItem('token');
      const { data } = await axios.post(`${config.server_url}/api/checkToken`, {token});
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
        else setAvatar(null);
        setPoint(data.point);
        // setUsername(data.username);
        setMyUser(data);
        setAuth(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  }, [setLoading, setRole, setGender, setMyUser, setAvatar]);

  const updateUserPoint = useCallback((point) => {
    setPoint(point);
  }, [setPoint]);

  const updateProfile = useCallback((userInfo) => {
    const { avatar, aboutMe } = userInfo;
    if (avatar) {
      setAvatar(avatar)
    }
    setMyUser({ ...myUser, ...userInfo });
  }, [setAvatar, setMyUser]);
 
  const removeCurrentUser = useCallback(() => {
    window.localStorage.removeItem('token');
    setAuth(false);
    setMyId(null);
    setUsername('');
    setRole('user');
    setAvatar(null);
  }, [setAuth, setMyId, setRole, setAvatar]);

  return { auth, setAuth, gender, avatar, myId, username, role, loading, setLoading, removeCurrentUser, prevUrl, setPrevUrl, updateUser, myUser, point, updateUserPoint, updateProfile };
};

export default useAuth;
