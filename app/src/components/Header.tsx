type props = {
    title: string
}

export const Header = ({ title }: props) => {
    return (
        <header
            style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/tour-images/tour.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="text-white h-50 flex justify-center items-center text-4xl font-semibold"
        >
            {title}
        </header>
    )
}