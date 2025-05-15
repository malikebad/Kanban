import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
      navigate('/');
    } else {
      toast({
        title: "Error",
        description: "Please enter email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Welcome Back!</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Sign in to continue to your Kanban Board.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="password"className="text-gray-700 dark:text-gray-200">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3">
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Don't have an account? <Link to="/signup" className="font-medium text-indigo-500 hover:underline">Sign Up</Link>
        </p>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          This is a demo sign-in. No actual authentication is performed.
        </p>
      </motion.div>
    </div>
  );
};

export default SignInPage;