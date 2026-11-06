import { ResumeFormData } from '../types/career';

export const SAMPLE_RESUME_DATA: ResumeFormData = {
  fullName: 'Alex Chen',
  email: 'alex.chen@university.edu',
  phone: '+1 (555) 349-8821',
  linkedin: 'linkedin.com/in/alexchen-tech',
  github: 'github.com/alexchen-dev',
  portfolio: 'alexchen.dev',
  targetRole: 'Junior Full Stack Engineer / Software Intern',
  summaryGoal: 'Motivated 3rd-year Computer Science student with practical experience in React, TypeScript, and Node.js. Passionate about building accessible, performant web applications and eager to contribute to collaborative engineering teams.',
  education: [
    {
      institution: 'State University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Software Engineering',
      gradYear: '2026',
      gpa: '3.82 / 4.0',
      relevantCourses: 'Data Structures & Algorithms, Database Systems, Web Architecture, Distributed Systems, Object-Oriented Design',
    },
  ],
  skills: {
    technical: 'JavaScript, TypeScript, Python, Java, SQL, HTML5/CSS3, REST APIs',
    tools: 'React, Node.js, Express, PostgreSQL, Git & GitHub, Docker (Basic), Tailwind CSS, Vite',
    soft: 'Collaborative problem solving, Agile sprint participation, Technical communication, Fast learner',
  },
  projects: [
    {
      title: 'StudySync – Collaborative Campus Study Room App',
      techStack: 'React, Node.js, Socket.io, Tailwind CSS, PostgreSQL',
      description: 'Built a real-time study group reservation and flashcard review tool used by over 350 university peers. Implemented live chat and JWT authentication.',
      link: 'github.com/alexchen-dev/studysync',
    },
    {
      title: 'Algorithmic Portfolio Rebalancer',
      techStack: 'Python, Flask, Pandas, Chart.js',
      description: 'Designed a lightweight investment portfolio simulator that calculates risk metrics and backtests rebalancing strategies across historical stock indices.',
      link: 'github.com/alexchen-dev/portfolio-sim',
    },
  ],
  experience: [
    {
      role: 'Undergraduate Teaching Assistant (CS101)',
      organization: 'Department of Computer Science',
      period: 'Aug 2024 – Present',
      details: 'Conducted weekly lab sessions for 45+ freshman students. Mentored peers on data structures, debugging memory leaks, and writing clean modular code.',
    },
    {
      role: 'Web Master & Lead Developer',
      organization: 'ACM Student Chapter',
      period: 'Jan 2024 – Present',
      details: 'Redesigned the official chapter website, increasing hackathon registrations by 40%. Organized two campus codeathons for 120+ attendees.',
    },
  ],
  certifications: 'AWS Certified Cloud Practitioner (2024), freeCodeCamp Full Stack Developer Certification',
  achievements: 'Dean\'s List for 4 consecutive semesters; 2nd Place at HackTech University Hackathon 2024 (Team of 4); ACM Student Leadership Award',
};

export const SAMPLE_QUESTIONS_DATA = {
  jobRole: 'Frontend Developer Intern',
  domain: 'Web Development & UI/UX',
  experienceLevel: 'College Fresher / Summer Intern',
  companyType: 'Modern Tech Startup',
};

export const SAMPLE_ANSWER_DATA = {
  question: 'Can you tell me about a time you faced a difficult technical challenge in a team project and how you solved it?',
  studentAnswer: 'In my web development class, we had a group project to build an e-commerce website in 4 weeks. Two weeks before the deadline, our API calls were failing and the team started arguing about whether to use MongoDB or SQL. I stayed up late, looked at the network errors, and figured out our CORS headers were misconfigured. I scheduled a call with the backend team, explained what was wrong, and helped rewrite the Express middleware. We ended up finishing on time and got an A in the class.',
  jobRole: 'Software Engineer Intern',
};

export const SAMPLE_GUIDANCE_DATA = {
  degree: 'B.S. in Computer Science & Information Systems',
  yearOfStudy: 'Junior (3rd Year)',
  interests: ['Building intuitive web apps', 'Data visualization', 'Artificial intelligence', 'UI/UX design', 'Solving logical puzzles'],
  skills: ['JavaScript / TypeScript', 'React', 'Python basics', 'SQL', 'Git', 'Problem Solving'],
  favoriteSubjects: ['Data Structures', 'Human-Computer Interaction (HCI)', 'Web Technologies', 'Cognitive Psychology'],
  workPreferences: 'Collaborative, fast-paced team with good mentorship, flexible or hybrid setup',
};

export const SAMPLE_ROADMAP_DATA = {
  targetCareerOrSkill: 'Full Stack Web Development (React & Node.js)',
  currentLevel: 'Beginner with basic HTML/JS knowledge',
  weeklyCommitmentHours: 10,
};

export const SAMPLE_COVER_LETTER_DATA = {
  studentName: 'Alex Chen',
  email: 'alex.chen@university.edu',
  phone: '+1 (555) 349-8821',
  jobRole: 'Software Engineer Intern (Frontend & Full Stack)',
  companyName: 'Starlight Interactive Labs',
  qualifications: 'Junior pursuing B.S. in Computer Science with 3.82 GPA. Coursework in Algorithms, Web Architecture, and Database Systems.',
  relevantProjects: 'Created StudySync, a real-time web application with React and Node.js serving 350+ student users. Built algorithmic portfolio tracker in Python.',
  whyCompany: 'I admire Starlight\'s open-source developer tooling and mission to democratize interactive software for creators. Your engineering blog posts on modern web performance deeply inspired my own campus projects.',
  tone: 'Professional & Confident',
};
