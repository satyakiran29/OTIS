import React, { useMemo } from 'react';
import TeamCard from './TeamCard';

const TeamGrid = () => {
    const developers = [
        { 
            name: 'Pampana Satya Kiran', 
            initials: 'PSK',
            github: 'https://github.com/satyakiran29',
            linkedin: 'https://linkedin.com/in/satyakiran29',
            website: 'https://psatyakiran.in'
        },
        { 
            name: 'Kurimina Anuradha', 
            initials: 'KA',
            github: '#',
            linkedin: '#',
            website: '#'
        },
        { 
            name: 'Manthini Neelaveni', 
            initials: 'MN',
            github: '#',
            linkedin: '#',
            website: '#'
        },
        { 
            name: 'Kambala Vijaya Sankar', 
            initials: 'KVS',
            github: '#',
            linkedin: '#',
            website: '#'
        },
        { 
            name: 'Palaka Dhanunjaya', 
            initials: 'PD',
            github: '#',
            linkedin: '#',
            website: '#'
        }
    ];

    const shuffledDevelopers = useMemo(() => {
        return [...developers].sort(() => Math.random() - 0.5);
    }, []);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
        }}>
            {shuffledDevelopers.map((dev, index) => (
                <TeamCard
                    key={dev.name}
                    name={dev.name}
                    initials={dev.initials}
                    github={dev.github}
                    linkedin={dev.linkedin}
                    website={dev.website}
                    delay={`${index * 0.1}s`}
                />
            ))}
        </div>
    );
};

export default TeamGrid;
