import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (email && password) {
      signup(email, password);
      toast({
        title: "Account Created",
        description: "Welcome! You can now sign in.",
      });
      navigate('/signin');
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Create Account</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Join our Kanban platform today!</p>
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
          <div>
            <Label htmlFor="confirmPassword"className="text-gray-700 dark:text-gray-200">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white text-lg py-3">
            Sign Up
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Already have an account? <Link to="/signin" className="font-medium text-teal-500 hover:underline">Sign In</Link>
        </p>
         <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          This is a demo sign-up. No actual account creation is performed.
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;