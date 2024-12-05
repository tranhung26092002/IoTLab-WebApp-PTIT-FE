// src/data/aboutData.ts
import { Stat, Facility, TeamMember } from '../types/about';

export const stats: Stat[] = [
    { title: "Research Projects", value: 50, suffix: "+" },
    { title: "Team Members", value: 25, suffix: "" },
    { title: "Publications", value: 100, suffix: "+" },
    { title: "Years Experience", value: 15, suffix: "+" }
];

export const facilities: Facility[] = [
    {
        title: "State-of-the-art Equipment",
        description: "Latest technology for precise research and analysis",
        icon: "🔬",
        bgColor: "from-[#f5f8f5] to-white"
    },
    {
        title: "Research Areas",
        description: "Specialized zones for different research activities",
        icon: "🧪",
        bgColor: "from-white to-[#f5f8f5]"
    },
    {
        title: "Safety Standards",
        description: "Following international safety protocols and guidelines",
        icon: "🛡️",
        bgColor: "from-[#f5f8f5] to-white"
    },
    {
        title: "Data Center",
        description: "High-performance computing facility for bioinformatics and data analysis",
        icon: "💻",
        bgColor: "from-white to-[#f5f8f5]"
    }
];

export const teamMembers: TeamMember[] = [
    {
        name: "Dr. Jane Smith",
        role: "Lab Director",
        description: "Ph.D. in Molecular Biology with 15 years of research experience in plant genetics and biotechnology",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:jane@example.com"
        }
    },
    {
        name: "Dr. John Doe",
        role: "Senior Researcher",
        description: "Specializing in experimental design and data analysis with focus on sustainable agriculture",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:john@example.com"
        }
    },
    {
        name: "Dr. Sarah Johnson",
        role: "Research Lead",
        description: "Expert in advanced laboratory techniques and molecular farming technologies",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:sarah@example.com"
        }
    },
    {
        name: "Dr. Michael Chen",
        role: "Technical Lead",
        description: "Specialized in bioinformatics and computational biology",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:michael@example.com"
        }
    },
    {
        name: "Dr. Emily Brown",
        role: "Research Scientist",
        description: "Expert in plant pathology and disease resistance",
        image: "https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:emily@example.com"
        }
    },
    {
        name: "Dr. David Wilson",
        role: "Senior Biotechnologist",
        description: "Specializing in genetic engineering and crop improvement",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        social: {
            linkedin: "#",
            github: "#",
            email: "mailto:david@example.com"
        }
    }
];