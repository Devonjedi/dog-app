import { useState } from 'react';
import React from 'react';
import DogDisplay from './components/DogDisplay';
import BanList from './components/BanList';
import DiscoverButton from './components/DiscoverButton';
import useDogApi from './hooks/useDogApi';

function App() {
  const [banList, setBanList] = useState([]);
  const { dogData, loading, error, timeRemaining, getRandomDogs } = useDogApi(banList);

  const handleBanToggle = (attribute) => {
    setBanList((prevList) =>
      prevList.includes(attribute)
        ? prevList.filter((item) => item !== attribute)
        : [...prevList, attribute]
    );
  };

  return (
    <div className="app">
      <h1>Dog Discovery</h1>
      <DiscoverButton onClick={() => getRandomDogs(1)} disabled={loading || timeRemaining > 0} />
      {timeRemaining > 0 && <p className="info">Please wait {timeRemaining} seconds before requesting again.</p>}
      {error && <p className="error">{error}</p>}
      {dogData.length > 0 && (
        <DogDisplay dogData={dogData[0]} banList={banList} onBanToggle={handleBanToggle} />
      )}
      <BanList banList={banList} onToggleBan={handleBanToggle} />
    </div>
  );
}

export default App;
