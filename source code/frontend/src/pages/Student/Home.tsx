import Navbar from "../../components/Navbar";
import "../Instructor/Instructor.css";
import default_pic from "../../assets/default_course.webp";
import user from "../../assets/user.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";

// Interface definitions remain the same

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post('http://localhost:5555/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsModalOpen(false);
      // Add logic to handle successful upload (e.g., show success message)
    } catch (error) {
      console.error('Error uploading file:', error);
      // Add logic to handle error (e.g., show error message)
    }
  };  

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
                  {course.image ? (
                    <Image src={course.image} w="100%" />
                  ) : (
                    <Image
                      src={default_pic}
                      w="100%"
                    />
                  )}
                </Box>
                <VStack alignItems="flex-start" w="60%">
                  <Text>{course.description}</Text>
                  <Text fontWeight="medium">Resources</Text>
                  <Text color="gray">{course.courseMaterials.length}</Text>
                </VStack>
                <Button onClick={() => setIsModalOpen(true)}>Buy Now</Button>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attach Payment Slip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Attach Payment Slip:</FormLabel>
              <Input type="file" onChange={handleFileChange} />
              <FormHelperText>Please attach a screenshot of your payment slip.</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpload}>
              Upload
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default Home;