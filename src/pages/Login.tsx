import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'researcher'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        navigate(formData.role === 'public' ? '/explore' : '/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
    setIsLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        
        const success = await loginWithGoogle(userInfo.name, userInfo.email);
        if (success) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Google user info fetch failed:', error);
      }
      setIsLoading(false);
    },
    onError: (error) => console.error('Google login failed:', error)
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] flex items-center justify-center px-6 py-12 relative overflow-hidden selection:bg-biolum-teal/30 selection:text-biolum-teal">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-biolum-teal/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-biolum-purple/20 rounded-full blur-[120px] animate-blob delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate('/')}
          className="group flex items-center space-x-2 text-gray-400 hover:text-white mb-12 transition-all duration-300 -ml-2 px-2 py-2"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="relative overflow-hidden bg-black/20 backdrop-blur-3xl border border-white/[0.05] border-t-white/[0.1] border-l-white/[0.1] rounded-[3rem] p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-biolum-teal/5 via-transparent to-biolum-purple/5 opacity-50" />
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-2">
                {isLogin ? 'Authenticate' : 'Initialize'}
              </h1>
              <p className="text-gray-400 font-light tracking-wide text-sm uppercase">
                {isLogin ? 'Access the core system' : 'Create an identity'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-biolum-teal transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all duration-300 font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-biolum-teal transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all duration-300 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-biolum-teal transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Authorization Level
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-biolum-teal transition-colors pointer-events-none z-10" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-biolum-teal/50 focus:bg-black/40 transition-all duration-300 appearance-none font-medium cursor-pointer"
                  >
                    <option value="researcher" className="bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] text-white">Researcher</option>
                    <option value="public" className="bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] text-white">General Public</option>
                    <option value="policy_maker" className="bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] text-white">Policy Maker</option>
                    <option value="admin" className="bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)] text-white">Admin</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-biolum-teal hover:bg-biolum-teal/80 text-obsidian-900 font-black tracking-widest uppercase text-sm py-4 px-4 rounded-2xl transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] disabled:opacity-50 transform hover:scale-[1.02] mt-8"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.05]"></div>
              </div>
              <div className="relative flex justify-center text-xs tracking-widest uppercase font-bold">
                <span className="px-4 bg-[linear-gradient(180deg,#0369a1_0%,#1e3a8a_50%,#06090e_100%)]/50 text-gray-500 rounded-full backdrop-blur-md border border-white/[0.05]">Or continue with</span>
              </div>
            </div>

            <button
              onClick={() => googleLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-black/30 hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] text-white font-bold tracking-widest uppercase text-sm py-4 px-4 rounded-2xl transition-all duration-500 disabled:opacity-50 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-400 font-light">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', role: 'researcher' });
                  }}
                  className="text-biolum-teal hover:text-white font-bold tracking-widest uppercase transition-colors ml-2"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
