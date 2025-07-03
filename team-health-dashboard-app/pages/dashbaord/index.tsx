import React, { useEffect } from 'react'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAuth } from '../../app/contexts/AuthContext'
import api from '../../utils/axiosConfig'
import ProjectList from './manager/projects/projectList';
import ContributorProjectList from '../components/contributor/dashbaord/ProjectList';
import LogOutSidePanel from '@/pages/components/projects/SidePannel/LogoutSidePanel';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';

const fetchProjects = async (userId, role) => {
  const endpoint = role === "manager" 
    ? `/project/manager/${userId}`
    : `/project/contributor/${userId}`;
  
  const response = await api.get(endpoint);
  return response.data;
};

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      if (user && user.role === 'admin') {
        router.push('/admin');
        return;
      }
      
      // Check if user has allowed role for this page
      if (user && !['user', 'manager', 'team_lead', 'contributor'].includes(user.role)) {
        router.push('/login');
        return;
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const { data: projects, isLoading: projectsLoading, error } = useQuery({
    queryKey: ['projects', user?.userId, user?.role],
    queryFn: () => fetchProjects(user.userId, user.role),
    enabled: !!user && isAuthenticated() && user.role !== 'admin', 
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // Show loading while checking authentication
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated()) {
    return null;
  }

  // Don't render for admin users (will redirect)
  if (user.role === 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200">Redirecting to admin...</div>
      </div>
    );
  }

  // Don't render for unauthorized roles
  if (!['user', 'manager', 'team_lead', 'contributor'].includes(user.role)) {
    return null;
  }

  if (error) {
    return (
      <div className="p-4 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded transition-colors duration-200">
          Error loading projects: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
        Dashboard - {user.role} ({user.email || user.username})
      </h1>
      
      {projectsLoading ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200">Loading projects...</div>
        </div>
      ) : (
        <>
          {user.role === "manager" ? (
            <div>
              <ProjectList projects={projects || []} user_id={user.userId} />
            </div>
          ) : (
            <div>
              <ContributorProjectList projects={projects || []} user_id={user.userId} />
            </div>
          )}
        </>
      )}

      <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`fixed top-8 right-0 z-50 h-10 w-10 rounded-l-md rounded-r-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ${isPanelOpen ? 'translate-x-[-320px]' : 'translate-x-0'
          }`}
        size="icon"
        title={isPanelOpen ? "Close Panel" : "Open Panel - Edit Project, Manage Sprints & Team"}
      >
        {isPanelOpen ? (
          <ChevronRight className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </Button>

      <LogOutSidePanel
        isOpen={isPanelOpen}
        user_id={user.userId}
        onOpenChange={setIsPanelOpen}
      />
    </div>
  )
}

export default Index