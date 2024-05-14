import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface Quiz {
  title: string;
  courseid: string;
  questions: {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    correct: string;
  }[];
}

interface Props {
  heading: string;
  listing: Quiz;
  onHandleSubmit: (
    e: React.FormEvent,
    title: string,
    courseid: string,
    questions: {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      correct: string;
    }[]
  ) => void;
}

const AddQuizForm = (props: Props) => {
  const quiz = props.listing;
  const [questions, setQuestions] = useState<
    {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      correct: string;
    }[]
  >(quiz.questions);
  const [title, setTitle] = useState(quiz.title); // State for title
  //const [courseid, setCourseid] = useState(quiz.courseid); // State for courseid

  const handleQuestionChange = (
    index: number,
    key: keyof (typeof questions)[0],
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", a: "", b: "", c: "", d: "", correct: "" },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const { state } = useLocation();
  const { courseid: courseId } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    props.onHandleSubmit(e, title, courseId, questions);
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-body-tertiary py-4 vh-100">
        <div className="form-signin w-50 m-25 text-center ">
          <form className="col-12 mt-5" onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">{props.heading}</h1>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title"
                onChange={(e) => setTitle(e.target.value)}
                required={true}
                value={title}
              />
              <label htmlFor="floatingTitle">Title</label>
            </div>

            {/* Render multiple question input fields */}
            {questions.map((question, index) => (
              <div key={index}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Question"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                  />
                  <label htmlFor="floatingQuestion">Question</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Option A"
                    value={question.a}
                    onChange={(e) =>
                      handleQuestionChange(index, "a", e.target.value)
                    }
                  />
                  <label htmlFor="floatingOptionA">Option A</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Option B"
                    value={question.b}
                    onChange={(e) =>
                      handleQuestionChange(index, "b", e.target.value)
                    }
                  />
                  <label htmlFor="floatingOptionB">Option B</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Option C"
                    value={question.c}
                    onChange={(e) =>
                      handleQuestionChange(index, "c", e.target.value)
                    }
                  />
                  <label htmlFor="floatingOptionC">Option C</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Option D"
                    value={question.d}
                    onChange={(e) =>
                      handleQuestionChange(index, "d", e.target.value)
                    }
                  />
                  <label htmlFor="floatingOptionD">Option D</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Correct Answer"
                    value={question.correct}
                    onChange={(e) =>
                      handleQuestionChange(index, "correct", e.target.value)
                    }
                  />
                  <label htmlFor="floatingCorrectAnswer">Correct Answer</label>
                </div>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove Question
                </button>
              </div>
            ))}

            <button
              className="btn btn-primary mt-4"
              type="button"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>

            <button className="w-100 btn btn-lg btn-primary mt-4" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddQuizForm;