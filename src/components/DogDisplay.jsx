import React from 'react';

const DogDisplay = ({ dogData, banList, onBanToggle }) => {
  if (!dogData) return <div className="loading">Loading...</div>;

  const { imageUrl, breed, temperament, origin, weight } = dogData;

  const AttributeItem = ({ label, value }) => (
    <div
      className={`attribute ${banList.includes(value) ? 'banned' : ''}`}
      onClick={() => onBanToggle(value)}
    >
      <span className="label">{label}:</span>
      <span className="value">{value}</span>
    </div>
  );

  return (
    <div className="dog-card">
      <img src={imageUrl} alt={breed} className="dog-image" />
      <div className="dog-info">
        <AttributeItem label="Breed" value={breed} />
        <AttributeItem label="Temperament" value={temperament} />
        <AttributeItem label="Origin" value={origin || 'Unknown'} />
        <AttributeItem label="Weight" value={weight} />
      </div>
    </div>
  );
};

export default DogDisplay;
