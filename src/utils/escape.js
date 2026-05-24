import he from 'he';

function escapeHTML(value) {
  return he.encode(String(value));
}

export { escapeHTML };
