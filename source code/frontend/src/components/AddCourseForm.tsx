import React, { useState } from "react";

interface Course {
  title: string;
  description: string;
  price: number;
  image: string;
  teacher_username: string;
  enrollments: string[];
  courseMaterials: CourseMaterial[];
}

interface Props {
  heading: string;
  listing: Course;
  onHandleSubmit: (
    e: React.FormEvent,
    title: string,
    description: string,
    price: number,
    imageUrl: string,
    teacher_username: string,
    enrollments: string[],
    materials: CourseMaterial[]
  ) => void;
}
interface CourseMaterial {
  title: string;
  type: string;
  url: string;
}

const AddCourseForm = (props: Props) => {
  const course = props.listing;
  const [materials, setMaterials] = useState<CourseMaterial[]>(
    course.courseMaterials
  );
  const [title, setTitle] = useState(course.title); // State for title
  const [description, setDescription] = useState(course.description); // State for description
  const [price, setPrice] = useState<number>(course.price); // State for price, initialized with 0
  const [imageUrl, setImageUrl] = useState(course.image); // State for image URL
  // console.log(title);
  // const materials_v = materials;
  const handleMaterialChange = (
    index: number,
    key: keyof (typeof materials)[0],
    value: string
  ) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][key] = value;
    setMaterials(updatedMaterials);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { title: "", type: "link", url: "" }]);
  };

  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // working
    // console.log(materials);
    props.onHandleSubmit(
      e,
      title,
      description,
      price,
      imageUrl,
      "nouman",
      [],
      materials
    );
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

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <label htmlFor="floatingDescription">Description</label>
            </div>

            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                placeholder="Enter Price"
                onChange={(e) => setPrice(parseInt(e.target.value))}
                required={true}
                value={price}
              />
              <label htmlFor="floatingPrice">Price</label>
            </div>

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Image URL"
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
              />
              <label htmlFor="floatingImage">Image URL</label>
            </div>
            {/* Render multiple material input fields */}
            {materials.map((material, index) => (
              <div key={index}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Material Title"
                    value={material.title}
                    onChange={(e) =>
                      handleMaterialChange(index, "title", e.target.value)
                    }
                  />
                  <label htmlFor="floatingMaterialTitle">Material Title</label>
                </div>

                <div className="form-floating">
                  <select
                    className="form-select"
                    onChange={(e) =>
                      handleMaterialChange(index, "type", e.target.value)
                    }
                  >
                    <option value="link">Link</option>
                  </select>
                  <label htmlFor="floatingMaterialType">Material Type</label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Material URL"
                    value={material.url}
                    onChange={(e) =>
                      handleMaterialChange(index, "url", e.target.value)
                    }
                  />
                  <label htmlFor="floatingMaterialUrl">Material URL</label>
                </div>

                {/* Add button to remove material */}
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(index)}
                >
                  Remove Material
                </button>
              </div>
            ))}

            {/* Button to add more materials */}
            <button type="button" onClick={handleAddMaterial}>
              Add Material
            </button>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCourseForm;
