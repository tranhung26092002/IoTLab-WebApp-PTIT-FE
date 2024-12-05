// src/components/about/Team.tsx
import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { TeamOutlined, LinkedinFilled, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { teamMembers } from '../../data/aboutData';
import { animations, colors, transitions } from '../../constants/aboutConstants';

const { Title, Paragraph } = Typography;

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => (
  <motion.a
    href={href}
    className="text-white text-2xl hover:text-[#d2e3c8]"
    whileHover={{ scale: 1.2 }}
    transition={transitions.default}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </motion.a>
);

export const Team: React.FC = () => (
  <motion.div {...animations.fadeInUp}>
    <Title level={2} className="flex items-center gap-3 primary--light--color mb-8">
      <TeamOutlined className="text-2xl" />
      Our Team
    </Title>
    <motion.div
      variants={animations.stagger.container}
      initial="hidden"
      animate="show"
    >
      <Row gutter={[24, 24]}>
        {teamMembers.map((member, index) => (
          <Col xs={24} md={8} key={member.id}>
            <motion.div 
              variants={animations.stagger.item}
              {...animations.cardHover}
            >
              <Card
                className={`h-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-br ${colors.gradient.primary}`}
                style={{ borderColor: colors.accent }}
                cover={
                  <div className="relative group">
                    <motion.img
                      alt={member.name}
                      src={member.image}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      {...animations.imageHover}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4"
                      transition={transitions.default}
                    >
                      <SocialLink href={member.social.linkedin} icon={<LinkedinFilled />} />
                      <SocialLink href={member.social.github} icon={<GithubOutlined />} />
                      <SocialLink href={member.social.email} icon={<MailOutlined />} />
                    </motion.div>
                  </div>
                }
              >
                <Title level={4} className="forest--dark--color mb-1">{member.name}</Title>
                <div className="text-sm sage--color mb-3">{member.role}</div>
                <Paragraph className="moss--color line-clamp-3">{member.description}</Paragraph>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  </motion.div>
);

export default Team;