import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { stats } from '../../data/aboutData';
import { animations, colors } from '../../constants/aboutConstants';
import { Stat } from '../../types/about';

export const Stats: React.FC = () => (
  <motion.div
    {...animations.fadeInUp}
    className="mb-16"
  >
    <Row gutter={[32, 32]}>
      {stats.map((stat: Stat, index: number) => (
        <Col xs={12} md={6} key={index}>
          <motion.div {...animations.cardHover}>
            <Card
              className="text-center bg-gradient-to-br from-white to-[#f5f8f5] shadow-md hover:shadow-xl transition-all"
              style={{ borderColor: colors.accent }}
            >
              {/* <div className="text-2xl mb-2">{stat.icon}</div> */}
              <Statistic
                title={
                  <span className="sage--color text-lg">
                    {stat.title}
                  </span>
                }
                value={stat.value}
                suffix={stat.suffix}
                className="primary--color"
                valueStyle={{ color: colors.primary, fontWeight: 600 }}
              />
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  </motion.div>
);

export default Stats;