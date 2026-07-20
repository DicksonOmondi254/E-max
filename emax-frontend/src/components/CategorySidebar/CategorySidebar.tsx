import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryService } from "../../services/categoryService";

import "./CategorySidebar.css";

type Category = {
  id: number;
  name: string;
};

const CategorySidebar = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await categoryService.getAllCategories();
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <aside className="sidebar">
      <h3>Categories</h3>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/categories/${category.id}`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;

