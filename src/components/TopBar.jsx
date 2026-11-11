
"use client";

import TopControls from "@/components/TopControls";
import MoneyCounter from "@/components/MoneyCounter";
import CenterStatus from "@/components/CenterStatus";
import ProfileButton from "@/components/ProfileButton";

export default function TopBar({
  room,
  coins,
  onOpenConfig,
  onOpenSkins,
  onToolUse,
  onBallDragStart,
  roomMessage,
}) {
  return (
    <header
      className="relative z-50 flex h-[72px] w-full shrink-0 items-center justify-between border-b-2 border-black px-3"
      style={{
        backgroundColor: room.topBarColor || "#191920",
      }}
    >
      <div className="flex items-center gap-3">
        <TopControls
          onOpenConfig={onOpenConfig}
          onOpenSkins={onOpenSkins}
        />

        <MoneyCounter coins={coins} />
      </div>

      <CenterStatus
        room={room}
        onToolUse={onToolUse}
        onBallDragStart={onBallDragStart}
        roomMessage={roomMessage}
      />

      <div className="ml-auto">
        <ProfileButton coins={coins} />
      </div>
    </header>
  );
}
