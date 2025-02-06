import Image from "next/image";

const TeamRow = ({ position, logo, name, score }) => {
  return (
    <div className="team-row">
      <span className="team-position">{position}</span>
      <Image
        src={logo}
        alt={name}
        width={40}
        height={40}
        className="team-logo"
      />
      <span className="team-name">{name}</span>
      <span className="team-score">{score}</span>
    </div>
  );
};

export default TeamRow;
