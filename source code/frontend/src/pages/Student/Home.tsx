import Navbar from "../../components/Navbar";
import "../Instructor/Instructor.css";
import default_pic from "../../assets/default_course.webp";
import user from "../../assets/user.png";
import { useEffect, useState } from "react";
import { Box, Button, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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

const Home = () => {
  const { state } = useLocation();
  const { username } = state;

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
  const items = ["Home"];
  const routes = ["/Student/Home"];
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourses();
      setCount(result.count);
      setList(result.data);
    };

    fetchCourses();
  }, []);
  return (
    <>
      <Navbar items={items} routes={routes} />
      <VStack w="100%">
        <Box w="70%">
          <Box>
            <HStack>
              <Image src={user} h="100px" />
              <VStack alignItems="flex-start">
                <Heading margin="20px">{username}</Heading>
              </VStack>
            </HStack>
          </Box>
          {list.slice(0, 4).map((course: Course) => (
            <Box key={course._id}>
              <HStack
                justifyContent="space-between"
                w="100%"
                marginBlock="30px"
              >
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
                {/*  Buy Now button */}
                  <Button>Buy Now</Button>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </>
  );
};

export default Home;
