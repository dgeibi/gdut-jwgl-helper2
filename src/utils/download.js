export default function download(url, filename) {
  const link = document.createElement('a');
  if (link.download !== undefined) {
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.dispatchEvent(new MouseEvent('click'));
  }
}
