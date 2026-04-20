import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      alert("Đăng nhập thành công!");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="bground_login">
      <form className="login_card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input_user">
          <FontAwesomeIcon icon={faUser} size="lg" />
          <input
            type="text"
            className="username_login"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input_password">
          <FontAwesomeIcon icon={faLock} size="lg" />
          <input
            type="password"
            className="password_login"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button_login" disabled={loading}>
          {loading ? "Đang xử lý..." : "Login"}
        </button>
        <div className="register">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </form>
    </div>
  );
}