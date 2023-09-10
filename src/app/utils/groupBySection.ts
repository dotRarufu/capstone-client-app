import { Project } from 'src/app/models/project';

export const groupBySection = (projects: Project[]) => {
  const sections = new Set<string>();
  const hasSections = projects.filter((p) => p.section !== null && p.section !== '');
  hasSections.forEach((p) => sections.add(p.section!));

  const res = Array.from(sections).map((section) => {
    const match = projects.filter((p) => p.section === section);

    return { section, projects: match };
  });

  const noSections = projects.filter((p) => p.section === null || p.section === '');
  console.log("nosections:", noSections)
  console.log("projechs ceck:", projects)
  if (noSections.length > 0) {
    res.push({ section: 'No Section', projects: noSections });
  }

  return res;
};
