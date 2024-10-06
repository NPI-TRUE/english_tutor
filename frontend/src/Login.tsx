import  { useState } from 'react';
import { Button } from 'react-daisyui';

const Login = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_REACT_APP_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`${url}/api/v1/set_session`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
        credentials: 'include'
    });

    if (res.ok) {
      window.location.reload();
    } else {
        alert('Username not valid');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-80">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
            onClick={() => setLoading(!loading)}
            loading={loading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;