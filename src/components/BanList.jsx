const BanList = ({ banList, onToggleBan }) => {
  if (banList.length === 0) return null;

  return (
    <div className="ban-list">
      <h3>Banned Attributes</h3>
      <div className="ban-items">
        {banList.map((item) => (
          <span
            key={item}
            className="ban-item"
            onClick={() => onToggleBan(item)}
          >
            {item} <span className="remove">×</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BanList;
