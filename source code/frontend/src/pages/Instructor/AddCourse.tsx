import axios from "axios";
import AddCourseForm from "../../components/AddCourseForm";
import Navbar from "../../components/Navbar";
interface CourseMaterial {
  title: string;
  type: string;
  url: string;
}
const AddCourse = () => {
  const item: string[] = ["Home", "Add Courses"];
  const routes = ["/Instructor/Home", "/Instructor/AddCourse"];

  const courseMaterial: CourseMaterial[] = [
    { title: "", type: "Link", url: "" },
  ];
  const course = {
    title: "",
    description: "",
    price: 0,
    image: "",
    teacher_username: "",
    enrollments: [],
    courseMaterials: courseMaterial,
  };
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
    console.log("In add courses");
    // console.log(materials);
    // works
    try {
      await axios.post("http://localhost:5555/instructor/createCourse", {
        title,
        description,
        price,
        image: imageUrl,
        teacher_username,
        enrollments,
        courseMaterials: materials,
      });
      alert("Course created successfully");
      // refresh page
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating course:", error.message);
      alert("Unable to create course. Try changing title.");
    }
  };
  return (
    <>
      <Navbar items={item} routes={routes} />
      <AddCourseForm
        heading="Add Courses"
        onHandleSubmit={handleSubmit}
        listing={course}
      ></AddCourseForm>
    </>
  );
};

export default AddCourse;
