import "./Button.css";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
};

export default function Button({
    children,
    onClick,
    type = "button",
}: Props) {
    return (
        <button
            type={type}
            className="btn-primary"
            onClick={onClick}
        >
            {children}
        </button>
    );
}