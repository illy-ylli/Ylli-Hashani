export type Project = {
  name: string
  summary: string
  technologies: string[]
  image: string
  imageAlt: string
  placeholder?: boolean
  repository?: string
  demo?: string
}

export const portfolio = {
  name: 'Ylli',
  field: 'Computer Science and Engineering',
  school: 'UBT',
  introduction: 'I’m interested in software development, automation, and creative digital experiences.',
  about: 'I study Computer Science and Engineering at UBT. I’m drawn to the places where software can make a practical difference, whether that means automating a repetitive task or building an interface that’s easier to use.',
  vision: 'I want to build useful systems and keep exploring what software can do. Automation gives me a way to make everyday work simpler, and creative coding gives me space to try ideas I wouldn’t encounter in a typical project.',
  interests: ['Creative coding', 'Software engineering', 'Personal development', 'Automation'],
  skills: [
    { name: 'Java', symbol: 'J', note: 'Object-oriented programming' },
    { name: 'Python', symbol: 'Py', note: 'Scripting and automation' },
    { name: 'HTML', symbol: '<>', note: 'Semantic page structure' },
    { name: 'CSS', symbol: '✦', note: 'Layout and visual design' },
    { name: 'JavaScript', symbol: 'JS', note: 'Interactive web experiences' },
    { name: 'Git', symbol: '◇', note: 'Version control' },
    { name: 'Software development', symbol: '{ }', note: 'Designing and building useful tools' },
    { name: 'Automation', symbol: '↻', note: 'Simplifying repetitive workflows' },
  ],
  projects: [
    {
      name: 'Workflow Console',
      summary: 'A concept for running common scripts and reviewing their results from a single dashboard.',
      technologies: ['Python', 'Automation'],
      image: 'images/workflow.png',
      imageAlt: 'Illustrated dashboard with a task list and activity graph',
      placeholder: true,
    },
    {
      name: 'Campus Planner',
      summary: 'A concept for organizing coursework, deadlines, and weekly schedules.',
      technologies: ['Java', 'Software development'],
      image: 'images/planner.png',
      imageAlt: 'Illustrated weekly calendar with color-coded study blocks',
      placeholder: true,
    },
    {
      name: 'Aero Interface Lab',
      summary: 'A concept for experimenting with glass surfaces and motion in the browser.',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      image: 'images/aero.png',
      imageAlt: 'Illustrated glass interface over a blue and green landscape',
      placeholder: true,
    },
  ] satisfies Project[] as Project[],
  contact: [
    { label: 'GitHub', url: '' },
    { label: 'LinkedIn', url: '' },
    { label: 'Email', url: '' },
  ],
}
