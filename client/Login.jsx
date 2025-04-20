function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/api/login", { email, password }, { withCredentials: true });
        setMessage("Login successful");
      } catch (err) {
        setMessage("Invalid login");
      }
    };
  
    return (
      <form onSubmit={handleLogin} className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full">Login</button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    );
  }
  