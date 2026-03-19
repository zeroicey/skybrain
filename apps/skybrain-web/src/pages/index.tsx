export default function IndexPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Welcome to <span className="text-primary">SkyBrain</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Drone system
        </p>
      </div>
    </div>
  );
}
