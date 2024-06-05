import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const firestore = getFirestore();

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Reset error message

        if (role === 'Admin') {
            const adminEmail = 'meet@medivirt.com';
            const adminPassword = 'Maynak@meet.2024';

            if (email === adminEmail && password === adminPassword) {
                login('Admin');
                navigate('/admin/dash');
            } else {
                setError('Invalid email or password for Admin');
            }
        } else if (role === 'Growth Manager') {
            try {
                const trimmedEmail = email.trim();
                const q = query(collection(firestore, 'managers'), where('email', '==', trimmedEmail));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const managerData = doc.data();
                    const isPasswordValid = await bcrypt.compare(password, managerData.password);

                    if (isPasswordValid) {
                        login('Growth Manager');
                        navigate(`/manager/dash/${doc.id}`);
                    } else {
                        setError('Invalid email or password for Growth Manager');
                    }
                } else {
                    console.log(`Manager not found with email: ${trimmedEmail}`);
                    setError('Manager not found');
                }
            } catch (error) {
                console.error('Error logging in as Growth Manager:', error);
                setError('Error logging in as Growth Manager');
            }
        } else {
            setError('Please select a role');
        }

        setIsLoading(false);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                    {/* {role === 'Admin' ? 'Admin Login' : 'Growth Manager Login'} */}
                    Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="role" className='block text-sm font-medium text-gray-700'>
                            Role
                        </label>
                        <select
                            name="role"
                            id="role"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Growth Manager">Growth Manager</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
