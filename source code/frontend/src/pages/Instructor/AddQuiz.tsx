import axios from "axios";
import AddQuizForm from "../../components/AddQuizForm.js";
import Navbar from "../../components/Navbar";
import { useLocation } from "react-router-dom";

interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: string;
}

interface Quiz {
  title: string;
  courseid: string;
  questions: Question[];
}

const AddQuiz = () => {
  const { state } = useLocation();
  const { username, courseId } = state;
  const item: string[] = ["Home", "Add Quizzes"];
  const routes = ["/Instructor/Home", `/Instructor/AddQuiz/${username}/${courseId}`];

  const initialQuiz: Quiz = {
    title: "",
    courseid: courseId,
    questions: [
      {
        question: "",
        a: "",
        b: "",
        c: "",
        d: "",
        correct: "",
      },
    ],
  };

  const handleSubmit = async (
    e: React.FormEvent,
    title: string,
    questions: Question[]
  ) => {
    e.preventDefault();
    console.log("In add quizzes");

    try {
      await axios.post("http://localhost:5555/instructor/AddQuiz", {
        title,
        courseid: courseId,
        questions,
      });
      alert("Quiz created successfully");
      // refresh page
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating quiz:", error.message);
      alert("Unable to create quiz. Try changing title.");
    }
  };

  return (
    <>
      <Navbar items={item} routes={routes} />
      <AddQuizForm
        heading="Add Quizzes"
        onHandleSubmit={(title, questions) => handleSubmit(title, questions, courseId)}
        listing={initialQuiz}
      ></AddQuizForm>
    </>
  );
};

export default AddQuiz;