import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config'
const useAuth = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
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
          console.log(data)
          if (data.role === 'super_admin') setRole('super_admin');
          else if (data.role === 'admin') setRole('admin');
          else if (data.role === 'guest') setRole('guest');
          else setRole('normal');
          if(data.gender === 'female') setGender('female');
          else setGender('female');
          if(data.avatar) setAvatar(data.avatar);
          else setAvatar(null);
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

  const updateUser = async () => {
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
        setMyUser(data)
        setAuth(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err)
      setLoading(false);
    }
  }

  const updateUserPoint = (point) => {
    setPoint(point);
  }

  const updateProfile = (userInfo) => {
    const { avatar, aboutMe } = userInfo;
    if (avatar) {
      setAvatar(avatar)
    }
    setMyUser({ ...myUser, ...userInfo });
  }
 
  const removeCurrentUser = () => {
    window.localStorage.removeItem('token');
    setAuth(false);
    setUsername('');
    setRole('user');
    setAvatar(null);
  };

  return { auth, setAuth, gender, avatar, username, role, loading, setLoading, removeCurrentUser, prevUrl, setPrevUrl, updateUser, myUser, point, updateUserPoint, updateProfile };
};

export default useAuth;
