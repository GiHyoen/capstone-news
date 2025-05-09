import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', null, {
        params: { username, password },
        withCredentials: false,
      });
      alert(response.data);
    } catch (error: any) {
      alert('로그인 실패: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginBox}>
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.loginInput}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.loginInput}
        />
        <div style={styles.loginButtons}>
          <button style={styles.loginBtn} onClick={handleLogin}>로그인</button>
          <button style={styles.signupBtn} onClick={() => navigate('/signup')}>회원가입</button>
        </div>
        <p style={styles.snsText}>SNS 계정으로 이용하기</p>
        <div style={styles.snsIcons}>
          <a href="http://localhost:8080/oauth2/authorization/naver">
            <img src="/images/naver.png" alt="naver" style={styles.snsIcon} />
          </a>
          <a href="http://localhost:8080/oauth2/authorization/kakao">
            <img src="/images/kakao.png" alt="kakao" style={styles.snsIcon} />
          </a>
          <a href="http://localhost:8080/oauth2/authorization/google">
            <img src="/images/google.png" alt="google" style={styles.snsIcon} />
          </a>
          <a href="http://localhost:8080/oauth2/authorization/facebook">
            <img src="/images/facebook.png" alt="facebook" style={styles.snsIcon} />
          </a>
      </div>
      </div>
    </div>
  );
};

const styles = {
  loginPage: {
    backgroundColor: '#edf2f5',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  loginInput: {
    display: 'block',
    width: '95%',
    padding: '10px',
    margin: '8px auto',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    backgroundColor: '#ddd',
  },
  loginButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '12px',
  },
  loginBtn: {
    flex: 1,
    backgroundColor: '#dde7f8',
    border: 'none',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  signupBtn: {
    flex: 1,
    backgroundColor: '#dde7f8',
    border: 'none',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  snsText: {
    marginTop: '16px',
    fontSize: '13px',
    color: '#444',
    fontWeight: 'bold',
  },
  snsIcons: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  snsIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
  },
} as const;

export default LoginPage;
