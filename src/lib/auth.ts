// Local authentication system for testing
export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  isMasterAdmin?: boolean;
  role?: 'user' | 'admin' | 'master';
  password?: string;
}

export interface FormData {
  personalInfo: {
    name: string;
    whatsapp: string;
    email: string;
    confirmEmail: string;
    state: string;
    photo?: string;
    isMblCoordinator?: boolean;
    mblAcademyStatus?: string;
    mblHistory?: string;
    wasMissionCollector?: boolean;
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
      educationLevel?: string;
    }>;
  };
  hexacoScores?: Record<string, number>;
  importantTruth?: string;
  isPublicServant?: boolean;
  publicServiceArea?: string;
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
    let user = users.find(u => u.email === email);

    // Master admin credentials
    if (email === '2007.gustavo.g.r@gmail.com' && password === '12345678') {
      if (!user) {
        user = {
          id: 'master-admin',
          email: '2007.gustavo.g.r@gmail.com',
          name: 'Admin Master',
          isAdmin: true,
          isMasterAdmin: true,
          role: 'master',
          password: '12345678'
        };
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      } else {
        user.isMasterAdmin = true;
        user.role = 'master';
        user.isAdmin = true;
      }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }

    // Check user credentials
    if (user && user.password === password) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (email: string, password: string): User => {
    const users = getUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('Usuário já existe');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      isAdmin: email === 'admin@test.com',
      role: email === 'admin@test.com' ? 'admin' : 'user'
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
    const currentUser = authService.getCurrentUser();
    const existingIndex = profiles.findIndex(p => p.id === userId);

    const profile: UserProfile = {
      ...currentUser!,
      formData,
      completedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    console.log('Profile saved:', profile);
    console.log('All profiles:', profiles);
  },

  getUserProfiles: (): UserProfile[] => {
    return getUserProfiles();
  },

  promoteToAdmin: (userId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.isMasterAdmin && !currentUser?.isAdmin) {
      return false;
    }

    const users = getUsers();
    const profiles = getUserProfiles();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].isAdmin = true;
      users[userIndex].role = 'admin';
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const profileIndex = profiles.findIndex(p => p.id === userId);
    if (profileIndex >= 0) {
      profiles[profileIndex].isAdmin = true;
      profiles[profileIndex].role = 'admin';
      localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    }

    return true;
  },

  revokeAdmin: (userId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.isMasterAdmin) {
      return false;
    }

    const users = getUsers();
    const profiles = getUserProfiles();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0 && !users[userIndex].isMasterAdmin) {
      users[userIndex].isAdmin = false;
      users[userIndex].role = 'user';
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const profileIndex = profiles.findIndex(p => p.id === userId);
    if (profileIndex >= 0 && !profiles[profileIndex].isMasterAdmin) {
      profiles[profileIndex].isAdmin = false;
      profiles[profileIndex].role = 'user';
      localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    }

    return true;
  },

  promoteToMasterAdmin: (userId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.isMasterAdmin) {
      return false;
    }

    const users = getUsers();
    const profiles = getUserProfiles();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      users[userIndex].isMasterAdmin = true;
      users[userIndex].isAdmin = true;
      users[userIndex].role = 'master';
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const profileIndex = profiles.findIndex(p => p.id === userId);
    if (profileIndex >= 0) {
      profiles[profileIndex].isMasterAdmin = true;
      profiles[profileIndex].isAdmin = true;
      profiles[profileIndex].role = 'master';
      localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    }

    return true;
  },

  revokeMasterAdmin: (userId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.isMasterAdmin) {
      return false;
    }

    const users = getUsers();
    const profiles = getUserProfiles();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex >= 0 && users[userIndex].email !== '2007.gustavo.g.r@gmail.com') {
      users[userIndex].isMasterAdmin = false;
      users[userIndex].isAdmin = false;
      users[userIndex].role = 'user';
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const profileIndex = profiles.findIndex(p => p.id === userId);
    if (profileIndex >= 0 && profiles[profileIndex].email !== '2007.gustavo.g.r@gmail.com') {
      profiles[profileIndex].isMasterAdmin = false;
      profiles[profileIndex].isAdmin = false;
      profiles[profileIndex].role = 'user';
      localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    }

    return true;
  },

  deleteUserProfile: (userId: string): boolean => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.isMasterAdmin) {
      return false;
    }

    const users = getUsers();
    const profiles = getUserProfiles();

    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.isMasterAdmin) {
      return false;
    }

    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));

    const filteredProfiles = profiles.filter(p => p.id !== userId);
    localStorage.setItem('hexaco_profiles', JSON.stringify(filteredProfiles));

    return true;
  },

  clearCompletion: (userId: string): void => {
    const profiles = getUserProfiles();
    const index = profiles.findIndex(p => p.id === userId);
    if (index >= 0) {
      delete (profiles[index] as any).completedAt;
      localStorage.setItem('hexaco_profiles', JSON.stringify(profiles));
    }
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
