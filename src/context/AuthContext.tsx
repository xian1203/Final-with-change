import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../lib/firebase';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminStatus, setAdminStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      if (user) {
        const adminEmails = ['roger@gmail.com', 'sival@gmail.com', 'admin@gmail.com'];
        setAdminStatus(adminEmails.includes(user.email || ''));
      } else {
        setAdminStatus(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            toast.error("Invalid email or password");
            break;
          case 'auth/user-not-found':
            toast.error("No account found with this email");
            break;
          case 'auth/network-request-failed':
            toast.error("Network error. Please check your internet connection and try again.");
            break;
          default:
            toast.error("Failed to sign in. Please try again.");
        }
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // First check if the email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length > 0) {
        console.log('Email already exists:', email);
        throw new FirebaseError('auth/email-already-in-use', 'An account with this email already exists');
      }

      // If email doesn't exist, proceed with signup
      console.log('Creating new account for email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        console.log('Account created successfully for:', email);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            toast.error("An account with this email already exists. Please sign in instead.");
            break;
          case 'auth/invalid-email':
            toast.error("Please enter a valid email address");
            break;
          case 'auth/weak-password':
            toast.error("Password should be at least 6 characters long");
            break;
          case 'auth/network-request-failed':
            toast.error("Network error. Please check your internet connection and try again.");
            break;
          default:
            toast.error("Failed to create account. Please try again.");
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin: adminStatus, 
        loading, 
        signIn, 
        signUp, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};