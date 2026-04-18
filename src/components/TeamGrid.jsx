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
            github: 'https://github.com/anuradhakurimina399-prog',
            linkedin: 'https://www.linkedin.com/in/kurimina-anuradha-544544293?utm_source=share_via&utm_content=profile&utm_medium=member_android',
            website: '#'
        },
        { 
            name: 'Manthini Neelaveni', 
            initials: 'MN',
            github: 'https://github.com/Neelaveni6678',
            linkedin: 'https://www.linkedin.com/in/manthini-neelaveni-560a86354',
            website: '#'
        },
        { 
            name: 'Kambala Vijaya Sankar', 
            initials: 'KVS',
            github: 'https://github.com/vijay-017',
            linkedin: '#',
            website: '#'
        },
        { 
            name: 'Palaka Dhanunjaya', 
            initials: 'PD',
            github: 'https://github.com/Dhanunjaya-21',
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
