'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs'; // TabsList removed
import { Sidebar } from '@/components/admin/sidebar';
import { ResumeRequestsTab } from '@/components/admin/resume-requests-tab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  User, Briefcase, GraduationCap, FolderOpen,
  MessageSquare, Settings, Award, Save,
  Plus, Trash2, Github, Linkedin, Twitter,
  Instagram, Globe, Mail, Phone, MapPin,
  CheckCircle, XCircle, Loader2, Code2,
  Wrench, Star, Upload, FileText,
  X, Download, Eye, Sparkles, Zap,
  Clock, TrendingUp, ChevronUp,
  ChevronDown, RotateCcw, AlertTriangle,
  Target, ImageIcon, ShieldCheck, Edit3
} from 'lucide-react';

type DashboardMessageType = 'success' | 'error' | 'warning' | 'info' | '';

type DashboardMessage = {
  type: DashboardMessageType;
  text: string;
};

type RequestStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type PortfolioData = {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string;
    resume: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  skills: Array<{
    category: string;
    items: string[];
  }>;
  experience: Array<{
    institution: string;
    degree: string;
    duration: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    highlights: string[];
    iconType: string;
    logo?: string;
    company?: string;
    position?: string;
    description?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
    location: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: string;
    achievements: string[];
    iconType: string;
    logo?: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    image: string;
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    order: number;
  }>;
  testimonials: Array<{
    name: string;
    position: string;
    company: string;
    image: string;
    content: string;
    rating: number;
  }>;
  services: Array<{
    title: string;
    description: string;
    icon: string;
    features: string[];
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
  settings: {
    theme: 'auto' | 'light' | 'dark';
    emailNotifications: boolean;
    publicProfile: boolean;
    analytics: boolean;
    openToWork: boolean;
  };
};

type ValidationResult = {
  tab: string;
  message: string;
} | null;

const LOCAL_DRAFT_KEY = 'portfolio-admin-dashboard-draft';

const TAB_TITLES: Record<string, string> = {
  overview: 'Dashboard Overview',
  requests: 'Resume Requests',
  personal: 'Personal Information',
  skills: 'Technical Skills',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  testimonials: 'Testimonials',
  services: 'Services',
  achievements: 'Achievements',
  settings: 'Portfolio Settings',
};

const createDefaultPortfolio = (): PortfolioData => ({
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    resume: '',
  },
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
    facebook: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  testimonials: [],
  services: [],
  achievements: [],
  settings: {
    theme: 'auto',
    emailNotifications: true,
    publicProfile: true,
    analytics: true,
    openToWork: false,
  },
});

const clonePortfolio = (portfolio: PortfolioData): PortfolioData => JSON.parse(JSON.stringify(portfolio));

const getDateInputValue = (value: string | Date | undefined | null) => {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  if (value === 'Present') {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  return parsed.toISOString().split('T')[0];
};

const formatTimeline = (
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  current?: boolean,
  completedLabel?: boolean
) => {
  if (!startDate) return '';

  const parsedStart = new Date(startDate);
  if (Number.isNaN(parsedStart.getTime())) return '';

  const startMonth = parsedStart.toLocaleString('default', { month: 'short' });
  const startYear = parsedStart.getFullYear();

  if (current || endDate === 'Present') {
    return `${startMonth} ${startYear} - Present`;
  }

  if (!endDate) return '';

  const parsedEnd = new Date(endDate);
  if (Number.isNaN(parsedEnd.getTime())) return '';

  const endMonth = parsedEnd.toLocaleString('default', { month: 'short' });
  const endYear = parsedEnd.getFullYear();

  if (completedLabel && startMonth === endMonth && startYear === endYear) {
    return `Completed ${endYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

const normalizeProjectOrder = (projects: PortfolioData['projects']) =>
  projects.map((project, index) => ({
    ...project,
    order: index,
  }));

const normalizePortfolio = (rawPortfolio?: Partial<PortfolioData> | null): PortfolioData => {
  const defaults = createDefaultPortfolio();

  return {
    ...defaults,
    ...rawPortfolio,
    personalInfo: {
      ...defaults.personalInfo,
      ...(rawPortfolio?.personalInfo || {}),
    },
    socialLinks: {
      ...defaults.socialLinks,
      ...(rawPortfolio?.socialLinks || {}),
    },
    skills: Array.isArray(rawPortfolio?.skills)
      ? rawPortfolio.skills.map((skill) => ({
          category: skill?.category || '',
          items: Array.isArray(skill?.items) ? skill.items.filter(Boolean) : [],
        }))
      : [],
    experience: Array.isArray(rawPortfolio?.experience)
      ? rawPortfolio.experience.map((item) => ({
          institution: item?.institution || item?.company || '',
          degree: item?.degree || item?.position || '',
          duration: item?.duration || '',
          location: item?.location || '',
          startDate: getDateInputValue(item?.startDate),
          endDate: item?.endDate === 'Present' ? 'Present' : getDateInputValue(item?.endDate),
          current: Boolean(item?.current),
          highlights: Array.isArray(item?.highlights)
            ? item.highlights.filter(Boolean)
            : Array.isArray(item?.description)
              ? item.description.filter(Boolean)
              : [],
          iconType: item?.iconType || 'briefcase',
          logo: item?.logo || '',
          company: item?.company || '',
          position: item?.position || '',
          description: Array.isArray(item?.description) ? item.description.filter(Boolean) : [],
        }))
      : [],
    education: Array.isArray(rawPortfolio?.education)
      ? rawPortfolio.education.map((item) => ({
          institution: item?.institution || '',
          degree: item?.degree || '',
          duration: item?.duration || '',
          location: item?.location || '',
          field: item?.field || '',
          startDate: getDateInputValue(item?.startDate),
          endDate: item?.endDate === 'Present' ? 'Present' : getDateInputValue(item?.endDate),
          current: Boolean(item?.current),
          gpa: item?.gpa || '',
          achievements: Array.isArray(item?.achievements) ? item.achievements.filter(Boolean) : [],
          iconType: item?.iconType || 'university',
          logo: item?.logo || '',
        }))
      : [],
    projects: Array.isArray(rawPortfolio?.projects)
      ? normalizeProjectOrder(
          rawPortfolio.projects.map((project) => ({
            title: project?.title || '',
            description: project?.description || '',
            technologies: Array.isArray(project?.technologies) ? project.technologies.filter(Boolean) : [],
            image: project?.image || '',
            liveUrl: project?.liveUrl || '',
            githubUrl: project?.githubUrl || '',
            featured: Boolean(project?.featured),
            order: typeof project?.order === 'number' ? project.order : 0,
          }))
        )
      : [],
    testimonials: Array.isArray(rawPortfolio?.testimonials)
      ? rawPortfolio.testimonials.map((item) => ({
          name: item?.name || '',
          position: item?.position || '',
          company: item?.company || '',
          image: item?.image || '',
          content: item?.content || '',
          rating: typeof item?.rating === 'number' ? item.rating : 5,
        }))
      : [],
    services: Array.isArray(rawPortfolio?.services)
      ? rawPortfolio.services.map((item) => ({
          title: item?.title || '',
          description: item?.description || '',
          icon: item?.icon || '',
          features: Array.isArray(item?.features) ? item.features.filter(Boolean) : [],
        }))
      : [],
    achievements: Array.isArray(rawPortfolio?.achievements)
      ? rawPortfolio.achievements.map((item) => ({
          title: item?.title || '',
          description: item?.description || '',
          date: getDateInputValue(item?.date),
          icon: item?.icon || '',
        }))
      : [],
    settings: {
      ...defaults.settings,
      ...(rawPortfolio?.settings || {}),
    },
  };
};

const getPortfolioSnapshot = (portfolio: PortfolioData) => JSON.stringify(normalizePortfolio(portfolio));

const reorderItems = <T,>(items: T[], index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const reordered = [...items];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  return reordered;
};

const formatSavedAt = (value: string | null) => {
  if (!value) return 'Not saved yet';

  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getRequestStats = (requests: Array<{ status: 'pending' | 'approved' | 'rejected' }>): RequestStats => ({
  total: requests.length,
  pending: requests.filter((request) => request.status === 'pending').length,
  approved: requests.filter((request) => request.status === 'approved').length,
  rejected: requests.filter((request) => request.status === 'rejected').length,
});

export default function AdminDashboard() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<DashboardMessage>({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingResume, setDeletingResume] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [requestStats, setRequestStats] = useState<RequestStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isPersisted, setIsPersisted] = useState(false);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const [uploadingLogoKey, setUploadingLogoKey] = useState<string | null>(null);

  const currentSnapshot = portfolio ? getPortfolioSnapshot(portfolio) : '';
  const hasRevertTarget = Boolean(portfolio && lastSavedSnapshot && currentSnapshot !== lastSavedSnapshot);
  const isDirty = Boolean(portfolio && (!isPersisted || currentSnapshot !== lastSavedSnapshot));

  useEffect(() => {
    initializePortfolio();
  }, []);

  useEffect(() => {
    setProfileCompletion(calculateProfileCompletion(portfolio));
  }, [portfolio]);

  useEffect(() => {
    if (!portfolio || typeof window === 'undefined') {
      return;
    }

    if (hasRevertTarget) {
      window.localStorage.setItem(LOCAL_DRAFT_KEY, currentSnapshot);
      setHasLocalDraft(true);
      return;
    }

    window.localStorage.removeItem(LOCAL_DRAFT_KEY);
    setHasLocalDraft(false);
  }, [portfolio, currentSnapshot, hasRevertTarget]);

  useEffect(() => {
    if (!isDirty || typeof window === 'undefined') {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const calculateProfileCompletion = (currentPortfolio: PortfolioData | null) => {
    if (!currentPortfolio) return 0;

    let completed = 0;
    const total = 10;

    if (currentPortfolio.personalInfo.name.trim()) completed++;
    if (currentPortfolio.personalInfo.title.trim()) completed++;
    if (currentPortfolio.personalInfo.bio.trim()) completed++;
    if (currentPortfolio.personalInfo.email.trim()) completed++;
    if (currentPortfolio.personalInfo.resume.trim()) completed++;
    if (currentPortfolio.skills.length > 0) completed++;
    if (currentPortfolio.projects.length > 0) completed++;
    if (currentPortfolio.experience.length > 0) completed++;
    if (currentPortfolio.education.length > 0) completed++;
    if (currentPortfolio.socialLinks.github.trim() || currentPortfolio.socialLinks.linkedin.trim()) completed++;

    return (completed / total) * 100;
  };

  const applyLoadedPortfolio = (
    nextPortfolio: PortfolioData,
    nextPersisted: boolean,
    nextMessage: DashboardMessage,
    nextSavedAt: string | null
  ) => {
    const normalizedPortfolio = normalizePortfolio(nextPortfolio);
    const savedSnapshot = getPortfolioSnapshot(normalizedPortfolio);

    if (typeof window !== 'undefined') {
      const draft = window.localStorage.getItem(LOCAL_DRAFT_KEY);

      if (draft) {
        try {
          const parsedDraft = normalizePortfolio(JSON.parse(draft));
          const draftSnapshot = getPortfolioSnapshot(parsedDraft);

          if (draftSnapshot !== savedSnapshot) {
            setPortfolio(parsedDraft);
            setLastSavedSnapshot(savedSnapshot);
            setLastSavedAt(nextSavedAt);
            setIsPersisted(nextPersisted);
            setHasLocalDraft(true);
            setMessage({
              type: 'warning',
              text: 'A local draft was restored. Save changes to publish it or discard to return to the last saved version.',
            });
            return;
          }

          window.localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch (error) {
          console.error('Failed to restore local draft:', error);
          window.localStorage.removeItem(LOCAL_DRAFT_KEY);
        }
      }
    }

    setPortfolio(normalizedPortfolio);
    setLastSavedSnapshot(savedSnapshot);
    setLastSavedAt(nextSavedAt);
    setIsPersisted(nextPersisted);
    setHasLocalDraft(false);
    setMessage(nextMessage);
  };

  const initializePortfolio = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 404) {
        applyLoadedPortfolio(
          createDefaultPortfolio(),
          false,
          { type: 'info', text: 'No published portfolio was found. Start building from this template.' },
          null
        );
      } else if (response.ok) {
        const result = await response.json();
        if (result.success) {
          applyLoadedPortfolio(
            result.data,
            true,
            { type: 'success', text: 'Portfolio loaded successfully.' },
            result.data.updatedAt || new Date().toISOString()
          );
        } else {
          throw new Error(result.error || 'Failed to load portfolio');
        }
      } else {
        throw new Error('Failed to load portfolio');
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      applyLoadedPortfolio(
        createDefaultPortfolio(),
        false,
        { type: 'warning', text: 'Unable to load the published portfolio. A fresh template was opened instead.' },
        null
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    // Validate required date fields
    let hasError = false;

    // Check education dates
    for (const edu of portfolio.education) {
      if (!edu.startDate || !edu.endDate) {
        setMessage({ type: 'error', text: '❌ All education entries must have start and end dates!' });
        setSaving(false);
        return;
      }
    }

    // Check experience dates
    for (const exp of portfolio.experience) {
      if (!exp.startDate) {
        setMessage({ type: 'error', text: '❌ All experience entries must have a start date!' });
        setSaving(false);
        return;
      }
      if (!exp.current && !exp.endDate) {
        setMessage({ type: 'error', text: '❌ Experience entries must have an end date or be marked as current!' });
        setSaving(false);
        return;
      }
    }

    try {
      console.log('Starting save...');
      console.log('Portfolio data to save:', portfolio);

      // Always use PUT as it handles both create and update
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(portfolio),
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        console.error('Response not OK:', data);

        // If unauthorized, redirect to login
        if (response.status === 401) {
          setMessage({ type: 'error', text: '❌ Session expired. Redirecting to login...' });
          setTimeout(() => {
            router.push('/admin/login');
          }, 1500);
          return;
        }

        throw new Error(data.error || 'Failed to save portfolio');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to save portfolio');
      }

      console.log('Save successful, data:', data);
      setPortfolio(data.data);
      setMessage({ type: 'success', text: '✅ Portfolio saved successfully!' });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error('Save error details:', error);
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please upload a PDF or DOC/DOCX file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      // Update local state
      setPortfolio({
        ...portfolio,
        personalInfo: {
          ...portfolio.personalInfo,
          resume: data.data.resumeUrl
        }
      });

      setSelectedFile(null);
      setMessage({ type: 'success', text: '✅ Resume uploaded successfully!' });

      // Clear file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error('Resume upload error:', error);
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeRemove = async () => {
    // Confirm deletion with user
    const confirmed = window.confirm('Are you sure you want to delete the resume? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingResume(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/resume/upload', {
        method: 'DELETE',
        credentials: 'include',
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        data = { error: 'Invalid response from server' };
      }

      if (!response.ok || !data.success) {
        console.error('Delete response not ok:', response.status, data);
        throw new Error(data.error || `Failed to remove resume (${response.status})`);
      }

      // Update local state
      setPortfolio({
        ...portfolio,
        personalInfo: {
          ...portfolio.personalInfo,
          resume: ''
        }
      });

      setSelectedFile(null);

      // Clear file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setMessage({ type: 'success', text: '✅ Resume removed successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error('Resume removal error:', error);
      const errorMessage = error.message || 'An unknown error occurred';
      setMessage({ type: 'error', text: `❌ Failed to remove resume: ${errorMessage}` });
    } finally {
      setDeletingResume(false);
    }
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setPortfolio({
      ...portfolio,
      personalInfo: {
        ...portfolio.personalInfo,
        [field]: value
      }
    });
  };

  const updateSocialLinks = (platform: string, value: string) => {
    setPortfolio({
      ...portfolio,
      socialLinks: {
        ...portfolio.socialLinks,
        [platform]: value
      }
    });
  };

  const addSkill = () => {
    setPortfolio({
      ...portfolio,
      skills: [...(portfolio.skills || []), { category: '', items: [] }]
    });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const newSkills = [...(portfolio.skills || [])];
    if (field === 'items') {
      newSkills[index].items = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    } else {
      newSkills[index][field] = value;
    }
    setPortfolio({ ...portfolio, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this skill category? This action cannot be undone.')) return;
    setPortfolio({
      ...portfolio,
      skills: (portfolio.skills || []).filter((_: any, i: number) => i !== index)
    });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    if (!portfolio || !portfolio.skills) return;
    setPortfolio({ ...portfolio, skills: reorderItems(portfolio.skills, index, direction) });
  };

  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [...(portfolio.projects || []), {
        title: '',
        description: '',
        technologies: [],
        image: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        order: (portfolio.projects || []).length
      }]
    });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newProjects = [...(portfolio.projects || [])];
    if (field === 'technologies') {
      newProjects[index].technologies = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    } else {
      newProjects[index][field] = value;
    }
    setPortfolio({ ...portfolio, projects: newProjects });
  };

  const removeProject = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setPortfolio({
      ...portfolio,
      projects: (portfolio.projects || []).filter((_: any, i: number) => i !== index)
    });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    if (!portfolio || !portfolio.projects) return;
    setPortfolio({ ...portfolio, projects: reorderItems(portfolio.projects, index, direction) });
  };

  const addExperience = () => {
    setPortfolio({
      ...portfolio,
      experience: [...(portfolio.experience || []), {
        institution: '', // company name
        degree: '', // position/role
        duration: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        highlights: [],
        iconType: 'briefcase'
      }]
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExperience = [...(portfolio.experience || [])];
    if (field === 'highlights') {
      newExperience[index].highlights = value.split('\n').filter((s: string) => s.trim());
    } else if (field === 'current') {
      newExperience[index][field] = value;
      // Update duration when current is toggled
      if (value) {
        const startDate = newExperience[index].startDate;
        const startYear = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();
        const startMonth = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : '';
        newExperience[index].duration = startMonth ? `${startMonth} ${startYear} – Present` : `${startYear} – Present`;
        newExperience[index].endDate = 'Present';
      } else if (newExperience[index].startDate && newExperience[index].endDate && newExperience[index].endDate !== 'Present') {
        const startDate = new Date(newExperience[index].startDate);
        const endDate = new Date(newExperience[index].endDate);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        const startMonth = startDate.toLocaleString('default', { month: 'short' });
        const endMonth = endDate.toLocaleString('default', { month: 'short' });
        newExperience[index].duration = `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
      }
    } else if (field === 'startDate' || field === 'endDate') {
      newExperience[index][field] = value;
      // Update duration when dates change
      if (newExperience[index].startDate && (newExperience[index].endDate || newExperience[index].current)) {
        const startDate = new Date(newExperience[index].startDate);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.toLocaleString('default', { month: 'short' });

        if (newExperience[index].current || newExperience[index].endDate === 'Present') {
          newExperience[index].duration = `${startMonth} ${startYear} – Present`;
        } else if (newExperience[index].endDate) {
          const endDate = new Date(newExperience[index].endDate);
          const endYear = endDate.getFullYear();
          const endMonth = endDate.toLocaleString('default', { month: 'short' });
          newExperience[index].duration = `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
        }
      }
    } else {
      newExperience[index][field] = value || '';
    }
    setPortfolio({ ...portfolio, experience: newExperience });
  };

  const removeExperience = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this experience entry? This action cannot be undone.')) return;
    setPortfolio({
      ...portfolio,
      experience: (portfolio.experience || []).filter((_: any, i: number) => i !== index)
    });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (!portfolio || !portfolio.experience) return;
    setPortfolio({ ...portfolio, experience: reorderItems(portfolio.experience, index, direction) });
  };

  const addEducation = () => {
    setPortfolio({
      ...portfolio,
      education: [...(portfolio.education || []), {
        institution: '',
        degree: '',
        duration: '',
        location: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        achievements: [],
        iconType: 'university'
      }]
    });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const newEducation = [...(portfolio.education || [])];
    if (field === 'achievements') {
      newEducation[index].achievements = value.split('\n').filter((s: string) => s.trim());
    } else if (field === 'current') {
      newEducation[index][field] = value;
      // Update duration when current is toggled
      if (value) {
        const startDate = newEducation[index].startDate;
        const startYear = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();
        const startMonth = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : '';
        newEducation[index].duration = startMonth ? `${startMonth} ${startYear} – Present` : `${startYear} – Present`;
        newEducation[index].endDate = 'Present';
      } else if (newEducation[index].startDate && newEducation[index].endDate && newEducation[index].endDate !== 'Present') {
        const startDate = new Date(newEducation[index].startDate);
        const endDate = new Date(newEducation[index].endDate);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        const startMonth = startDate.toLocaleString('default', { month: 'short' });
        const endMonth = endDate.toLocaleString('default', { month: 'short' });

        if (startYear === endYear && startMonth === endMonth) {
          newEducation[index].duration = `Completed ${endYear}`;
        } else {
          newEducation[index].duration = `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
        }
      }
    } else if (field === 'startDate' || field === 'endDate') {
      newEducation[index][field] = value;
      // Update duration when dates change
      if (newEducation[index].startDate && (newEducation[index].endDate || newEducation[index].current)) {
        const startDate = new Date(newEducation[index].startDate);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.toLocaleString('default', { month: 'short' });

        if (newEducation[index].current || newEducation[index].endDate === 'Present') {
          newEducation[index].duration = `${startMonth} ${startYear} – Present`;
        } else if (newEducation[index].endDate) {
          const endDate = new Date(newEducation[index].endDate);
          const endYear = endDate.getFullYear();
          const endMonth = endDate.toLocaleString('default', { month: 'short' });

          if (startYear === endYear && startMonth === endMonth) {
            newEducation[index].duration = `Completed ${endYear}`;
          } else {
            newEducation[index].duration = `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
          }
        }
      }
    } else {
      newEducation[index][field] = value || '';
    }
    setPortfolio({ ...portfolio, education: newEducation });
  };

  const removeEducation = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this education entry? This action cannot be undone.')) return;
    setPortfolio({
      ...portfolio,
      education: (portfolio.education || []).filter((_: any, i: number) => i !== index)
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (!portfolio || !portfolio.education) return;
    setPortfolio({ ...portfolio, education: reorderItems(portfolio.education, index, direction) });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-500" />
          </div>
          <p className="text-lg text-gray-300">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 text-gray-100 font-sans selection:bg-purple-500/30">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={portfolio?.personalInfo?.name}
        onLogout={handleLogout}
      />

      {/* Background Grid & Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <main className="relative z-10 lg:ml-72 min-h-screen transition-all duration-300">
        {/* Top Action Bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {activeTab === 'overview' ? 'Dashboard Overview' :
                activeTab === 'personal' ? 'Personal Information' :
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Completion */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="text-xs font-mono text-gray-400">PROFILE HEALTH</span>
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">{Math.round(profileCompletion)}%</span>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto space-y-8">




          {/* Status Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  className={`mb-6 border backdrop-blur-xl ${message.type === 'success' ? 'border-green-500 bg-green-500/10 text-green-300' :
                    message.type === 'error' ? 'border-red-500 bg-red-500/10 text-red-300' :
                      message.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300' :
                        'border-blue-500 bg-blue-500/10 text-blue-300'
                    }`}
                >
                  <AlertDescription className="text-sm font-medium">
                    {message.text}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs Container (Navigation removed, controlled by Sidebar) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* TabsList removed - specific triggers hidden */}

            {/* Requests Tab */}
            <TabsContent value="requests">
              <ResumeRequestsTab />
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Views", value: "1,234", trend: "+12% vs last month", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/20", trendColor: "text-emerald-400" },
                    { label: "Active Projects", value: portfolio?.projects?.length || 0, trend: "Portfolio Items", icon: FolderOpen, color: "text-blue-400", bg: "bg-blue-500/20", trendColor: "text-blue-400" },
                    { label: "Total Skills", value: portfolio?.skills?.reduce((acc: any, cat: any) => acc + (cat.items?.length || 0), 0) || 0, trend: "Technical Capabilities", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/20", trendColor: "text-emerald-400" },
                    { label: "Profile Health", value: `${Math.round(profileCompletion)}%`, trend: "Optimization Score", icon: Zap, color: "text-pink-400", bg: "bg-pink-500/20", trendColor: "text-pink-400" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl group hover:border-white/20 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                          <h3 className="text-3xl font-bold text-white mt-2 mb-1">{stat.value}</h3>
                          <div className={`flex items-center gap-1 text-xs ${stat.trendColor}`}>
                            {i === 0 ? <TrendingUp className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full bg-current opacity-50" />}
                            <span>{stat.trend}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-gray-300"
                        onClick={() => setActiveTab('projects')}
                      >
                        <Plus className="h-5 w-5" />
                        <span className="text-xs">Add Project</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-gray-300"
                        onClick={() => setActiveTab('skills')}
                      >
                        <Code2 className="h-5 w-5" />
                        <span className="text-xs">Update Skills</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-gray-300"
                        onClick={() => setActiveTab('personal')}
                      >
                        <Upload className="h-5 w-5" />
                        <span className="text-xs">Upload Resume</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 border-gray-600 hover:bg-gray-700 text-gray-300"
                        onClick={() => window.open('/', '_blank')}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="text-xs">View Portfolio</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolio?.updatedAt ? (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Edit3 className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-gray-300">Portfolio updated</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(portfolio.updatedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </motion.div>
                      ) : (
                        <div className="text-center p-8 text-gray-500">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div >
            </TabsContent >

            {/* Personal Info Tab */}
            < TabsContent value="personal" >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={portfolio.personalInfo.name || ''}
                        onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input
                        id="title"
                        placeholder="Full Stack Developer"
                        value={portfolio.personalInfo.title || ''}
                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          placeholder="john@example.com"
                          value={portfolio.personalInfo.email || ''}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                          value={portfolio.personalInfo.phone || ''}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          className="pl-10"
                          placeholder="San Francisco, CA"
                          value={portfolio.personalInfo.location || ''}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        placeholder="https://example.com/avatar.jpg"
                        value={portfolio.personalInfo.avatar || ''}
                        onChange={(e) => updatePersonalInfo('avatar', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="resume-upload">Resume/CV</Label>
                    <div className="space-y-3">
                      {portfolio.personalInfo.resume ? (
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Resume uploaded</p>
                              <p className="text-xs text-muted-foreground">
                                {portfolio.personalInfo.resume}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('/api/resume/download', '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={handleResumeRemove}
                              disabled={deletingResume}
                              title="Delete Resume"
                            >
                              {deletingResume ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Input
                              id="resume-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="flex-1"
                            />
                          </div>
                          {selectedFile && (
                            <div className="flex items-center justify-between p-2 border rounded bg-muted/30">
                              <span className="text-sm">
                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                              </span>
                              <Button
                                size="sm"
                                onClick={handleResumeUpload}
                                disabled={uploadingResume}
                              >
                                {uploadingResume ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                                ) : (
                                  <><Upload className="mr-2 h-4 w-4" /> Upload</>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Upload your resume in PDF or DOC/DOCX format (max 5MB). This will be available for download on your portfolio.
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Write a compelling bio about yourself..."
                      rows={4}
                      value={portfolio.personalInfo.bio || ''}
                      onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {portfolio.personalInfo.bio?.length || 0} characters
                    </p>
                  </div>

                  <Separator />

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            className="pl-10"
                            placeholder="https://github.com/username"
                            value={portfolio.socialLinks?.github || ''}
                            onChange={(e) => updateSocialLinks('github', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            className="pl-10"
                            placeholder="https://linkedin.com/in/username"
                            value={portfolio.socialLinks?.linkedin || ''}
                            onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitter"
                            className="pl-10"
                            placeholder="https://twitter.com/username"
                            value={portfolio.socialLinks?.twitter || ''}
                            onChange={(e) => updateSocialLinks('twitter', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="instagram"
                            className="pl-10"
                            placeholder="https://instagram.com/username"
                            value={portfolio.socialLinks?.instagram || ''}
                            onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Skills Tab */}
            < TabsContent value="skills" >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Technical Skills
                  </CardTitle>
                  <CardDescription>
                    Organize your skills by categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addSkill} className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Skill Category
                  </Button>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {portfolio.skills?.map((skill: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 group hover:border-white/20 transition-all">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Input
                                  placeholder="Category (e.g., Frontend, Backend, Tools)"
                                  value={skill.category}
                                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                  className="max-w-xs font-semibold bg-black/20 border-white/10"
                                />
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveSkill(index, 'up')} disabled={index === 0}>
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveSkill(index, 'down')} disabled={index === (portfolio.skills?.length || 0) - 1}>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeSkill(index)} className="text-red-500 hover:text-red-700 hover:bg-red-500/10 h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Input
                                  placeholder="Skills (comma-separated, e.g., React, Next.js, TypeScript)"
                                  value={skill.items?.join(', ') || ''}
                                  onChange={(e) => updateSkill(index, 'items', e.target.value)}
                                  className="bg-black/20 border-white/10"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {skill.items?.map((item: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-white/10 text-white border-none shrink-0">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Experience Tab */}
            < TabsContent value="experience" >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>
                    Add your professional work experience
                    <span className="block text-xs mt-1 text-red-500">Fields marked with * are required</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addExperience} className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                  </Button>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {portfolio.experience?.map((exp: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 group hover:border-white/20 transition-all">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-emerald-400">Experience {index + 1}</h3>
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveExperience(index, 'up')} disabled={index === 0}>
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveExperience(index, 'down')} disabled={index === (portfolio.experience?.length || 0) - 1}>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700 hover:bg-red-500/10 h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Company/Institution</Label>
                                  <Input
                                    placeholder="Company Name"
                                    value={exp.institution || exp.company || ''}
                                    onChange={(e) => updateExperience(index, 'institution', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Position/Role</Label>
                                  <Input
                                    placeholder="Job Title"
                                    value={exp.degree || exp.position || ''}
                                    onChange={(e) => updateExperience(index, 'degree', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Logo</Label>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="bg-black/20 border-white/10"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const formData = new FormData();
                                        formData.append('logo', file);
                                        const res = await fetch('/api/upload/logo', { method: 'POST', body: formData });
                                        const data = await res.json();
                                        if (res.ok) updateExperience(index, 'logo', data.url);
                                      }
                                    }}
                                  />
                                  {exp.logo && <img src={exp.logo} alt="Logo" className="h-12 w-12 rounded mt-2 ring-2 ring-white/10" />}
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Location</Label>
                                  <Input
                                    placeholder="City, Country"
                                    value={exp.location || ''}
                                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">
                                    Start Date <span className="text-emerald-500">*</span>
                                  </Label>
                                  <Input
                                    type="date"
                                    value={exp.startDate instanceof Date ? exp.startDate.toISOString().split('T')[0] : (exp.startDate || '')}
                                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                    required
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">
                                    End Date <span className="text-emerald-500">{!exp.current && '*'}</span>
                                    {exp.current && <span className="text-xs text-emerald-400 ml-2">(Currently working)</span>}
                                  </Label>
                                  <Input
                                    type="date"
                                    value={exp.endDate === 'Present' ? '' : (exp.endDate || '')}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                    required={!exp.current}
                                    className="bg-black/20 border-white/10 disabled:opacity-50"
                                  />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch
                                    id={`current-${index}`}
                                    checked={exp.current}
                                    onCheckedChange={(checked) => updateExperience(index, 'current', checked)}
                                  />
                                  <Label htmlFor={`current-${index}`} className="text-gray-300">Currently working here</Label>
                                </div>
                              </div>

                              {exp.duration && (
                                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                  <Label className="text-xs text-emerald-400/80">Duration</Label>
                                  <p className="text-sm font-medium text-emerald-100">{exp.duration}</p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label className="text-gray-300">Highlights/Achievements</Label>
                                <Textarea
                                  placeholder="Describe your responsibilities and achievements (one per line)"
                                  rows={4}
                                  value={exp.highlights?.join('\n') || exp.description?.join('\n') || ''}
                                  onChange={(e) => updateExperience(index, 'highlights', e.target.value)}
                                  className="bg-black/20 border-white/10 focus-visible:ring-emerald-500/50"
                                />
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Education Tab */}
            < TabsContent value="education" >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <CardDescription>
                    Add your educational background
                    <span className="block text-xs mt-1 text-red-500">Fields marked with * are required</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addEducation} className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                  </Button>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {portfolio.education?.map((edu: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 group hover:border-white/20 transition-all">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-blue-400">Education {index + 1}</h3>
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveEducation(index, 'up')} disabled={index === 0}>
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveEducation(index, 'down')} disabled={index === (portfolio.education?.length || 0) - 1}>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 hover:bg-red-500/10 h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Institution</Label>
                                  <Input
                                    placeholder="University Name"
                                    value={edu.institution || ''}
                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Degree</Label>
                                  <Input
                                    placeholder="Bachelor of Science"
                                    value={edu.degree || ''}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Logo</Label>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="bg-black/20 border-white/10"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const formData = new FormData();
                                        formData.append('logo', file);
                                        const res = await fetch('/api/upload/logo', { method: 'POST', body: formData });
                                        const data = await res.json();
                                        if (res.ok) updateEducation(index, 'logo', data.url);
                                      }
                                    }}
                                  />
                                  {edu.logo && <img src={edu.logo} alt="Logo" className="h-12 w-12 rounded mt-2 ring-2 ring-white/10" />}
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Location</Label>
                                  <Input
                                    placeholder="City, State/Country"
                                    value={edu.location || ''}
                                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Field of Study (Optional)</Label>
                                  <Input
                                    placeholder="Computer Science"
                                    value={edu.field || ''}
                                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">
                                    Start Date <span className="text-blue-500">*</span>
                                  </Label>
                                  <Input
                                    type="date"
                                    value={edu.startDate instanceof Date ? edu.startDate.toISOString().split('T')[0] : (edu.startDate || '')}
                                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                    required
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">
                                    End Date <span className="text-blue-500">*</span>
                                    {edu.current && <span className="text-xs text-blue-400 ml-2">(Currently studying)</span>}
                                  </Label>
                                  <Input
                                    type="date"
                                    value={edu.endDate === 'Present' ? '' : (edu.endDate instanceof Date ? edu.endDate.toISOString().split('T')[0] : (edu.endDate || ''))}
                                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                    disabled={edu.current}
                                    required={!edu.current}
                                    className="bg-black/20 border-white/10 disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                  id={`edu-current-${index}`}
                                  checked={edu.current}
                                  onCheckedChange={(checked) => updateEducation(index, 'current', checked)}
                                />
                                <Label htmlFor={`edu-current-${index}`} className="text-gray-300">Currently studying</Label>
                              </div>

                              {edu.duration && (
                                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                  <Label className="text-xs text-blue-400/80">Duration</Label>
                                  <p className="text-sm font-medium text-blue-100">{edu.duration}</p>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-gray-300">GPA (Optional)</Label>
                                  <Input
                                    placeholder="3.8/4.0"
                                    value={edu.gpa || ''}
                                    onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-gray-300">Achievements (Optional)</Label>
                                <Textarea
                                  placeholder="List achievements, honors, relevant coursework (one per line)"
                                  rows={3}
                                  value={edu.achievements?.join('\n') || ''}
                                  onChange={(e) => updateEducation(index, 'achievements', e.target.value)}
                                  className="bg-black/20 border-white/10 focus-visible:ring-blue-500/50"
                                />
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Projects Tab */}
            < TabsContent value="projects" >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Portfolio Projects
                  </CardTitle>
                  <CardDescription>
                    Showcase your best work and projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={addProject} className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {portfolio.projects?.map((project: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 group hover:border-white/20 transition-all">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-400">
                                  Project {index + 1}
                                  {project.featured && (
                                    <Badge variant="default" className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 border-none">
                                      <Star className="h-3 w-3 mr-1" /> Featured
                                    </Badge>
                                  )}
                                </h3>
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveProject(index, 'up')} disabled={index === 0}>
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => moveProject(index, 'down')} disabled={index === (portfolio.projects?.length || 0) - 1}>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => removeProject(index)} className="text-red-500 hover:text-red-700 hover:bg-red-500/10 h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Project Title</Label>
                                  <Input
                                    placeholder="My Awesome Project"
                                    value={project.title}
                                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Image URL</Label>
                                  <Input
                                    placeholder="https://example.com/project-image.jpg"
                                    value={project.image}
                                    onChange={(e) => updateProject(index, 'image', e.target.value)}
                                    className="bg-black/20 border-white/10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">Live URL</Label>
                                  <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                      className="pl-10 bg-black/20 border-white/10"
                                      placeholder="https://project-demo.com"
                                      value={project.liveUrl}
                                      onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-gray-300">GitHub URL</Label>
                                  <div className="relative">
                                    <Github className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                      className="pl-10 bg-black/20 border-white/10"
                                      placeholder="https://github.com/username/repo"
                                      value={project.githubUrl}
                                      onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-gray-300">Description</Label>
                                <Textarea
                                  placeholder="Describe your project, its purpose, and impact..."
                                  rows={3}
                                  value={project.description}
                                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                                  className="bg-black/20 border-white/10 focus-visible:ring-purple-500/50"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-gray-300">Technologies Used</Label>
                                <Input
                                  placeholder="React, Node.js, MongoDB (comma-separated)"
                                  value={project.technologies?.join(', ') || ''}
                                  onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                                  className="bg-black/20 border-white/10"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies?.map((tech: string, i: number) => (
                                    <Badge key={i} variant="outline" className="border-white/20 bg-black/40 text-gray-300 backdrop-blur-sm">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                                <Switch
                                  id={`featured-${index}`}
                                  checked={project.featured}
                                  onCheckedChange={(checked) => updateProject(index, 'featured', checked)}
                                  className="data-[state=checked]:bg-purple-500"
                                />
                                <Label htmlFor={`featured-${index}`} className="text-gray-300">Feature this project prominently</Label>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            {/* Other tabs with coming soon */}
            < TabsContent value="testimonials" >
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>Client reviews and testimonials - Coming soon!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Testimonials management will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent >

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Your professional services - Coming soon!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Services management will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Settings</CardTitle>
                  <CardDescription>Configure your portfolio preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div>
                      <Label htmlFor="open-to-work" className="text-base font-semibold text-emerald-400">Open for Work</Label>
                      <p className="text-sm text-muted-foreground mt-0.5">Show "Open to Opportunities" card in your timeline</p>
                    </div>
                    <Switch
                      id="open-to-work"
                      checked={portfolio.settings?.openToWork ?? false}
                      onCheckedChange={(checked) => setPortfolio({
                        ...portfolio,
                        settings: { ...portfolio.settings, openToWork: checked }
                      })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your portfolio publicly accessible</p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={portfolio.settings?.publicProfile}
                      onCheckedChange={(checked) => setPortfolio({
                        ...portfolio,
                        settings: { ...portfolio.settings, publicProfile: checked }
                      })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about your portfolio</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={portfolio.settings?.emailNotifications}
                      onCheckedChange={(checked) => setPortfolio({
                        ...portfolio,
                        settings: { ...portfolio.settings, emailNotifications: checked }
                      })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">Track portfolio visitor statistics</p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={portfolio.settings?.analytics}
                      onCheckedChange={(checked) => setPortfolio({
                        ...portfolio,
                        settings: { ...portfolio.settings, analytics: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs >
        </div >
      </main >
    </div >
  );
}
