interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard = ({
  title,
  value,
}: StatsCardProps) => {
  return (
    <div className="stats-card">

      <h3>{title}</h3>

      <h2>{value}</h2>

    </div>
  );
};

export default StatsCard;