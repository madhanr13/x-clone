
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const secondsAgo = Math.floor((now - date) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (secondsAgo < 60) {
    return `${secondsAgo}s`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo}m`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}hr`;
  } else if (daysAgo < 7) {
    return `${daysAgo}d`;
  } else {
    return `${daysAgo}days ago`;
  }
}

export default formatTimestamp;
