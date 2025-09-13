'use client'

import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
      } else {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: { name?: string }) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
      return { user: null, error }
    }

    return { user: data.user, error: null }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
      return { user: null, error }
    }

    return { user: data.user, error: null }
  }

  // Sign out
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
    }
    
    return { error }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    setAuthState(prev => ({ ...prev, loading: false }))
    
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }))
      return { error }
    }

    return { error: null }
  }

  // Update password
  const updatePassword = async (password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.updateUser({ password })

    setAuthState(prev => ({ ...prev, loading: false }))
    
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }))
      return { error }
    }

    return { error: null }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!authState.user,
    clearError: () => setAuthState(prev => ({ ...prev, error: null }))
  }
}