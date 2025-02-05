import { useState, useEffect } from "react";
import { db } from "../lib/firebaseconfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import TeamRow from "../components/TeamRow";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("score", "asc")); // Changed to ascending order
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTeams = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        position: index + 1, // Assign position based on sorting
        ...doc.data(),
      }));
      setTeams(fetchedTeams);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#000" }}>FDG Leaderboard</h1>
      {teams.length === 0 ? (
        <p style={{ textAlign: "center" }}>No teams found!</p>
      ) : (
        teams.map((team) => (
          <TeamRow
            key={team.id}
            position={team.position} // Pass the position
            logo={`/logos/${team.logo}`}
            name={team.name}
            score={formatTime(team.score)} // Convert score from seconds to hh:mm:ss
          />
        ))
      )}
    </div>
  );
}
