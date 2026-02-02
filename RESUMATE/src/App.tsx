 import { motion } from "framer-motion";

// Sections
import Navigation from "@/sections/Navigation";
import Hero from "@/sections/Hero";
import ResumeUpload from "@/sections/ResumeUpload";
import JobDescription from "@/sections/JobDscription";
import ATSScore from "@/sections/ATSScore";
import FeedbackCards from "@/sections/FeedbackCards";
import Dashboard from "@/sections/Dashboard";
import AuthForms from "@/sections/AuthForms";

function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navigation */}
      <Navigation
        isAuthenticated={false}
        userName="Demo User"
        currentView="home"
        onNavigate={() => {}}
        onLogout={() => {}}
      />

      <main className="pt-16 space-y-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Hero onGetStarted={() => {}} />
        </motion.div>

        {/* Resume Upload */}
        <ResumeUpload
          isLoading={false}
          onUpload={async () => ({ success: true })}
        />

        {/* Job Description */}
        <JobDescription
          isLoading={false}
          hasResume={true}
          onAnalyze={async () => {}}
        />

        {/* ATS Score (mock data) */}
        <ATSScore
          analysisResult={{
            overallScore: 78,
            sectionScores: {
              skills: 80,
              experience: 70,
              projects: 75,
              education: 85,
            },
            keywordMatch: {
              percentage: 72,
              matched: ["React", "Node.js", "MongoDB"],
              missing: ["Docker", "AWS"],
            },
            feedback: {
              missingSkills: [],
              weakSections: [],
              strongPoints: [],
              repeatedKeywords: [],
              overusedBuzzwords: [],
              suggestions: [],
            },
            resumeKeywords: {
              skills: [],
              actionVerbs: [],
            },
            analyzedAt: new Date().toISOString(),
          }}
        />

        {/* Feedback Cards */}
        <FeedbackCards
          analysisResult={{
            overallScore: 78,
            sectionScores: {
              skills: 80,
              experience: 70,
              projects: 75,
              education: 85,
            },
            keywordMatch: {
              percentage: 72,
              matched: ["React", "Node.js", "MongoDB"],
              missing: ["Docker", "AWS"],
            },
            feedback: {
              missingSkills: ["Docker", "AWS"],
              weakSections: ["Experience"],
              strongPoints: ["Skills"],
              repeatedKeywords: [],
              overusedBuzzwords: [],
              suggestions: ["Add cloud experience"],
            },
            resumeKeywords: {
              skills: [],
              actionVerbs: [],
            },
            analyzedAt: new Date().toISOString(),
          }}
        />

        {/* Dashboard */}
        <Dashboard
          isLoading={false}
          onRefresh={() => {}}
          stats={{
            totalResumes: 5,
            totalAnalyses: 12,
            averageScore: 74,
            improvementTrend: 12,
            recentAnalyses: [],
            scoreHistory: [],
          }}
        />

        {/* Auth Forms */}
        <AuthForms
          isLoading={false}
          error={null}
          onLogin={async () => ({ success: true })}
          onRegister={async () => ({ success: true })}
        />
      </main>
    </div>
  );
}

export default App;
