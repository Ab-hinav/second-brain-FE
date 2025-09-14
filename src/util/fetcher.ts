/**
 * SWR/utility fetcher that throws on non-2xx and returns parsed JSON.
 */
const fetcher = async (url: URL) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      throw error;
    }
    return res.json();
  };

  export default fetcher;
