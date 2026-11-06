export type FeatureTab =
  | 'resume'
  | 'questions'
  | 'improver'
  | 'guidance'
  | 'roadmap'
  | 'cover-letter';

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  gradYear: string;
  gpa?: string;
  relevantCourses?: string;
}

export interface ProjectItem {
  title: string;
  techStack: string;
  description: string;
  link?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  details: string;
}

export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  targetRole: string;
  summaryGoal: string;
  education: EducationItem[];
  skills: {
    technical: string;
    tools: string;
    soft: string;
  };
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: string;
  achievements: string;
}

export interface ResumeResult {
  resumeMarkdown: string;
  executiveSummary: string;
  atsScoreEstimate: number;
  keyStrengths: string[];
  improvementTips: string[];
  actionVerbsUsed: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  interviewerIntent: string;
  suggestedApproach: string;
  sampleKeywords: string[];
}

export interface InterviewQuestionsResult {
  roleSummary: string;
  questions: InterviewQuestion[];
  preparationTips: string[];
}

export interface AnswerImproverResult {
  scores: {
    clarity: number;
    impact: number;
    structure: number;
    confidence: number;
    overall: number;
  };
  improvedAnswer: string;
  spokenVersion: string;
  strengths: string[];
  areasToImprove: string[];
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  powerPhrases: string[];
}

export interface CareerPath {
  title: string;
  matchPercentage: number;
  tagline: string;
  whyGoodFit: string;
  requiredSkills: {
    core: string[];
    goodToHave: string[];
  };
  entryLevelRoles: string[];
  dayInTheLife: string;
  growthTrajectory: {
    year1: string;
    year3: string;
    year5: string;
  };
  salaryOutlook: string;
  marketDemand: string;
  recommendedFirstStep: string;
}

export interface CareerGuidanceResult {
  profileAnalysis: string;
  careerPaths: CareerPath[];
  generalAdvice: string[];
}

export interface RoadmapModule {
  moduleTitle: string;
  topics: string[];
  practicalOutcome: string;
}

export interface MilestoneProject {
  title: string;
  description: string;
  resumeHighlight: string;
}

export interface RecommendedResource {
  name: string;
  type: string;
  tip: string;
}

export interface RoadmapStage {
  stageName: string;
  timeline: string;
  goal: string;
  modules: RoadmapModule[];
  milestoneProject: MilestoneProject;
  recommendedResources: RecommendedResource[];
}

export interface RoadmapResult {
  roadmapTitle: string;
  overview: string;
  totalDuration: string;
  stages: RoadmapStage[];
  portfolioCapstone: {
    title: string;
    description: string;
    techStack: string[];
    whyItImpressesRecruiters: string;
  };
  studyTips: string[];
}

export interface CoverLetterResult {
  coverLetterText: string;
  subjectLine: string;
  keyHighlights: string[];
  customizationTips: string[];
}

export interface SavedItem {
  id: string;
  type: FeatureTab;
  title: string;
  timestamp: number;
  data: any;
}
