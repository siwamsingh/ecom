import GetAllCategories from "../components/category/GetAllCategories"
import UpdateCategory from "../components/category/UpdateCategory"
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Categories() {
  const [showModal, setShowModal] = useState(false);
  const category = useSelector((state: RootState)=>state.category.category)
  const handleUpdateSuccess = () => {
    // Refresh categories or do any update-related action
  };

  return (
    <div>
      <GetAllCategories onClick={()=>setShowModal(true)}/>
      {showModal && (
        <UpdateCategory
          _id={category?._id}
          category_name={category?.category_name }
          url_slug={category?.url_slug}
          status={category?.status}
          onClose={() => setShowModal(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      </div>
  )
}

export default Categories