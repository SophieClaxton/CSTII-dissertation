import ClickedElementsDisplay from './ClickedElementsDisplay';

interface HomeScreenProps {
  goEditor1: () => void;
  goEditor2: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ goEditor1, goEditor2 }) => {
  return (
    <>
      <h1>SC2370 Project</h1>
      <button onClick={goEditor1}>Go to Editor 1</button>
      <button onClick={goEditor2}>Go to Editor 2</button>
      <ClickedElementsDisplay />
    </>
  );
};

export default HomeScreen;
