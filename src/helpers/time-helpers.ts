export const formatTime = (d: Date, includeFirstColon: boolean = false) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return includeFirstColon ? `${hh}:${mm}:${ss}` : `${hh} ${mm}:${ss}`;
};
