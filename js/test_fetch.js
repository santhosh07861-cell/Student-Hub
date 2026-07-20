async function run() {
  const url = "https://www.se.com/ww/en/about-us/careers/students.jsp";
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });
    console.log("Status Code:", response.status);
    console.log("Redirected:", response.redirected);
    console.log("Final URL:", response.url);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();
