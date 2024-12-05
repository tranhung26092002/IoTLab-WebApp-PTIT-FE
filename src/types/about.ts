// src/types/about.ts
export interface Stat {
    title: string;
    value: number;
    suffix: string;
}

export interface Facility {
    title: string;
    description: string;
    icon: string;
    bgColor: string;
}

export interface TeamMember {
    name: string;
    role: string;
    description: string;
    image: string;
    social: {
        linkedin: string;
        github: string;
        email: string;
    };
}