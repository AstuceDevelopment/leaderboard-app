import { useState, useEffect } from "react";
import { db } from "../lib/firebaseconfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import TeamRow from "../components/TeamRow";
import "../styles/leaderboard.css"; // Import the CSS file

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("score", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTeams = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          position: index + 1,
          ...doc.data(),
        }));
        setTeams(fetchedTeams);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="leaderboard-container">
      {/* 🔥 Extravagant Title */}
      <h1 className="leaderboard-title">LE GRAND SAGESSE PRIX</h1>

      {/* 🔄 Loading State */}
      {loading ? (
        <p className="leaderboard-message">Loading teams...</p>
      ) : teams.length === 0 ? (
        <p className="leaderboard-message">No teams found!</p>
      ) : (
        <div className="teams-container">
          {teams.map((team) => (
            <TeamRow
              key={team.id}
              position={team.position}
              logo={`/logos/${team.logo}`}
              name={team.name}
              score={formatTime(team.score)}
              customClass={
                team.position === 1
                  ? "gold"
                  : team.position === 2
                  ? "silver"
                  : team.position === 3
                  ? "bronze"
                  : ""
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
