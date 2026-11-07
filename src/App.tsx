import React, { useState, useEffect } from 'react';
import { UserRole, User, Complaint, Department, FieldWorker, WorkerTask } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { ComplaintDbService } from './services/complaintDbService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoNoticeBanner } from './components/layout/DemoNoticeBanner';
import { VoiceInputModal } from './components/common/VoiceInputModal';
import { CivicAIAssistantModal } from './components/ai/CivicAIAssistantModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { FileComplaint } from './pages/citizen/FileComplaint';
import { TrackComplaint } from './pages/citizen/TrackComplaint';
import { MyComplaints } from './pages/citizen/MyComplaints';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Authority Pages
import { AuthorityDashboard } from './pages/authority/AuthorityDashboard';
import { OfficialQueue } from './pages/authority/OfficialQueue';
import { ComplaintInvestigation } from './pages/authority/ComplaintInvestigation';
import { DepartmentWorkload } from './pages/authority/DepartmentWorkload';
import { ResolutionManager } from './pages/authority/ResolutionManager';

// Admin & Operations Pages
import { WorkCoordinatorDashboard } from './pages/coordinator/WorkCoordinatorDashboard';
import { AdminOverview } from './pages/admin/AdminOverview';
import { UserManagement } from './pages/admin/UserManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { PlatformMonitoring } from './pages/admin/PlatformMonitoring';
import { AIIntelligenceHub } from './pages/admin/AIIntelligenceHub';

// Field Worker Portal
import { FieldWorkerDashboard } from './pages/worker/FieldWorkerDashboard';

// Common Interactive Map
import { InteractiveCivicMap } from './components/map/InteractiveCivicMap';
import { INITIAL_CITY_ANALYTICS } from './services/mockData';

export function App() {
  // Navigation View: 'landing' | 'auth' | 'dashboard'
  const [appView, setAppView] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<User>(StorageService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('citizen_dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fieldWorkers, setFieldWorkers] = useState<FieldWorker[]>([]);
  const [workerTasks, setWorkerTasks] = useState<WorkerTask[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | undefined>(undefined);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data Source & Database State
  const [dataSource, setDataSource] = useState<'supabase' | 'demo_fallback'>(
    isSupabaseConfigured() ? 'supabase' : 'demo_fallback'
  );
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load complaints and application telemetry
  const refreshData = async (targetSource?: 'supabase' | 'demo_fallback') => {
    StorageService.initialize();
    setDepartments(StorageService.getDepartments());
    setUsers(StorageService.getUsers());
    setFieldWorkers(StorageService.getFieldWorkers());
    setWorkerTasks(StorageService.getWorkerTasks());
    const role = StorageService.getCurrentRole();
    setCurrentRole(role);
    const activeUser = StorageService.getCurrentUser();
    setCurrentUser(activeUser);

    const activeSource = targetSource || dataSource;

    if (activeSource === 'demo_fallback' || !isSupabaseConfigured()) {
      setComplaints(StorageService.getComplaints());
      setDataSource('demo_fallback');
      return;
    }

    setIsDbLoading(true);
    setDbError(null);
    const res = await ComplaintDbService.fetchComplaints({
      citizenId: activeUser.id,
      role: role,
      departmentId: activeUser.departmentId,
      workerId: activeUser.id
    });
    setIsDbLoading(false);

    if (res.error) {
      setDbError(res.error);
      addToast('error', 'Supabase Database Query Error', res.error);
      // Requirement 9: Never silently show mock complaints as though they came from the database.
      setComplaints([]);
      setDataSource('supabase');
    } else if (res.data) {
      setComplaints(res.data);
      setDataSource('supabase');
    }
  };

  const isAdminRole =
    currentRole === 'admin' ||
    currentRole === 'coordinator' ||
    currentRole === 'platform_admin';

  useEffect(() => {
    refreshData();

    // Recover existing Supabase session on startup
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setCurrentRole(user.role);
        setAppView('dashboard');
      }
    });

    // Subscribe to live auth events (session changes, sign-in, sign-out, password recovery)
    const { unsubscribe } = AuthService.onAuthStateChange((event, user) => {
      if (event === 'SIGNED_IN' && user) {
        setCurrentUser(user);
        setCurrentRole(user.role);
        setAppView('dashboard');
      } else if (event === 'SIGNED_OUT') {
        refreshData();
        setAppView('auth');
      } else if (event === 'PASSWORD_RECOVERY') {
        setAppView('auth');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // When role changes, switch default tab
  const handleRoleChange = (newRole: UserRole) => {
    StorageService.setCurrentRole(newRole);
    setCurrentRole(newRole);
    const updatedUser = StorageService.getCurrentUser();
    setCurrentUser(updatedUser);

    if (newRole === 'citizen') {
      setCurrentTab('citizen_dashboard');
    } else if (newRole === 'field_worker') {
      setCurrentTab('worker_dashboard');
    } else if (newRole === 'coordinator') {
      setCurrentTab('admin_coordinator');
    } else if (newRole === 'platform_admin' || newRole === 'admin') {
      setCurrentTab('admin_overview');
    } else {
      setCurrentTab('auth_dashboard');
    }

    addToast(
      'info',
      `Switched to ${newRole.replace('_', ' ').toUpperCase()} View`,
      `Active Persona: ${updatedUser.name}`
    );
  };

  const handleOpenComplaint = (id: string) => {
    setSelectedComplaintId(id);
    if (currentRole === 'citizen') {
      setCurrentTab('citizen_track');
    } else if (currentRole === 'field_worker') {
      setCurrentTab('worker_dashboard');
    } else if (isAdminRole) {
      setCurrentTab('admin_coordinator');
    } else {
      setCurrentTab('auth_investigation');
    }
  };

  const handleComplaintSubmitted = (newId: string) => {
    refreshData();
    setSelectedComplaintId(newId);
    setCurrentTab('citizen_track');
    addToast('success', 'Grievance Submitted', `Ticket ${newId} registered and routed via AI.`);
  };

  const handleAuthSuccess = (user: User, role: UserRole) => {
    refreshData();
    setCurrentUser(user);
    setCurrentRole(role);
    setAppView('dashboard');
    if (role === 'citizen') setCurrentTab('citizen_dashboard');
    else if (role === 'field_worker') setCurrentTab('worker_dashboard');
    else if (role === 'coordinator') setCurrentTab('admin_coordinator');
    else if (role === 'platform_admin' || role === 'admin') setCurrentTab('admin_overview');
    else setCurrentTab('auth_dashboard');
    addToast('success', 'Authentication Successful', `Welcome, ${user.name} (${role.replace('_', ' ').toUpperCase()})`);
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    refreshData();
    setAppView('auth');
    addToast('info', 'Signed Out', 'You have been safely signed out of CivicSense AI.');
  };

  const openGrievanceCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'verified'
  ).length;
  const criticalGrievanceCount = complaints.filter(
    (c) => c.aiAnalysis.severity === 'critical' && c.status !== 'resolved'
  ).length;

  return (
    <div className="min-h-screen bg-[#F4F7F5] font-sans text-[#263A32] flex flex-col selection:bg-[#237A57] selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* ================= VIEW 1: LANDING PAGE ================= */}
      {appView === 'landing' && (
        <LandingPage
          complaints={complaints}
          onOpenAuth={() => setAppView('auth')}
          onExploreDashboard={() => setAppView('dashboard')}
        />
      )}

      {/* ================= VIEW 2: SPLIT-SCREEN AUTH PAGE ================= */}
      {appView === 'auth' && (
        <AuthPage
          departments={departments}
          onLoginSuccess={handleAuthSuccess}
          onNavigateLanding={() => setAppView('landing')}
        />
      )}

      {/* ================= VIEW 3: MAIN PORTALS DASHBOARD ================= */}
      {appView === 'dashboard' && (
        <>
          {/* Top Data Source & Demo Indicator Banner */}
          <DemoNoticeBanner
            dataSource={dataSource}
            complaintCount={complaints.length}
            onToggleDataSource={(source) => {
              setDataSource(source);
              refreshData(source);
              if (source === 'demo_fallback') {
                addToast(
                  'info',
                  'Demo Data Activated',
                  'Now viewing local sample data (development fallback).'
                );
              } else {
                addToast(
                  'success',
                  'Live Database Query',
                  'Reconnected to live Supabase PostgreSQL database.'
                );
              }
            }}
            onReset={() => {
              refreshData('demo_fallback');
              addToast('info', 'Demo State Restored', 'Complaint registry reset to default values.');
            }}
          />

          {/* Main Navbar (Unified CivicSense AI Theme) */}
          <Navbar
            currentRole={currentRole}
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            selectedDepartmentId={selectedDepartmentId}
            onDepartmentFilterChange={setSelectedDepartmentId}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            onOpenComplaint={handleOpenComplaint}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNavigateLanding={() => setAppView('landing')}
            onNavigateAuth={handleSignOut}
          />

          <div className="flex flex-1 overflow-hidden bg-[#F4F7F5]">
            {/* Sidebar */}
            {sidebarOpen && (
              <Sidebar
                currentRole={currentRole}
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  if (tab === 'citizen_assistant' || tab === 'auth_assistant') {
                    setIsAIAssistantOpen(true);
                  } else {
                    setCurrentTab(tab);
                  }
                }}
                openGrievanceCount={openGrievanceCount}
                criticalGrievanceCount={criticalGrievanceCount}
              />
            )}

            {/* Content Viewport */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F7F5]">
              {/* Database Telemetry Indicator Banner */}
              {dataSource === 'supabase' && (
                <>
                  {dbError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">PostgreSQL Query Alert:</span>
                        <span>{dbError}</span>
                      </div>
                      <button
                        onClick={() => {
                          setDataSource('demo_fallback');
                          refreshData('demo_fallback');
                        }}
                        className="rounded-lg bg-red-100 hover:bg-red-200 px-3 py-1 font-bold text-red-900 text-xs transition-colors"
                      >
                        Switch to Demo Fallback
                      </button>
                    </div>
                  )}

                  {isDbLoading && (
                    <div className="mb-4 rounded-xl border border-[#DFE8E1] bg-white p-3 text-xs text-[#237A57] flex items-center gap-2 animate-pulse shadow-xs">
                      <span className="h-2 w-2 rounded-full bg-[#237A57] animate-ping" />
                      <span>Synchronizing live complaints with Supabase PostgreSQL...</span>
                    </div>
                  )}

                  {!isDbLoading && !dbError && complaints.length === 0 && (
                    <div className="mb-4 rounded-xl border border-[#DFE8E1] bg-[#E7F2EC] p-3 text-xs text-[#123D32] flex flex-wrap items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#237A57]" />
                        <span>
                          <strong>Supabase Live Database:</strong> 0 complaints registered in table{' '}
                          <code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">
                            public.complaints
                          </code>
                          .
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentTab('citizen_file')}
                          className="rounded-lg bg-[#237A57] hover:bg-[#1B6346] text-white px-2.5 py-1 font-bold text-[11px] transition-colors"
                        >
                          Submit Real Complaint
                        </button>
                        <button
                          onClick={() => {
                            setDataSource('demo_fallback');
                            refreshData('demo_fallback');
                          }}
                          className="rounded-lg border border-[#237A57]/30 bg-white hover:bg-[#F4F7F5] text-[#123D32] px-2.5 py-1 font-bold text-[11px] transition-colors"
                        >
                          View Demo Sandbox Data
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* ================= 1. CITIZEN PORTAL TABS ================= */}
              {currentRole === 'citizen' && currentTab === 'citizen_dashboard' && (
                <CitizenDashboard
                  currentUser={currentUser}
                  complaints={complaints}
                  onNavigateTab={(tab, id) => {
                    if (id) setSelectedComplaintId(id);
                    if (tab === 'citizen_assistant') setIsAIAssistantOpen(true);
                    else setCurrentTab(tab);
                  }}
                />
              )}

              {currentRole === 'citizen' && currentTab === 'citizen_file' && (
                <FileComplaint
                  currentUser={currentUser}
                  onComplaintSubmitted={handleComplaintSubmitted}
                />
              )}

              {currentRole === 'citizen' && currentTab === 'citizen_track' && (
                <TrackComplaint
                  currentUser={currentUser}
                  complaints={complaints}
                  initialComplaintId={selectedComplaintId}
                  onRefreshData={() => {
                    refreshData();
                    addToast('success', 'Verification Updated', 'Citizen audit log updated.');
                  }}
                />
              )}

              {currentRole === 'citizen' && currentTab === 'citizen_my_complaints' && (
                <MyComplaints
                  currentUser={currentUser}
                  complaints={complaints}
                  onOpenComplaint={handleOpenComplaint}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentRole === 'citizen' && currentTab === 'citizen_map' && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
                      Civic Issues & Hazard Map
                    </h1>
                    <p className="text-xs text-[#687A70]">
                      Explore reported road potholes, water leaks, and garbage clusters across Hyderabad
                    </p>
                  </div>
                  <InteractiveCivicMap complaints={complaints} height="600px" />
                </div>
              )}

              {currentRole === 'citizen' && currentTab === 'citizen_profile' && (
                <CitizenProfile currentUser={currentUser} complaints={complaints} />
              )}

              {/* ================= 2. FIELD WORKER PORTAL TABS ================= */}
              {currentRole === 'field_worker' && (
                <FieldWorkerDashboard
                  currentUser={currentUser}
                  complaints={complaints}
                  workerTasks={workerTasks}
                  fieldWorkers={fieldWorkers}
                  onRefreshData={() => {
                    refreshData();
                    addToast('info', 'Task Updated', 'Field progress recorded.');
                  }}
                  onOpenComplaint={handleOpenComplaint}
                />
              )}

              {/* ================= 3. ADMIN & WORK COORDINATOR PORTAL TABS ================= */}
              {isAdminRole && currentTab === 'admin_coordinator' && (
                <WorkCoordinatorDashboard
                  currentUser={currentUser}
                  complaints={complaints}
                  departments={departments}
                  fieldWorkers={fieldWorkers}
                  workerTasks={workerTasks}
                  onRefreshData={() => {
                    refreshData();
                    addToast('success', 'Coordinator Updated', 'Assignments & task status synchronized.');
                  }}
                  onOpenComplaint={handleOpenComplaint}
                />
              )}

              {isAdminRole && currentTab === 'admin_overview' && (
                <AdminOverview
                  complaints={complaints}
                  departments={departments}
                  users={users}
                  cityAnalytics={INITIAL_CITY_ANALYTICS}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {isAdminRole && currentTab === 'admin_users' && (
                <UserManagement
                  users={users}
                  onRefreshData={() => {
                    refreshData();
                    addToast('info', 'User Status Updated', 'Account access privileges toggled.');
                  }}
                />
              )}

              {isAdminRole && currentTab === 'admin_departments' && (
                <DepartmentManagement
                  departments={departments}
                  onRefreshData={() => {
                    refreshData();
                    addToast('success', 'Department Saved', 'Registry configuration updated.');
                  }}
                />
              )}

              {isAdminRole && currentTab === 'admin_monitoring' && (
                <OfficialQueue
                  complaints={complaints}
                  onOpenInvestigation={handleOpenComplaint}
                />
              )}

              {isAdminRole && currentTab === 'admin_ai_hub' && (
                <AIIntelligenceHub
                  complaints={complaints}
                  departments={departments}
                  onOpenAssistant={() => setIsAIAssistantOpen(true)}
                  onOpenInvestigation={handleOpenComplaint}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {isAdminRole && currentTab === 'admin_analytics' && (
                <PlatformMonitoring
                  complaints={complaints}
                  departments={departments}
                  cityAnalytics={INITIAL_CITY_ANALYTICS}
                />
              )}

              {/* ================= 4. AUTHORITY PORTAL TABS ================= */}
              {currentRole === 'authority' && currentTab === 'auth_dashboard' && (
                <AuthorityDashboard
                  currentUser={currentUser}
                  complaints={complaints}
                  departments={departments}
                  selectedDepartmentId={selectedDepartmentId}
                  onNavigateTab={(tab, id) => {
                    if (id) setSelectedComplaintId(id);
                    setCurrentTab(tab);
                  }}
                />
              )}

              {currentRole === 'authority' && currentTab === 'auth_queue' && (
                <OfficialQueue
                  complaints={complaints}
                  selectedDepartmentId={selectedDepartmentId}
                  onOpenInvestigation={handleOpenComplaint}
                />
              )}

              {currentRole === 'authority' && currentTab === 'auth_investigation' && (
                <ComplaintInvestigation
                  complaintId={selectedComplaintId}
                  complaints={complaints}
                  currentUser={currentUser}
                  onRefreshData={() => {
                    refreshData();
                    addToast('info', 'Investigation Updated', 'Status and notes recorded.');
                  }}
                  onBackToQueue={() => setCurrentTab('auth_queue')}
                />
              )}

              {currentRole === 'authority' && currentTab === 'auth_departments' && (
                <DepartmentWorkload
                  departments={departments}
                  complaints={complaints}
                  onOpenInvestigation={handleOpenComplaint}
                />
              )}

              {currentRole === 'authority' && currentTab === 'auth_resolutions' && (
                <ResolutionManager
                  complaints={complaints}
                  currentUser={currentUser}
                  onRefreshData={() => {
                    refreshData();
                    addToast('success', 'Resolution Submitted', 'Pending citizen verification.');
                  }}
                  onOpenComplaint={handleOpenComplaint}
                />
              )}

              {currentRole === 'authority' && currentTab === 'auth_map' && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#263A32]">
                      Geospatial Civic Operations Map
                    </h1>
                    <p className="text-xs text-[#687A70]">
                      Density heatmap overlays and location-based triage
                    </p>
                  </div>
                  <InteractiveCivicMap
                    complaints={complaints}
                    height="600px"
                    onSelectComplaint={(c) => handleOpenComplaint(c.id)}
                  />
                </div>
              )}
            </main>
          </div>

          {/* Multilingual Voice Modal */}
          <VoiceInputModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            onTranscriptComplete={(txt) => {
              addToast('info', 'Voice Captured', txt);
              setCurrentRole('citizen');
              setCurrentTab('citizen_file');
            }}
          />

          {/* AI Assistant Modal */}
          <CivicAIAssistantModal
            isOpen={isAIAssistantOpen}
            onClose={() => setIsAIAssistantOpen(false)}
            role={currentRole}
            onOpenComplaint={handleOpenComplaint}
          />
        </>
      )}
    </div>
  );
}

export default App;
