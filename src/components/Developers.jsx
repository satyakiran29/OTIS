import DeveloperCard from "./DeveloperCard";

const developers = [
  "Pampana Satya Kiran",
  "Kurimina Anuradha",
  "Manthini Neelaveni",
  "Kambala Vijaya Sankar",
  "Palaka Dhanunjaya",
];

export default function Developers() {
  return (
    <section className="developers">
      <h2>Development Team</h2>
      <div className="dev-grid">
        {developers.map((name) => (
          <DeveloperCard key={name} name={name} />
        ))}
      </div>
    </section>
  );
}
