import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function generateSlots(section) {
  const slots = [];
  for (let i = 1; i <= 20; i++) {
    const num = i.toString().padStart(2, "0");
    slots.push(`${section}${num}`);
  }
  return slots;
}

const priceMap = {
  C01: 83000, C02: 82000, C03: 81000, C04: 80000,
  C05: 73000, C06: 72000, C07: 71000, C08: 70000,
  C09: 63000, C10: 62000, C11: 61000, C12: 60000,
  C13: 58000, C14: 57000, C15: 56000, C16: 55000,
  C17: 53000, C18: 52000, C19: 51000, C20: 50000,

  D01: 80000, D02: 81000, D03: 82000, D04: 83000,
  D05: 70000, D06: 71000, D07: 72000, D08: 73000,
  D09: 60000, D10: 61000, D11: 62000, D12: 63000,
  D13: 55000, D14: 56000, D15: 57000, D16: 58000,
  D17: 50000, D18: 51000, D19: 52000, D20: 53000,

  E01: 83000, E02: 82000, E03: 81000, E04: 80000,
  E05: 73000, E06: 72000, E07: 71000, E08: 70000,
  E09: 63000, E10: 62000, E11: 61000, E12: 60000,
  E13: 58000, E14: 57000, E15: 56000, E16: 55000,
  E17: 53000, E18: 52000, E19: 51000, E20: 50000,

  F01: 80000, F02: 81000, F03: 82000, F04: 83000,
  F05: 70000, F06: 71000, F07: 72000, F08: 73000,
  F09: 60000, F10: 61000, F11: 62000, F12: 63000,
  F13: 55000, F14: 56000, F15: 57000, F16: 58000,
  F17: 50000, F18: 51000, F19: 52000, F20: 53000
};

const layers = [
  { level: "第五層" },
  { level: "第四層" },
  { level: "第三層" },
  { level: "第二層" },
  { level: "第一層" },
];

const sections = {
  D: generateSlots("D"),
  C: generateSlots("C"),
  F: generateSlots("F"),
  E: generateSlots("E"),
};

const reserved = new Set(["C03", "D08", "F11", "E16"]);

export default function TowerSelector() {
  const [selected, setSelected] = useState(null);
  const [records, setRecords] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [generation, setGeneration] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const generationOptions = ["十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六"];

  const handleSelect = async (slot) => {
    if (!generation || !name || reserved.has(slot)) return;
    setConfirmed(false);
    const newSelected = selected === slot ? null : slot;
    setSelected(newSelected);
    setMessage("");

    if (newSelected) {
      const layerPrice = priceMap[newSelected];
      const data = {
        slot: newSelected,
        generation,
        name,
        layerPrice,
        deposit: 30000,
        managementFee: 10000,
        total: layerPrice + 30000 + 10000,
      };
      setRecords([data]);

      try {
        const recordRes = await fetch("/api/record-slot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const emailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "frank306@gmail.com",
            cc: "frank@t-best.com.tw",
            subject: "塔位選擇",
            text: `已選塔位：${data.slot}\n世代：${data.generation}\n姓名：${data.name}\n塔位金：${data.layerPrice}\n保證金：${data.deposit}\n管理費：${data.managementFee}\n總金額：${data.total}`,
          }),
        });

        if (!recordRes.ok || !emailRes.ok) {
          setMessage("⚠️ 資料記錄或寄送郵件失敗，請稍後重試。");
        } else {
          setMessage("✅ 選位成功，資料已送出。");
        }
      } catch (err) {
        console.error("記錄或寄信失敗：", err);
        setMessage("⚠️ 系統錯誤，請聯絡管理員。");
      }
    } else {
      setRecords([]);
    }
  };

  const handleConfirm = () => {
    if (selected && records.length > 0) {
      setConfirmed(true);
    }
  };

  const renderZone = (zone1, zone2) => (
    <div className="grid gap-6">
      {layers.map((layer, i) => {
        const start = i * 4;
        const row1 = sections[zone1].slice(start, start + 4);
        const row2 = sections[zone2].slice(start, start + 4);
        return (
          <div key={layer.level} className="grid grid-cols-[1fr_40px_1fr] gap-8 items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1 font-bold">
                {zone1}區{layer.level}
              </div>
              <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                {row1.map((slot) => (
                  <Button
                    key={slot}
                    className={`h-20 w-20 p-1 transition-colors duration-200 text-sm leading-tight text-center whitespace-pre-line ${
                      reserved.has(slot)
                        ? "bg-gray-300 text-red-600 font-bold"
                        : selected === slot
                        ? "bg-blue-500 text-white font-bold"
                        : "bg-gray-100 text-black font-bold hover:bg-blue-100 hover:text-black"
                    }`}
                    disabled={reserved.has(slot)}
                    onClick={() => handleSelect(slot)}
                  >
                    {selected === slot ? `${slot}\n${generation}世\n${name}` : slot}
                  </Button>
                ))}
              </div>
            </div>
            <div></div>
            <div>
              <div className="text-sm text-gray-500 mb-1 font-bold">
                {zone2}區{layer.level}
              </div>
              <div className="grid grid-cols-4 gap-x-1 gap-y-2">
                {row2.map((slot) => (
                  <Button
                    key={slot}
                    className={`h-20 w-20 p-1 transition-colors duration-200 text-sm leading-tight text-center whitespace-pre-line ${
                      reserved.has(slot)
                        ? "bg-gray-300 text-red-600 font-bold"
                        : selected === slot
                        ? "bg-blue-500 text-white font-bold"
                        : "bg-gray-100 text-black font-bold hover:bg-blue-100 hover:text-black"
                    }`}
                    disabled={reserved.has(slot)}
                    onClick={() => handleSelect(slot)}
                  >
                    {selected === slot ? `${slot}\n${generation}世\n${name}` : slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">期爪公家族塔位選擇系統</h1>
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium">世代：</label>
          <select
            value={generation}
            onChange={(e) => setGeneration(e.target.value)}
            className="border px-2 py-1 rounded w-24"
          >
            <option value="">請選擇</option>
            {generationOptions.map((gen) => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">姓名：</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded w-36"
          />
        </div>
      </div>

      {message && <div className="text-sm text-green-600 font-bold">{message}</div>}

      <h2 className="text-lg font-semibold">C區 & D區</h2>
      {renderZone("D", "C")}

      <h2 className="text-lg font-semibold">F區 & E區</h2>
      {renderZone("F", "E")}

      <Card>
        <CardContent className="p-4 space-y-2">
          <div>已選塔位：{selected || "無"}</div>
          {records.map((r) => (
            <div key={r.slot} className="space-y-1">
              <div>塔位金小計：NT$ {r.layerPrice.toLocaleString()}</div>
              <div>保證金：NT$ {r.deposit.toLocaleString()}</div>
              <div>管理費：NT$ {r.managementFee.toLocaleString()}</div>
              <div className="font-bold">總金額：NT$ {r.total.toLocaleString()}</div>
            </div>
          ))}
          <Button onClick={handleConfirm} disabled={!selected || !generation || !name} className="mt-4">
            確認
          </Button>
        </CardContent>
      </Card>

      {confirmed && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold">✅ 已選清單紀錄</h3>
            {records.map((r) => (
              <div key={r.slot} className="space-y-1">
                <div>塔位：{r.slot}</div>
                <div>世代：{r.generation}</div>
                <div>姓名：{r.name}</div>
                <div>塔位金：NT$ {r.layerPrice.toLocaleString()}</div>
                <div>保證金：NT$ {r.deposit.toLocaleString()}</div>
                <div>管理費：NT$ {r.managementFee.toLocaleString()}</div>
                <div className="font-bold">總金額：NT$ {r.total.toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
