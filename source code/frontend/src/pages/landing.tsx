import default_pic from "../assets/default_course.webp";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../landing.css";
import img from "../assets/land.png";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Course {
  title: string;
  description: string;
  price: number;
  image: string;
  teacher_username: string;
  enrollments: string[];
  courseMaterials: Material[];
  _id: string;
}

interface Material {
  title: string;
  type: string;
  url: string;
}

const LandingPage: React.FC = () => {
  const [, setCount] = useState(0);
  const [list, setList] = useState<Course[]>([]);

  const getCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/getCourses`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourses();
      setCount(result.count);
      setList(result.data);
    };

    fetchCourses();
  }, []);
  const navigate = useNavigate();
  const handleButton = () => {
    navigate("/user/signup");
  };
  return (
    <div
      className="landing-page"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <img src={img} alt="Logo" height={200} width={200} />
      <div className="fs-4">
        <button onClick={handleButton}>Sign Up Now</button>
      </div>

      <header>
        <h1>Welcome to Your E-Learning Platform</h1>
        <p>Learn Anything, Anytime, Anywhere</p>
      </header>
      <VStack>
        {list.slice(0, 4).map((course: Course) => (
          <Box key={course._id}>
            <HStack justifyContent="space-between" w="100%" marginBlock="30px">
              <Text fontSize="larger" fontWeight="bold">
                {course.title}
              </Text>
              <Text fontSize="larger" fontWeight="bold">
                {"$" + course.price}
              </Text>
            </HStack>
            <HStack mt="10px">
              <Box w="40%">
                {/* <Image src={course.image} w="100%" /> */}
                {course.image ? (
                  <Image src={course.image} w="100%" />
                ) : (
                  <Image
                    src={default_pic} // Replace default_pic with the URL of your default image
                    w="100%"
                  />
                )}
              </Box>
              <VStack alignItems="flex-start" w="60%">
                <Text>{course.description}</Text>
                <Text fontWeight="medium">Resources</Text>
                <Text color="gray">{course.courseMaterials.length}</Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      <footer>
        <p>Get started today and embark on your learning journey!</p>
      </footer>
    </div>
  );
};

export default LandingPage;
