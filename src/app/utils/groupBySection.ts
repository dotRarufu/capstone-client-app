import { Project } from 'src/app/models/project';

export const groupBySection = (projects: Project[]) => {
  const sections = new Set<string>();
  const nonNulls = projects.filter((p) => p.section !== null);
  nonNulls.map((p) => sections.add(p.section!));

  const res = Array.from(sections).map((section) => {
    const match = projects.filter((p) => p.section === section);

    return { section, projects: match };
  });

  return res;
};
