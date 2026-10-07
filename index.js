const [, , method, route, ...args] = process.argv;  

const [resource, id] = route.split("/")


const BASE_URL = "https://dummyjson.com";


const request = async (url, options) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

return await response.json();
};

try {
  if (method === "GET") {
    if (id) {
      const data = await request(`${BASE_URL}/${resource}/${id}`);
      console.log(data);
    } else {
      const data = await request(`${BASE_URL}/${resource}`);
      console.log(data);
    }
  } else if (method === "POST") {
    let url = `${BASE_URL}/${resource}`;
    let payload;

    if (resource === "products") {
      const [title, priceArg, ...categoryParts] = args;
      const price = Number(priceArg);
      const category = categoryParts.join(" ");

      if (!title || !priceArg || !Number.isFinite(price) || !category) {
        throw new Error(
          "Title, numeric price, and category are required to add a product",
        );
      }

      url = `${url}/add`;
      payload = { title, price, category };
    } else {
      const [title, body] = args;

      if (!title || !body) {
        throw new Error(
          `Title and body are required for POST requests on ${resource}`,
        );
      }

      payload = { title, body };
    }

    const data = await request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(data);
  } else if (method === "DELETE") {
    if (!id) {
      throw new Error(`ID is required for DELETE requests on ${resource}`);
    }


        await request(`${BASE_URL}/${resource}/${id}`, { method: "DELETE" });
  } else {
    throw new Error(`Unsupported method: ${method}`);
  }
} catch (error) {
  console.log(error.message);
}