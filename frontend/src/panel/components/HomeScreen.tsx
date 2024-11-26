import ClickedElementsDisplay from './ClickedElementsDisplay';

interface HomeScreenProps {
  goEditor: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ goEditor }) => {
  return (
    <>
      <h1>SC2370 Project</h1>
      <button onClick={goEditor}>Go to Editor</button>
      <ClickedElementsDisplay />
    </>
  );
};

export default HomeScreen;
