// components/home/ImageCarousel.tsx
import React from 'react';
import { Card, Carousel, Image } from 'antd';
import { motion } from 'framer-motion';

// Import images directly
import practice from '/src/assets/home/practice.jpg';
import practice2 from '/src/assets/home/practice2.jpg';
import han1 from '/src/assets/home/han1.jpg';
import han2 from '/src/assets/home/han2.jpg';

const ImageCarousel: React.FC = () => {
    const images = [
        { src: practice, title: 'IoT Development Area' },
        { src: practice2, title: 'Testing Facility' },
        { src: han1, title: 'Research Space' },
        { src: han2, title: 'Workshop Area' }
    ];

    return (
        <motion.div
            className="w-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-white/90 backdrop-blur">
                <Carousel autoplay effect="fade">
                    {images.map((image, index) => (
                        <div key={index} className="h-[400px]">
                            <Image
                                src={image.src}
                                alt={image.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                                {image.title}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Card>
        </motion.div>
    );
};

export default ImageCarousel;