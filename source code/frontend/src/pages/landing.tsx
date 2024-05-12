// LandingPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../landing.css'; // Import CSS for styling
import img from "../assets/land.png"

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
}

const LandingPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get<Course[]>('https://localhost:5173/');
            setCourses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="landing-page" style={{ backgroundImage: 'url("../assets/land.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <img src={img} alt="Logo" height={200} width={200} />
            <header>
                <h1>Welcome to Your E-Learning Platform</h1>
                <p>Learn Anything, Anytime, Anywhere</p>
            </header>
            <section className="courses">
                {courses.map(course => (
                    <div className="course" key={course._id}>
                        {course.image && <img src={course.image} alt={course.title} />}
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                        <p>Price: {course.price}</p>
                    </div>
                ))}
            </section>
            <footer>
                <p>Get started today and embark on your learning journey!</p>
                <button>Sign Up Now</button>
            </footer>
        </div>
    );
};

export default LandingPage;
