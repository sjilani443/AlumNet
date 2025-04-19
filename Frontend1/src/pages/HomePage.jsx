import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import AlumniList from '../components/AlumniList';
import JobsList from '../components/JobsList';
import EventsList from '../components/EventsList';
import { motion, useInView } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();

  const alumniRef = useRef(null);
  const eventsRef = useRef(null);
  const jobsRef = useRef(null);

  const alumniInView = useInView(alumniRef, { once: true, margin: '-100px' });
  const eventsInView = useInView(eventsRef, { once: true, margin: '-100px' });
  const jobsInView = useInView(jobsRef, { once: true, margin: '-100px' });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Alumni Section */}
        <motion.div
          ref={alumniRef}
          variants={fadeUp}
          initial="hidden"
          animate={alumniInView ? 'visible' : 'hidden'}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Alumni Network</h2>
          </div>
          <AlumniList limit={9} onSeeAll={() => navigate('/student/companies')} />
        </motion.div>

        {/* Events Section */}
        <motion.div
          ref={eventsRef}
          variants={fadeUp}
          initial="hidden"
          animate={eventsInView ? 'visible' : 'hidden'}
          className="mt-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <button
              onClick={() => navigate('/student/events')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              See All
            </button>
          </div>
          <EventsList limit={2} />
        </motion.div>

        {/* Jobs Section */}
        <motion.div
          ref={jobsRef}
          variants={fadeUp}
          initial="hidden"
          animate={jobsInView ? 'visible' : 'hidden'}
          className="mt-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Job Referrals</h2>
            <button
              onClick={() => navigate('/student/jobs')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              See All
            </button>
          </div>
          <JobsList limit={2} />
        </motion.div>
      </div>
    </div>
  );
}
