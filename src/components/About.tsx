import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(to right, #00ff87, #60efff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 100%;
`;

const Description = styled(motion.p)`
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  max-width: min(800px, 90%);
  text-align: center;
  line-height: 1.6;
  margin: 2rem auto;
  color: #e0e0e0;
`;

const TeamSection = styled(motion.div)`
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin: 4rem auto 0;
`;

const TeamTitle = styled(motion.h2)`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  margin-bottom: 3rem;
  color: #ffffff;
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
`;

const MemberCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const MemberName = styled(motion.h3)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: #ffffff;
  margin: 0;
`;

const MemberRole = styled(motion.p)`
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #00ff87;
  margin: 0;
`;

const teamMembers = [
  { name: 'Aditya', role: 'Team Lead' },
  { name: 'Athai', role: 'Developer' },
  { name: 'Soumya', role: 'Developer' },
  { name: 'Ankit', role: 'Developer' },
  { name: 'Chayan', role: 'Developer' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title
        initial={{ opacity: 0, y: -30 }}
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TeamTitle variants={itemVariants}>
          Meet Our Team
        </TeamTitle>

        <MembersGrid>
          {teamMembers.map((member, index) => (
            <MemberCard
              key={member.name}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
            </MemberCard>
          ))}
        </MembersGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
