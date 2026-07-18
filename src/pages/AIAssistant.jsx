import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from '../components/SvgIcon';
import './AIAssistant.css';

// Keyword misspelling normalizer map
const MISSPELLED_WORDS = {
  scholership: "scholarship",
  internsip: "internship",
  govt: "government",
  resum: "resume",
  placment: "placement",
  enginner: "engineer",
  jobss: "jobs",
  btechh: "btech",
  interviw: "interview",
  cv: "resume"
};

// Detailed short query clarifications database
const SHORT_QUERY_MAP = {
  eee: "Electrical and Electronics Engineering (EEE) is a great core engineering field. Are you looking for EEE core projects, placements preparation, roadmaps, higher studies (GATE/GRE), or internships?",
  cse: "Computer Science & Engineering (CSE) is a high-demand field. Are you looking for programming roadmaps, CSE project ideas, IT internship links, or mock interviews?",
  ece: "Electronics and Communication Engineering (ECE) covers embedded systems, IoT, and communications. Are you looking for ECE projects, VLSI roadmaps, software/core job guidance, or learning resources?",
  ai: "Artificial Intelligence and Machine Learning (AIML) is shaping the future of tech. Are you looking for AI learning roadmaps, machine learning projects, courses, or industry trends?",
  aiml: "Artificial Intelligence and Machine Learning (AIML) is shaping the future of tech. Are you looking for AI learning roadmaps, machine learning projects, courses, or industry trends?",
  java: "Are you looking to learn Java, need project ideas using Java, want a Java study roadmap, or would you like to start a mock interview on Java?",
  python: "Are you looking to learn Python, need project ideas using Python, want a Python study roadmap, or would you like to start a mock interview on Python?",
  react: "Are you looking to learn React, need project ideas using React, want a React study roadmap, or would you like to start a mock interview on React?",
  resume: "A strong resume is key to getting interviews. Would you like me to share ATS optimization tips, review your current resume format, suggest project details, or open the StudentHub Resume Builder?",
  scholarship: "Scholarships can help support your education. Are you looking for government scholarships, private scholarships, merit-based, or international scholarships?",
  internship: "Internships provide crucial practical experience. Are you looking for private software internships, government internships, resume tips for applications, or interview prep?",
  roadmap: "Roadmaps guide you step-by-step from zero to industry-ready. Are you looking for software developer roadmaps, full-stack roadmaps, or core engineering (like EEE/ECE/Mechanical) roadmaps?",
  gate: "The Graduate Aptitude Test in Engineering (GATE) opens paths to IITs, IISc, MTech, and PSU jobs. Would you like a comprehensive study plan, exam strategy, or list of subjects to cover?",
  gre: "The Graduate Record Examination (GRE) is widely used for MS/PhD admissions abroad. Are you looking for preparation roadmaps, verbal/quant study strategies, or university application advice?",
  upsc: "The Union Public Service Commission (UPSC) CSE exam selects candidates for prestigious civil services like IAS, IPS, and IFS. Are you looking for preparation strategies, study plans, or subject selection guidance?",
  ssc: "Staff Selection Commission (SSC JE) and banking exams are popular routes for stable government and public sector careers. Are you looking for SSC JE study roadmaps, exam patterns, or preparation plans?",
  bank: "Banking exams like Bank PO or Clerk offer stable careers in financial institutions. Are you looking for banking exam preparation strategies, syllabus details, or daily study routines?"
};

// Emotional responses catalog
const EMOTIONAL_RESPONSES = {
  failed: "I'm sorry to hear that. One exam or grade doesn't define your worth or your future. Let's take a deep breath, figure out what went wrong, and make a study plan together to tackle it next time. You are fully capable of bouncing back!",
  stressed: "I hear you. Academic pressure can get really heavy. It is completely okay to feel overwhelmed sometimes. Take a moment to step away, drink some water, and breathe. When you're ready, let's break your tasks down into small, bite-sized goals so they feel manageable. We can tackle them one by one.",
  nervous: "It is completely natural to feel nervous, especially before exams or interviews! That anxiety just shows how much this means to you. Remember: you have prepared for this, and you are capable. Let's practice a bit together or do a quick mock interview to boost your confidence. You've got this!",
  excited: "That is absolutely amazing news! I am so excited for you! 🎉 Your hard work has paid off. Take a moment to celebrate this win—you've earned it. What's the next step you want to plan?"
};

// Teacher mode concepts bank (Simple -> Medium -> Advanced -> Practical Example)
const CONCEPT_BANK = {
  recursion: {
    title: "Recursion",
    simple: "Imagine you are in a line at a movie theater and want to know what row you are in. You ask the person in front of you. They don't know either, so they ask the person in front of them, all the way to the front row. The front person answers 'I am in row 1' and passes it back, adding 1 each time until it reaches you. That is recursion: a process that calls itself until it hits a starting point (the base case).",
    medium: "In programming, recursion is a method where a function calls itself directly or indirectly to solve a smaller instance of the same problem. Every recursive function must have two components: a Base Case (which stops the recursive loop) and a Recursive Case (which makes the self-call with modified parameters). Without a proper base case, the function will run infinitely and trigger a stack overflow.",
    advanced: "Under the hood, each recursive call adds a new activation record (stack frame) to the system Call Stack. This frame stores local variables and the return address. In terms of efficiency, recursion takes O(N) memory due to call stack overhead. In languages that support it, Tail Call Optimization (TCO) can run recursion in O(1) space if the recursive call is the final action of the function.",
    example: "```python\n# Python Example: Calculate factorial of a number\ndef factorial(n):\n    # 1. Base Case\n    if n <= 1:\n        return 1\n    # 2. Recursive Case\n    else:\n        return n * factorial(n - 1)\n\nprint(factorial(5)) # Output: 120\n```"
  },
  polymorphism: {
    title: "Polymorphism",
    simple: "Think of buttons on electronic devices. A 'Play' button does one thing on a music app (plays a song), another on a video player (plays video), and another on a game console (starts the game). The button is the same concept, but the behavior changes based on what device uses it. Polymorphism literally means 'many forms'.",
    medium: "Polymorphism is an OOP principle that allows subclasses to define their own unique behaviors while sharing the same interface or parent class signature. It falls into two categories: Compile-time Polymorphism (Method Overloading) where methods have the same name but different parameters, and Runtime Polymorphism (Method Overriding) where a subclass provides a specific implementation of a method already declared in its parent class.",
    advanced: "In compiled languages like C++, runtime polymorphism is implemented using a virtual table (vtable). Each class containing virtual methods has a vtable listing function pointers to the correct implementations. When a virtual function is called via a parent class reference, the runtime engine looks up the address in the vtable (late binding), adding a small pointer-lookup overhead but offering complete OOP flexibility.",
    example: "```java\n// Java Example: Runtime Polymorphism\nclass Animal {\n    void makeSound() {\n        System.out.println(\"Some generic sound\");\n    }\n}\nclass Dog extends Animal {\n    @Override\n    void makeSound() {\n        System.out.println(\"Woof! Woof!\");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Animal myDog = new Dog(); // Parent reference to child object\n        myDog.makeSound(); // Outputs: Woof! Woof!\n    }\n}\n```"
  },
  encapsulation: {
    title: "Encapsulation",
    simple: "Think of a medicine capsule. The bitter chemical powder is enclosed inside a smooth gelatin shell so you don't taste it or spill it, and you can only take it as a whole capsule. In code, we hide the sensitive inner data inside a class capsule and only allow access through approved controls.",
    medium: "Encapsulation is the practice of wrapping data (variables) and the methods that operate on that data into a single unit (a class). To achieve encapsulation, class variables are marked private, and public getter and setter methods are provided to retrieve or modify them. This allows validation and keeps the inner state safe from direct, unintended modifications.",
    advanced: "Encapsulation enforces data hiding and increases modularity. By hiding internal implementation details, classes become independent components. If you need to change a variable's data type, you only update the internal getter/setter implementation without breaking outer consumer systems. It establishes strict object contracts.",
    example: "```javascript\n// JavaScript Example: Encapsulation using Class Private Fields\nclass BankAccount {\n  #balance = 0; // Private field (starts with #)\n\n  constructor(owner) {\n    this.owner = owner;\n  }\n\n  deposit(amount) {\n    if (amount > 0) this.#balance += amount;\n  }\n\n  getBalance() {\n    return this.#balance; // Controlled access getter\n  }\n}\n\nconst myAccount = new BankAccount(\"Sam\");\nmyAccount.deposit(500);\nconsole.log(myAccount.getBalance()); // Output: 500\n// console.log(myAccount.#balance); // Error: Private field cannot be accessed outside\n```"
  },
  inheritance: {
    title: "Inheritance",
    simple: "Think of family attributes. A child inherits their parents' eye color, height, and last name automatically, but can also pick up new hobbies or learn new languages that the parents do not know. In code, a new class inherits variables and methods from an existing class, and adds its own custom features.",
    medium: "Inheritance is an OOP mechanism where a new class (subclass or child class) inherits properties and methods from an existing class (superclass or parent class) using keywords like `extends`. This promotes code reusability and builds hierarchical relationships between classes.",
    advanced: "Inheritance models the 'IS-A' relationship. It can lead to tight coupling between superclass and subclass, meaning changes in the superclass might break subclasses (the Fragile Base Class problem). Composition ('HAS-A' relationships) is often preferred over deep inheritance hierarchies to maintain modularity and ease refactoring.",
    example: "```cpp\n// C++ Example: Simple Inheritance\n#include <iostream>\nusing namespace std;\n\nclass Vehicle {\npublic:\n    string brand = \"Tesla\";\n    void honk() {\n        cout << \"Beep Beep!\" << endl;\n    }\n};\n\nclass Car : public Vehicle {\npublic:\n    string model = \"Model 3\";\n};\n\nint main() {\n    Car myCar;\n    myCar.honk(); // Inherited method. Outputs: Beep Beep!\n    cout << myCar.brand << \" \" << myCar.model << endl; // Outputs: Tesla Model 3\n    return 0;\n}\n```"
  }
};

// Branch projects database
const BRANCH_PROJECTS = {
  eee: [
    { name: "⚡ Power Electronics Converter Design", desc: "Design, model, and simulate a high-efficiency DC-DC Buck-Boost converter with digital PWM controller parameters." },
    { name: "🔋 IoT-Based Smart Grid Monitoring System", desc: "Build a prototype sensor node using ESP32 to monitor line voltage/current, sending real-time logs to a cloud dashboard for fault alerts." },
    { name: "☀️ Smart Solar Tracking System", desc: "Develop a dual-axis solar panel tracker using LDR light sensors and servo motors to optimize solar capture efficiency." },
    { name: "🏭 PLC-Automated Sorting Conveyor Line", desc: "Program industrial sorting logic using ladder diagram configurations on PLC controllers with proximity sensing." }
  ],
  ece: [
    { name: "🛰️ Embedded IoT Climate Station", desc: "Develop an ESP32 micro-station that reads DHT22/BMP280 sensor values and relays weather telemetry to an MQTT broker database." },
    { name: "📟 VLSI 8-Bit Arithmetic Logic Unit (ALU)", desc: "Design and verify an 8-bit ALU supporting math/logical operations in Verilog HDL, analyzing timing parameters." },
    { name: "🤖 FPGA-Based Obstacle Avoidance Control", desc: "Implement real-time ultrasonic sonar echo calculation algorithms directly on a Cyclone IV FPGA board for mobile robots." },
    { name: "📡 Smart Wearable ECG Monitor", desc: "Build a low-power biomedical sensor glove that filters ECG signals and transmits heart metrics via BLE to a mobile app." }
  ],
  cse: [
    { name: "🛒 Full-Stack MERN E-Commerce Platform", desc: "Create a SaaS store with React frontend, Node/Express API backend, MongoDB catalog database, and JWT security controls." },
    { name: "💬 Socket.io Real-Time Collaborative Chatboard", desc: "Build a socket-powered chat workspace with private channels, active status sync, and text search history storage." },
    { name: "📋 Kanban Task Board (Trello Clone)", desc: "Develop a drag-and-drop workspace app in React with columns, tasks list, tags, and local-storage backup." },
    { name: "🧠 Predictive Grade Evaluator Web App", desc: "Run a Python Flask server hosting a Scikit-Learn forest classifier that predicts student success based on mock exam details." }
  ],
  it: [
    { name: "🛒 Full-Stack MERN E-Commerce Platform", desc: "Create a SaaS store with React frontend, Node/Express API backend, MongoDB catalog database, and JWT security controls." },
    { name: "💬 Socket.io Real-Time Collaborative Chatboard", desc: "Build a socket-powered chat workspace with private channels, active status sync, and text search history storage." },
    { name: "📋 Kanban Task Board (Trello Clone)", desc: "Develop a drag-and-drop workspace app in React with columns, tasks list, tags, and local-storage backup." },
    { name: "🧠 Predictive Grade Evaluator Web App", desc: "Run a Python Flask server hosting a Scikit-Learn forest classifier that predicts student success based on mock exam details." }
  ],
  mechanical: [
    { name: "⚙️ 3D Printer Extruder Hotend Optimization", desc: "Simulate thermal dissipation profiles and feed-gear torque limits for dual-drive direct filament extruders in CAD/FEA." },
    { name: "🏎️ Off-Road Buggy Chassis FEA Simulation", desc: "Model an ATV tubular space-frame in SolidWorks and perform structural impact tests under varying velocity loads." },
    { name: "🦾 Multi-Axis Pneumatic Manipulator Arm", desc: "Assemble and program a 3-DOF robot arm actuated by pneumatic pistons controlled via an Arduino relay shield." }
  ],
  civil: [
    { name: "🏢 Structural Seismic Load FEA Modeler", desc: "Build a multi-story structural model in SAP2000 and run response-spectrum tests to analyze building drift values." },
    { name: "🚦 Adaptive Sensor-Driven Traffic Control System", desc: "Simulate traffic throughput improvements on crossroads using vehicle density detectors and microcontroller timers." },
    { name: "🧱 Eco-Friendly Plastic Concrete Strength Study", desc: "Formulate concrete cubes replacing sand with shredded PET plastics, and analyze compressive limits in crushing rigs." }
  ]
};

// Mock Interview Questions Database
const MOCK_INTERVIEWS = {
  java: [
    {
      q: "What are the four main principles of Object-Oriented Programming (OOP) and how do they help in development?",
      keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction"],
      feedback: "OOP principles are key. Encapsulation hides details, inheritance enables reuse, polymorphism allows dynamic behavior, and abstraction simplifies complexity."
    },
    {
      q: "What is the difference between an Interface and an Abstract Class in Java, and when would you use each?",
      keywords: ["interface", "abstract class", "multiple inheritance", "default methods", "extends", "implements"],
      feedback: "Use abstract classes for closely related classes to share state/behavior; use interfaces to define contracts that unrelated classes can implement."
    },
    {
      q: "Explain what the JVM is, and how Java manages memory and garbage collection.",
      keywords: ["jvm", "garbage collection", "heap", "stack", "memory leak", "automatic"],
      feedback: "JVM executes bytecode. Heap stores objects, stack stores execution frames. Garbage collector automatically reclaims unreferenced heap memory."
    }
  ],
  python: [
    {
      q: "What are list comprehensions in Python, and how do they differ from standard for-loops?",
      keywords: ["syntactic sugar", "readable", "expression", "brackets", "performance"],
      feedback: "List comprehensions offer a shorter syntax to create new lists from iterables. They are generally faster and more readable when kept simple."
    },
    {
      q: "Explain mutable vs immutable objects in Python, giving examples of both.",
      keywords: ["mutable", "immutable", "list", "dict", "tuple", "string", "int", "pointer", "address"],
      feedback: "Mutable objects (lists, dicts) can be modified in-place. Immutable objects (strings, tuples, ints) cannot be changed after creation; modifications create new objects."
    },
    {
      q: "What are decorators in Python, and how do you write a simple decorator function?",
      keywords: ["decorator", "wrapper", "function", "@", "return", "arguments"],
      feedback: "Decorators wrap another function to extend or modify its behavior without permanently altering it, leveraging Python's first-class functions."
    }
  ],
  cpp: [
    {
      q: "What are pointers in C/C++, and what is a memory leak?",
      keywords: ["pointer", "memory address", "asterisk", "malloc", "free", "new", "delete", "leak", "dangling"],
      feedback: "Pointers store memory addresses. Memory leaks occur when heap memory is allocated but never freed, exhausting system memory."
    },
    {
      q: "What is the difference between Stack and Heap memory allocation?",
      keywords: ["stack", "heap", "static", "dynamic", "automatic", "faster", "size limit"],
      feedback: "Stack memory is fast, managed automatically by compiler, and has size limits (for local variables). Heap is dynamic, manual (or GC-managed), larger, but slower."
    },
    {
      q: "What is runtime polymorphism in C++ and how is it achieved using virtual functions?",
      keywords: ["virtual", "polymorphism", "vtable", "override", "base class", "pointer"],
      feedback: "Runtime polymorphism allows a derived class function to be called via a base class pointer using virtual functions, resolved at runtime via a vtable."
    }
  ],
  c: [
    {
      q: "What are pointers in C/C++, and what is a memory leak?",
      keywords: ["pointer", "memory address", "asterisk", "malloc", "free", "leak", "dangling"],
      feedback: "Pointers store memory addresses. Memory leaks occur when heap memory is allocated but never freed, exhausting system memory."
    },
    {
      q: "What is the difference between Stack and Heap memory allocation?",
      keywords: ["stack", "heap", "static", "dynamic", "automatic", "faster", "size limit"],
      feedback: "Stack memory is fast, managed automatically by compiler, and has size limits (for local variables). Heap is dynamic, manual (or GC-managed), larger, but slower."
    },
    {
      q: "What is runtime polymorphism in C++ and how is it achieved using virtual functions?",
      keywords: ["virtual", "polymorphism", "vtable", "override", "base class", "pointer"],
      feedback: "Runtime polymorphism allows a derived class function to be called via a base class pointer using virtual functions, resolved at runtime via a vtable."
    }
  ],
  react: [
    {
      q: "What is the Virtual DOM and how does React use it to optimize page rendering?",
      keywords: ["virtual dom", "reconciliation", "diff", "real dom", "batch", "performance"],
      feedback: "React maintains a lightweight Virtual DOM in memory. On state change, it diffs it with the previous state (reconciliation) and updates only changed elements in the real DOM."
    },
    {
      q: "Explain the difference between React state and props.",
      keywords: ["state", "props", "local", "parent", "read-only", "immutable", "mutable"],
      feedback: "State is local, mutable data managed within the component. Props are read-only configuration inputs passed down from parent components."
    },
    {
      q: "What are hooks in React? Explain useState and useEffect.",
      keywords: ["useState", "useEffect", "hook", "functional component", "side effect", "dependency", "lifecycle"],
      feedback: "Hooks let functional components use state and other features. useState manages state variables; useEffect handles side-effects like data fetching and cleanups."
    }
  ],
  sql: [
    {
      q: "What is database normalization and what are the main forms (1NF, 2NF, 3NF)?",
      keywords: ["normalization", "redundancy", "anomaly", "1nf", "2nf", "3nf", "atomic", "dependency"],
      feedback: "Normalization structures database schemas to minimize redundancy and prevent update anomalies by ensuring atomic columns (1NF), full key dependency (2NF), and no transitive dependency (3NF)."
    },
    {
      q: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
      keywords: ["join", "inner", "left", "right", "matching", "null", "all rows"],
      feedback: "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (or nulls). RIGHT JOIN is the inverse of LEFT JOIN."
    },
    {
      q: "What are indexes in DBMS and how do they speed up search queries? What is the trade-off?",
      keywords: ["index", "b-tree", "search", "lookup", "speed", "write overhead", "storage"],
      feedback: "Indexes are data structures (like B-trees) created on columns to speed up row retrieval. The trade-off is increased storage and slower writes (insert/update/delete) as indexes must be updated."
    }
  ],
  dbms: [
    {
      q: "What is database normalization and what are the main forms (1NF, 2NF, 3NF)?",
      keywords: ["normalization", "redundancy", "anomaly", "1nf", "2nf", "3nf", "atomic", "dependency"],
      feedback: "Normalization structures database schemas to minimize redundancy and prevent update anomalies by ensuring atomic columns (1NF), full key dependency (2NF), and no transitive dependency (3NF)."
    },
    {
      q: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.",
      keywords: ["join", "inner", "left", "right", "matching", "null", "all rows"],
      feedback: "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right (or nulls). RIGHT JOIN is the inverse of LEFT JOIN."
    },
    {
      q: "What are indexes in DBMS and how do they speed up search queries? What is the trade-off?",
      keywords: ["index", "b-tree", "search", "lookup", "speed", "write overhead", "storage"],
      feedback: "Indexes are data structures (like B-trees) created on columns to speed up row retrieval. The trade-off is increased storage and slower writes (insert/update/delete) as indexes must be updated."
    }
  ],
  dsa: [
    {
      q: "What is the difference between a Stack and a Queue, and what are their core operations?",
      keywords: ["stack", "queue", "lifo", "fifo", "push", "pop", "enqueue", "dequeue"],
      feedback: "Stack is Last-In-First-Out (LIFO) with push/pop operations. Queue is First-In-First-Out (FIFO) with enqueue/dequeue operations."
    },
    {
      q: "Explain Binary Search and its time complexity compared to Linear Search.",
      keywords: ["binary search", "sorted", "divide", "logarithmic", "o(log n)", "o(n)", "linear"],
      feedback: "Binary Search works by repeatedly dividing a sorted search space in half. Its complexity is O(log n), which is much faster than Linear Search's O(n) for large lists."
    },
    {
      q: "What is Dynamic Programming (DP) and when should it be used?",
      keywords: ["dynamic programming", "overlapping subproblems", "optimal substructure", "memoization", "tabulation"],
      feedback: "DP solves complex problems by breaking them into simpler subproblems. It is used when there are overlapping subproblems and optimal substructure, using memoization (top-down) or tabulation (bottom-up)."
    }
  ],
  os: [
    {
      q: "What is the difference between a Process and a Thread?",
      keywords: ["process", "thread", "independent memory", "shared memory", "lightweight", "overhead", "context switch"],
      feedback: "A process is an executing program with its own memory space. A thread is a lightweight execution unit within a process, sharing the process's memory space and resources."
    },
    {
      q: "What is virtual memory and paging in operating systems?",
      keywords: ["virtual memory", "paging", "physical", "logical", "page fault", "page table", "swap"],
      feedback: "Virtual memory maps logical addresses to physical memory using paging. If a requested page is not in RAM, a page fault occurs, prompting the OS to swap it in from disk."
    },
    {
      q: "What is deadlock and what are the four Coffman conditions required for it to occur?",
      keywords: ["deadlock", "mutual exclusion", "hold and wait", "no preemption", "circular wait"],
      feedback: "Deadlock is a state where processes are blocked waiting for resources held by each other. The four conditions are mutual exclusion, hold & wait, no preemption, and circular wait."
    }
  ]
};

export default function AIAssistant() {
  const navigate = useNavigate();

  // Loaded database arrays from JSON files
  const [db, setDb] = useState({
    scholarships: [],
    govScholarships: [],
    privScholarships: [],
    internships: [],
    govInternships: [],
    privInternships: [],
    courses: [],
    roadmaps: []
  });

  // Conversation memory and interview states
  const [userContext, setUserContext] = useState({
    branch: '',
    year: '',
    target: '',
    lastSubject: '',
    lastQueryType: ''
  });

  const [interview, setInterview] = useState({
    active: false,
    topic: '',
    questionIndex: 0,
    questions: [],
    score: 0,
    feedbacks: []
  });

  // API settings states
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('studenthub_gemini_api_key') || '');
  const [tempKey, setTempKey] = useState(apiKey);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "I'm your intelligent career companion. I can guide you through scholarships, internships, careers, placements, resumes, government jobs, free courses, and career roadmaps.",
      chips: [
        "🎓 Find Scholarships",
        "💼 Find Internships",
        "🧭 Career Roadmap",
        "📄 Resume Review",
        "🏛 Government Jobs",
        "🌍 Study Abroad",
        "🎯 Interview Prep",
        "⚡ Skill Development",
        "📚 Free Courses",
        "💡 Career Guidance"
      ],
      isWelcome: true
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Prevent parent overflow scrolling during focus & overrides on mount
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.add('assistant-page-active');
    }
    
    return () => {
      if (mainContent) {
        mainContent.classList.remove('assistant-page-active');
      }
    };
  }, []);

  // Fetch local mock databases on mount
  useEffect(() => {
    const fetchMockDatabases = async () => {
      try {
        const [
          scholarships,
          govScholarships,
          privScholarships,
          internships,
          govInternships,
          privInternships,
          courses,
          roadmaps
        ] = await Promise.all([
          fetch('./data/scholarships.json').then(r => r.json()).catch(() => []),
          fetch('./data/government-scholarships.json').then(r => r.json()).catch(() => []),
          fetch('./data/private-scholarships.json').then(r => r.json()).catch(() => []),
          fetch('./data/internships.json').then(r => r.json()).catch(() => []),
          fetch('./data/government-internships.json').then(r => r.json()).catch(() => []),
          fetch('./data/private-internships.json').then(r => r.json()).catch(() => []),
          fetch('./data/courses.json').then(r => r.json()).catch(() => []),
          fetch('./data/roadmaps.json').then(r => r.json()).catch(() => [])
        ]);

        setDb({
          scholarships,
          govScholarships,
          privScholarships,
          internships,
          govInternships,
          privInternships,
          courses,
          roadmaps
        });
      } catch (err) {
        console.error("Failed to load StudentHub mock datasets in AI Mentor:", err);
      }
    };
    fetchMockDatabases();
  }, []);

  // Smarter scroll to bottom logic
  const scrollToBottom = (force = false) => {
    const container = chatMessagesRef.current;
    if (!container) return;

    const threshold = 150; // pixels from the bottom limit
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;

    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const isFirstLoad = messages.length === 1 && messages[0].id === 'welcome';
    scrollToBottom(isFirstLoad);
  }, [messages, isTyping]);

  // Clean up student misspellings and abbreviations
  const normalizeQuery = (text) => {
    let q = text.toLowerCase().trim();
    
    // Replace misspelled words using mapping
    Object.keys(MISSPELLED_WORDS).forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      q = q.replace(regex, MISSPELLED_WORDS[word]);
    });
    
    return q;
  };

  // Determine helper follow-up questions
  const getFollowUpQuestion = (queryType, currentBranch) => {
    const branchText = currentBranch ? ` for ${currentBranch.toUpperCase()}` : "";
    if (queryType === 'scholarship') {
      return "Would you like me to filter these scholarships by eligibility criteria or help you prepare your application documents?";
    } else if (queryType === 'internship') {
      return "Would you like me to review your resume or guide you on how to write a professional cold email to recruiters?";
    } else if (queryType === 'course') {
      return "Would you like me to draft a step-by-step weekly study schedule to help you complete this course?";
    } else if (queryType === 'roadmap') {
      return `Should we construct a detailed exam preparation strategy or start a mock interview${branchText} to test your knowledge?`;
    } else if (queryType === 'resume') {
      return "Would you like me to check your projects description format or direct you to open our Resume Builder page?";
    } else if (queryType === 'interview') {
      return "Would you like to try another mock interview on a different coding language or study concept?";
    }
    return "Can I help you with a study plan, resume reviews, or finding internship opportunities today?";
  };

  // call Google Gemini API Live Agent
  const callGeminiAPI = async (userText) => {
    const contents = messages
      .filter(msg => msg.id !== 'welcome')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    contents.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    const systemPrompt = `
You are StudentHub AI, an intelligent AI Career Mentor designed to help students worldwide.
MISSION: Help every student succeed in education and career. You are a career mentor, teacher, advisor, friend, guide, and assistant. Always welcome and support.
PERSONALITY: Friendly, Professional, Intelligent, Patient, Respectful, Motivational, Honest, Helpful, Calm, Conversational. Speak naturally. Avoid robotic/one-word replies. Occasional emojis.
CONVERSATION STYLE: Ask polite follow-ups if message is unclear. Never make assumptions.
SMALL TALK: Respond like a supportive human.
EMOTIONAL SUPPORT: Recognize emotions (e.g. "I failed" -> don't talk about jobs immediately, say: "I'm sorry to hear that. One exam doesn't define your future. Let's see what happened...").
UNDERSTAND TYPOS & SHORT QUESTIONS.
BE A TEACHER: Start Simple, then Medium, then Advanced, then Examples.
HELP WITH: Programming, Engineering, Career, Scholarships, Internships, Jobs, Resume review, mock interviews, roadmaps, study plans.
HONESTY: If you don't know something, say "I'm not sure." Never make up facts.
SAFETY: No cheating, hate, violence, plagiarism, illegal acts.
FORMAT: Use Headings, Bullet points, Tables, Examples, Step-by-step guides when appropriate.
END EVERY CONVERSATION: Ask one helpful follow-up question.
    `;

    const cachedModel = localStorage.getItem('studenthub_resolved_gemini_model');
    const baseCandidates = [
      'gemini-1.5-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-3.5-flash'
    ];
    const modelCandidates = cachedModel 
      ? [cachedModel, ...baseCandidates.filter(m => m !== cachedModel)]
      : baseCandidates;

    let lastError = null;
    let data = null;
    let textReply = null;

    for (const model of modelCandidates) {
      try {
        console.log(`Attempting chat generation using model: ${model}`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          })
        });

        if (response.status === 404) {
          throw new Error(`Model ${model} not found (HTTP 404)`);
        }

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody.error?.message || `HTTP status ${response.status}`;
          throw new Error(errMsg);
        }

        data = await response.json();
        textReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textReply) {
          throw new Error("Empty response returned from Google API server.");
        }

        // Successfully resolved model! Cache it so subsequent calls are fast
        localStorage.setItem('studenthub_resolved_gemini_model', model);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed:`, err.message || err);
        
        const errStr = (err.message || '').toLowerCase();
        if (errStr.includes("404") || errStr.includes("not found") || errStr.includes("modelservice") || errStr.includes("not supported")) {
          continue;
        }
        
        throw err;
      }
    }

    if (!textReply) {
      throw lastError || new Error("Failed to connect to any compatible Gemini model.");
    }

    let chips = ["🧭 Career Roadmap", "💼 Find Internships", "🎓 Find Scholarships"];
    const textLower = textReply.toLowerCase();
    
    if (textLower.includes("mock interview") || textLower.includes("interview question")) {
      chips = ["🎯 Java Interview", "🎯 Python Interview", "🎯 DSA Interview", "End Interview"];
    } else if (textLower.includes("project")) {
      chips = ["💻 CSE Projects", "⚡ EEE Projects", "📄 Resume Review"];
    } else if (textLower.includes("resume") || textLower.includes("cv")) {
      chips = ["📝 Open Resume Builder", "📄 Resume Review", "💼 Find Internships"];
    }

    return {
      text: textReply,
      chips: chips
    };
  };

  // Process and parse simulated responses
  const processAIResponse = (rawText) => {
    const qClean = normalizeQuery(rawText);
    let reply = { text: '', chips: ["🧭 Career Roadmap", "💼 Find Internships", "🎓 Find Scholarships"] };

    // --- 1. MOCK INTERVIEW MODE ACTIVE ---
    if (interview.active) {
      const idx = interview.questionIndex;
      const currentQ = interview.questions[idx];
      
      const matched = currentQ.keywords.filter(keyword => qClean.includes(keyword));
      const qScore = Math.min(10, Math.max(2, Math.round(2 + (matched.length / currentQ.keywords.length) * 8)));
      
      let questionFeedback = `**Evaluation for Question ${idx + 1}:** \n*Score:* ${qScore}/10 \n`;
      if (matched.length > 0) {
        questionFeedback += `Good mention of key concepts: ${matched.join(', ')}. `;
      } else {
        questionFeedback += `Missed core technical terms. `;
      }
      questionFeedback += `${currentQ.feedback}\n`;

      const nextIndex = idx + 1;
      const nextScore = interview.score + qScore;
      const nextFeedbacks = [...interview.feedbacks, questionFeedback];

      if (nextIndex < interview.questions.length) {
        setInterview(prev => ({
          ...prev,
          questionIndex: nextIndex,
          score: nextScore,
          feedbacks: nextFeedbacks
        }));
        
        reply.text = `### Feedback on your answer:\n${questionFeedback}\n***\nLet's move to the next question.\n\n**Question ${nextIndex + 1}:** ${interview.questions[nextIndex].q}`;
        reply.chips = ["Skip Question", "End Interview"];
        reply.type = 'interview';
      } else {
        const finalScore = nextScore;
        const totalMax = interview.questions.length * 10;
        let summary = `### Mock Interview Concluded! 🎉\n\nHere is your performance scorecard for **${interview.topic.toUpperCase()}**:\n\n* **Final Score:** ${finalScore} / ${totalMax}\n\n`;
        summary += `#### Question-by-Question Feedback:\n`;
        nextFeedbacks.forEach((fb, i) => {
          summary += `**Q${i+1}:** ${fb}\n`;
        });
        
        if (finalScore >= 24) {
          summary += `\n**Overall Verdict:** Exceptional performance! You display solid theoretical clarity on key engineering concepts. Keep up the high standards!`;
        } else if (finalScore >= 15) {
          summary += `\n**Overall Verdict:** Decent attempt! You have a good base but need to articulate concepts using more technical terminology. Focus on explaining core parameters.`;
        } else {
          summary += `\n**Overall Verdict:** Needs improvement. I recommend revising basic concepts and structures. A study plan or roadmap can guide your revisions.`;
        }

        setInterview({
          active: false,
          topic: '',
          questionIndex: 0,
          questions: [],
          score: 0,
          feedbacks: []
        });

        reply.text = summary + `\n\n` + getFollowUpQuestion('interview', userContext.branch);
        reply.chips = ["🧭 Career Roadmap", "📚 Free Courses", "🎯 Interview Prep"];
        reply.type = 'interview';
      }
      return reply;
    }

    // --- INTERVIEW CONTROL KEYWORDS ---
    if (qClean === 'skip question' && interview.active) {
      const idx = interview.questionIndex;
      const nextIndex = idx + 1;
      const nextFeedbacks = [...interview.feedbacks, `**Evaluation for Question ${idx + 1}:** \n*Score:* 0/10 (Skipped). \nCorrect point: ${interview.questions[idx].feedback}`];

      if (nextIndex < interview.questions.length) {
        setInterview(prev => ({
          ...prev,
          questionIndex: nextIndex,
          feedbacks: nextFeedbacks
        }));
        reply.text = `Question skipped.\n***\n**Question ${nextIndex + 1}:** ${interview.questions[nextIndex].q}`;
        reply.chips = ["Skip Question", "End Interview"];
      } else {
        setInterview({ active: false, topic: '', questionIndex: 0, questions: [], score: 0, feedbacks: [] });
        reply.text = `Interview ended early.\n\n` + getFollowUpQuestion('interview', userContext.branch);
      }
      return reply;
    }

    if (qClean === 'end interview' && interview.active) {
      setInterview({ active: false, topic: '', questionIndex: 0, questions: [], score: 0, feedbacks: [] });
      reply.text = `Understood. I have stopped the mock interview. Let's return to regular career guidance. \n\nWhat would you like to explore next?`;
      return reply;
    }

    // --- 2. BRANCH CONTEXT CAPTURE ---
    let detectedBranch = '';
    if (qClean.includes('eee') || qClean.includes('electrical')) detectedBranch = 'eee';
    else if (qClean.includes('cse') || qClean.includes('computer science') || qClean.includes('it') || qClean.includes('information tech')) detectedBranch = 'cse';
    else if (qClean.includes('ece') || qClean.includes('electronics') || qClean.includes('telecommunication')) detectedBranch = 'ece';
    else if (qClean.includes('mechanical') || qClean.includes('mech')) detectedBranch = 'mechanical';
    else if (qClean.includes('civil')) detectedBranch = 'civil';
    else if (qClean.includes('ai') || qClean.includes('ml') || qClean.includes('machine learning') || qClean.includes('data science') || qClean.includes('aiml')) detectedBranch = 'aiml';

    if (detectedBranch) {
      setUserContext(prev => ({ ...prev, branch: detectedBranch }));
    }
    const activeBranch = detectedBranch || userContext.branch;

    // --- 3. EMOTIONAL SUPPORT HANDLER ---
    if (qClean.includes('failed') || qClean.includes('fail') || qClean.includes('flunk')) {
      reply.text = EMOTIONAL_RESPONSES.failed + "\n\n" + getFollowUpQuestion('general', activeBranch);
      return reply;
    }
    if (qClean.includes('stressed') || qClean.includes('stress') || qClean.includes('overwhelmed')) {
      reply.text = EMOTIONAL_RESPONSES.stressed + "\n\n" + getFollowUpQuestion('general', activeBranch);
      return reply;
    }
    if (qClean.includes('nervous') || qClean.includes('anxious') || qClean.includes('worried') || qClean.includes('scared')) {
      reply.text = EMOTIONAL_RESPONSES.nervous + "\n\n" + getFollowUpQuestion('general', activeBranch);
      return reply;
    }
    if (qClean.includes('excited') || qClean.includes('passed') || qClean.includes('placed') || qClean.includes('got a job') || qClean.includes('got internship')) {
      reply.text = EMOTIONAL_RESPONSES.excited + "\n\n" + getFollowUpQuestion('general', activeBranch);
      return reply;
    }

    // --- 4. SHORT QUESTIONS & ABBREVIATION CLARIFICATION ---
    if (SHORT_QUERY_MAP[qClean]) {
      reply.text = SHORT_QUERY_MAP[qClean];
      if (qClean === 'eee' || qClean === 'cse' || qClean === 'ece' || qClean === 'ai' || qClean === 'aiml') {
        reply.chips = ["🧭 Career Roadmap", "💼 Find Internships", "⚡ Skill Development"];
      } else if (qClean === 'gate' || qClean === 'gre' || qClean === 'upsc' || qClean === 'ssc' || qClean === 'bank') {
        reply.chips = ["📅 Suggest Study Plan", "🧭 Career Roadmap", "📚 Free Courses"];
      } else if (qClean === 'java' || qClean === 'python' || qClean === 'react') {
        reply.chips = [`🎯 Interview Prep`, `🧭 Career Roadmap`, "📚 Free Courses"];
      } else {
        reply.chips = ["🧭 Career Roadmap", "📄 Resume Review", "💼 Find Internships"];
      }
      return reply;
    }

    // --- 5. MOCK INTERVIEW START HANDLER ---
    if (qClean.includes('interview') || qClean.includes('test me') || qClean.includes('quiz me') || qClean.includes('prep')) {
      let topic = '';
      if (qClean.includes('java')) topic = 'java';
      else if (qClean.includes('python')) topic = 'python';
      else if (qClean.includes('react')) topic = 'react';
      else if (qClean.includes('sql') || qClean.includes('dbms')) topic = 'sql';
      else if (qClean.includes('dsa') || qClean.includes('structures') || qClean.includes('algorithm')) topic = 'dsa';
      else if (qClean.includes('os') || qClean.includes('operating system')) topic = 'os';
      else if (qClean.includes('c++') || qClean.includes('cpp') || qClean.includes('c ')) topic = 'cpp';

      if (topic && MOCK_INTERVIEWS[topic]) {
        setInterview({
          active: true,
          topic: topic,
          questionIndex: 0,
          questions: MOCK_INTERVIEWS[topic],
          score: 0,
          feedbacks: []
        });

        reply.text = `### Mock Interview Started! 🎯\n\nLet's test your skills on **${topic.toUpperCase()}**! I will ask you 3 questions one by one. Try to write down your answer explaining the concept. I will analyze your response and provide a scorecard at the end.\n\n**Question 1:** ${MOCK_INTERVIEWS[topic][0].q}`;
        reply.chips = ["Skip Question", "End Interview"];
        reply.type = 'interview';
        return reply;
      } else {
        reply.text = `I can conduct a structured, step-by-step Mock Interview for you! \n\nWhich topic would you like to practice? I currently support: \n* **Java**\n* **Python**\n* **C++**\n* **React**\n* **SQL & DBMS**\n* **Data Structures & Algorithms (DSA)**\n* **Operating Systems (OS)**\n\nTell me which topic to choose and we can begin immediately.`;
        reply.chips = ["🎯 Java Interview", "🎯 Python Interview", "🎯 SQL Interview", "🎯 DSA Interview"];
        return reply;
      }
    }

    // --- 6. CONCEPT TUTORING (TEACHER MODE) ---
    if (qClean.includes('explain') || qClean.includes('what is') || qClean.includes('how does')) {
      let conceptKey = '';
      if (qClean.includes('recursion')) conceptKey = 'recursion';
      else if (qClean.includes('polymorphism')) conceptKey = 'polymorphism';
      else if (qClean.includes('encapsulation')) conceptKey = 'encapsulation';
      else if (qClean.includes('inheritance')) conceptKey = 'inheritance';

      if (conceptKey && CONCEPT_BANK[conceptKey]) {
        const item = CONCEPT_BANK[conceptKey];
        reply.text = `## Concept Guide: ${item.title}\n\n` +
          `### 🟢 1. Simple Explanation (Analogy)\n${item.simple}\n\n` +
          `### 🟡 2. Medium Explanation (Technical)\n${item.medium}\n\n` +
          `### 🔴 3. Advanced Explanation (Under the hood)\n${item.advanced}\n\n` +
          `### 💻 Practical Example:\n${item.example}\n\n` +
          getFollowUpQuestion('course', activeBranch);
        reply.chips = ["📚 Free Courses", "🧭 Career Roadmap", "🎯 Interview Prep"];
        return reply;
      } else {
        const matchedWord = qClean.replace(/explain|what is|how does|\?|\./g, '').trim();
        const upperWord = matchedWord.charAt(0).toUpperCase() + matchedWord.slice(1);
        
        reply.text = `## Concept Guide: ${upperWord}\n\n` +
          `### 🟢 1. Simple Explanation\n${upperWord} is a core building block in technical design, helping solve resource or coordination problems using modular structures.\n\n` +
          `### 🟡 2. Medium Explanation\nIn system structures, ${upperWord} acts as an abstraction layer. It establishes a set of properties and commands to structure inputs, execute logic, and output values securely.\n\n` +
          `### 🔴 3. Advanced Explanation\nUnder the hood, optimizing ${upperWord} involves minimizing time complexity (CPU execution cycles) and space usage (memory/stack sizes). It handles resource contention and limits side effects.\n\n` +
          `### 💻 Practical Example\nIn practice, it is implemented in code files or configuration layouts to structure data flows. Always verify limits and write test suites to cover edge cases.\n\n` +
          getFollowUpQuestion('course', activeBranch);
        reply.chips = ["📚 Free Courses", "🧭 Career Roadmap", "🎯 Interview Prep"];
        return reply;
      }
    }

    // --- 7. STUDY PLANS ---
    if (qClean.includes('study plan') || qClean.includes('schedule') || qClean.includes('blueprint') || qClean.includes('revision strategy')) {
      let duration = 'weekly';
      if (qClean.includes('daily')) duration = 'daily';
      else if (qClean.includes('monthly')) duration = 'monthly';

      let planTopic = activeBranch ? activeBranch.toUpperCase() : "General Engineering & Coding";
      if (qClean.includes('gate')) planTopic = "GATE Exam Preparation";
      else if (qClean.includes('gre')) planTopic = "GRE Examination";
      else if (qClean.includes('react')) planTopic = "React & Frontend Development";
      else if (qClean.includes('python')) planTopic = "Python & Data Science";

      reply.text = `### Customized ${duration.charAt(0).toUpperCase() + duration.slice(1)} Study Plan: **${planTopic}**\n\n` +
        `Here is a structured strategy designed to maximize learning efficiency without leading to burnout:\n\n` +
        `#### 📅 Study Schedule Breakdown:\n` +
        `* **Daily Focus (2-3 Hours):** Dedicate 60 mins to Core Theory, 90 mins to Hands-on Coding/Simulation Projects, and 30 mins to Active Recall Review.\n` +
        `* **Weekly Milestones:** \n` +
        `  * *Mon-Tue:* Fundamentals, Core Theory, and Notebook Reference Readings.\n` +
        `  * *Wed-Thu:* Mid-level Practice Problems, Sandbox Coding, and Debugging setups.\n` +
        `  * *Fri:* Complex Projects building and API connections.\n` +
        `  * *Sat:* Full-length Mock Tests or Exam Practice sets.\n` +
        `  * *Sun:* Spaced Repetition Revision (Review past notes at 1-day, 7-day, and 30-day gaps) and Rest.\n\n` +
        `#### 🎯 Revision & Exam Strategy:\n` +
        `1. **Active Recall:** Close your books and write down everything you remember about a topic before reviewing resources.\n` +
        `2. **Weak-Point Logging:** Maintain an 'error diary' to document questions you miss in practice tests and repeat them 3 days later.\n\n` +
        getFollowUpQuestion('course', activeBranch);
      
      reply.chips = ["📚 Free Courses", "🧭 Career Roadmap", "🎯 Interview Prep"];
      return reply;
    }

    // --- 8. PROJECT SUGGESTIONS (MEMORY INVOLVED) ---
    if (qClean.includes('project') || qClean.includes('suggest projects')) {
      if (activeBranch && BRANCH_PROJECTS[activeBranch]) {
        const list = BRANCH_PROJECTS[activeBranch];
        let pText = `### Suggested Projects for **${activeBranch.toUpperCase()}**:\n\n`;
        pText += `Since you are in the **${activeBranch.toUpperCase()}** field, here are some industry-level projects to add to your resume:\n\n`;
        list.forEach(p => {
          pText += `* **${p.name}**\n  *Description:* ${p.desc}\n`;
        });
        pText += `\n` + getFollowUpQuestion('resume', activeBranch);
        reply.text = pText;
        reply.chips = ["📄 Resume Review", "💼 Find Internships", "🧭 Career Roadmap"];
      } else {
        reply.text = `I can suggest customized projects, but I want to make sure they match your background! \n\nWhich engineering branch are you in? (e.g. CSE, EEE, ECE, Mechanical, Civil)`;
        reply.chips = ["💻 CSE Projects", "⚡ EEE Projects", "📟 ECE Projects", "⚙️ Mechanical Projects"];
      }
      return reply;
    }

    // --- 9. RESUME REVIEW INFO ---
    if (qClean.includes('resume') || qClean.includes('cv') || qClean.includes('ats')) {
      reply.text = `### Professional Resume review Guidelines 📄\n\n` +
        `An ATS-friendly (Applicant Tracking System) resume is crucial for passing initial recruitment parses. Here are the core formatting standards:\n\n` +
        `* **Strict Page Limit:** Keep it strictly to a single page (the StudentHub template prints exactly on A4 layout).\n` +
        `* **Formatting Cleanliness:** Avoid grids, icons, progress bars, logos, or side-by-side columns which break parsing engines.\n` +
        `* **Google X-Y-Z Formula:** Write project details as: *\"Accomplished [X], as measured by [Y], by doing [Z].\"* (e.g., \"Enhanced API load speeds by 40% [X] as measured by Postman logs [Y], by implementing Redis caching queries [Z]\").\n` +
        `* **Tag Cloud:** Group your technical skills (languages, databases, tools) in a single horizontal block at the top for quick parsing.\n\n` +
        getFollowUpQuestion('resume', activeBranch);
      
      reply.chips = ["📝 Open Resume Builder", "💼 Find Internships", "🧭 Career Roadmap"];
      reply.type = 'resume';
      return reply;
    }

    // --- 10. GREETINGS & SMALL TALK ---
    const greetings = ["hi", "hello", "hey", "hii", "hlo", "good morning", "good afternoon", "good evening", "namaste", "yo", "what's up", "how are you", "how's it going"];
    if (greetings.some(g => qClean === g || qClean.startsWith(g + ' '))) {
      const responses = [
        "Hello! It is wonderful to meet you. I am StudentHub AI, your career mentor and friend. How is your academic week going?",
        "Hi there! Welcome back to StudentHub AI. I'm ready to help you plan your next study step, review a resume, or prepare for placements. What's on your mind?",
        "Hey! Great to connect with you today. Let's work together to make your study and career milestones a reality. How can I help you succeed?"
      ];
      reply.text = responses[Math.floor(Math.random() * responses.length)] + "\n\n" + getFollowUpQuestion('general', activeBranch);
      reply.chips = ["🧭 Career Roadmap", "💼 Find Internships", "🎓 Find Scholarships"];
      return reply;
    }

    const smalltalk = ["thank you", "thanks", "awesome", "great", "cool", "nice", "okay", "fine", "good", "bad", "i'm tired", "i'm happy", "i failed", "good luck", "bye", "see you", "take care"];
    if (smalltalk.some(st => qClean.includes(st))) {
      if (qClean.includes('thank') || qClean.includes('thanks')) {
        reply.text = "You are so welcome! Supporting you on this journey is my absolute pleasure. Let me know if you need anything else. Have a productive day!";
      } else if (qClean.includes('bye') || qClean.includes('see you') || qClean.includes('take care')) {
        reply.text = "Goodbye! Take care and keep pushing toward your dreams. Remember, consistency is key. See you soon!";
      } else {
        reply.text = "I understand completely! Let's keep moving forward step-by-step. Let me know what academic path we should map out next.";
      }
      reply.text += "\n\n" + getFollowUpQuestion('general', activeBranch);
      return reply;
    }

    // --- 11. DYNAMIC DATABASE SEARCH ---

    // A. Scholarships search
    if (qClean.includes('scholarship')) {
      let list = [];
      let label = "Scholarships";

      if (qClean.includes('government') || qClean.includes('govt')) {
        list = db.govScholarships.length > 0 ? db.govScholarships : db.scholarships;
        label = "Government Scholarships";
      } else if (qClean.includes('private')) {
        list = db.privScholarships.length > 0 ? db.privScholarships : db.scholarships;
        label = "Private Scholarships";
      } else {
        list = db.scholarships.length > 0 ? db.scholarships : [];
      }

      if (list.length > 0) {
        let filtered = list.filter(item => {
          const name = (item.name || item.scholarshipName || '').toLowerCase();
          const org = (item.organization || item.provider || '').toLowerCase();
          const elig = (item.eligibility || '').toLowerCase();
          return name.includes(qClean) || org.includes(qClean) || elig.includes(qClean) || name.includes(activeBranch) || elig.includes(activeBranch);
        });

        if (filtered.length === 0) filtered = list.slice(0, 3);

        const renderedItems = filtered.map(item => ({
          name: item.name || item.scholarshipName || "Scholarship Program",
          eligibility: item.eligibility || "Open to eligible undergraduate students.",
          benefits: item.amount || item.benefits || "Financial support details.",
          applyLink: item.officialApplyLink || item.applyLink || "https://buildyourfuture.withgoogle.com/scholarships"
        }));

        reply.text = `Here are some verified **${label}** matching your parameters in our database:\n\n` + getFollowUpQuestion('scholarship', activeBranch);
        reply.items = renderedItems;
        reply.type = 'scholarships';
        reply.chips = ["💼 Find Internships", "📚 Free Courses", "🧭 Career Roadmap"];
        return reply;
      }
    }

    // B. Internships search
    if (qClean.includes('internship') || qClean.includes('job') || qClean.includes('vacancy')) {
      let list = [];
      let label = "Internship Openings";

      if (qClean.includes('government') || qClean.includes('govt')) {
        list = db.govInternships.length > 0 ? db.govInternships : db.internships;
        label = "Government Training Internships";
      } else if (qClean.includes('private')) {
        list = db.privInternships.length > 0 ? db.privInternships : db.internships;
        label = "Private Sector Internships";
      } else {
        list = db.internships.length > 0 ? db.internships : [];
      }

      if (list.length > 0) {
        let filtered = list.filter(item => {
          const role = (item.role || '').toLowerCase();
          const comp = (item.companyName || item.company || '').toLowerCase();
          const loc = (item.location || '').toLowerCase();
          const skillsStr = (item.skills || []).join(' ').toLowerCase();
          return role.includes(qClean) || comp.includes(qClean) || loc.includes(qClean) || skillsStr.includes(qClean) || role.includes(activeBranch) || skillsStr.includes(activeBranch);
        });

        if (filtered.length === 0) filtered = list.slice(0, 3);

        const renderedItems = filtered.map(item => ({
          role: item.role || "Software Intern",
          duration: item.duration || "12 Weeks",
          company: item.companyName || item.company || "Leading Tech Firm",
          location: item.location || "Hybrid/Remote",
          eligibility: `Skills required: ${(item.skills || []).join(', ') || 'Coding foundations'}`,
          applyLink: item.officialApplyLink || item.applyLink || "https://careers.google.com"
        }));

        reply.text = `Here are some active **${label}** available in our database:\n\n` + getFollowUpQuestion('internship', activeBranch);
        reply.items = renderedItems;
        reply.type = 'internships';
        reply.chips = ["🎓 Find Scholarships", "📄 Resume Review", "🧭 Career Roadmap"];
        return reply;
      }
    }

    // C. Courses search
    if (qClean.includes('course') || qClean.includes('learn') || qClean.includes('class') || qClean.includes('study')) {
      if (db.courses.length > 0) {
        let filtered = db.courses.filter(item => {
          const name = (item.courseName || '').toLowerCase();
          const plat = (item.platform || '').toLowerCase();
          const desc = (item.description || '').toLowerCase();
          const cat = (item.category || '').toLowerCase();
          return name.includes(qClean) || plat.includes(qClean) || desc.includes(qClean) || cat.includes(qClean) || name.includes(activeBranch);
        });

        if (filtered.length === 0) filtered = db.courses.slice(0, 3);

        const renderedItems = filtered.slice(0, 4).map(item => ({
          name: item.courseName || "Certified Programming Course",
          platform: item.platform || "Online Academy",
          duration: item.duration || "8 Weeks",
          certificate: item.certificate || "Free Certificate",
          startLink: item.officialCoursePage || "https://pll.harvard.edu"
        }));

        reply.text = `Improve your technical credentials with these premium free certified courses:\n\n` + getFollowUpQuestion('course', activeBranch);
        reply.items = renderedItems;
        reply.type = 'courses';
        reply.chips = ["💼 Find Internships", "🧭 Career Roadmap", "🎯 Interview Prep"];
        return reply;
      }
    }

    // D. Roadmaps search
    if (qClean.includes('roadmap') || qClean.includes('career path') || qClean.includes('how to become')) {
      if (db.roadmaps.length > 0) {
        let filtered = db.roadmaps.filter(item => {
          const name = (item.careerName || '').toLowerCase();
          const desc = (item.description || '').toLowerCase();
          const skillsStr = (item.skills || []).join(' ').toLowerCase();
          return name.includes(qClean) || desc.includes(qClean) || skillsStr.includes(qClean) || name.includes(activeBranch);
        });

        if (filtered.length === 0) filtered = db.roadmaps.slice(0, 3);

        reply.text = `Here are the matching **Career Roadmaps** available in StudentHub to help you progress step-by-step:\n\n` + getFollowUpQuestion('roadmap', activeBranch);
        reply.items = filtered;
        reply.type = 'roadmaps';
        reply.chips = ["📚 Free Courses", "🎯 Interview Prep", "💼 Find Internships"];
        return reply;
      }
    }

    // --- 12. FALLBACK/HONEST GENERAL COMPANION ---
    reply.text = `I want to make sure I give you the most accurate help. If you are preparing for career placements, could you tell me more about your engineering branch, semester, or what coding language you are focusing on? \n\nAlternatively, let me know if you would like me to conduct a mock interview or generate a study plan. I am always here to guide you. \n\n` + getFollowUpQuestion('general', activeBranch);
    reply.chips = ["🧭 Career Roadmap", "💼 Find Internships", "🎯 Interview Prep"];
    return reply;
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    if (!textToSend) setInputVal('');

    // Append User Message
    const userMsgId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsTyping(true);

    if (apiKey) {
      // Call Live Google Gemini API Agent
      callGeminiAPI(text)
        .then(aiReply => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ...aiReply
            }
          ]);
        })
        .catch(err => {
          console.error("Gemini API direct call failed:", err);
          setIsTyping(false);
          // Graceful fallback to offline local database matching
          const localFallback = processAIResponse(text);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ...localFallback,
              text: `⚠️ *[Live Agent Error: ${err.message || 'API connection timeout'}. Offline fallback active]*\n\n` + localFallback.text
            }
          ]);
        });
    } else {
      // Call Simulated local logic engine
      setTimeout(() => {
        setIsTyping(false);
        const aiReply = processAIResponse(text);
        
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...aiReply
          }
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chipText) => {
    if (chipText.includes("Open Resume Builder") || chipText.includes("Resume Builder")) {
      navigate('/resume');
      return;
    }
    
    let cleanText = chipText.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
    
    // Map chip inputs directly to search triggers
    if (cleanText === "Find Scholarships") cleanText = "scholarships";
    else if (cleanText === "Find Internships") cleanText = "internships";
    else if (cleanText === "Career Roadmap") cleanText = "roadmaps";
    else if (cleanText === "Resume Review") cleanText = "resume";
    else if (cleanText === "Government Jobs") cleanText = "government internships";
    else if (cleanText === "Free Courses") cleanText = "courses";
    else if (cleanText === "Interview Prep" || cleanText === "Interview prep") cleanText = "mock interview";
    else if (cleanText === "Skill Development") cleanText = "courses";
    else if (cleanText === "Study Abroad") cleanText = "gre";
    else if (cleanText === "Suggest Study Plan") cleanText = "study plan";
    else if (cleanText === "Java Interview") cleanText = "mock interview java";
    else if (cleanText === "Python Interview") cleanText = "mock interview python";
    else if (cleanText === "SQL Interview") cleanText = "mock interview sql";
    else if (cleanText === "DSA Interview") cleanText = "mock interview dsa";
    else if (cleanText === "CSE Projects") cleanText = "cse projects";
    else if (cleanText === "EEE Projects") cleanText = "eee projects";
    else if (cleanText === "ECE Projects") cleanText = "ece projects";
    else if (cleanText === "Mechanical Projects") cleanText = "mechanical projects";

    handleSend(cleanText);
  };

  const resetChat = () => {
    setInterview({
      active: false,
      topic: '',
      questionIndex: 0,
      questions: [],
      score: 0,
      feedbacks: []
    });
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "I'm your intelligent career companion. I can guide you through scholarships, internships, careers, placements, resumes, government jobs, free courses, and career roadmaps.",
        chips: [
          "🎓 Find Scholarships",
          "💼 Find Internships",
          "🧭 Career Roadmap",
          "📄 Resume Review",
          "🏛 Government Jobs",
          "🌍 Study Abroad",
          "🎯 Interview Prep",
          "⚡ Skill Development",
          "📚 Free Courses",
          "💡 Career Guidance"
        ],
        isWelcome: true
      }
    ]);
  };

  const showWelcomeDashboard = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <>
      <div className="assistant-centered-layout" style={{ height: '100%' }}>
        
        {/* Chat Window Panel */}
        <div className="glass-panel chat-container">
          
          {/* Sticky Chat Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-avatar-emoji">🤖</span>
              <div className="chat-header-info">
                <div className="chat-title-row">
                  <h3 className="conversation-name">StudentHub AI Career Mentor</h3>
                  <div className="chat-status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="pulse-dot" style={{ backgroundColor: apiKey ? '#10b981' : '#64748b', boxShadow: apiKey ? '0 0 6px #10b981' : 'none' }}></span>
                    <span className="chat-status-text" style={{ color: apiKey ? '#10b981' : '#94a3b8' }}>
                      {apiKey ? 'Live Agent' : 'Simulated'}
                    </span>
                  </div>
                </div>
                <p className="chat-subtitle-text">Always Ready</p>
              </div>
            </div>
            <div className="chat-header-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                className="header-action-btn" 
                onClick={() => {
                  setShowSettings(!showSettings);
                  setTempKey(apiKey);
                }}
                style={{
                  border: showSettings ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: showSettings ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)',
                  color: showSettings ? 'var(--primary)' : 'var(--text-secondary)'
                }}
                title="Configure Gemini API Settings"
              >
                ⚙️ Settings
              </button>
              <button className="header-action-btn" onClick={resetChat} id="new-chat-btn" title="Start a fresh conversation">
                <span>New Chat</span>
              </button>
              <button className="header-action-btn" onClick={resetChat} id="clear-chat-btn" title="Clear current messages">
                <span>Clear Chat</span>
              </button>
            </div>
          </div>

          {/* Collapsible API Configuration Settings Drawer */}
          {showSettings && (
            <div className="api-settings-panel" style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(15, 17, 23, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backdropFilter: 'blur(12px)',
              zIndex: 9
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Google Gemini Live AI Integration</h4>
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#8b5cf6', textDecoration: 'underline' }}>
                  Get Free API Key ↗
                </a>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Enter your private Gemini API Key (stored entirely inside your browser local storage) to replace the offline logic engine with a live, responsive LLM Agent that answers anything while keeping the StudentHub Mentor persona.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px', alignItems: 'center' }}>
                <input 
                  type="password" 
                  placeholder="Paste your API key (AIzaSy...)" 
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(0,0,0,0.4)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    const trimmed = tempKey.trim();
                    setApiKey(trimmed);
                    if (trimmed) {
                      localStorage.setItem('studenthub_gemini_api_key', trimmed);
                    } else {
                      localStorage.removeItem('studenthub_gemini_api_key');
                    }
                    setShowSettings(false);
                  }}
                  style={{ fontSize: '0.8rem', padding: '8px 16px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Save
                </button>
                {apiKey && (
                  <button 
                    className="btn btn-glass" 
                    onClick={() => {
                      setApiKey('');
                      setTempKey('');
                      localStorage.removeItem('studenthub_gemini_api_key');
                      setShowSettings(false);
                    }}
                    style={{ fontSize: '0.8rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 12px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="chat-messages-area" id="chat-messages" ref={chatMessagesRef}>
            
            {showWelcomeDashboard ? (
              <div className="empty-chat-dashboard" id="empty-chat-state">
                {/* Welcoming greeting message styled as bubble */}
                <div className="chat-bubble ai-bubble fade-in greeting-bubble" style={{ maxWidth: '100%' }}>
                  <div className="bubble-avatar">
                    <SvgIcon name="assistant" size={18} />
                  </div>
                  <div className="bubble-text" style={{ width: '100%' }}>
                    <h3 className="bubble-greeting-title">👋 Welcome to StudentHub AI Career Mentor</h3>
                    <p className="greeting-intro">I'm your intelligent career companion. I can guide you through scholarships, internships, careers, placements, resumes, government jobs, free courses, and career roadmaps.</p>
                  </div>
                </div>

                {/* Suggestion Chips */}
                <div className="suggestion-chips-container" id="suggestion-chips">
                  {messages[0].chips.map(chip => {
                    const cleanText = chip.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
                    const emojiMatch = chip.match(/^([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);
                    const icon = emojiMatch ? emojiMatch[1] : '';
                    const text = emojiMatch ? emojiMatch[2] : chip;

                    return (
                      <button 
                        key={chip} 
                        className="suggestion-chip" 
                        onClick={() => handleChipClick(chip)}
                      >
                        {icon && <span className="chip-icon">{icon}</span>} {text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              messages.filter(msg => msg.id !== 'welcome').map(msg => (
                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'} fade-in`} key={msg.id}>
                  <div className={`bubble-avatar ${msg.sender === 'user' ? 'user-avatar-circle' : ''}`}>
                    {msg.sender === 'user' ? <span>ME</span> : <SvgIcon name="assistant" size={18} />}
                  </div>
                  <div className="bubble-text">
                    {/* Render text content with support for paragraph breaks */}
                    {msg.text.split('\n').map((para, pIdx) => {
                      if (para.startsWith('### ')) {
                        return <h4 key={pIdx} className="text-sm weight-bold" style={{ margin: '14px 0 6px 0' }}>{para.replace('### ', '')}</h4>;
                      }
                      if (para.startsWith('## ')) {
                        return <h3 key={pIdx} className="text-base weight-bold" style={{ margin: '18px 0 8px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>{para.replace('## ', '')}</h3>;
                      }
                      if (para.startsWith('#### ')) {
                        return <h5 key={pIdx} className="text-xs weight-bold" style={{ margin: '10px 0 4px 0', color: 'var(--text-secondary)' }}>{para.replace('#### ', '')}</h5>;
                      }
                      if (para.startsWith('* **') || para.startsWith('- **')) {
                        // Bold bullet format parsing
                        const parts = para.replace(/^[\*\-]\s*\*\*/, '').split('**');
                        return (
                          <p key={pIdx} style={{ margin: '4px 0 4px 12px', fontSize: '0.85rem' }}>
                            • <strong>{parts[0]}</strong>{parts.slice(1).join('**')}
                          </p>
                        );
                      }
                      if (para.startsWith('* ') || para.startsWith('- ') || para.startsWith('• ')) {
                        return <p key={pIdx} style={{ margin: '4px 0 4px 12px', fontSize: '0.85rem' }}>• {para.replace(/^([\*\-•]\s*)/, '')}</p>;
                      }
                      if (para.match(/^\d+\.\s/)) {
                        return <p key={pIdx} style={{ margin: '4px 0 4px 12px', fontSize: '0.85rem' }}>{para}</p>;
                      }
                      if (para.startsWith('```')) {
                        if (para === '```' || para.startsWith('```')) return null;
                      }
                      return para.trim() ? <p key={pIdx} style={{ margin: '0 0 8px 0', fontSize: '0.88rem', lineHeight: '1.45' }}>{para}</p> : <div key={pIdx} style={{ height: '8px' }} />;
                    })}

                    {/* Render Bullet Points (Resume tips, etc.) */}
                    {msg.bullets && (
                      <ul style={{ paddingLeft: '20px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                      </ul>
                    )}

                    {/* Render Scholarships Grid */}
                    {msg.items && msg.type === 'scholarships' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: '12px' }}>
                        {msg.items.map((item, idx) => (
                          <div className="card glass-panel" key={idx} style={{ padding: '16px', gap: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                            <h4 className="text-sm weight-bold" style={{ margin: 0 }}>{item.name}</h4>
                            <p className="text-xs text-muted" style={{ minHeight: '36px', margin: 0 }}>{item.eligibility}</p>
                            <span className="badge badge-primary" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>{item.benefits}</span>
                            <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', alignSelf: 'stretch' }}>
                              Apply <SvgIcon name="apply" size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Internships Grid */}
                    {msg.items && msg.type === 'internships' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: '12px' }}>
                        {msg.items.map((item, idx) => (
                          <div className="card glass-panel" key={idx} style={{ padding: '16px', gap: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 className="text-sm weight-bold" style={{ margin: 0 }}>{item.role}</h4>
                              <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{item.duration}</span>
                            </div>
                            <p className="text-xs text-muted" style={{ margin: 0 }}>{item.company} - {item.location}</p>
                            <p className="text-xs text-secondary" style={{ margin: 0, fontSize: '0.75rem' }}>{item.eligibility}</p>
                            <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-sm" style={{ fontSize: '0.75rem', marginTop: '6px', textAlign: 'center', alignSelf: 'stretch' }}>
                              View Role
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Courses Grid */}
                    {msg.items && msg.type === 'courses' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: '12px' }}>
                        {msg.items.map((item, idx) => (
                          <div className="card glass-panel" key={idx} style={{ padding: '16px', gap: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                            <h4 className="text-sm weight-bold" style={{ margin: 0 }}>{item.name}</h4>
                            <p className="text-xs text-muted" style={{ margin: 0 }}>{item.platform} • {item.duration}</p>
                            <span className="badge badge-secondary" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>{item.certificate}</span>
                            <a href={item.startLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', alignSelf: 'stretch' }}>
                              Start Learning <SvgIcon name="apply" size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Roadmaps list */}
                    {msg.items && msg.type === 'roadmaps' && (
                      <div className="grid grid-cols-1 gap-3" style={{ marginTop: '12px' }}>
                        {msg.items.map((item, idx) => (
                          <div className="card glass-panel" key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 className="text-sm weight-bold" style={{ margin: 0 }}>{item.careerName}</h4>
                              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{item.estimatedTime}</span>
                            </div>
                            <p className="text-xs text-muted" style={{ margin: 0 }}>{item.description}</p>
                            <p className="text-xs text-secondary" style={{ margin: 0 }}><strong>Skills:</strong> {(item.skills || []).join(', ')}</p>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/roadmaps?id=${item.id}`)} style={{ fontSize: '0.75rem', marginTop: '6px', alignSelf: 'flex-start' }}>
                              Explore Syllabus & Subjects
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.options && msg.type === 'higherStudies' && (
                      <div className="flex flex-col gap-sm" style={{ marginTop: '12px' }}>
                        {msg.options.map((item, idx) => (
                          <div className="card glass-panel" key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)' }}>
                            <h4 className="text-sm weight-bold">{item.route}</h4>
                            <p className="text-xs text-secondary" style={{ marginTop: '4px' }}><strong>Required Exams:</strong> {item.exams}</p>
                            <p className="text-xs text-muted" style={{ marginTop: '2px' }}>{item.details}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestion Chips */}
                    {msg.chips && (
                      <div className="chat-dynamic-suggestion-chips fade-in">
                        {msg.chips.map(chip => (
                          <button key={chip} className="chat-response-chip" onClick={() => handleChipClick(chip)}>
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="bubble-timestamp-row">
                      <span className="bubble-timestamp">{msg.time || '10:00 AM'}</span>
                      {msg.sender === 'user' && (
                        <span className="delivery-tick">
                          <SvgIcon name="check" size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="chat-bubble ai-bubble fade-in">
                <div className="bubble-avatar">
                  <SvgIcon name="assistant" size={18} />
                </div>
                <div className="bubble-text">
                  <div className="typing-indicator" style={{ display: 'flex', gap: '4px', padding: '6px' }}>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Control Area */}
          <div className="chat-input-outer-wrapper">
            <div className="chat-input-container">
              <button className="chat-input-btn attachment-btn" title="Attach file (Future use)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>

              <div className="input-textarea-wrapper">
                <textarea
                  id="chat-input"
                  rows="1"
                  placeholder="Ask anything about scholarships, internships, resumes, careers, placements, courses or roadmaps..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  autoComplete="off"
                />
              </div>

              <button className="chat-input-btn voice-btn" title="Voice Search (UI only)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              </button>

              <button 
                className="chat-input-btn send-btn" 
                id="chat-send-btn" 
                title="Send Message"
                onClick={() => handleSend()}
                disabled={!inputVal.trim() || isTyping}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <div className="chat-disclaimer">
              StudentHub AI can make mistakes. Consider checking important information.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
