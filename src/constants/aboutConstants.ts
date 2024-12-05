// src/constants/aboutConstants.ts
export const colors = {
    primary: '#2c4a2d',
    secondary: '#4f6f52',
    accent: '#86a789',
    light: '#d2e3c8',
    background: '#f5f8f5',
    gradient: {
        primary: 'from-white to-[#f5f8f5]',
        secondary: 'from-[#f5f8f5] to-white'
    }
};

export const animations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
    },
    fadeInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
    },
    cardHover: {
        whileHover: {
            scale: 1.03,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        transition: {
            duration: 0.2,
            ease: 'easeInOut'
        }
    },
    stagger: {
        container: {
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        },
        item: {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }
    },
    imageHover: {
        whileHover: {
            scale: 1.05,
            filter: 'brightness(1.1)'
        },
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
};

export const transitions = {
    default: {
        duration: 0.3,
        ease: 'easeInOut'
    },
    slow: {
        duration: 0.6,
        ease: 'easeOut'
    },
    spring: {
        type: 'spring',
        stiffness: 300,
        damping: 20
    }
};