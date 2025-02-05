import { useState, useEffect } from "react";
import { db, auth, provider } from "../lib/firebaseconfig";
import { signInWithPopup } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

// Convert total seconds to hh:mm:ss format
const formatTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function Admin() {
  const [teams, setTeams] = useState([]);
  const [localScores, setLocalScores] = useState({});

  // Fetch teams from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTeams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(fetchedTeams);

      // Set initial local scores
      const scores = {};
      fetchedTeams.forEach((team) => {
        scores[team.id] = team.score;
      });
      setLocalScores(scores);
    });

    return () => unsubscribe();
  }, []);

  // Function to increment time locally
  const incrementTime = (teamId, amount) => {
    setLocalScores((prevScores) => ({
      ...prevScores,
      [teamId]: prevScores[teamId] + amount,
    }));
  };

  // Function to decrement time locally
  const decrementTime = (teamId, amount) => {
    setLocalScores((prevScores) => ({
      ...prevScores,
      [teamId]: prevScores[teamId] - amount,
    }));
  };

  // Function to update Firestore when "Update Scores" is clicked
  const updateScoresInFirestore = async () => {
    const updates = Object.keys(localScores).map(async (teamId) => {
      const teamRef = doc(db, "leaderboard", teamId);
      return updateDoc(teamRef, { score: localScores[teamId] });
    });

    await Promise.all(updates);
    alert("Scores updated successfully!");
  };

  // Google Sign-in
  const login = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Admin Panel</h1>
      <button onClick={login} style={{ marginBottom: "20px" }}>
        Login with Google
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {teams.map((team) => (
          <div
            key={team.id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span style={{ width: "150px" }}>{team.name}</span>
            <span style={{ width: "100px", textAlign: "center" }}>
              {formatTime(localScores[team.id] || 0)}
            </span>
            <button onClick={() => incrementTime(team.id, 3600)}>
              +1 Hour
            </button>
            <button onClick={() => incrementTime(team.id, 60)}>+1 Min</button>
            <button onClick={() => incrementTime(team.id, 1)}>+1 Sec</button>
            <text>... </text>
            <button onClick={() => incrementTime(team.id, 300)}>+5 Min</button>
            <button onClick={() => incrementTime(team.id, 5)}>+5 Sec</button>
            <text>........ </text>
            <button onClick={() => decrementTime(team.id, 3600)}>
              -1 Hour
            </button>
            <button onClick={() => decrementTime(team.id, 60)}>-1 Min</button>
            <button onClick={() => decrementTime(team.id, 1)}>-1 Sec</button>
            <text>... </text>
            <button onClick={() => decrementTime(team.id, 300)}>-5 Min</button>
            <button onClick={() => decrementTime(team.id, 5)}>-5 Sec</button>
          </div>
        ))}
      </div>

      <button
        onClick={updateScoresInFirestore}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "green",
          color: "white",
        }}
      >
        Update Scores
      </button>
    </div>
  );
}
