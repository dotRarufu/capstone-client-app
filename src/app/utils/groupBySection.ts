import { Project } from "src/app/models/project";

export const groupBySection = (projects: Project[]) => {
    const sections = new Set<string>();
    projects.map(p => sections.add(p.sectionName));

    const res = Array.from(sections).map(section => {
        const match = projects.filter(p => p.sectionName === section);
        
        return {section, projects: match};
    })

    return res;
    
}