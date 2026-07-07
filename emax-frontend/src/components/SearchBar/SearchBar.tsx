import { FaSearch } from "react-icons/fa";

import Input from "../common/Input/Input";

import "./SearchBar.css";

export default function SearchBar() {
    return (
        <div className="search">

            <Input placeholder="Search genuine electronics..." />

            <FaSearch className="icon"/>

        </div>
    );
}