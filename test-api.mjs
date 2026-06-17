async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/homepage/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tabs: [
          { id: "e1cd5e9c-1234-4567-890a-bcdef1234560", title: "Kamera", sort_order: 1 }
        ],
        services: [
          {
            id: "f2cd5e9c-1234-4567-890a-bcdef1234560",
            tab_id: "e1cd5e9c-1234-4567-890a-bcdef1234560",
            title: "Test Kart",
            description: "Test Desc",
            image: "/images/kamera-sistemi.svg",
            link: "/kamera",
            sort_order: 1
          }
        ]
      })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch (err) {
    console.error(err);
  }
}

test();
