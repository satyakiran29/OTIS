import React from 'react';
import TeamCard from './TeamCard';

const TeamGrid = () => {
    const developers = [
        { name: 'Pampana Satya Kiran', initials: 'PSK', role: 'Full Stack Developer' },
        { name: 'Kurimina Anuradha', initials: 'KA', role: 'Frontend Developer' },
        { name: 'Manthini Neelaveni', initials: 'MN', role: 'UI/UX Designer' },
        { name: 'Kambala Vijaya Sankar', initials: 'KVS', role: 'Backend Developer' },
        { name: 'Palaka Dhanunjaya', initials: 'PD', role: 'Database Engineer' }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
        }}>
            {developers.map((dev, index) => (
                <TeamCard
                    key={index}
                    name={dev.name}
                    initials={dev.initials}
                    role={dev.role}
                    delay={`${index * 0.1}s`}
                />
            ))}
        </div>
    );
};

export default TeamGrid;
