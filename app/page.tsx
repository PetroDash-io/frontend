"use client"
import React, { useEffect, useState } from "react";

export default function Home() {
  const [reservorio, setReservorio] = useState(null);

  useEffect(() => {
    const url = "https://petrodashbackend.onrender.com/ultimo";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log("json", json);

        const { data } = json;
        // Only put the results in state, ie, the actual users array
        setReservorio(data);
      } catch (error) {
        console.log("error CORS", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Response</h1>
      <pre>{JSON.stringify(reservorio, null, 2)}</pre>
    </div>
  );
}
