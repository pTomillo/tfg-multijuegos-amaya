import { useEffect, useState } from "react";
import InfoCard from "../../components/common/InfoCard";
import LoadingScreen from "../../components/common/LoadingScreen";

const imagesToLoad = [
  "/Multijuegos-Amaya.png",
  "/chica-anime-jugando.png",
  "/conecta-con-amigos.png",
];

export default function HomePage() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  if (!imagesLoaded) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-textPrimary)] px-4 py-10">
      <div className="max-w-xl mx-auto space-y-8">
        <InfoCard
          image="Multijuegos-Amaya.png"
          heading="Bienvenido a Multijuegos Amaya"
          text="Únete a una plataforma de juegos única donde puedes competir, socializar y crecer."
          imagePosition="left"
        />
        <InfoCard
          image="chica-anime-jugando.png"
          heading="¡Juega con tus amigos!"
          text="Explora diferentes modos de juego, desde clásicos hasta los más competitivos."
          imagePosition="right"
        />
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
