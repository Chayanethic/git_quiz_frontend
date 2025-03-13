import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #00ff87, #60efff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TeamSection = styled(motion.div)`
  text-align: center;
  margin: 2rem 0;
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
`;

const MemberCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 800px;
  text-align: center;
  line-height: 1.6;
  margin: 2rem auto;
  color: #e0e0e0;
`;

const teamMembers = [
  { name: 'Aditya', role: 'Team Lead' },
  { name: 'Athaiya', role: 'Developer' },
  { name: 'Soumya', role: 'Developer' },
  { name: 'Ankit', role: 'Developer' },
  { name: 'Chayan', role: 'Developer' },
];

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Team Alpha
      </Title>

      <Description
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Welcome to our innovative quiz platform! Built with passion and expertise by Team Alpha,
        we're dedicated to creating an engaging and interactive learning experience.
      </Description>

      <TeamSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ fontSize: '2.5rem', marginBottom: '2rem' }}
        >
          Meet Our Team
        </motion.h2>

        <MembersGrid>
          {teamMembers.map((member, index) => (
            <MemberCard
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.h3
                style={{ fontSize: '1.8rem', marginBottom: '1rem' }}
                    >
                      {member.name}
              </motion.h3>
              <motion.p
                style={{ color: '#00ff87', fontSize: '1.2rem' }}
                    >
                      {member.role}
              </motion.p>
            </MemberCard>
          ))}
        </MembersGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About; 