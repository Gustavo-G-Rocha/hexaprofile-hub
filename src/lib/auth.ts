// Local authentication system for testing
export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

export interface FormData {
  personalInfo: {
    name: string;
    whatsapp: string;
    email: string;
    confirmEmail: string;
    state: string;
  };
  skills: string[];
  subSkills: Record<string, string[]>;
  behavioralSkills: string[];
  hexacoResponses: Record<string, number>;
  curriculum: {
    experiences: Array<{
      role: string;
      company: string;
      duration: string;
    }>;
    languages: string[];
    portfolio: string;
    education: Array<{
      course: string;
      institution: string;
    }>;
  };
  hexacoScores?: Record<string, number>;
}

export interface UserProfile extends User {
  formData?: FormData;
  completedAt?: string;
}

const USERS_KEY = 'hexaco_users';
const CURRENT_USER_KEY = 'hexaco_current_user';

export const authService = {
  login: (email: string, password: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (user && password === 'test123') { // Simple password for testing
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (email: string, password: string): User => {
    const users = getUsers();
    const newUser: User = {
      id: Date.now().toString(),
      email,
      isAdmin: email === 'admin@test.com'
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  saveUserProfile: (userId: string, formData: FormData) => {
    const profiles = getUserProfiles();
    const existingIndex = profiles.findIndex(p => p.id === userId);
    
    const profile: UserProfile = {
      ...authService.getCurrentUser()!,
      formData,
      completedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
  },

  getUserProfiles: (): UserProfile[] => {
    return getUserProfiles();
  }
};

function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function getUserProfiles(): UserProfile[] {
  const profiles = localStorage.getItem('hexaco_profiles');
  return profiles ? JSON.parse(profiles) : [];
}