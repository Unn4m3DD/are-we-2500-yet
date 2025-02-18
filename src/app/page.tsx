import { Graph } from "./components/graph";
import { ChessDotComMember } from "./types";

export default async function Home() {
  const bearKillerInfo: ChessDotComMember = await fetch(
    "https://www.chess.com/callback/member/stats/bearkillerpt",
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());
  const unnamedInfo: ChessDotComMember = await fetch(
    "https://www.chess.com/callback/member/stats/unn4m3ddd",
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-background">
      <Graph
        bearKiller={{
          name: "Bearkiller",
          points: bearKillerInfo.stats.find((e) => e.key === "tactics")!.stats
            .rating,
        }}
        unnamedInfo={{
          name: "Unn4m3DD",
          points: unnamedInfo.stats.find((e) => e.key === "tactics")?.stats
            .rating,
        }}
      />
    </div>
  );
}
