import InfoCard from "../../components/common/InfoCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Tarjeta informativa 1 */}
        <InfoCard
          image="Multijuegos-Amaya.png"
          heading="Bienvenido a Multijuegos Amaya"
          text="Únete a una plataforma de juegos única donde puedes competir, socializar y crecer."
          imagePosition="left"
        />

        {/* Tarjeta informativa 2 */}
        <InfoCard
          image="chica-anime-jugando.png"
          heading="¡Juega con tus amigos!"
          text="Explora diferentes modos de juego, desde clásicos hasta los más competitivos."
          imagePosition="right"
        />

        {/* Tarjeta informativa 3 */}
        <InfoCard
          image="conecta-con-amigos.png"
          heading="Conecta y comparte"
          text="Agrega amigos, chatea con ellos y comparte tu progreso en la comunidad."
          imagePosition="left"
        />
      </div>
    </div>
  );
}
