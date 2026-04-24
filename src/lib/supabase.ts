import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});

// ─── Auth helpers ──────────────────────────────────────────────────────────────

export interface SignUpMeta {
  full_name: string;
  username: string;
  role: 'patient' | 'doctor';
  tax_code: string;
  medical_id?: string;
  preferred_language: string;
  city: string;
  /** B2B: name of the clinic or healthcare organization the user belongs to */
  organization_name: string;
  /** B2B: optional invite / access code provided by the organization */
  organization_code?: string;
}

export const signUp = async (email: string, password: string, meta: SignUpMeta) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: meta.full_name,
        username: meta.username,
        role: meta.role,
        tax_code: meta.tax_code,
        preferred_language: meta.preferred_language,
        city: meta.city,
        organization_name: meta.organization_name,
        ...(meta.organization_code ? { organization_code: meta.organization_code } : {}),
        ...(meta.medical_id ? { medical_id: meta.medical_id } : {}),
      },
    },
  });

  // Upsert into profiles — the trigger handles this too, but we do it explicitly as a safety net
  if (data.user && !error) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: meta.full_name,
      username: meta.username,
      role: meta.role,
      tax_code: meta.tax_code,
      medical_id: meta.medical_id ?? null,
      preferred_language: meta.preferred_language,
      city: meta.city,
      organization_name: meta.organization_name,
      organization_code: meta.organization_code ?? null,
      email,
    });
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// ─── Consultations ─────────────────────────────────────────────────────────────

export const getConsultations = async (userId: string) => {
  const { data, error } = await supabase
    .from('consultations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return { data, error };
};

export const createConsultation = async (consultation: {
  user_id: string; symptoms: string;
  urgency_level: 'low' | 'medium' | 'high'; specialist: string; summary: string;
}) => {
  const { data, error } = await supabase.from('consultations').insert(consultation).select().single();
  return { data, error };
};

// ─── Chat messages ─────────────────────────────────────────────────────────────

export const getChatMessages = async (consultationId: string) => {
  const { data, error } = await supabase
    .from('chat_messages').select('*').eq('consultation_id', consultationId).order('created_at', { ascending: true });
  return { data, error };
};

export const saveChatMessage = async (message: {
  consultation_id: string; role: 'user' | 'assistant'; content: string;
}) => {
  const { data, error } = await supabase.from('chat_messages').insert(message).select().single();
  return { data, error };
};

// ─── Profiles ──────────────────────────────────────────────────────────────────

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return { data, error };
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    full_name?: string; avatar_url?: string; role?: 'patient' | 'doctor';
    username?: string; tax_code?: string; medical_id?: string;
    preferred_language?: string; city?: string;
    organization_name?: string; organization_code?: string;
  }
) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
  return { data, error };
};

// ─── Doctors ──────────────────────────────────────────────────────────────────

export const getDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors').select('*').order('review_count', { ascending: false });
  return { data, error };
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const saveReview = async (review: {
  user_id: string;
  doctor_id?: string;
  stars: number;
  comment: string;
  consultation_id?: string;
}) => {
  const { data, error } = await supabase.from('reviews').insert(review).select().single();
  return { data, error };
};
