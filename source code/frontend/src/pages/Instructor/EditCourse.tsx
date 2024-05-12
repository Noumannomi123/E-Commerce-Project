import axios from "axios";
import AddCourseForm from "../../components/AddCourseForm";
import Navbar from "../../components/Navbar";
interface CourseMaterial {
  title: string;
  type: string;
  url: string;
}
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const EditCourse = () => {
  const { state } = useLocation();
  const { listing } = state;
  const { username } = state;
  //   const { id } = useParams();
  //   const getCourse = async () => {
  //       await axios
  //       .get(`http://localhost:5555/courses/${id}`)
  //       .then((response) => {
  //           setCourses(response.data);
  //         })
  //         .catch((error) => console.log(error));
  //     };

  //     useEffect(() => {
  //       getCourse();
  //     }, []);
  const item: string[] = ["Home", "Add Courses"];
  const routes = ["/Instructor/Home", "/Instructor/AddCourse"];
  const navigate = useNavigate();
  const handleSubmit = async (
    e: React.FormEvent,
    title: string,
    description: string,
    price: number,
    imageUrl: string,
    teacher_username: string,
    enrollments: string[],
    materials: CourseMaterial[]
  ) => {
    e.preventDefault();
    try {
      axios
        .put(`http://localhost:5555/instructor/updateCourse/${listing._id}`, {
          title,
          description,
          price,
          image: imageUrl,
          teacher_username,
          enrollments,
          courseMaterials: materials,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      alert("Course updated successfully");
      const username = teacher_username;
      navigate("/instructor/Home", {
        state: { username: username },
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!username) {
      navigate("/user/login");
    }
  }, [username]);
  return (
    <>
      <Navbar items={item} routes={routes} />
      <AddCourseForm
        heading="Edit Course"
        onHandleSubmit={handleSubmit}
        listing={listing}
      ></AddCourseForm>
    </>
  );
};

export default EditCourse;
