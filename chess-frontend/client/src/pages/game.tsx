import ChessBoard from "@/components/game/ChessBoard";
import GameInfo from "@/components/game/GameInfo";
import { Card } from "@/components/ui/card";

export default function GamePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          On-Chain Chess Game
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <ChessBoard />
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <GameInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
