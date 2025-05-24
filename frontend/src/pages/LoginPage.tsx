import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/login',
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 세션 쿠키 포함
        }
      );
      alert(response.data);
      navigate('/'); // 메인 페이지로 이동
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

        <p style={styles.snsText}>SNS 계정으로 로그인</p>
        <div style={styles.snsButtons}>
          <a href="http://localhost:8080/oauth2/authorization/kakao" style={styles.kakaoBtn}>
            <img src="/images/kakao.png" alt="kakao" style={styles.icon} />
            카카오 로그인하기
          </a>
          <a href="http://localhost:8080/oauth2/authorization/naver" style={styles.naverBtn}>
            <img src="/images/naver.png" alt="naver" style={styles.icon} />
            네이버 로그인하기
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
    width: '320px',
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
    cursor: 'pointer',
  },
  signupBtn: {
    flex: 1,
    backgroundColor: '#dde7f8',
    border: 'none',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  snsText: {
    marginTop: '16px',
    fontSize: '13px',
    color: '#444',
    fontWeight: 'bold',
  },
  snsButtons: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  kakaoBtn: {
    backgroundColor: '#FEE500',
    color: '#3C1E1E',
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  naverBtn: {
    backgroundColor: '#03C75A',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
} as const;

export default LoginPage;