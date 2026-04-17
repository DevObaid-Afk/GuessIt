function BackgroundFX() {
  return (
    <>
      <div className="background-grid" />
      <div className="orb orb--cyan" />
      <div className="orb orb--violet" />
      <div className="orb orb--emerald" />
      <div className="particles">
        {Array.from({ length: 24 }).map((_, index) => (
          <span key={index} style={{ "--delay": `${index * 0.6}s`, "--left": `${(index % 8) * 13}%` }} />
        ))}
      </div>
    </>
  );
}

export default BackgroundFX;
