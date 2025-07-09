const DiscoverButton = ({ onClick, disabled }) => (
  <button
    className="discover-button"
    onClick={onClick}
    disabled={disabled}
  >
    {disabled ? 'Loading...' : 'Discover New Dog!'}
  </button>
);

export default DiscoverButton;
