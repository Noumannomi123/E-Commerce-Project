import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Instructor.css";
import default_pic from "../../assets/default_course.webp";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import user from "../../assets/user.png";
import { ArrowDownIcon } from "@chakra-ui/icons";
import axios from "axios";

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
  // const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const leastDestructiveRef = useRef(null); // Create a ref for the least destructive element

  const getCourses = async (username: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5555/instructor/courses/${username}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const courses = getCourses("nouman");
  console.log(courses);
  useEffect(() => {
    courses.then((result) => {
      setCount(result.count);
      setList(result.list);
    });
  }, []);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) {
      navigate("/user/login");
    }
  }, [username]);

  const item: string[] = ["Home", "Add Courses"];
  const routes = ["/Instructor/Home", "/Instructor/AddCourse"];
  // const courses = getCourses("nouman");
  // len of enrollments

  // len of courseMaterials
  const editCourse = (id: string) => {
    const listing  = list.find((course: Course) => course._id === id)
    navigate(`/Instructor/EditCourse/${id}`, {
      state: { listing: listing },
    });
  };
  const deleteCourse = async (id: string) => {
    axios
      .delete(`http://localhost:5555/instructor/deleteCourse/${id}`)
      .then(() => {
        alert("Deleted successfully");
        window.location.reload(); // Refresh the page
      });
  };
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
    } catch (error) {
      // Handle error
    }
    onClose(); // Close the confirmation dialog regardless of the outcome
  };
  return (
    <>
      <Navbar items={item} routes={routes} />

      <VStack w="100%" justifyContent="center">
        <Box w="70%">
          <Box>
            <HStack>
              <Image src={user} h="100px" />
              <VStack alignItems="flex-start">
                <Heading margin="20px">{username}</Heading>
                <HStack w="100%" justifyContent="space-between" padding="25px">
                  <VStack
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    gap="1px"
                  >
                    <Text color="gray">Courses</Text>
                    <Text fontWeight="500">{count}</Text>
                  </VStack>
                  <Box>
                    <VStack alignItems="flex-start" gap="1px">
                      <Text color="gray">Students</Text>
                      <Text fontWeight="500">
                        {list.reduce(
                          (total, course: Course) =>
                            total + course.enrollments.length,
                          0
                        )}
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </Box>
        <Box w="70%">
          <HStack justifyContent="space-between" w="100%">
            <Text fontSize="4xl" fontWeight="bold">
              Courses
            </Text>
            <Button
              rightIcon={<ArrowDownIcon />}
              colorScheme="teal"
              variant="outline"
            >
              Sort By
            </Button>
          </HStack>
          {list.map((course: Course) => (
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
                  <Image src={course.image || default_pic} w="100%" />
                </Box>
                <VStack alignItems="flex-start" w="60%">
                  <Text>{course.description}</Text>
                  <Text color="gray">{course.courseMaterials.length}</Text>
                  <HStack w="100%" justifyContent="flex-end">
                    <Button
                      bg="#5AB2FF"
                      color="white"
                      onClick={() => editCourse(course._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      bg="#FF5A5A"
                      color="white"
                      onClick={() => setIsOpen(true)}
                    >
                      Delete
                    </Button>
                    <AlertDialog
                      isOpen={isOpen}
                      leastDestructiveRef={leastDestructiveRef}
                      onClose={onClose}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent>
                          <AlertDialogHeader>Delete Course</AlertDialogHeader>
                          <AlertDialogBody>
                            Are you sure you want to delete this course?
                          </AlertDialogBody>
                          <AlertDialogFooter>
                            <Button ref={leastDestructiveRef} onClick={onClose}>
                              No
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => handleDelete(course._id)}
                              ml={3}
                            >
                              Yes
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </>
  );
};

export default Home;
