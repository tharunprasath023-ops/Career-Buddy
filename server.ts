import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI with proper telemetry headers
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add it to the Secrets panel.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'AI Career Buddy',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// 1. AI Resume Builder
app.post('/api/career/resume', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      linkedin,
      github,
      portfolio,
      targetRole,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
      summaryGoal,
    } = req.body;

    if (!fullName || !targetRole) {
      return res.status(400).json({ error: 'Full name and target role are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert college career counselor and certified professional resume writer specializing in helping college students, undergraduate engineers, and fresh graduates craft standout, ATS-optimized, high-impact resumes.

Generate a comprehensive, professionally formatted resume draft based on the student's real inputs below.
CRITICAL RULES:
- Do NOT fabricate fake companies, degrees, or false metrics. Enhance and polish what the student provided with strong action verbs (e.g., "Engineered", "Orchestrated", "Implemented", "Spearheaded") and quantifiable impact placeholders (e.g. "[reduced load time by ~25%]") where appropriate.
- Target Role: "${targetRole}"
- Full Name: ${fullName}
- Contact Info: Email: ${email || 'N/A'}, Phone: ${phone || 'N/A'}, LinkedIn: ${linkedin || 'N/A'}, GitHub: ${github || 'N/A'}, Portfolio: ${portfolio || 'N/A'}
- Career Summary / Goal: ${summaryGoal || 'Targeting entry-level / internship opportunities to apply technical rigor and problem-solving skills.'}
- Education Details: ${JSON.stringify(education || [])}
- Skills Input: Technical: ${skills?.technical || ''}, Tools/Frameworks: ${skills?.tools || ''}, Soft Skills: ${skills?.soft || ''}
- Projects Details: ${JSON.stringify(projects || [])}
- Work/Internship/Extracurricular Experience: ${JSON.stringify(experience || [])}
- Certifications & Courses: ${certifications || 'None provided'}
- Honors, Awards & Achievements: ${achievements || 'None provided'}

Format the resume cleanly using standard markdown headings (# for Name, ## for Sections), bolding, and bullet points. Make it immediately readable, cleanly structured, and ready to print or copy.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumeMarkdown: {
              type: Type.STRING,
              description: 'The complete, fully formatted resume in Markdown syntax with clean typography and bullet points.',
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'A 2-3 sentence punchy summary tailored for the student target role.',
            },
            atsScoreEstimate: {
              type: Type.INTEGER,
              description: 'Estimated ATS score out of 100 based on standard formatting, action verbs, and keyword density.',
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3-4 standout strengths reflected in this draft.',
            },
            improvementTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable tips for the college student to make their profile even stronger.',
            },
            actionVerbsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top dynamic action verbs used in this resume draft.',
            },
          },
          required: ['resumeMarkdown', 'executiveSummary', 'atsScoreEstimate', 'keyStrengths', 'improvementTips', 'actionVerbsUsed'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating resume:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate resume draft. Please verify API key and inputs.',
    });
  }
});

// 2. Interview Question Generator
app.post('/api/career/interview-questions', async (req: Request, res: Response) => {
  try {
    const { jobRole, domain, experienceLevel, companyType } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role or domain is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Generate exactly 10 realistic, high-yield interview practice questions for a college student applying for:
- Job Role: "${jobRole}"
- Domain/Field: "${domain || jobRole}"
- Experience Level: "${experienceLevel || 'College Fresher / Summer Intern'}"
- Target Company Profile: "${companyType || 'General Tech / Product Company'}"

REQUIREMENTS:
- Provide exactly 10 questions.
- Divide them into:
  - 6 Technical & Core Domain Questions (fundamental concepts, scenario-based problem solving, coding/design logic if tech).
  - 4 Behavioral, HR & Situational Questions (team collaboration, handling tight deadlines, learning steep curves, conflict resolution).
- For each question, explain WHY the interviewer asks this, WHAT key points or concepts the student should highlight, and suggested keywords.
- Clearly note that these are practice questions intended for preparation.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleSummary: {
              type: Type.STRING,
              description: 'A brief summary of what interviewers evaluate for this specific role and level.',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: Technical, Behavioral, Situational, HR, Problem Solving',
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: 'One of: Beginner, Intermediate, Challenging',
                  },
                  interviewerIntent: {
                    type: Type.STRING,
                    description: 'What the interviewer is testing or looking for in the candidate.',
                  },
                  suggestedApproach: {
                    type: Type.STRING,
                    description: 'How to structure the answer (e.g. STAR method, key concepts to mention).',
                  },
                  sampleKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-5 key terms or buzzwords that demonstrate proficiency.',
                  },
                },
                required: ['id', 'question', 'category', 'difficulty', 'interviewerIntent', 'suggestedApproach', 'sampleKeywords'],
              },
            },
            preparationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 general interview advice points for college candidates.',
            },
          },
          required: ['roleSummary', 'questions', 'preparationTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate interview questions.',
    });
  }
});

// 3. Interview Answer Improver
app.post('/api/career/improve-answer', async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, jobRole } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Both interview question and student answer are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are a warm, encouraging, yet rigorous university interview coach.
A college student is practicing for interviews. Review their draft answer to the following question:

Question: "${question}"
Target Job Role / Context: "${jobRole || 'Entry-Level Professional / College Intern'}"
Student's Raw Answer:
"${studentAnswer}"

YOUR TASK:
1. Evaluate clarity, grammar, confidence, and structure.
2. Provide a score from 1 to 10 for Clarity, Impact, Structure, and Confidence.
3. Rewrite the answer using the STAR Framework (Situation, Task, Action, Result) in a professional, compelling way without inventing fake credentials.
4. Provide a "Spoken Version" that sounds natural when spoken aloud during an interview (avoiding overly stiff written prose).
5. Highlight strengths and give constructive, specific suggestions for improvement.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scores: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.INTEGER },
                impact: { type: Type.INTEGER },
                structure: { type: Type.INTEGER },
                confidence: { type: Type.INTEGER },
                overall: { type: Type.INTEGER },
              },
              required: ['clarity', 'impact', 'structure', 'confidence', 'overall'],
            },
            improvedAnswer: {
              type: Type.STRING,
              description: 'The polished, high-impact version of their answer structured with STAR principles.',
            },
            spokenVersion: {
              type: Type.STRING,
              description: 'A conversational, natural-sounding version tailored for vocal delivery.',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'What the student did well in their initial answer.',
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Constructive critique pointing out missing context, filler words, or weak phrasing.',
            },
            starBreakdown: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            powerPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key power phrases or action words the candidate can use.',
            },
          },
          required: ['scores', 'improvedAnswer', 'spokenVersion', 'strengths', 'areasToImprove', 'starBreakdown', 'powerPhrases'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error improving answer:', error);
    return res.status(500).json({
      error: error.message || 'Failed to improve interview answer.',
    });
  }
});

// 4. AI Career Guidance
app.post('/api/career/guidance', async (req: Request, res: Response) => {
  try {
    const { interests, skills, favoriteSubjects, workPreferences, degree, yearOfStudy } = req.body;

    if (!interests || !favoriteSubjects) {
      return res.status(400).json({ error: 'Interests and favorite subjects are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an empathetic, insightful college career counselor.
Analyze this college student's profile to suggest 3-4 suitable career paths.

Student Profile:
- Degree & Major: ${degree || 'Undergraduate Student'}
- Year of Study: ${yearOfStudy || 'Undergraduate'}
- Interests & Passions: ${Array.isArray(interests) ? interests.join(', ') : interests}
- Known Skills & Strengths: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Eager to learn'}
- Favorite Subjects: ${Array.isArray(favoriteSubjects) ? favoriteSubjects.join(', ') : favoriteSubjects}
- Work Environment / Style: ${workPreferences || 'Flexible / Modern team'}

REQUIREMENTS:
- Suggest 3 to 4 realistic, high-potential career paths that genuinely match this profile.
- Give a match percentage (e.g. 92%).
- Outline required core skills and good-to-have skills.
- Outline what typical entry-level roles/internships look like.
- Give a brief "Day in the Life" snippet.
- Outline career progression (1-year, 3-year, 5-year outlook).
- Include realistic salary expectations for entry level and job market outlook.
- Make the tone motivating, grounded, and clear.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profileAnalysis: {
              type: Type.STRING,
              description: 'Brief encouraging analysis of the student unique intersection of skills and interests.',
            },
            careerPaths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  tagline: { type: Type.STRING },
                  whyGoodFit: { type: Type.STRING },
                  requiredSkills: {
                    type: Type.OBJECT,
                    properties: {
                      core: { type: Type.ARRAY, items: { type: Type.STRING } },
                      goodToHave: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['core', 'goodToHave'],
                  },
                  entryLevelRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dayInTheLife: { type: Type.STRING },
                  growthTrajectory: {
                    type: Type.OBJECT,
                    properties: {
                      year1: { type: Type.STRING },
                      year3: { type: Type.STRING },
                      year5: { type: Type.STRING },
                    },
                    required: ['year1', 'year3', 'year5'],
                  },
                  salaryOutlook: { type: Type.STRING },
                  marketDemand: { type: Type.STRING },
                  recommendedFirstStep: { type: Type.STRING },
                },
                required: [
                  'title',
                  'matchPercentage',
                  'tagline',
                  'whyGoodFit',
                  'requiredSkills',
                  'entryLevelRoles',
                  'dayInTheLife',
                  'growthTrajectory',
                  'salaryOutlook',
                  'marketDemand',
                  'recommendedFirstStep',
                ],
              },
            },
            generalAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 practical tips for exploring careers while in college.',
            },
          },
          required: ['profileAnalysis', 'careerPaths', 'generalAdvice'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating career guidance:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate career guidance.',
    });
  }
});

// 5. Skill Learning Roadmap
app.post('/api/career/roadmap', async (req: Request, res: Response) => {
  try {
    const { targetCareerOrSkill, currentLevel, weeklyCommitmentHours } = req.body;

    if (!targetCareerOrSkill) {
      return res.status(400).json({ error: 'Target career or skill is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Create a comprehensive, structured step-by-step learning roadmap for a college student who wants to learn:
- Target Career or Skill: "${targetCareerOrSkill}"
- Current Starting Level: "${currentLevel || 'Complete Beginner'}"
- Available Study Time: "${weeklyCommitmentHours || 8} hours per week"

MANDATORY STRUCTURE:
Divide the roadmap into 3 distinct, progressive stages:
1. Beginner Stage: Core concepts, syntax/theory fundamentals, essential tools, first mini-project.
2. Intermediate Stage: Practical application, frameworks, APIs, databases, architecture, real-world project.
3. Advanced Stage: Optimization, system design, testing, deployment/CI-CD, capstone portfolio project.

For EACH stage provide:
- Estimated time (e.g. Weeks 1-4)
- Core goal
- 2 to 3 focused modules with key topics
- A hands-on milestone project to put on their resume
- Recommended free or high-value resources (e.g. freeCodeCamp, official docs, Coursera audit, CS50, GitHub repos)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmapTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            totalDuration: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stageName: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced' },
                  timeline: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  modules: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        moduleTitle: { type: Type.STRING },
                        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                        practicalOutcome: { type: Type.STRING },
                      },
                      required: ['moduleTitle', 'topics', 'practicalOutcome'],
                    },
                  },
                  milestoneProject: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      resumeHighlight: { type: Type.STRING },
                    },
                    required: ['title', 'description', 'resumeHighlight'],
                  },
                  recommendedResources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, description: 'e.g. Documentation, Course, YouTube, Interactive' },
                        tip: { type: Type.STRING },
                      },
                      required: ['name', 'type', 'tip'],
                    },
                  },
                },
                required: ['stageName', 'timeline', 'goal', 'modules', 'milestoneProject', 'recommendedResources'],
              },
            },
            portfolioCapstone: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                whyItImpressesRecruiters: { type: Type.STRING },
              },
              required: ['title', 'description', 'techStack', 'whyItImpressesRecruiters'],
            },
            studyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 study habits for college students balancing coursework.',
            },
          },
          required: ['roadmapTitle', 'overview', 'totalDuration', 'stages', 'portfolioCapstone', 'studyTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate learning roadmap.',
    });
  }
});

// 6. Cover Letter Generator
app.post('/api/career/cover-letter', async (req: Request, res: Response) => {
  try {
    const {
      studentName,
      email,
      phone,
      jobRole,
      companyName,
      qualifications,
      relevantProjects,
      whyCompany,
      tone,
    } = req.body;

    if (!studentName || !jobRole || !companyName) {
      return res.status(400).json({ error: 'Student name, job role, and company name are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert college career mentor and professional writer.
Draft an authentic, persuasive, and well-structured cover letter for a college student applying for:
- Student Name: "${studentName}"
- Contact Info: Email: ${email || 'N/A'}, Phone: ${phone || 'N/A'}
- Applying For Role: "${jobRole}"
- Target Company: "${companyName}"
- Student's Academic Qualifications & Background: "${qualifications || 'Undergraduate coursework and foundational training'}"
- Relevant Projects / Extracurriculars: "${relevantProjects || 'Course capstones and personal engineering/design projects'}"
- Why this Company: "${whyCompany || 'Admiration for company product innovation and impact'}"
- Desired Tone: "${tone || 'Professional & Confident'}"

CRITICAL RULES:
- Never invent false employment history or degrees.
- Connect academic projects, passion, coursework, and proactive learning directly to what the company values.
- Use a clear business letter format: Date placeholder, recipient salutation, compelling hook, 2 body paragraphs demonstrating technical/domain competence and culture alignment, and a confident closing call to action.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverLetterText: {
              type: Type.STRING,
              description: 'The complete, ready-to-copy cover letter formatted with proper paragraphs and salutation.',
            },
            subjectLine: {
              type: Type.STRING,
              description: 'A professional email subject line for submitting the application.',
            },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 key selling points emphasized in this letter.',
            },
            customizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Advice for the student to tailor this before sending.',
            },
          },
          required: ['coverLetterText', 'subjectLine', 'keyHighlights', 'customizationTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate cover letter.',
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Asset Serving
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[AI Career Buddy] Server listening on http://${HOST}:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
