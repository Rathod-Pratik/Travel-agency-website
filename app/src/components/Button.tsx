type Props = {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const Button = ({
  text,
  onClick,
  isDisabled,
  type = "button",
}: Props) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className="bg-[#0b2727] cursor-pointer text-white px-4 py-2 rounded-lg w-full hover:bg-[#083c3c] transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
};