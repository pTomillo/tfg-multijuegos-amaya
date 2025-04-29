export default function InfoCard({
  image,
  heading,
  text,
  imagePosition = "left",
}) {
  const isImageLeft = imagePosition === "left";

  return (
    <div className="flex flex-col md:flex-row items-center bg-[var(--color-card)] p-6 rounded-2xl shadow-md gap-6">
      {isImageLeft && (
        <img
          src={image}
          alt="Ejemplo"
          className="w-45 h-45 rounded-xl object-cover"
        />
      )}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">{heading}</h2>
        <p className="text-[var(--color-textSecondary)]">{text}</p>
      </div>
      {!isImageLeft && (
        <img
          src={image}
          alt="Ejemplo"
          className="w-45 h-45 rounded-xl object-cover"
        />
      )}
    </div>
  );
}
