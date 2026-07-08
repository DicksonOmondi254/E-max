import "./CategorySidebar.css";

const categories = [
  "Smartphones",
  "Laptops",
  "Desktop Computers",
  "Gaming",
  "Networking",
  "Smart TVs",
  "Accessories",
  "Printers",
  "Audio",
  "Wearables",
  "Storage",
  "Power Banks"
];

const CategorySidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>

      <ul>
        {categories.map((category) => (
          <li key={category}>{category}</li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;