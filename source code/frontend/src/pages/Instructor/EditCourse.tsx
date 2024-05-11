import axios from "axios";
import AddCourseForm from "../../components/AddCourseForm";
import Navbar from "../../components/Navbar";

import { useLocation } from "react-router-dom";
const EditCourse = () => {
  const { state } = useLocation();
  const { listing } = state;

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
  const {
    title,
    description,
    price,
    imageUrl,
    teacher_username,
    enrollments,
    materials,
  } = listing;
  const handleSubmit = async () => {
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
    } catch (error: any) {}
  };

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
