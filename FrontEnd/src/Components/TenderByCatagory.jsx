import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import BaseUrl from "../api/BaseUrl";

export default function TenderByCategory() {
  const Base_Url = BaseUrl();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Base_Url}/categories`);
      const data = response.data.data;
      const sortedData = data.sort((a, b) => b.id - a.id);
      setCategories(sortedData.slice(0, 6)); // Limit to 6 categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Ensure loading is stopped in both success and error cases
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="text-center fw-bolder">Tender By Categories</h2>
      <div className="container-fluid pt-5 pb-5 pl-0 pr-0">
        <div className="row d-flex justify-content-center align-items-center gap-3 tenderByRows">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="col-md-3 col-12">
                  {/* Bootstrap Placeholder */}
                  <div className="placeholder-glow shadow-lg rounded-sm p-3">
                    <span className="placeholder col-12"></span>
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <div key={category.id} className="col-md-3 col-12">
                  <Link
                    to={`/category-details/${encodeURIComponent(category.name)}`}
                    className="text-decoration-none text-dark"
                  >
                    <p className="text-center shadow-lg rounded-sm p-3">
                      {category.name.slice(0, 27)}
                    </p>
                  </Link>
                </div>
              ))}
          {/* Button to View All Categories */}
          <div className="text-center mt-4">
            <Link
              to="/categories"
              className="btn customButton rounded-pill text-decoration-none"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
